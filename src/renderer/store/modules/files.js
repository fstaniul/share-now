import Vue from 'vue'

export default {
    state: [],
    mutations: {
        'add-file': (state, file) => {
            state.push(file)
        },
        'update-file': (state, { id, data }) => {
            const index = state.findIndex(f => f.id === id)
            Vue.set(state, index, { ...state[index], ...data })
        }
    },
    actions: {
        'update-file': ({commit}, payload) {
            commit('update-file', payload)
        },
        'new-file': ({commit}, payload) {
            commit('add-file', payload)
        }
    },
    getters: {
        'getFileById': (state) => {
            return (id) => state.filter(f => f.id === id)
        }
    }
}
