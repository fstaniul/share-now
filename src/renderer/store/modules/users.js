import Vue from 'vue'

export default {
    state: {
        users: {
            '192.158.0.1': {
                name: 'mommy',
                image: '',
                ip: '192.158.0.1'
            }
        },
        loading: false
    },
    mutations: {
        'new-user' (state, user) {
            if (state.loading) state.loading = false
            Vue.set(state.users, user.ip, user)
        },
        'set-users-loading' (state, payload) {
            if (payload && Object.keys(state.users).length === 0) {
                state.loading = true
            } else state.loading = false
        }
    },
    getters: {
        users (state) {
            return Object.values(state.users)
        },
        'users-loading' (state) {
            return state.loading
        },
        getUserByIp (state) {
            return ip => state.users[ip]
        }
    },
    actions: {
        'new-user' (ctx, user) {
            ctx.commit('new-user', user)
        },
        'loading-users' (ctx) {
            ctx.commit('loading-users', true)
        },
        'loaded-users' (ctx) {
            ctx.commit('loaded-users', false)
        }
    }
}
