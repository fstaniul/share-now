<template>
  <div>

  </div>
</template>

<script>
  export default {
      mounted () {
          if (this.$store.state.settings.firstStart) {
              this.$router.push({name: 'first-launch-name'})
          } else {
              this.$router.push({name: 'dashboard'})
          }
      }
  }
</script>

<style scoped>
</style>