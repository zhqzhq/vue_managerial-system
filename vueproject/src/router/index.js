import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/home.vue";
import Welcome from "../components/welcome.vue";
import Users from "../components/users.vue";
import Rights from "../components/rights.vue";
import Roles from "../components/roles.vue";
import Cate from "../components/cate.vue"
import Params from "../components/params.vue"
import List from "../components/list.vue"
import Add from  "../components/add.vue"
import Order from "../components/order/order.vue"
import Report from "../components/report.vue"
Vue.use(VueRouter);



const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome
        },
        {
          path: "/users",
          component: Users
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/roles",
          component: Roles
        },
        {
          path:"/categories",
          component:Cate
        },
        {
          path:"/params",
          component:Params
        },
        {
          path:"/goods",
          component:List
        },
        {
          path:"/goods/add",
          component:Add
        },
        {
          path:"/orders",
          component:Order
        },
        {
          path:"/reports",
          component:Report
        }
      ]
    }
  ]
});
// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenstr = window.sessionStorage.getItem("token");
  if (!tokenstr) return next("/login");
  next();
});

export default router;
