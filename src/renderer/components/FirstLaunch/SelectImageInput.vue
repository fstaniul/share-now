<template>
    <div class="container rounded-full border border-gray bg-transparent relative flex justify-center items-center flex-col cursor-pointer" @click="selectFile" :style="containerStyles">
        <template v-if="!value">
            <div class="image-icon-contianer"><fa-icon icon="image"></fa-icon></div>
            <span class="pb-3">SELECT PICTURE</span>
        </template>
    </div>
</template>

<script>
  export default {
      props: {
          value: {
              default: '',
              type: String
          }
      },
      computed: {
          containerStyles () {
              if (!this.value) return ''
              return {
                  'background-image': `url(${this.value})`,
                  'background-size': 'cover',
                  'background-repeat': 'no-repeat',
                  'background-position': 'center'
              }
          }
      },
      methods: {
          selectFile () {
              const currentBrowserWindow = this.$electron.remote.getCurrentWindow()
              const dialogOptions = {
                  title: 'Select profile picture',
                  defaultPath: this.$electron.remote.app.getPath('pictures'),
                  buttonLabel: 'Select picture',
                  filters: [{name: 'Images', extensions: ['jpg', 'png', 'gif']}],
                  properties: ['openFile'],
                  message: 'Select profile picture so other users can recognise you faster.'
              }
              this.$electron.remote.dialog.showOpenDialog(currentBrowserWindow, dialogOptions, (files) => {
                  if (!files || files.length === 0 || files.length > 1) return
                  const dataUrl = this.$electron.remote.nativeImage.createFromPath(files[0]).toDataURL()
                  this.$emit('input', dataUrl)
              })
          }
      }
  }
</script>

<style lang="scss" scoped>
.container {
  width: 200px;
  height: 200px;
}
.image-icon-contianer {
  font-size: 64px;
}
</style>