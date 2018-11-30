<template>
    <transition name="bounce">
        <div v-if="count > 0" class="ncc absolute bg-red-dark text-white text-xs font-source" ref="container">
            {{ count }}
        </div>
    </transition>
</template>

<script>
    export default {
        watch: {
            count (now, before) {
                if (now > before) {
                    this.$refs.container.classList.add('flash')
                }
            }
        },
        mounted () {
            this.__animationedListener = () => {
                this.$refs.container.classList.remove('flash')
            }
            this.$refs.container.addEventListener('animationed', this.__animationedListener)
        },
        beforeDestroy () {
            this.$refs.container.removeEventListener('animationed', this.__animationedListener)
        },
        computed: {
            count () {
                return this.$store.getters.notifications.filter(x => !x.seen).length
            }
        }
    }
</script>

<style lang="scss" scoped>
.ncc {
    top: -5px;
    right: -5px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    line-height: 16px;
    text-align: center;
}

@keyframes bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }

  75% {
    transform: translate3d(0, -10px, 0);
  }

  90% {
    transform: translate3d(0, 5px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.bounce-enter-active {
  animation: bounceInDown 0.75s;
}

@keyframes flash {
  from,
  50%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
}

.flash {
  animation: flash 500ms;
}
</style>