import * as types from './mutation-type'
import api from '@/modules/services/api'
import Vue from 'vue'

/* eslint-disable */

export const ActionLogin = ({ dispatch }, payload) => {
    return api.post('login', payload).then((res) => {
        dispatch('ActionSetUser', res.data.colaborador)
        dispatch('ActionSetToken', res.data.token)
        localStorage.setItem('token', res.data.token)

        dispatch('ActionLoadSession')

    }).catch((error) => {
        Vue.toasted.error("Email ou senha incorretos!", {
            className: "error",
            duration: "7000",
            position: "bottom-right",
        });
        console.log(error)
    })
}

export const ActionLogout = ({ commit }) => {
    commit('ActionClearUser')
}

export const ActionCheckToken = ({ dispatch, state }) => {
    if (state.token) {
        return Promise.resolve(token)
    }

    const token = localStorage.getItem('token')

    if (!token) {
        return Promise.reject(new Error('Token invalido'))
    }

    dispatch('ActionSetToken', token)
    return dispatch('ActionLoadSession')
}

export const ActionLoadSession = ({ dispatch }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                data: { token,colaborador },
              } =  await api.get('load-session')
              dispatch('ActionSetToken', token)
              dispatch('ActionSetUser', colaborador)
              console.log(data)

              resolve()
        } catch (error) {
            return reject(error)
        }
    })
}

export const ActionSetUser = ({ commit }, payload) => {
    commit(types.SET_USER, payload)
}

export const ActionSetToken = ({ commit }, payload) => {
    commit(types.SET_TOKEN, payload)
}

export const ActionClearUser = ({ commit }) => {
    commit(types.CLEAR_USER)
}