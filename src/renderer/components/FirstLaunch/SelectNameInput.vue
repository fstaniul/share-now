<template>
  <div class="relative mt-8 mb-4">
    <input id="name-input" type="text" @input="input($event)" :value="value" ref="input">
    <label for="name-input" class="name-label" :class="{'move-up': notEmpty}">Your name</label>
  </div>
</template>

<script>
  export default {
    props: {
      'value': {
        default: '',
        type: String
      }
    },
    computed: {
      notEmpty () {
        return this.value
      }
    },
    methods: {
      input (event) {
        this.$emit('input', event.target.value)
      }
    }
  }
</script>

<style lang="scss" scoped>
input {
  @apply text-2xl text-center w-full h-16 bg-transparent border-gray-light border rounded-full;
  &:focus {
    outline: none;
    @apply border-blue;
  }
}

.name-label {
  @apply text-2xl absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: 500ms all;

  input:focus + &,
  &.move-up {
    @apply text-xs;
    top: -12px;
    tranform: translate(-50%, -100%);
  }
}
</style>