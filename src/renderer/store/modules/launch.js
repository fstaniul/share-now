export default {
  state: {
    firstLaunch: true
  },
  mutations: {
    finishFirstLaunch (store) {
      store.firstLaunch = false
    }
  },
  actions: {
    finishFirstLaunch (ctx) {
      ctx.commit('finishFirstLaunch')
    }
  }
}
