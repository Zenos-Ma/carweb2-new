import Layout from "@/layout";

const customerRouter = {
  path: "/customer",
  component: Layout,
  // redirect: "noRedirect",
  name: "MyCustomer",
  meta: {
    title: "common.myCustomer",
    icon: "customer"
  },
  children: [
    {
      path: "mycustomer",
      component: () => import("@/views/customer/Customer.vue"),
      name: "Customer",
      meta: {
        title: "common.myCustomer"
      }
    }
  ]
};

export default customerRouter;
