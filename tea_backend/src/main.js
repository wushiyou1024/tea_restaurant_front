import Vue from 'vue'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router/index.js'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(router)
new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
