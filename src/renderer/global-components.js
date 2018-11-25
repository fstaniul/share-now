import Vue from 'vue'

Vue.component('logo', require('@/components/Utility/Logo').default)
Vue.component(
    'rounded-progress',
    require('@/components/Utility/RoundedProgress').default
)
Vue.component(
    'fa-icon',
    require('@fortawesome/vue-fontawesome').FontAwesomeIcon
)
Vue.component('loader', require('@/components/Utility/Loader').default)
