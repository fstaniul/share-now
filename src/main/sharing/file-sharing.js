import * as express from 'express'
// import * as forge from 'node-forge'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as fs from 'fs'
import store from '../store'
import uuid from 'uuid'
import uploadFile from './upload-with-progress'
import { createServer } from 'http'
// import { createSecureContext } from 'tls'
import { ipcMain } from 'electron'

// console.log(createSecureContext)

// const credentials = (() => {
//     const keyPair = forge.pki.rsa.generateKeyPair(2048)
//     const cert = forge.pki.createCertificate()
//     cert.publicKey = keyPair.publicKey
//     cert.serialNumber = '01'
//     cert.validity.notBefore = new Date()
//     cert.validity.notAfter = new Date()
//     cert.validity.notAfter.setFullYear(
//         cert.validity.notBefore.getFullYear() + 1
//     )
//     const certAttrs = [
//         {
//             name: 'commonName',
//             value: 'SHAREnow'
//         },
//         {
//             name: 'countryName',
//             value: 'PL'
//         },
//         {
//             shortName: 'ST',
//             value: 'Poland'
//         },
//         {
//             name: 'localityName',
//             value: 'Poland'
//         },
//         {
//             name: 'organizationName',
//             value: 'SHAREnow'
//         },
//         {
//             shortName: 'OU',
//             value: 'SHAREnow'
//         }
//     ]
//     cert.setSubject(certAttrs)
//     cert.setIssuer(certAttrs)
//     cert.sign(keyPair.privateKey)

//     console.log(forge.pki.certificateToPem(cert))
//     console.log(forge.pki.privateKeyToPem(keyPair.privateKey))

//     return createSecureContext({
//         key: forge.pki.privateKeyToPem(keyPair.privateKey),
//         cert: forge.pki.certificateToPem(cert)
//     })
// })()

const app = express()
export default app
app.use(express.json({ limit: '5mb' }))

// const server = createServer(credentials, app)
const server = createServer(app)

export function start () {
    return new Promise(resolve => {
        server.listen(store.state.settings.port, '0.0.0.0', resolve)
    })
        .then(() => {
            console.log('Server started')
        })
}

export function stop () {
    return new Promise(resolve => {
        server.close(resolve)
    })
}

store.watch(state => state.settings.port, () => stop().then(start))

ipcMain.on('start-server', start)
ipcMain.on('stop-server', stop)
ipcMain.on('restart-server', () => stop().then(start))

const router = express.Router()
app.use(router)

router.post('/identify', (req, res) => {
    console.log('Got identify request from', req.ip)

    if (!req.body || !req.body.name || !req.body.image) {
        res.status(400)
        res.json({
            message: 'Invalid request, expected name and image in request body!'
        })
    } else {
        store.dispatch('new-user', {
            ip: req.ip,
            name: req.body.name,
            image: req.body.image
        })
        res.status(200).json({
            name: store.state.settings.name,
            image: store.state.settings.image
        })
    }
})

router.post('/request-file', (req, res) => {
    console.log('Received file request from', req.ip)

    if (req.body) {
        const name = req.body.name
        const size = req.body.size

        console.log('Request data [name=%s] [size=%s]', name, '' + size)

        if (
            typeof name === 'string' &&
            typeof size === 'number' &&
            size > 0 &&
            name !== ''
        ) {
            const data = {
                id: uuid.v4(),
                ip: req.ip,
                name,
                size,
                direction: 'download',
                status: 'requested',
                progress: 0
            }

            let downloadFolder = store.state.settings.downloadFolder

            // Create subdirectory if needed
            if (store.state.settings.useSubfolder) {
                downloadFolder = path.join(downloadFolder, 'SHAREnow')
            }

            data.path = path.resolve(downloadFolder, name)

            try {
                mkdirp.sync(downloadFolder)
            } catch (err) {
                console.error('Failed to create folder for downloading of file [%s]: ', data.id, downloadFolder)
                data.status = 'error'
                store.dispatch('new-file', data)
                return res.status(500).end()
            }

            store.dispatch('new-file', data)

            console.log('Updated state and returning data id to requested user', data.id)

            return res.status(200).json({ id: data.id })
        }
    }

    res.status(400)
    res.json({
        message: 'Invalid request, expected file name and size in request body!'
    })
})

router.post('/file-status', (req, res) => {
    console.log('Requested file status change from', req.ip)

    if (req.body && req.body.id) {
        if (req.body.status === 'accepted') {
            console.log('file status is accepted, upadting state accordingly, starting to upload file')
            store.dispatch('update-file', {
                id: req.body.id,
                data: {
                    'status': 'in-progress',
                    progress: 0
                }
            })

            res.status(201).end()

            setTimeout(() => uploadFile(req.ip, req.body.id).catch(err => console.log(err)))
        }

        if (req.body.status === 'error' || req.body.status === 'rejected') {
            console.log('file status is [%s], updating state accordingly', req.body.status)
            store.dispatch('update-file', {
                id: req.body.id,
                data: {
                    status: req.body.status
                }
            })
        }
    }
})

router.post('/file-transfer/:id', async (req, res) => {
    console.log('begin file transter request from %s with file id %s', req.ip, req.params.id)

    const id = req.params.id
    const file = store.getters.getFileById(id)
    if (!file) {
        return res.status(404).end()
    }

    if (file.ip !== req.ip || file.destination !== 'download' || file.status !== 'in-progress' || file.progress !== 0) {
        return res.status(403).end()
    }

    const writeStream = fs.createWriteStream(file.path)
    let bytesDownloaded = 0

    writeStream.on('error', (err) => {
        console.error('[%s] error in write stream: ', id, err)

        fs.unlink(file.path)
        store.dispatch('update-file', {
            id,
            data: {
                status: 'error'
            }
        })
    })

    req.on('data', data => {
        // if the file size is too large
        bytesDownloaded += data.length
        if (bytesDownloaded > file.size) {
            req.off('data')
            res.status(500).json({
                message:
                    'File is too large, specified smaller size when requesting!'
            })
            writeStream.destroy(new Error('File too large!'))
        }

        console.log('[%s] downloaded bytes %s / %s', id, bytesDownloaded, file.size)

        const newProgress = Math.floor((file.size / bytesDownloaded) * 100)
        const bytesToSave = bytesDownloaded
        writeStream.write(data, () => {
            store.dispatch('update-file', {
                id,
                data: {
                    progress: newProgress,
                    bytesDownloaded: bytesToSave
                }
            })

            if (bytesToSave === file.size) {
                store.dispatch('update-file', {
                    id,
                    data: {
                        progress: 100,
                        status: 'downloaded'
                    }
                })
                writeStream.end()
                res.status(201).end()

                console.log('[%s] finished downloading this file!', id)
            }
        })
    })

    req.on('error', (err) => {
        console.error('[%s] error in request stream: ', id, err)
        res.status(500).json({ message: 'Request stream error occurred!' })
        writeStream.destroy(new Error('Request stream error!'))
    })
})
