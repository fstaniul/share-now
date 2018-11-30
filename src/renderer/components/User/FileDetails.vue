<template>
  <div
    class="file-details-container relative bg-grey-lighter flex flex-row items-center border border-grey-light"
  >
    <fa-icon
      class="icon text-grey-darker mx-4"
      :icon="file.direction === 'download' ? 'file-download' : 'file-upload'"
    />
    <span class="text-black">{{ file.name }}</span>
    <span class="text-grey-dark text-sm ml-3" v-if="file.status === 'requested' && file.direction === 'download'">({{ prettySize }})</span>
    <span class="ml-auto mr-3 text-grey-dark status-text">{{ statusText }}</span>
    <div v-if="file.status === 'requested' && file.direction === 'download'" class="accept-container text-grey-lightest absolute text-xl">
        <button class="btn btn-accept bg-green-dark border-green text-grey-lighter" @click="acceptFile()">
            <fa-icon icon="check"></fa-icon>
        </button>
        <button class="btn btn-reject bg-red-dark border-red text-grey-lighter" @click="rejectFile()">
            <fa-icon icon="ban"></fa-icon>
        </button>
    </div>
    <div v-else-if="file.status === 'requested' || file.status === 'rejected' || file.status === 'error'" class="err-circle bg-red border-0 text-red-lighter" :class="{'bg-grey-lighter text-blue-dark': file.status === 'requested'}">
        <fa-icon v-if="file.status === 'requested'" icon="question-circle" />
        <template v-else>
            <fa-icon :icon="file.status === 'error' ? 'times' : 'ban'" class="text-xl"/>
            <span class="text-xs text-red-lighter">{{file.status}}</span>
        </template>
    </div>
    <div class="progress-container" v-else>
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
import * as prettyBytes from 'pretty-bytes'

export default {
    props: ['file'],
    computed: {
        statusText () {
            const d = this.file.direction === 'download'
            switch (this.file.status) {
            case 'requested':
                return d ? '' : 'requested'
            case 'in-progress':
                return d ? 'downloading' : 'uploading'
            case 'completed':
                return d ? 'downloaded' : 'uploaded'
            case 'error': return ''
            default: return this.file.status
            }
        },
        prettySize () {
            return prettyBytes(this.file.size)
        }
    },
    methods: {
        btnClick () {
            if (this.file.status !== 'completed' || this.file.direction !== 'download') return
            open(path.dirname(this.file.path))
        },
        acceptFile () {
            this.$store.dispatch('update-file-status', {id: this.file.id, status: 'accepted'})
        },
        rejectFile () {
            this.$store.dispatch('update-file-status', {id: this.file.id, status: 'rejected'})
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

.accept-container {
    top: -1px;
    right: -36px;
    width: 100px;
    height: 50px;

    .btn {
        position: absolute;
        height: 50px;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 150ms ease-out;

        &:hover {
            z-index: 1000;
            width: 100px;

            border-radius: 25px;
        }
    }

    .btn-accept {
        top: 0;
        left: 0;
        border-bottom-left-radius: 25px;
        border-top-left-radius: 25px;
    }

    .btn-reject {
        top: 0;
        right: -0;
        border-bottom-right-radius: 25px;
        border-top-right-radius: 25px;
    }
}

.err-circle {
    position: absolute;
    top: -10px;
    right: -35px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>