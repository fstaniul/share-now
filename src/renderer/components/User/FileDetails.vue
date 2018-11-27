<template>
  <div
    class="file-details-container relative bg-grey-lighter flex flex-row items-center border border-grey-light"
  >
    <fa-icon
      class="icon text-grey-darker mx-4"
      :icon="file.direction === 'download' ? 'file-download' : 'file-upload'"
    />
    <span class="text-black">{{ file.name }}</span>
    <span class="ml-auto mr-3 text-grey-dark status-text">{{ statusText }}</span>
    <div class="progress-container">
      <rounded-progress
        :progress="file.progress"
        :size="70"
        class="bg-grey-lighter border border-grey-light"
      />
      <button
        class="rp-count bg-grey-lighter cursor-default"
        :class="{'openBtn cursor-pointer text-white': file.status === 'completed' && file.direction === 'download'}"
        @click="btnClick()"
      >
        <template v-if="file.status === 'in-progress'">{{file.progress}}%</template>
        <template v-if="file.status === 'completed' && file.direction === 'download'">open</template>
      </button>
    </div>
  </div>
</template>

<script>
import * as open from 'open'
import * as path from 'path'

export default {
    props: ['file'],
    computed: {
        statusText () {
            const d = this.file.direction === 'download'
            switch (this.file.status) {
            case 'requested':
                return d ? 'requested' : 'awaiting response'
            case 'in-progress':
                return d ? 'downloading' : 'uploading'
            case 'completed':
                return d ? 'downloaded' : 'uploaded'
            }
        }
    },
    methods: {
        btnClick () {
            if (this.file.status !== 'completed' || this.file.direction !== 'download') return
            open(path.dirname(this.file.path))
        }
    }
}
</script>

<style lang="scss" scoped>
.file-details-container {
    height: 50px;
    margin-top: 10px;
    margin-bottom: 30px;
    width: calc(100% - 35px);
    padding-right: 40px;
}

.icon {
    font-size: 32px;
}

.progress-container {
    position: absolute;
    right: -35px;
    top: -10px;
    border-radius: 50%;
    height: 70px;
    width: 70px;
}

.rp-count {
    position: absolute;
    height: 50px;
    width: 50px;
    top: 10px;
    left: 10px;
    border-radius: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transition: all 300ms ease;

    &.openBtn {
        top: 0;
        left: 0;
        width: 70px;
        height: 70px;
        @apply bg-blue;

        &:hover {
            @apply bg-blue-dark;
        }
    }
}

.status-text {
    font-size: 12px;
}
</style>