<template>
  <div>

  </div>
</template>

<script>
  export default {
    mounted () {
      console.log('first launch conditional redirect')
      if (this.$store.state.launch.firstLaunch) {
        this.$router.push('first-launch-name')
        console.log('Redirecting!')
      } else {
        this.$router.push('dashboard')
      }
    }
  }
</script>

<style scoped>
</style>