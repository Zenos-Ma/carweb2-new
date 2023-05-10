import Layout from "@/layout";

const accountRouter = {
  path: "/fence",
  component: Layout,
  // redirect: 'noRedirect',
  name: "Fence",
  meta: {
    title: "fence.fenceManage",
    icon: "fence"
  },
  children: [
    {
      path: "fencePolygon",
      component: () => import("@/views/fence/FencePolygon"),
      name: "FencePolygon",
      meta: {
        title: "fence.navTabs[0].text"
      }
    },
    {
      path: "fenceDevice",
      component: () => import("@/views/fence/FenceDevice"),
      name: "FenceDevice",
      meta: {
        title: "fence.navTabs[1].text"
      }
    }
  ]
};

export default accountRouter;
