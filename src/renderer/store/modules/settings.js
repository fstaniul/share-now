export default {
    state: {
        name: '',
        image: ''
    },
    mutations: {
        'set-image' (state, payload) {
            state.image = payload
        },
        'set-name' (state, payload) {
            state.name = payload
        }
    },
    actions: {
        'set-image' (ctx, payload) {
            ctx.commit('set-image', payload)
        },
        'set-name' (ctx, payload) {
            ctx.commit('set-name', payload)
        }
    }
}
