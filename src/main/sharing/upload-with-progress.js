import store from '../store'
import Deferred from '../utility/deferred'
import axios from 'axios'
import upload from './uploader'

function sendStatusError (ip, id) {
    axios.post(`http://${ip}:${store.state.settings.port}/file-status`, {id: id, status: 'error'})
}

export default function uploadFile (ip, id) {
    console.log('Uploading file with id [%s] to ip [%s]', id, ip)

    const prom = new Deferred()
    const file = store.getters.getFileById(id)

    if (!file) prom.reject(new Error(`File with id ${id} does not exist!`))

    const uploader = upload(file, {port: store.state.settings.port})

    uploader.on('error', (err) => {
        console.error(err)
        sendStatusError(ip, id)
        store.dispatch('update-file', {
            id,
            data: {
                status: 'error'
            }
        })
        prom.reject(err)
    })

    uploader.on('done', () => {
        store.dispatch('update-file', {
            id,
            data: {
                status: 'completed'
            }
        })
        prom.resolve()
    })

    uploader.on('progress', progress => {
        store.dispatch('update-file', {
            id,
            data: {
                progress
            }
        })
    })

    return prom.promise
}
