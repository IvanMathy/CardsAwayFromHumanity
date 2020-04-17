import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false


import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Buefy from 'buefy'

Vue.use(Buefy)

const socket = io(
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:3000'
    : 'wss://play.cafh.okat.best'
);

Vue.use(VueSocketIOExt, socket, { store });

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
