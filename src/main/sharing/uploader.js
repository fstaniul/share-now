import * as EventEmitter from 'events'
import { request } from 'http'
import { createReadStream } from 'fs'

export default (file, {port}) => {
    const eventEmitter = new EventEmitter()

    const req = request({
        protocol: 'http:',
        hostname: file.ip,
        port,
        path: '/transter-file/' + file.id,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': file.size
        }
    }, res => {
        if (res.statusCode < 300) eventEmitter.emit('done')
        else eventEmitter.emit('error', {...(new Error('Response other then accepted')), res})
    })

    const readStream = createReadStream(file.path)

    let bytesRead = 0
    readStream.on('data', data => {
        bytesRead += data.length
        req.write(data, () => {
            const progress = Math.floor(bytesRead / file.size * 100)
            console.log('[%s] Sent %s (%s%) / %s -> %s', file.id, bytesRead, progress, file.size, file.ip)
            eventEmitter.emit('progress', progress)
        })
    })

    readStream.on('end', () => {
        req.end()
    })

    readStream.on('error', err => {
        req.destroy(err)
        eventEmitter.emit('error', err)
    })

    req.on('error', err => {
        readStream.destroy(err)
        eventEmitter.emit('error')
    })

    return eventEmitter
}
