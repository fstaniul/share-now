import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

const plugins = [createSharedMutations()]

if (process.env.NODE_ENV === 'production') {
    plugins.push(createPersistedState())
}

const store = new Vuex.Store({
    modules,
    plugins,
    strict: process.env.NODE_ENV !== 'production'
})

if (process.env.NODE_ENV === 'production') {
    store.replaceState({
        ...store.state,
        files: [],
        users: {
            users: {},
            loading: false
        }
    })
}

export default store
