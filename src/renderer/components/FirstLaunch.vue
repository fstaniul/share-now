<template>
  <div class="overflow-hidden h-screen w-screen">
    <div class="header-container flex justify-center">
        <div>
            <logo class="text-5xl" />
            <div>Share your files on local network <span class="font-bold">fast</span> and <span class="font-bold">easy</span>!</div>
        </div>
    </div>
    <div class="router-container relative">
        <transition name="tr-anim" appear>
            <router-view />
        </transition>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.tr-anim-enter,
.tr-anim-enter-to,
.tr-anim-leave,
.tr-anim-leave-to {
  position: absolute;
  top: 0;
  left: 0;
}
.tr-anim-enter {
  opacity: 0;
  transform: scale3d(0.8, 0.8, 1);
}
.tr-anim-enter-active,
.tr-anim-leave-active {
  transition-duration: 600ms;
  transition-property: opacity, transform;
  transition-timing-function: linear;
}
.tr-anim-leave,
.tr-anim-enter-to {
  transform: scale3d(1);
  opacity: 1;
}
.tr-anim-leave-to {
  opacity: 0;
  transform: scale3d(1.2, 1.2, 1);
}

.header-container {
  margin-top: 100px;
  height: 100px;
}

.router-container {
  height: 300px;
  margin-bottom: 100px;
}
</style>