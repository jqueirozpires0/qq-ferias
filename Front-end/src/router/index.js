import Vue from 'vue'
import VueRouter from 'vue-router'
import beforeEach from './beforeEach'
//Login
import TelaLogin from '../views/TelaLogin.vue'
//Administrador
import Cadastro from '../views/TelaCadastro.vue'
import Edit from '../views/TelaEditar.vue'
import TelaPerfilAdministrador from '../views/TelaPerfilAdministrador.vue'
//Colaborador
import TelaPerfilColaborador from '../views/TelaPerfilColaborador.vue'
import TelaSolicitacaoColaborador from '../views/TelaSolicitacaoColaborador.vue'
//Gestor
import TelaNotificacoes from '../views/TelaNotificacoes.vue'
import TelaPerfilGestor from '../views/TelaPerfilGestor.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: TelaLogin
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro
  },
  {
    path: '/edit',
    name: 'Editar',
    component: Edit
  },
  {
    path: '/solicitacao',
    name: 'Solicitaçao',
    component: TelaSolicitacaoColaborador
  },
  {
    path: '/notificacoes',
    name: 'Notificações',
    component: TelaNotificacoes
  },
  {
    path: '/administrador',
    name: 'Perfil Administrador',
    component: TelaPerfilAdministrador
  },
  {
    path: '/colaborador',
    name: 'Perfil Colaborador',
    component: TelaPerfilColaborador
  },
  {
    path: '/gestor',
    name: 'Perfil Gestor',
    component: TelaPerfilGestor
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(beforeEach)

export default router
