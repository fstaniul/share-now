<template>
  <div
    class="ris-container border border-gray-light rounded-full cursor-pointer relative"
    :style="styles"
    @click="selectImage()"
  >
    <div
      class="absolute top-left-0 text-gray ris-overlay w-full h-full flex flex-col items-center justify-center rounded-full"
      :class="{visible: !value}"
    >
      <fa-icon class="text-5xl" icon="image"/>
      <div v-if="text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
    import { ipcRenderer } from 'electron'

    export default {
        props: {
            size: {
                type: Number,
                default: 150
            },
            text: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            }
        },
        computed: {
            styles () {
                return {
                    width: `${this.size}px`,
                    height: `${this.size}px`,
                    'background-image': this.value ? `url(${this.value})` : '',
                    'background-position': 'center',
                    'background-size': 'cover'
                }
            }
        },
        methods: {
            selectImage () {
                const dialogOptions = {
                    title: 'Select picture',
                    defaultPath: this.$electron.remote.app.getPath('pictures'),
                    buttonLabel: 'Select picture'
                }
                ipcRenderer.once('image', (sender, data) => [
                    this.$emit('input', data)
                ])
                ipcRenderer.send('select-and-resize-image', 200, dialogOptions)
            }
        }
    }
</script>

<style lang="scss" scoped>
.ris-container {
    .ris-overlay {
        transition: all 300ms ease;
    }

    .ris-overlay:not(.visible) {
        opacity: 0;
        background: rgba(black, 0.7);
    }

    &:hover {
        .ris-overlay {
            opacity: 1;
        }
        .ris-overlay:not(.visible) {
            @apply text-white;
        }
    }
}
</style>