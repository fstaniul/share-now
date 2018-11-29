import Vue from 'vue'
import axios from 'axios'
import path from 'path'

export default {
    state: [
        // {
        //     name: 'file.ext',
        //     size: 1250,
        //     direction: 'download',
        //     ip: '192.158.0.1',
        //     id: 'aea11d22-45d0-4846-8483-2d7a528afcb7',
        //     status: 'in-progress',
        //     progress: 45
        // },
        // {
        //     name: 'file.ext',
        //     size: 1250,
        //     direction: 'download',
        //     ip: '192.158.0.1',
        //     id: 'aea11d22-45d0-4846-8483-2d7a528afcb8',
        //     status: 'completed',
        //     progress: 100
        // },
        // {
        //     name: 'file.ext',
        //     size: 1250,
        //     direction: 'download',
        //     ip: '192.158.0.1',
        //     id: 'aea11d22-45d0-4846-8483-2d7a528afcb9',
        //     status: 'requested',
        //     progress: 100
        // }
    ],
    mutations: {
        'add-file' (state, file) {
            state.push({ ...file, timestamp: (new Date()).getTime() })
        },
        'update-file' (state, { id, data }) {
            const index = state.findIndex(f => f.id === id)
            Vue.set(state, index, { ...state[index], ...data })
        }
    },
    actions: {
        'update-file' ({ commit }, payload) {
            commit('update-file', payload)
        },
        'new-file' ({ commit, rootState }, file) {
            commit('add-file', { ...file })
        },
        'update-file-status' ({getters, commit, rootState}, {id, status}) {
            const file = getters.getFileById(id)

            console.log(file)

            commit('update-file', {
                id,
                data: {
                    status: status === 'accepted' ? 'in-progress' : status
                }
            })

            axios.post(`http://${file.ip}:${rootState.settings.port}/file-status`, {id, status})
                .catch(err => {
                    console.log(err)
                    commit('update-file', {
                        id, data: {status: 'error'}
                    })
                })
        }
    },
    getters: {
        getFileById (state) {
            return id => state.find(f => f.id === id)
        },
        getFilesByUserIp (state) {
            return ip => state.filter(f => f.ip === ip)
        },
        getInProgressFiles (state) {
            return state
                .filter(f => f.status === 'in-progress')
                .sort((x, y) => x.timestamp - y.timestamp)
        }
    }
}
