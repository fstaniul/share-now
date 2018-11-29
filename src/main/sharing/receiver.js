import { createWriteStream, unlink } from 'fs'
import * as EventEmitter from 'events'

export default (req, file) => {
    const ee = new EventEmitter()

    const writeStream = createWriteStream(file.path)

    let bytesRead = 0
    req.on('data', data => {
        bytesRead += data.length
        writeStream.write(data, () => {
            const progress = Math.floor(bytesRead / file.size * 100)
            console.log('[%s] %s (%s%) / %s <- %s', file.id, bytesRead, progress, file.size, file.ip)
            ee.emit('progress', progress)
        })
    })

    req.on('end', () => {
        writeStream.close()
    })

    req.on('error', err => {
        unlink(file.path)
        ee.emit('error', err)
    })

    return ee
}
