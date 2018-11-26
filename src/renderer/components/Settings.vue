<template>
  <div class="--apppad --appbarpad pb-6 h-screen overflow-y-auto">
    <button
      class="closebtn flex flex-col items-center justify-center rounded-full border border-gray text-gray hover:bg-gray-lighter hover:text-gray-dark hover:border-gray-dark"
      @click="$router.go(-1)"
    >
      <fa-icon icon="times"/>esc
    </button>
    <h1 class="mt-3">Settings</h1>
    <div class="mt-1 text-gray">Don't forget to save changes!</div>
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
        methods: {
            escListener (event) {
                if (event.key === 'Escape') this.$router.go(-1)
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