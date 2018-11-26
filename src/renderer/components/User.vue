<template>
  <div class="--appbarpad ugrid h-screen w-full">
    <header class="flex flex-row items-center --apppad">
      <button
        class="text-2rem text-gray hover:text-blue tr-300ms tr-ease tr-color relative"
        @click="$router.go(-1)"
      >
        <span class="absolute floating-in-text text-base text-blue">BACK</span>
        <fa-icon icon="arrow-circle-left"></fa-icon>
      </button>
      <nav-bar class="ml-auto"/>
    </header>
    <header class="flex flex-row items-center justify-center">
      <div v-if="user.image" class="image mr-6" :style="imageStyles"></div>
      <div class="flex flex-col items-center justify-center name-button-container">
        <span class="text-gray-dark mb-2 text-xl">{{ this.user.name }}</span>
        <button
          class="px-6 py-3 bg-blue hover:bg-blue-darker text-white text-lg upload-btn rounded-full tr-300ms tr-ease tr-background"
        >
          <fa-icon icon="upload"></fa-icon>Send file
        </button>
      </div>
    </header>
    <main class="--apppad overflow-y-auto overflow-x-hidden">
      <div>
        <file-details v-for="file of userFiles" :key="file.id" :file="file"/>
      </div>
    </main>
  </div>
</template>

<script>
    export default {
        components: {
            'file-details': require('./User/FileDetails').default
        },
        data () {
            return {
                scrolled: false
            }
        },
        computed: {
            user () {
                return this.$store.getters.getUserByIp(this.$route.params.ip)
            },
            userFiles () {
                return this.$store.getters.getFilesByUserIp(this.user.ip)
            },
            imageStyles () {
                return {
                    'background-image': `url(${this.user.image})`,
                    'background-size': 'cover',
                    'background-position': 'center'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.ugrid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content 1fr;
  grid-gap: 10px;
}

header {
  padding-top: 10px;
}

.floating-in-text {
  top: 50%;
  left: 120%;
  transform: translate(-100%, -50%);
  opacity: 0;
  transition: all 300ms;
  button:hover & {
    opacity: 1;
    transform: translate(0, -50%);
  }
}

.image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #0c75ff;
  z-index: 10000;
}


</style>