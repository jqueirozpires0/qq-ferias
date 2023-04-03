import * as types from './mutation-type.js'


export default{
    [types.SET_USER](state, payload){
        state.colaborador = payload
        localStorage.setItem('colaborador', JSON.stringify(payload))
    },

    [types.SET_TOKEN](state, payload){
        state.token = payload
        localStorage.setItem('token', payload)
    },
    [types.CLEAR_USER](state){
        state.colaborador = null
        localStorage.setItem('token', null)
    }
}