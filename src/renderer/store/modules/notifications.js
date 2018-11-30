import Vue from 'vue'
import { v1 } from 'uuid'

export default {
    state: {
        notifications: [
            {id: 'ed4f8292-f4a6-11e8-8eb2-f2801f1b9fd1', text: 'User wants to send you a file', route: '/user/192.168.0.1', icon: 'file-download', seen: false},
            {id: 'ed4f879c-f4a6-11e8-8eb2-f2801f1b9fd1', text: 'User wants to send you a file', route: '/user/192.168.0.1', icon: 'file-download', seen: false},
            {id: 'ed4f8940-f4a6-11e8-8eb2-f2801f1b9fd1', text: 'User wants to send you a file', route: '/user/192.168.0.1', icon: 'file-download', seen: false},
            {id: 'ed4f8b34-f4a6-11e8-8eb2-f2801f1b9fd1', text: 'User wants to send you a file', route: '/user/192.168.0.1', icon: 'file-download', seen: false}
        ],
        displayed: false
    },
    mutations: {
        'add-notification' (state, payload) {
            state.notifications.push({ ...payload, id: v1(), seen: false })
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
        },
        'mark-notifications-as-seen' (state) {
            state.notifications.forEach(n => {
                n.seen = true
            })
        }
    },
    actions: {
        'toggle-notifications-display' ({ commit }, payload) {
            commit('toggle-notifications-display', payload)
        },
        'mark-notifications-as-seen' ({commit}) {
            commit('mark-notifications-as-seen')
        },
        'add-notification' ({commit}, payload) {
            commit('add-notification', payload)
        },
        'alter-notification' ({commit}, payload) {
            commit('alter-notification', payload)
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
