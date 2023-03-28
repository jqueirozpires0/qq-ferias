import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import VueMaterial from 'vue-material'
import Toasted from 'vue-toasted';
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import VueTheMask from 'vue-the-mask'

Vue.use(VueTheMask)
 
Vue.use(Chartkick.use(Chart))

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)
Vue.use(Toasted, {
  iconPack: 'fontawesome'
});

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
