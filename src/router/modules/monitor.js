import Layout from "@/layout";

const monitorRouter = {
  path: "/monitor",
  // redirect: "noRedirect",
  // component: Layout,
  name: "Monitor",
  component: () => import("@/views/monitor/Monitor"),
  meta: {
    title: "common.monitorPlatfrom",
    icon: "monitor"
  },
  hidden: true,
  children: [
    {
      path: "location",
      name: "Location",
      component: () => import("@/views/monitor/components/Location"),
      meta: {
        title: "monitor.navTabs[0].text"
      }
    },
    {
      path: "running",
      name: "Running",
      component: () => import("@/views/monitor/components/Running"),
      meta: {
        title: "monitor.navTabs[1].text"
      }
    },
    {
      path: "alarm",
      name: "Alarm",
      component: () => import("@/views/monitor/components/Alarm"),
      meta: {
        title: "monitor.navTabs[2].text"
      }
    },
    {
      //2021-12-31添加上行程统计
      path: "travel",
      name: "Traveling",
      component: () => import("@/views/monitor/components/Traveling.vue"),
      meta: {
        title: "monitor.navTabs[3].text"
      }
    }
  ]
};

export default monitorRouter;
