import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/first-launch',
      component: require('@/components/FirstLaunch').default,
      children: [
        {
          path: '/select-name',
          name: 'first-launch-name',
          component: require('@/components/FirstLaunch/SelectName').default
        },
        {
          path: '/select-image',
          name: 'first-launch-image',
          component: require('@/components/FirstLaunch/SelectImage').default
        }
      ]
    },
    {
      path: '/',
      name: 'first-launch-conditional-redirect',
      component: require('@/router/FirstLaunchConditionalRedirect').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
