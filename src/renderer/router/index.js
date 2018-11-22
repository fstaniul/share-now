import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/first-launch',
      name: 'first-launch',
      component: require('@/components/FirstLaunch').default,
      children: [
        {
          path: '/select-name',
          name: 'first-launch-name',
          component: require('@/components/FirstLaunch/SelectName')
        },
        {
          path: '/select-image',
          name: 'first-launch-image',
          component: require('@/components/FirstLaunch/SelectImage')
        }
      ]
    },
    {
      path: '*',
      redirect: '/first-launch/select-image'
    }
  ]
})
