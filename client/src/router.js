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
      path: "/loadBookCsv",
      name: "loadBookCsv",
      component: () => import("./components/ImportCsvBook")
    },
    {
      path: "/bookingList",
      name: "bookingList",
      component: () => import("./components/BookingList")
    },
    {
      path: "/tableList",
      name: "tableList",
      component: () => import("./components/TableList")
    },
  ]
});