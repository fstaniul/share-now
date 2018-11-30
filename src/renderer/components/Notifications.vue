<template>
  <transition name="expand-down" appear>
    <div class="notifications-container-container" v-if="display">
        <div class="arrow-top"></div>
        <div class="notifications-container" :style="containerStyles">
            <div
            v-if="notifications.length === 0"
            class="notification flex flex-col items-center justify-center text-grey-darker text-sm"
            >There are no notifications to display</div>
            <template v-else>
            <div
                v-for="notification of notifications"
                :key="notification.id"
                @click="notificationAction(notification)"
                class="notification notification-grid cursor-pointer"
            >
                <div class="flex items-center justify-center text-3xl text-grey-dark"><fa-icon :icon="notification.icon" /></div>
                <div class="flex flex-row items-center jusitfy-start text-sm text-grey-darker">{{ notification.text }}</div>
            </div>
            </template>
        </div>
    </div>
  </transition>
</template>

<script>
export default {
    watch: {
        display (next, previous) {
            if (next) {
                this.$store.dispatch('mark-notifications-as-seen')
            }
        }
    },
    computed: {
        notifications () {
            return this.$store.getters.notifications
        },
        display () {
            return this.$store.getters.notificationsDisplayed
        },
        containerStyles () {
            return {
                height: Math.max(Math.min(this.notifications.length * 70, 280), 70) + 'px'
            }
        }
    },
    methods: {
        notificationAction (notification) {
            this.$router.push({path: notification.route})
            this.$store.dispatch('toggle-notifications-display')
        }
    }
}
</script>

<style lang="scss" scoped>
$border-color: #dae1e7;
$background-color: #f1f5f8;

.notifications-container-container {
  position: fixed;
  top: 90px;
  right: 40px;
}

.notifications-container {
  overflow-x: hidden;
  overflow-y: auto;
  width: 400px;
  border: 1px solid $border-color;
  background: $background-color;
}

.notification {
  width: 398px;
  height: 68px;
  border: 1px solid;
  border-color: transparent transparent $border-color transparent;
  box-sizing: border-box;

  &:last-child {
    border-color: transparent;
  }
}

.notification-grid {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 70px 1fr;

    &:hover div {
        @apply text-blue-dark;
        transition: 300ms color ease-in-out;
    }
}

.arrow-top {
    position: absolute;
    top: -8px;
    right: 50px;
    width: 0px;
    height: 0px;
    border: solid transparent;
    border-top-color: $border-color;
    border-width: 16px 16px 0 0;
    transform: rotate(45deg);
}

.expand-down-enter,
.expand-down-leave-to {
  height: 0px;
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