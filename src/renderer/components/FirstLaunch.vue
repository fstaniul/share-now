<template>
  <router-view />
</template>

<script>
  export default {
    created () {
      if (!this.$store.state.launch.firstLaunch) {
        this.$router.push('dashboard')
      }
    }
  }
</script>

<style scoped>
</style>