<template>
  <div class="h-screen w-full dashboard-grid">
    <div class="flex flex-row header-container mb-4">
      <logo class="logo"/>
      <nav-bar class="ml-auto"/>
    </div>
    <header class="mb-5">
      <hr class="border border-grey-light mb-6">
      <div class="flex flex-row">
        <div>
            <h2 class="text-black">Users online</h2>
            <span class="text-grey-darkest">Select user to share your files with...</span>
        </div>
        <button class="ml-auto text-xs flex flex-row justify-center items-center text-grey-darker border-b border-grey-dark hover:text-blue-dark hover:border-blue pb-1 self-center refresh-btn" @click="reloadUsers()" :class="{loading}">
          <span class="text display-block mr-1">refresh</span>
          <fa-icon icon="redo-alt" :spin="loading"/>
        </button>
      </div>
    </header>
    <div v-if="usersOnline.length === 0 && !loading" class="text-center">There are no users on local network.</div>
    <div v-else-if="usersOnline.length === 0 && loading" class="flex flex-row items-center justify-center">
        <loader />
    </div>
    <transition-group v-else tag="div" name="pltrans" class="profiles-container overflow-x-hidden overflow-y-auto relative">
        <profile v-for="profile of usersOnline" :profile="profile" :key="profile.ip" />
    </transition-group>
    <!-- <task-bar /> -->
  </div>
</template>

<script>
export default {
    created () {
        this.$electron.ipcRenderer.send('start-user-discovery')
        this.$electron.ipcRenderer.send('start-server')
    },
    components: {
        'task-bar': require('./Dashboard/TaskBar').default,
        profile: require('./Dashboard/Profile').default
    },
    computed: {
        usersOnline () {
            return this.$store.getters.users
        },
        loading () {
            return this.$store.state.users.loading
        }
    },
    methods: {
        reloadUsers () {
            if (this.loading) return
            this.$electron.ipcRenderer.send('discover-users')
        }
    }
}
</script>

<style lang="scss" scoped>
.profiles-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 150px;
  grid-auto-rows: 150px;
  grid-gap: 15px;
}

.header-container {
  padding-top: 40px;
  font-size: 32px;
}
.logo {
  font-size: 32px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content 1fr;
  padding: 0 40px 0 40px;
}

.refresh-btn {
    width: 62px;
    &.loading {
        cursor: default;
        @apply text-blue-dark border-blue;

        .text {
            width: 0px;
            margin-right: 0;
        }
    }
    .text {
        width: 43px;
        transition: 300ms ease;
        transition-property: width, margin;
        overflow: hidden;
    }
}

.pltrans-enter-to, .pltrans-leave {
    transform: translateY(0);
    opacity: 1;
}

.pltrans-enter {
    transform: translateY(-100%);
    opacity: 0;
}

.pltrans-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.pltrans-enter-active, .pltrans-leave-active, .pltrans-move {
    transition: all 600ms ease-out;
}

.pltrans-leave-active {
    position: absolute;
}
</style>
