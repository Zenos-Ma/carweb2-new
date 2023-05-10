import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

import accountRouter from "./modules/account";
import customerRouter from "./modules/customer";
import FenceRouter from "./modules/fence";
import CardRouter from "./modules/card";
import rechargeRouter from "./modules/recharge";
import frctRouter from "./modules/frc";
import systemRouter from "./modules/system";
import insuranceRouter from "./modules/insurance";
import monitorRouter from "./modules/monitor";
import deviceChartRouter from "./modules/deviceChart";
import apiDoctRouter from "./modules/apiDoc";
import deviceBlueToothRouter from "./modules/deviceBluetooth";
import productionRouter from "./modules/production";
import monitorSingleRouter from "./modules/monitorSingle";
import rechargeChartRouter from "./modules/rechargeChart";
import pathPlanningRouter from "./modules/pathPlanning";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/home",

    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/Home"),
        meta: { title: "account.leftMenus[0].text", icon: "home" }
      }
    ]
  },
  accountRouter,
  customerRouter,
  monitorRouter,
  insuranceRouter,
  FenceRouter,
  CardRouter,
  rechargeRouter,
  frctRouter,
  systemRouter,
  deviceChartRouter,
  apiDoctRouter,
  deviceBlueToothRouter,
  productionRouter,
  monitorSingleRouter,
  rechargeChartRouter,
  pathPlanningRouter,
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
  {
    path: "/export",
    name: "InsuranceExport",
    component: () => import("@/views/export/InsuranceExport.vue"),
    hidden: true
  },
  {
    path: "/export1",
    name: "InsuranceExport1",
    component: () => import("@/views/export/InsuranceExport1.vue"),
    hidden: true
  },
  {
    path: "/export2",
    name: "InsuranceExport2",
    component: () => import("@/views/export/InsuranceExport2.vue"),
    hidden: true
  },
  {
    path: "/export3",
    name: "InsuranceExport3",
    component: () => import("@/views/export/InsuranceExport3.vue"),
    hidden: true
  },
  {
    path: "/export7",
    name: "InsuranceExport7",
    component: () => import("@/views/export/InsuranceExport7.vue"),
    hidden: true
  },
  {
    path: "/export8",
    name: "InsuranceExport8",
    component: () => import("@/views/export/InsuranceExport8.vue"),
    hidden: true
  },
  {
    path: "/export9",
    name: "InsuranceExport9",
    component: () => import("@/views/export/InsuranceExport9.vue"),
    hidden: true
  },
  {
    path: "/export10",
    name: "InsuranceExport10",
    component: () => import("@/views/export/InsuranceExport10.vue"),
    hidden: true
  },
  {
    path: "/export11",
    name: "InsuranceExport11",
    component: () => import("@/views/export/InsuranceExport11.vue"),
    hidden: true
  },
  {
    path: "/export12",
    name: "InsuranceExport12",
    component: () => import("@/views/export/InsuranceExport12.vue"),
    hidden: true
  },
  {
    path: "/export13",
    name: "InsuranceExport13",
    component: () => import("@/views/export/InsuranceExport13.vue"),
    hidden: true
  },
  {
    path: "/export14",
    name: "InsuranceExport14",
    component: () => import("@/views/export/InsuranceExport14.vue"),
    hidden: true
  },
  {
    path: "/export15",
    name: "InsuranceExport15",
    component: () => import("@/views/export/InsuranceExport15.vue"),
    hidden: true
  },
  {
    path: "/export16",
    name: "InsuranceExport16",
    component: () => import("@/views/export/InsuranceExport16.vue"),
    hidden: true
  },
  {
    path: "/playback",
    name: "Playback",
    component: resolve => require(["@/views/playback/Playback.vue"], resolve),
    hidden: true
  },
  {
    path: "/track",
    name: "Track",
    component: () => import("@/views/track/Track.vue")
  }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
