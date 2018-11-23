<template>
  <div class="flex flex-row justify-center items-center h-full w-full">
    <div class="form-container">
      <name-input v-model="name" />
      <div class="text-right">
        <button type="button" class="btn-blue" @click="next()" :class="{'disabled': !name}">
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