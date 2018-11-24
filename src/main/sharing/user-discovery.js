const deviceDiscovery = require('device-discovery')
const EventEmitter = require('events')
const os = require('os')
const axios = require('axios')
const settings = require('../settings.js')
const store = require('../store')
const { ipcMain } = require('electron')

const gee = EventEmitter()

export function findUsers () {
    return new Promise(resolve => {
        const discovery = discoverDevices()
        discovery.on('device', ip => {
            axios
                .post(`https://${ip}:${settings.get('port')}/identify`, {
                    name: settings.name,
                    image: settings.image
                })
                .then(res => {
                    console.log(res.body)
                    if (res.body.name && res.body.image) {
                        gee.emit('user', {
                            name: res.body.name,
                            image: res.body.image,
                            ip
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
        discovery.on('done', () => {
            discovery.removeAllListeners()
            resolve()
        })
    })
}

function discoverDevices () {
    const ee = EventEmitter()
    const interfaces = Object.keys(os.networkInterfaces())
    let interfacesScanned = 0
    interfaces.forEach(iface => {
        const discover = deviceDiscovery({
            iface: iface,
            excludeSelf: true,
            timeout: 2000,
            retries: 0,
            type: 'ICMP'
        })
        discover.on('device', ip => {
            ee.emit('device', ip)
        })
        discover.on('done', () => {
            interfacesScanned++
            if (interfacesScanned === interfaces.length) ee.emit('done')
        })
    })

    return ee
}

gee.on('user', user => {
    store.dispatch('new-user', user)
})

ipcMain.on('discover-users', async () => {
    store.dispatch('loading-users')
    await findUsers()
    store.dispatch('loaded-users')
})
