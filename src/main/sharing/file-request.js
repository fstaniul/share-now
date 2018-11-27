import * as fs from 'fs'
import * as path from 'path'
import { ipcMain, dialog, app } from 'electron'
import axios from 'axios'
import store from '../store'

function requestFiles (files, ip) {
    if (files.length === 1) {
        const fpath = files[0]
        fs.stat(fpath, (err, stat) => {
            if (err) {
                store.dispatch('new-file', {
                    name: path.basename(fd),
                    path: fpath,
                    status: 'error'
                })
                return
            }

            const data = {
                name: path.basename(fpath),
                path: fpath,
                size: stat.size,
                progress: 0,
                status: 'requested'
            }

            axios.post(`https://${ip}:${store.state.settings.port}/request-file`, {
                name: data.name,
                size: data.size
            })
                .then(res => {
                    if (!res.body.id) throw new Error('missing id in response')
                    store.dispatch('new-file', {
                        data,
                        id: res.body.id
                    })
                })
                .catch(err => {
                    store.dispatch('new-file', {
                        ...data,
                        status: 'error'
                    })
                    console.log(err)
                })
        })
    }
}

ipcMain.on('select-and-upload-files', (sender, ip) => {
    const mainWindow = require('../index').mainWindow
    const dialogOptions = {
        properties: ['openFile', 'multiSelections'],
        title: 'Select files to transfer',
        defaultPath: app.getPath('home'),
        buttonLabel: 'Transfer files'
    }
    dialog.showOpenDialog(mainWindow, dialogOptions, (files) => {
        if (!files || files.length === 0) return
        requestFiles(files, ip)
    })
})
