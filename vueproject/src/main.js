import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/golbal.css";
import axios from "axios";
import Treetable from "vue-table-with-tree-grid"
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/";
// 通过axios请求拦截器添加一个token值
axios.interceptors.request.use(config => {
  // 为请求头对象添加一个Authorization字段来验证token值
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
Vue.component("tree-table",Treetable );
Vue.filter("dateFormat",function(originVal){
  const dt=new Date(originVal)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+"").padStart(2,"0")
  const d=(dt.getDay()+"").padStart(2,"0")
  const hh=(dt.getHours()+"").padStart(2,"0")
  const mm=(dt.getMinutes()+"").padStart(2,"0")
  const ss=(dt.getSeconds()+"").padStart(2,"0")
  return  `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
