<template>
  <div class="flex items-center justify-center h-full w-full">
      <div class="select-image-container">
          <div class="flex justify-center">
            <select-image-input class="mt-8 mb-4" v-model="image" />
          </div>
          <div class="text-right">
            <button class="btn-blue" @click="start()">
                START
                <fa-icon icon="caret-right"></fa-icon>
            </button>
          </div>
      </div>
  </div>
</template>

<script>
  export default {
    components: {
      'select-image-input': require('./SelectImageInput').default
    },
    data () {
      return {
        image: ''
      }
    },
    methods: {
      start () {
        this.$store.dispatch('finishFirstLaunch')
        if (this.image) {
          this.$store.dispatch('set-image', this.image)
        }
        this.$router.push({name: 'dashboard'})
      }
    }
  }
</script>

<style lang="scss" scoped>
.select-image-container {
  width: 500px;
}
</style>