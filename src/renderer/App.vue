<template>
  <div id="app">
    <app-bar />
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'share-now',
    components: {
      'app-bar': require('@/components/AppBar').default
    }
  }
</script>

<style>
</style>
