import Layout from "@/layout";

const apiDoctRouter = {
  path: "/apiDoc",
  name: "apiDoc",
  component: () => import("@/views/apiDoc/apiDoc.vue"),
  meta: {
    title: "apiInfo.text",
    icon: "monitor"
  },
  hidden: true
};

export default apiDoctRouter;
