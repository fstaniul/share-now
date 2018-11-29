import Vue from 'vue'
import { v1 } from 'uuid'

export default {
    state: {
        notifications: [],
        displayed: false
    },
    mutations: {
        'add-notification' (state, payload) {
            state.notifications.push({ ...payload, id: v1() })
        },
        'alter-notification' (state, payload) {
            const index = state.notifications.findIndex(
                n => n.id === payload.id
            )
            if (index !== -1) {
                Vue.set(state.notifications, index, payload)
            }
        },
        'toggle-notifications-display' (state, payload) {
            if (typeof payload !== 'undefined') state.displayed = !!payload
            else state.displayed = !state.displayed
        }
    },
    actions: {
        'toggle-notifications-display' ({ commit }, payload) {
            commit('toggle-notifications-display', payload)
        }
    },
    getters: {
        notifications (state) {
            return state.notifications
        },
        notificationsDisplayed (state) {
            return state.displayed
        }
    }
}
