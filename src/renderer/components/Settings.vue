<template>
  <div class="--apppad --appbarpad pb-6 h-screen overflow-y-auto relative">
    <button
      class="closebtn flex flex-col items-center justify-center rounded-full border border-gray text-gray hover:bg-gray-lighter hover:text-gray-dark hover:border-gray-dark"
      @click="$router.go(-1)"
    >
      <fa-icon icon="times"/>esc
    </button>
    <h1 class="mt-3">Settings</h1>
    <div class="mt-1 text-gray">Don't forget to save changes!</div>
    <hr class="border-t border-gray-light my-6">
    <h3>
      <span class="mr-2">Profile</span>
      <span class="text-gray text-xs">Profile picture and name</span>
    </h3>
    <div class="flex flex-row items-center justify-center mt-3">
      <rounded-image-selector v-model="settings.image" text="select picture" :size="150"/>
      <floating-label-input class="ml-3" v-model="settings.name" label="Your name" :width="450"/>
    </div>
  </div>
</template>

<script>
    export default {
        mounted () {
            this.escListener.bind(this)
            window.addEventListener('keydown', this.escListener)
        },
        beforeDestroy () {
            window.removeEventListener('keydown', this.escListener)
        },
        created () {
            this.settings = Object.assign({}, this.$store.state.settings)
        },
        data () {
            return {
                settings: {}
            }
        },
        methods: {
            escListener (event) {
                if (event.key === 'Escape') this.$router.go(-1)
            },
            save () {
                this.$store.dispatch('update-settings', this.settings)
            }
        }
    }
</script>

<style lang="scss" scoped>
.closebtn {
    width: 50px;
    height: 50px;
    position: fixed;
    top: 40px;
    right: 40px;
    transition: 300ms ease;
    transition-property: background-color, color, border-color;
}

</style>