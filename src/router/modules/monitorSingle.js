import Layout from "@/layout";

const monitorSingleRouter = {
  path: "/monitor-single",
  name: "MonitorSingle",
  component: () => import("@/views/monitorSingle/MonitorSingle"),
  meta: {
    title: "common.monitorPlatfrom",
    icon: "monitor"
  },
  hidden: true,
  children: [
    {
      path: "location",
      name: "Location1",
      component: () => import("@/views/monitorSingle/Location1"),
      meta: {
        title: "monitorSingle.navTabs[0].text"
      }
    },
    {
      path: "running",
      name: "Running",
      component: () => import("@/views/monitorSingle/Running1"),
      meta: {
        title: "monitorSingle.navTabs[1].text"
      }
    }
  ]
};

export default monitorSingleRouter;
