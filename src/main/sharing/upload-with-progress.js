import * as http from 'http'
import * as fs from 'fs'
import store from '../store'
import Deferred from '../utility/deferred'
import axios from 'axios'

function sendStatusError (url, id) {
    axios.post(`${url}/file-status`, {id: id, status: 'error'})
}

export default function uploadFile (ip, id) {
    console.log('Uploading file with id [%s] to ip [%s]', id, ip)

    const prom = new Deferred()
    const file = store.getters.getFileById(id)

    if (!file) prom.reject(new Error(`File with id ${id} does not exist!`))

    const req = http.request({
        protocol: 'http:',
        host: file.ip,
        port: store.state.settings.port,
        method: 'POST',
        path: `/file-transfer/${id}`,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': file.size
        }
    }, res => {
        console.log('Got response back from client receiving with status:', res.statusCode)
        if (res.statusCode > 400) return prom.reject(new Error(`Returned status ${res.statusCode}`))

        store.dispatch('update-file', {
            id,
            data: {
                status: 'completed',
                progress: 100
            }
        })

        prom.resolve(res)
    })

    console.log('Created request!')

    req.on('error', (err) => {
        console.error('Error in request stream: ', err)

        store.dispatch('update-file', {
            id,
            data: {
                status: 'error'
            }
        })
        prom.reject(err)
    })

    fs.open(file.path, 'r', (err, fd) => {
        if (err) {
            console.error('Error while opening file at path', file.path)

            sendStatusError()
            store.dispatch('update-file', {
                id,
                data: {
                    status: 'error'
                }
            })
            prom.reject(err)
            return
        }

        console.log('Openend file [%s]', file.path)

        const bsize = 1024 * 64
        let buffer = Buffer.alloc(bsize)
        let bytesRead = 0

        function continueReading () {
            store.dispatch('update-file', {
                id,
                data: {
                    progress: Math.floor(bytesRead / file.size * 100)
                }
            })

            if (bytesRead !== file.size) return readChunk()
            fs.close(fd)
            req.end()
        }

        function readChunk () {
            fs.read(fd, buffer, 0, bsize, bytesRead, (err, br, buffer) => {
                if (err) {
                    sendStatusError()
                    fs.close(fd)
                    store.dispatch('update-file', {
                        id,
                        data: {
                            status: 'error'
                        }
                    })
                    prom.reject(err)
                    return
                }

                bytesRead += br

                console.log('[%s] Read %s (%s)/ %s -> %s', file.id, br, bytesRead, file.size, file.ip)

                if (br <= bsize) req.write(buffer.slice(0, br), continueReading)
                else req.write(buffer, continueReading)
            })
        }

        readChunk()
    })

    return prom.promise
}
