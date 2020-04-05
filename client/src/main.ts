import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false


Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.NODE_ENV === 'development'
                ? 'ws://localhost:3000'
                : 'wss://cafh.okat.best',
  vuex: {
      store,
      actionPrefix: 'IOA_',
      mutationPrefix: 'IOM._'
  }
}))

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
