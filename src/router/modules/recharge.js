import Layout from "@/layout";

const rechargeRouter = {
  path: "/recharge",
  component: Layout,
  // redirect: 'noRedirect',
  name: "Recharge",
  meta: {
    title: "recharge.title",
    icon: "recharge"
  },
  children: [
    {
      path: "rechargeDo",
      component: () => import("@/views/recharge/RechargeDo"),
      name: "RechargeDo",
      meta: {
        title: "recharge.leftMenus[0].text"
      }
    },
    {
      path: "rechargePrice",
      component: () => import("@/views/recharge/RechargePrice"),
      name: "RechargePrice",
      meta: {
        title: "recharge.leftMenus[1].text"
      }
    },
    {
      path: "rechargeBill",
      component: () => import("@/views/recharge/RechargeBill"),
      name: "RechargeBill",
      meta: {
        title: "recharge.leftMenus[2].text"
      }
    },
    {
      path: "rechargeProfit",
      component: () => import("@/views/recharge/RechargeProfit"),
      name: "RechargeProfit",
      meta: {
        title: "recharge.leftMenus[3].text"
      }
    },
    {
      path: "rechargeExamine",
      component: () => import("@/views/recharge/RechargeExamine"),
      name: "RechargeExamine",
      meta: {
        title: "recharge.leftMenus[4].text"
      }
    }
  ]
};

export default rechargeRouter;
