import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './routes/index.js'
import store from './store'
import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
