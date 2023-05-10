import Layout from "@/layout";

const deviceBlueToothRouter = {
  path: "/bluetoothStatus",
  name: "DeviceBluetooth",
  component: Layout,
  meta: {
    title: "deviceBluetooth.title",
    icon: "monitor"
  },
  children: [
    {
      path: 'toothStatus',
      name: "DeviceBluetoothStatus",
      component: () => import("@/views/deviceBluetoothStatus/DeviceBluetoothStatus.vue"),
      meta: {
        title: "deviceBluetooth.title"
      }
    }
  ]
};

export default deviceBlueToothRouter;
