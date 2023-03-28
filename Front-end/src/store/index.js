import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/modules/auth/store';
import VuexPersistence from 'vuex-persist';
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    auth
  }
});