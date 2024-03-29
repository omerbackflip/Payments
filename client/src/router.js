import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/payments",
      name: "payments",
      component: () => import("./components/PaymentsList")
    },
    {
      path: "/loadCsv",
      name: "loadCsv",
      component: () => import("./components/VueCsvImport")
    },
    {
      path: "/Payment",
      name: "payment",
      component: () => import("./components/Payment")
    },
    {
      path: "/tableList",
      name: "tableList",
      component: () => import("./components/TableList")
    },
    {
      path: "/project",
      name: "project",
      component: () => import("./components/Project")
    },
    {
      path: "/mainView",
      name: "mainView",
      component: () => import("./components/MainView")
    },
  ]
});