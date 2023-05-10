import Layout from "@/layout";

const pathPlanningRouter = {
  path: "/pathPlanning",
  component: Layout,
  // redirect: "noRedirect",
  name: "Path",
  meta: {
    title: "common.xianluguanli",
    icon: "xianlu"
  },
  children: [
    {
      path: "index",
      component: () => import("@/views/pathPlanning/index.vue"),
      name: "PathPlanning",
      meta: {
        title: "common.xianluguanli"
      }
    }
  ]
};

export default pathPlanningRouter;
