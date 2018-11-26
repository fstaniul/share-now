<template>
  <div id="app">
    <app-bar/>
    <transition name="fade" mode="out-in" appear>
      <router-view></router-view>
    </transition>
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

<style scoped>
.fade-enter-to, .fade-leave {
    opacity: 1;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 300ms ease;
}

.fade-leave-to, .fade-enter {
    opacity: 0;
}
</style>
