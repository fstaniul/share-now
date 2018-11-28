const deviceDiscovery = require('device-discovery')
const EventEmitter = require('events')
const os = require('os')
const axios = require('axios')
const store = require('../store').default
const { ipcMain, app } = require('electron')

const gee = new EventEmitter()

function findUsers () {
    return new Promise(resolve => {
        console.log('looking for users online!')
        const discovery = discoverDevices()
        let devicesToScan = 0
        let scannedDevices = 0
        let finished = false
        discovery.on('device', ip => {
            devicesToScan += 1
            axios
                .post(`https://${ip}:${store.state.settings.port}/identify`, {
                    name: store.state.settings.name,
                    image: store.state.settings.image
                })
                .then(res => {
                    scannedDevices += 1
                    if (res.body.name && res.body.image) {
                        gee.emit('user', {
                            name: res.body.name,
                            image: res.body.image,
                            ip
                        })
                    }
                    if (scannedDevices === devicesToScan && finished) resolve()
                })
                .catch(() => {
                    scannedDevices += 1
                    if (scannedDevices === devicesToScan && finished) resolve()
                })
        })
        discovery.on('done', () => {
            discovery.removeAllListeners()
            finished = true
        })
    })
}

function discoverDevices () {
    const ee = new EventEmitter()
    const interfaces = getNetworkInterfaces()
    let interfacesScanned = 0
    console.log('interfaces too scan', interfaces)
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
            console.log('done with ', iface)
            interfacesScanned += 1
            if (interfacesScanned === interfaces.length) {
                console.log('done with all interfaces, emiting done')
                ee.emit('done')
            }
        })
    })

    return ee
}

function getNetworkInterfaces () {
    const ifaces = os.networkInterfaces()
    return Object.keys(ifaces)
        .map(k => [k, ifaces[k]])
        .map(([key, iface]) => [key, iface.find(f => f.family === 'IPv4')]) // reduce to only ipv4
        .filter(([key, iface]) => iface && iface.address !== '127.0.0.1' && !iface.internal) // ignore loopback interface
        .map(([key]) => key)
}

async function loadUsers () {
    store.dispatch('loading-users')
    await findUsers()
    store.dispatch('loaded-users')
    console.log('finished-loading-users')
}
export default loadUsers

gee.on('user', user => {
    store.dispatch('new-user', user)
})

ipcMain.on('discover-users', loadUsers)

let loadUsersInterval

ipcMain.on('start-user-discovery', () => {
    loadUsers()
    if (loadUsersInterval) clearInterval(loadUsersInterval)
    loadUsersInterval = setInterval(loadUsers, 60000)
})

app.on('close-all-windows', () => {
    if (loadUsersInterval) clearInterval(loadUsersInterval)
})
