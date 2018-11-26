<template>
  <div
    class="container rounded-full border border-gray bg-transparent relative flex justify-center items-center flex-col cursor-pointer"
    @click="selectFile"
    :style="containerStyles"
  >
    <template v-if="!value && !loading">
      <div class="image-icon-contianer">
        <fa-icon icon="image"></fa-icon>
      </div>
      <span class="pb-3">SELECT PICTURE</span>
    </template>
    <template v-if="loading">
      <loader/>
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
    data () {
        return {
            loading: false
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
            if (this.loading) return
            this.loading = true
            this.$electron.ipcRenderer.once('image', (sender, data) => {
                this.$emit('input', data)
                this.loading = false
            })
            const dialogOptions = {
                title: 'Select profile picture',
                defaultPath: this.$electron.remote.app.getPath('pictures'),
                buttonLabel: 'Select picture',
                message: 'Select profile picture so other users can recognise you faster.'
            }
            this.$electron.ipcRenderer.send('select-and-resize-image', 200, dialogOptions)
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