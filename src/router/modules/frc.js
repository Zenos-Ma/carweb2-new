import Layout from "@/layout";

const frctRouter = {
  path: "/frc",
  component: Layout,
  // redirect: 'noRedirect',
  name: "Frc",
  meta: {
    title: "frc.title",
    icon: "frc"
  },
  children: [
    {
      path: "dataReport",
      component: () => import("@/views/frc/DataReport"),
      name: "DataReport",
      meta: {
        title: "frc.navTabs[0].text"
      }
    },
    {
      path: "pledge",
      component: () => import("@/views/frc/Pledge"),
      name: "Pledge",
      meta: {
        title: "frc.navTabs[1].text"
      }
    },
    {
      path: "pledgeDevice",
      component: () => import("@/views/frc/PledgeDevice"),
      name: "PledgeDevice",
      meta: {
        title: "frc.navTabs[2].text"
      }
    },
    {
      path: "carManage",
      component: () => import("@/views/frc/CarManage"),
      name: "CarManage",
      meta: {
        title: "frc.navTabs[3].text"
      }
    }
  ]
};

export default frctRouter;
