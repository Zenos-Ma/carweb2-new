import Layout from "@/layout";

const deviceChartRouter = {
  path: "/device-chart",
  name: "DeviceChartStatistic",
  component: () => import("@/views/deviceChart/DeviceChart.vue"),
  meta: {
    title: "statisticDialog.statistic",
    icon: "monitor"
  },
  hidden: true
};

export default deviceChartRouter;
