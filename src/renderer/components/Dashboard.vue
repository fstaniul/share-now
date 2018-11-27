<template>
  <div class="h-screen w-full dashboard-grid">
    <div class="flex flex-row header-container mb-4">
      <logo class="logo"/>
      <nav-bar class="ml-auto"/>
    </div>
    <header class="mb-5">
      <hr class="border border-grey-light mb-6">
      <h2 class="text-black">Users online</h2>
      <span class="text-grey-darkest">Select user to share your files with...</span>
    </header>
    <div class="profiles-container overflow-x-hidden overflow-y-auto">
      <profile class="mx-auto" v-for="profile of usersOnline" :profile="profile" :key="profile.id"></profile>
    </div>
    <!-- <task-bar /> -->
  </div>
</template>

<script>
export default {
    components: {
        'task-bar': require('./Dashboard/TaskBar').default,
        profile: require('./Dashboard/Profile').default
    },
    computed: {
        usersOnline () {
            return this.$store.getters.users
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
</style>
