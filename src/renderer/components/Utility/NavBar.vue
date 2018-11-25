<template>
    <nav class="text-2rem">
        <button type=button class="bell-btn mr-1 text-gray hover:text-blue">
            <fa-icon icon="bell"></fa-icon>
        </button>
        <button type=button class="cog-btn text-gray hover:text-blue">
            <fa-icon icon="cog"></fa-icon>
        </button>
    </nav>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>
nav button {
  &:hover {
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