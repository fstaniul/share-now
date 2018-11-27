import * as https from 'https'
import * as fs from 'fs'
import store from '../store'
import Deferred from '../utility/deferred'
import axios from 'axios'

function sendStatusError (url, id) {
    axios.post(`${url}/file-status`, {id: id, status: 'error'})
}

export default function uploadFile (ip, id) {
    const prom = new Deferred()
    const file = store.getters.getFileById(id)
    const url = `https://${ip}:${store.state.settings.port}`

    if (!file) prom.reject(new Error(`File with id ${id} does not exist!`))

    const req = https.request(`${url}/file-transfer/${id}`, {method: 'POST'})

    req.on('error', (err) => {
        store.dispatch('update-file', {
            id,
            data: {
                status: 'error'
            }
        })
        prom.reject(err)
    })

    req.on('response', res => {
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

    fs.open(file.path, 'r', (err, fd) => {
        if (err) {
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

                if (br <= bsize) req.write(buffer.slice(0, br), continueReading)
                else req.write(buffer, continueReading)
            })
        }

        readChunk()
    })

    return prom
}
