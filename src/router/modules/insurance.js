import Layout from "@/layout";

const insuranceRouter = {
  path: "/insurance",
  component: Layout,
  // redirect: "noRedirect",
  name: "InsuranceManage",
  meta: {
    title: "insurance.title",
    icon: "insurance"
  },
  children: [
    {
      path: "insurance",
      component: () => import("@/views/insurance/Insurance.vue"),
      name: "Insurance",
      meta: {
        title: "insurance.title"
      }
    }
  ]
};

export default insuranceRouter;
