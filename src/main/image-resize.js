import { ipcMain, nativeImage, dialog } from 'electron'

ipcMain.on('select-and-resize-image', (event, size, dialogOptions) => {
    dialog.showOpenDialog(
        require('./index').mainWindow,
        {
            ...dialogOptions,
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
            properties: ['openFile']
        },
        files => {
            if (!files || files.length === 0) {
                return event.sender.send('image', '')
            }
            let image = nativeImage.createFromPath(files[0])
            let imgSize = image.getSize()
            const propToResize =
                imgSize.height > imgSize.width ? 'width' : 'height'

            image = image.resize({ [propToResize]: 200 })
            imgSize = image.getSize()
            image = image.crop({
                width: 200,
                height: 200,
                x: Math.floor((imgSize.width - 200) / 2),
                y: Math.floor((imgSize.height - 200) / 2)
            })

            event.sender.send('image', image.toDataURL())
        }
    )
})
