import Vue from 'vue'
import NewApp from './NewApp.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(NewApp),
}).$mount('#app')
