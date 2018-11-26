<template>
  <div :style="styles" class="relative">
    <input
      class="border-b border-gray-light w-full px-4 py-2 bg-transparent outline-none focus:border-blue"
      :type="type"
      :value="value"
      @input="onInput($event)"
      ref="inputField"
    >
    <label
      class="px-4 py-2 cursor-text"
      :class="{'not-empty': value}"
      @click="focusInput()"
    >{{ label }}</label>
  </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'text'
            },
            value: {
                type: String,
                default: ''
            },
            width: {
                type: Number,
                default: 300
            },
            label: {
                type: String,
                default: ''
            }
        },
        computed: {
            styles () {
                return {
                    width: this.width + 'px'
                }
            }
        },
        methods: {
            onInput (event) {
                this.$emit('input', event.target.value)
            },
            focusInput () {
                this.$refs.inputField.focus()
            }
        }
    }
</script>

<style lang="scss" scoped>
label {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 300ms ease;
}

input:focus + label, label.not-empty {
    top: 100%;
    font-size: 12px;
    padding: 0;
}

input:focus + label {
    @apply text-blue;
}

</style>