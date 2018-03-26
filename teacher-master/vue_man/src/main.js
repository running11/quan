// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'
import VueResource from 'vue-resource'
import qs from "qs"
import echarts from 'echarts'
import Vuex from 'vuex'
import store from './vuex/store'
import Global from './components/global/global.js'


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.axios = Axios

//Axios.defaults.withCredentials = true

Vue.prototype.global = Global
// 引入echarts

Vue.prototype.$echarts = echarts

Axios.interceptors.request.use(function (config) {
   if(config.method == "post"){
    	config.data = qs.stringify(config.data);
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
