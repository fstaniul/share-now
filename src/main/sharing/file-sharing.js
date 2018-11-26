import { createServer } from 'https'
import { createSecureContext } from 'tls'
import * as express from 'express'
import * as forge from 'node-forge'
import store from '../store'
import uuid from 'uuid'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as fs from 'fs'

const credentials = (() => {
    const keyPair = forge.pki.rsa.generateKeyPair(2048)
    const cert = forge.pki.createCertificate()
    cert.publicKey = keyPair.publicKey
    cert.serialNumber = '01'
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(
        cert.validity.notBefore.getFullYear() + 1
    )
    const certAttrs = [
        {
            name: 'commonName',
            value: 'share-now.com'
        },
        {
            name: 'countryName',
            value: 'PL'
        },
        {
            shortName: 'ST',
            value: 'Poland'
        },
        {
            name: 'localityName',
            value: 'Poland'
        },
        {
            name: 'organizationName',
            value: 'SHAREnow'
        },
        {
            shortName: 'OU',
            value: 'SHAREnow'
        }
    ]
    cert.setSubject(certAttrs)
    cert.setIssuer(certAttrs)
    cert.sign(keyPair.privateKey)

    return createSecureContext({
        key: forge.pki.privateKeyToPem(keyPair.privateKey),
        cert: forge.pki.certificateToPem(cert)
    })
})()

const app = express()
export default app
app.use(express.json({ limit: '5mb' }))

const server = createServer(credentials, app)

export function start () {
    return new Promise(resolve => {
        server.listen(store.state.settings.port, '0.0.0.0', resolve)
    })
}

export function stop () {
    return new Promise(resolve => {
        server.close(resolve)
    })
}

store.watch(state => state.settings.port, () => stop().then(start))

const router = express.Router()
app.use(router)

router.post('/identify', (req, res) => {
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
    if (req.body) {
        const name = req.body.name
        const size = req.body.size
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
                size
            }
            store.dispatch('new-file', data)

            return res.status(200).json({ id: data.id })
        }
    }

    res.status(400)
    res.json({
        message: 'Invalid request, expected file name and size in request body!'
    })
})

router.post('/file-status', (req, res) => {
    if (req.body && req.body.id && req.body.accepted) {
        store.dispatch('update-file', {
            id: req.body.id,
            data: {
                accepted: req.body.accepted
            }
        })

        res.status(201).end()
    }
})

router.post('/file-transfer/:id', async (req, res) => {
    const id = req.params.id
    const file = store.getters.getFileById(id)
    if (!file) {
        return res.status(404).end()
    }

    if (file.ip !== req.ip) {
        return res.status(403).end()
    }

    let downloadFolder = store.state.settings.downloadFolder

    store.dispatch('update-file', {
        id,
        data: {
            status: 'downloading',
            progress: 0
        }
    })

    // Create subdirectory if needed
    if (store.settings.useSubfolder) {
        try {
            downloadFolder = path.join(downloadFolder, 'SHAREnow')
            await new Promise((resolve, reject) => {
                mkdirp(downloadFolder, err => {
                    if (err) reject(err)
                    else resolve()
                })
            })
        } catch (err) {
            store.dispatch('file-update', {
                id,
                data: {
                    status: 'error',
                    progress: 0
                }
            })
            return res.status(500).end()
        }
    }

    const filePath = path.join(downloadFolder, file.name)
    const writeStream = fs.createWriteStream(filePath)
    let bytesDownloaded = 0

    writeStream.on('error', () => {
        fs.unlink(filePath)
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
            }
        })
    })

    req.on('error', () => {
        res.status(500).json({ message: 'Request stream error occurred!' })
        writeStream.destroy(new Error('Request stream error!'))
    })
})
