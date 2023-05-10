import Layout from "@/layout";

const accountRouter = {
  path: "/account",
  component: Layout,
  // redirect: 'noRedirect',
  name: "Account",
  meta: {
    title: "home.myAccount",
    icon: "people"
  },
  children: [
    // {
    //   path: "accountMain",
    //   component: () => import("@/views/account/AccountMain"),
    //   name: "AccountMain",
    //   meta: {
    //     title: "账户首页"
    //   }
    // },
    {
      path: "accountMsg",
      component: () => import("@/views/account/AccountMsg"),
      name: "AccountMsg",
      meta: {
        title: "common.message"
      }
    },
    {
      path: "accountSend",
      component: () => import("@/views/account/AccountSend"),
      name: "AccountSend",
      meta: {
        title: "account.sendMessage"
      }
    },
    {
      path: "accountAppoint",
      component: () => import("@/views/account/AccountAppoint"),
      name: "AccountAppoint",
      meta: {
        title: "account.appointment"
      }
    },
    {
      path: "accountSetting",
      component: () => import("@/views/account/AccountSetting"),
      name: "AccountSetting",
      meta: {
        title: "account.setting"
      }
    }
  ]
};

export default accountRouter;
