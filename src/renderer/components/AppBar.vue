<template>
  <div class="app-bar pt-1 px-3">
    <button class="app-bar-btn bg-red active:shadow-inner" @click="close()">
      <fa-icon icon="times"></fa-icon>
    </button>
    <button class="app-bar-btn bg-yellow active-shadow-inner" @click="minimize()">
      <fa-icon icon="minus"></fa-icon>
    </button>
  </div>
</template>

<script>
export default {
    methods: {
        close () {
            this.$electron.remote.getCurrentWindow().close()
        },
        minimize () {
            this.$electron.remote.getCurrentWindow().minimize()
        }
    }
}
</script>

<style lang="scss" scoped>
.app-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 30px;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.app-bar-btn {
  @apply rounded-full cursor-pointer text-white;
  width: 16px;
  height: 16px;
  font-size: 8px;
  &:focus {
    outline: none;
  }
  -webkit-app-region: no-drag;
}
</style>
