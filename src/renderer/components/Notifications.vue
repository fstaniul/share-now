<template>
  <transition name="expand-down" appear>
    <div v-if="display" class="notifications-container" :style="containerStyles">
      <div
        v-if="notifications.length === 0"
        class="notification flex flex-col items-center content-center text-grey-dark"
      >There are no notifications to display</div>
      <template v-else>
        <div
          v-for="notification of notifications"
          :key="notification.id"
          @click="notificationAction(notification)"
          class="notification"
        ></div>
      </template>
    </div>
  </transition>
</template>

<script>
export default {
    computed: {
        notifications () {
            return this.$store.getters.notifications
        },
        display () {
            return this.$store.getters.notificationsDisplayed
        },
        containerStyles () {
            return {
                height: Math.max(Math.min(this.notifications.length * 100, 300), 100)
            }
        }
    },
    methods: {
        notificationAction (notification) {}
    }
}
</script>

<style lang="scss" scoped>
$border-color: #dae1e7;
$background-color: #f1f5f8;

.notifications-container {
  overflow: hidden;
  width: 400px;
  border: 1px solid $border-color;
  background: $background-color;
  position: fixed;
  top: 100px;
  right: 100px;
}

.notification {
  width: 400px;
  height: 100px;
  border: 1px solid;
  border-color: transparent transparent $border-color transparent;

  &:last-child {
    border-color: transparent;
  }
}

.expand-down-enter,
.expand-down-leave-to {
  height: 0;
  opacity: 0;
}

.expand-down-enter-to,
.expand-down-leave {
  opacity: 1;
}

.expand-down-enter-active,
.expand-down-leave-active {
  transition-duration: 400ms;
  transition-property: height, opacity;
  transition-timing-function: ease-out;
}
</style>