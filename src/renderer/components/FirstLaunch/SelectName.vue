<template>
  <div class="flex flex-row justify-center items-center h-screen w-full">
    <div class="form-container">
      <logo class="text-5xl" />
      <div>Share your files on local network <span class="font-bold">fast</span> and <span class="font-bold">easy</span>!</div>
      <name-input v-model="name" />
      <div class="text-right">
        <button type="button" class="btn-blue" @click="next()" :class="{'disabled': !nameSet}">
          CONTINUE
          <fa-icon icon="caret-right"></fa-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      'name-input': require('./SelectNameInput').default
    },
    data () {
      return {
        name: ''
      }
    },
    computed: {
      nameSet () {
        return this.name
      }
    },
    methods: {
      next () {
        if (this.name) {
          this.$store.dispatch('set-name', this.name)
          this.$router.push({name: 'first-launch-image'})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.form-container {
  width: 500px;
}
</style>