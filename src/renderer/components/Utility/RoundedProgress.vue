<template>
  <div class="relative rounded-full" :style="styles" :class="progressClass">
    <div class="mask" :style="maskStyles">
      <div class="bar" :style="barStyles"></div>
    </div>
    <div class="mask over" :style="overMaskStyles">
      <div class="bar" :style="barStyles"></div>
    </div>
    <div class="mask fix" :style="maskFixStyles">
      <div class="bar" :style="barStyles"></div>
    </div>
  </div>
</template>

<script>
  export default {
      props: {
          size: {
              type: Number,
              default: 150
          },
          progress: {
              type: Number,
              default: 0
          }
      },
      computed: {
          progressClass () {
              return `progress-${this.progress}`
          },
          styles () {
              return {
                  'width': this.size + 'px',
                  'height': this.size + 'px'
              }
          },
          maskStyles () {
              return {
                  'clip': `rect(0 ${this.size}px ${this.size}px ${this.size / 2}px)`
              }
          },
          barStyles () {
              return {
                  'transform': `rotate(${Math.round(this.progress * 180 / 100)}deg)`,
                  'clip': `rect(0, ${this.size / 2}px, ${this.size}px, 0)`
              }
          },
          overMaskStyles () {
              return {
                  'transform': `rotate(${Math.round(this.progress * 180 / 100)}deg)`,
                  'clip': `rect(0 ${this.size}px ${this.size}px ${this.size / 2}px)`
              }
          },
          maskFixStyles () {
              return {
                  'transform': `rotate(${Math.round(this.progress * 90 / 100)}deg)`,
                  'clip': `rect(0 ${this.size}px ${this.size}px ${this.size / 2}px)`
              }
          }
      }
  }
</script>

<style lang="scss" scoped>
.mask,
.bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: transform 300ms ease;
  -webkit-backface-visibility: hidden;
}

.bar {
  @apply bg-blue;
}
</style>