import Layout from "@/layout";

const rechargeChartRouter = {
  path: "/recharge-chart",
  name: "RechargeChart",
  component: () => import("@/views/rechargeChart/RechargeChart.vue"),
  meta: {
    title: "statisticDialog.statistic",
    icon: "monitor"
  },
  hidden: true
};

export default rechargeChartRouter;
