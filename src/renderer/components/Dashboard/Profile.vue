<template>
  <div class="profile-container relative overflow-hidden cursor-pointer" @click="click()">
    <div class="absolute top-left-0">
      <rounded-progress :size="150" :progress="progress" class="bg-gray" />
    </div>
    <div class="image absolute rounded-full bg-gray-light" :style="imageStyle"></div>
    <div class="mask bg-black absolute flex flex-col items-center justify-center rounded-full text-white">
      <span>{{ profile.name }}</span>
      <span class="font-source" v-if="progress > 0 && progress < 100">{{progress}}%</span>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        profile: {
            default: () => ({}),
            type: Object
        }
    },
    computed: {
        imageStyle () {
            return {
                'background-image': `url(${this.profile.image})`,
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat'
            }
        },
        progress () {
            return 35
        }
    },
    methods: {
        click () {
            this.$router.push({name: 'user', params: {ip: this.profile.ip}})
        }
    }
}
</script>

<style lang="scss" scoped>
.profile-container {
  width: 150px;
  height: 150px;
}

.image,
.mask {
  top: 5px;
  left: 5px;
  height: 140px;
  width: 140px;
}

.mask {
  opacity: 0;
  transition: 300ms all;
  &:hover {
    opacity: 0.7;
  }
}
</style>
