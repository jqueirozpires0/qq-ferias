import store from "@/store"

export default async (to, from, next) => {
    document.title = `${to.name} - QQ-FÉRIAS`
    if (to.name !== 'Login' && !store.getters['auth/hasToken']) {
      try {
        await store.dispatch('auth/ActionCheckToken')
        next({ path: to.path })
      } catch (err) {
        next({ name: 'Login' })
      }
    } else {
      if (to.name === 'Login' && store.getters['auth/hasToken']) {
        var colaborador = JSON.parse(localStorage.getItem("colaborador"));
        if (colaborador.col_isGestor == true) {
          next({ name: 'Perfil Gestor' })
        } else if (colaborador.col_isAdministrador == true) {
          next({ name: 'Perfil Administrador' })
        } else {
          next({ name: 'Perfil Colaborador' })
        }
      } else {
        next()
      }
    }
  }