<template>
    <div class="h-screen w-full">
        <div class="flex flex-row header-container">
            <logo class="logo" />
            <nav class="ml-auto">
                <button type=button class="bell-btn mr-3">
                    <fa-icon icon="bell"></fa-icon>
                </button>
                <button type=button class="cog-btn">
                    <fa-icon icon="cog"></fa-icon>
                </button>
            </nav>
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
      return this.$store.state.users.online
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

nav button {
  @apply text-gray-dark;
  &:hover {
    @apply text-blue;
    transition: 300ms;
  }
}

.cog-btn {
  &:hover {
    animation: 2s spin infinite linear;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.bell-btn {
  transform-origin: top center;
  &:hover {
    animation: 3s ringTheBell infinite cubic-bezier(0.37, 1.55, 0.55, -0.37);
  }
}

@keyframes ringTheBell {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(15deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
