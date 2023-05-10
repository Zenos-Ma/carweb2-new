import Layout from "@/layout";

const CardRouter = {
  path: "/card",
  component: Layout,
  // redirect: 'noRedirect',
  name: "Card",
  meta: {
    title: "card.card",
    icon: "money"
  },
  children: [
    {
      path: "crdFlow",
      component: () => import("@/views/card/CardFlow"),
      name: "CardFlow",
      meta: {
        title: "card.flowAudit"
      }
    },
    {
      path: "cardPrice",
      component: () => import("@/views/card/CardPrice"),
      name: "CardPrice",
      meta: {
        title: "card.cardPrice"
      }
    },
    {
      path: "cardMy",
      component: () => import("@/views/card/CardMy"),
      name: "CardMy",
      meta: {
        title: "card.myRecharge"
      }
    },
    {
      path: "cardPurchase",
      component: () => import("@/views/card/CardPurchase"),
      name: "CardPurchase",
      meta: {
        title: "withdraw.payCard"
      }
    }
  ]
};

export default CardRouter;
