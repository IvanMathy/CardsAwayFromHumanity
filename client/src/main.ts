import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false


import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Buefy from 'buefy'

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

const socket = io(
  process.env.NODE_ENV === 'development'
    ? `ws://${window.location.hostname}:4000`
    : undefined as any
);

Vue.use(VueSocketIOExt, socket, { store });

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
