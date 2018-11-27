<template>
  <div class="absolute task-bar-container w-full" :class="{closed: closed}">
    <div class="task-bar bg-grey-light">
      <div class="header text-blue font-bold">TASKS</div>
    </div>
    <button
      class="task-bar-btn absolute bg-grey-light hover:bg-grey text-grey-dark"
      @click="closed = !closed"
    >
      <fa-icon :icon="btnIcon"></fa-icon>
    </button>
  </div>
</template>

<script>
export default {
    data () {
        return {
            closed: false
        }
    },
    computed: {
        btnIcon () {
            return this.closed ? 'plus' : 'minus'
        }
    }
}
</script>

<style lang="scss" scoped>
.task-bar-container {
  bottom: 0;
  left: 0;

  .task-bar {
    overflow: hidden;
    height: 200px;
    opacity: 1;
    transition: all 500ms ease-out;
  }

  .task-bar-btn {
    top: 0px;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 0 0 0 6px;
    transition: 300ms all;
  }

  &.closed {
    .task-bar-btn {
      top: -32px;
      border-radius: 6px 0 0 0;
    }
    .task-bar {
      height: 0px;
      opacity: 0;
    }
  }

  .header {
    padding: 10px 10px 0 10px;
    font-size: 16px;
  }
}
</style>
