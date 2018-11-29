export default {
    state: {
        name: '',
        image: '',
        firstStart: true,
        port: 8124,
        useSubfolder: false
    },
    mutations: {
        'set-image' (state, payload) {
            state.image = payload
        },
        'set-name' (state, payload) {
            state.name = payload
        },
        'set-first-start' (state, payload) {
            state.firstStart = payload
        }
    },
    actions: {
        'set-image' (ctx, payload) {
            ctx.commit('set-image', payload)
        },
        'set-name' (ctx, payload) {
            ctx.commit('set-name', payload)
        },
        'mark-first-started' (ctx) {
            ctx.commit('set-first-start', false)
        }
    }
}
