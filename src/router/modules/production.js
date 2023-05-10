import Layout from "@/layout";

const productionRouter = {
  path: "/production",
  component: Layout,
  // redirect: 'noRedirect',
  name: "Production",
  meta: {
    title: "production.title",
    icon: "production"
  },
  children: [
    {
      path: "productionManage",
      component: () => import("@/views/production/ProductionManage"),
      name: "ProductionManage",
      meta: {
        title: "production.leftMenus[0].text"
      }
    },
    {
      path: "productionUpgrade",
      component: () => import("@/views/production/ProductionUpgrade"),
      name: "ProductionUpgrade",
      meta: {
        title: "production.leftMenus[1].text"
      }
    }
  ]
};

export default productionRouter;
