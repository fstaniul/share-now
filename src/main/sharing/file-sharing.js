import { createServer } from 'https'
import { createSecureContext } from 'tls'
import express from 'express'
import forge from 'forge'
import store from '../store'
import multer from 'multer'

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

router.post('/identify', (req, res, next) => {
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
    }
})
