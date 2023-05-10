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
  // children: [
  //   {
  //     path: "chart",
  //     name: "DeviceChart",
  //     component: () => import("@/views/deviceChart/DeviceChart.vue"),
  //     meta: {
  //       title: "statisticDialog.statistic"
  //     }
  //   }
  // ]
};

export default deviceChartRouter;
