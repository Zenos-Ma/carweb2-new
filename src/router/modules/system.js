import Layout from "@/layout";

const systemRouter = {
  path: "/system",
  component: Layout,
  // redirect: 'noRedirect',
  name: "System",
  meta: {
    title: "system.title",
    icon: "home"
  },
  children: [
    {
      path: "systemDevice",
      component: () => import("@/views/system/SystemDevice"),
      name: "SystemDevice",
      meta: {
        title: "system.leftMenus[0].text"
      }
    },
    {
      path: "simInfo",
      component: () => import("@/views/system/SimInfo"),
      name: "SimInfo",
      meta: {
        title: "system.leftMenus[1].text"
      }
    },
    {
      path: "systemFeedback",
      component: () => import("@/views/system/SystemFeedback"),
      name: "SystemFeedback",
      meta: {
        title: "system.leftMenus[2].text"
      }
    }
  ]
};

export default systemRouter;
