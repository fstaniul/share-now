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
Vue.component('nav-bar', require('@/components/Utility/NavBar').default)
Vue.component(
    'rounded-image-selector',
    require('@/components/Utility/RoundedImageSelector').default
)
Vue.component(
    'floating-label-input',
    require('@/components/Utility/FloatingLabelInput').default
)
