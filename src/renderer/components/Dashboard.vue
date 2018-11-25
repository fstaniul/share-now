<template>
    <div class="h-screen w-full">
        <div class="flex flex-row header-container">
            <logo class="logo" />
            <nav-bar class="ml-auto" />
        </div>
        <div class="profiles-container">
          <profile v-for="profile of usersOnline" :profile="profile" :key="profile.id"></profile>
        </div>
        <task-bar />
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
.profiles.container {
  padding: 20px 40px 0 40px;
}

.header-container {
  padding-top: 40px;
  padding-left: 40px;
  padding-right: 40px;
  font-size: 32px;
}
.logo {
  font-size: 32px;
}
</style>
