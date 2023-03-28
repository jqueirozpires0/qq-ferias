import Vue from 'vue'
import VueRouter from 'vue-router'
import beforeEach from './beforeEach'
//Login
import TelaLogin from '../views/TelaLogin.vue'
//Administrador
import Cadastro from '../views/TelaCadastro.vue'
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
    path: '/login',
    name: 'login',
    component: TelaLogin
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro
  },
  {
    path: '/solicitacao',
    name: 'solicitacao',
    component: TelaSolicitacaoColaborador
  },
  {
    path: '/notificacoes',
    name: 'notificacoes',
    component: TelaNotificacoes
  },
   {
     path: '/administrador',
     name: 'administrador',
     component: TelaPerfilAdministrador
   },
   {
    path: '/colaborador',
    name: 'telaperfilcolaborador',
    component: TelaPerfilColaborador
  },
  {
    path: '/gestor',
    name: 'telaperfilgestor',
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
