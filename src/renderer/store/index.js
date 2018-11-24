import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

const plugins = [createSharedMutations()]

if (process.env.NODE_ENV === 'production') {
    plugins.push(createPersistedState())
}

export default new Vuex.Store({
    modules,
    plugins,
    strict: process.env.NODE_ENV !== 'production'
})
