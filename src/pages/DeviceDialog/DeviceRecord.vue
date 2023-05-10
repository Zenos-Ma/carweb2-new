<template>
  <div style="padding: 0.8rem 0.8rem 0 0.8rem" class="device-record">
    <!--指令记录表格-->
    <data-table
      :data="recordList"
      :show-index="true"
      :page="page"
      @getTableData="loadDeviceRecord"
    >
      <!--  -->
      <el-table-column :label="$t('deviceRecord.orderName')" min-width="120">
        <template slot-scope="props">
          {{
            props.row.num ? changOrderName(props.row.num) : props.row.orderName
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('deviceRecord.orderSts')" min-width="120">
        <template slot-scope="props">
          {{
            props.row.number
              ? changOrderStautsName(props.row.number)
              : props.row.orderSts
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('deviceRecord.result')" min-width="150">
        <template slot-scope="props">
          <!-- {{ props.row.result ? props.row.result : "--" }} -->
          {{
            props.row.result == "等待设备响应"
              ? $t("deviceRecord.instructionResponse")
              : props.row.result
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('deviceRecord.stsTime')" width="140">
        <template slot-scope="props">
          {{ props.row.stsTime | fdatetime }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('deviceRecord.sendTime')" width="140">
        <template slot-scope="props">
          {{ props.row.sendTime | fdatetime }}
        </template>
      </el-table-column>
    </data-table>
  </div>
</template>

<script>
import { loadDeviceRecordInfo } from "@/api/monitor.js";
export default {
  name: "DeviceRecord",
  components: {},
  props: {},
  data: () => ({
    //指令记录表格数据
    recordList: [], //指令记录表格分页器
    page: {
      name: "commandRecord",
      pageSize: 20,
      num: 1,
      current: 1,
      total: 0
    },
    imei: "",
    instruction: [
      { text: "重启设备", num: 100 },
      { text: "基本参数", num: 101 },
      { text: "实时状态", num: 102 },
      { text: "软件版本", num: 103 },
      { text: "实时定位", num: 104 },
      { text: "恢复出厂设置", num: 200 },
      { text: "修改服务器", num: 201 },
      { text: "修改时区", num: 202 },
      { text: "升级软件版本", num: 203 },
      { text: "修改心跳间隔", num: 204 },
      { text: "修改时间间隔", num: 205 },
      { text: "设置感光开关", num: 206 },
      { text: "添加防区", num: 207 },
      { text: "撤除防区", num: 208 },
      { text: "设置定位方式", num: 209 },
      { text: "设置工作模式", num: 210 },
      { text: "运动上报模式", num: 2123 },
      { text: "在线运动上报", num: 2102 },
      { text: "省电定时上报", num: 2103 },
      { text: "省电闹铃上报", num: 2104 },
      { text: "自动休眠", num: 211 },
      { text: "设置协议", num: 212 },
      { text: "断开/恢复油电", num: 213 },
      { text: "设置紧急联系号码", num: 214 },
      { text: "录音", num: 310 },
      { text: "绑定蓝牙设备", num: 311 },
      { text: "移除蓝牙设备", num: 312 },
      // 新增
      { text: "开启LED灯", num: 314 },
      { text: "设置APN", num: 315 },
      { text: "开启蓝牙功能", num: 316 },
      { text: "关闭蓝牙功能", num: 317 },
      { text: "设置低电报警阈值", num: 318 },
      { text: "保持GPS开启", num: 319 },
      { text: "设置GPS自动控制", num: 320 },
      { text: "蓝牙连接失败次数", num: 321 },
      { text: "设置间隔步数定位", num: 322 },
      { text: "开启麦克风", num: 323 },
      { text: "关闭麦克风", num: 324 },
      { text: "设置自动保护电压", num: 325 },
      { text: "围栏范围", num: 326 },
      { text: "线检测ACC状态", num: 327 },
      { text: "线加电压检测ACC状态", num: 328 },
      { text: "线加传感器检测ACC状态", num: 329 },
      { text: "作为断电检测", num: 330 },
      { text: "ACC线作为ACC检测", num: 331 },
      { text: "关闭SOS", num: 332 },
      { text: "开启SOS平台报警", num: 333 },
      { text: "开启平台短信报警", num: 334 },
      { text: "开启平台短信电话报警", num: 335 },
      { text: "设置中心号码", num: 336 },
      { text: "设置断油电速度", num: 337 },
      { text: "掉外电时断油电", num: 338 },
      { text: "掉外电时按油电速度断油电", num: 339 },
      { text: "设置acc开启电压临界值", num: 340 },
      { text: "开启循环录音", num: 341 },
      { text: "关闭循环录音", num: 342 },
      { text: "读取蓝牙开关参数", num: 343 },
      { text: "设置蓝牙开关参数", num: 344 },
      { text: "添加蓝牙终端绑定", num: 345 },
      { text: "设置蓝牙根密钥", num: 346 },
      { text: "锁定车辆", num: 347 },
      { text: "解锁车辆", num: 348 },
      { text: "开启后备箱", num: 349 },
      { text: "启动", num: 350 },
      { text: "熄火", num: 351 },
      { text: "升窗", num: 352 },
      { text: "降窗", num: 353 },
      { text: "寻车", num: 354 },
      { text: "开启GPS", num: 355 },
      { text: "关闭GPS", num: 356 }
    ],
    orderStatus: [
      { text: "终端响应指令", number: 1 },
      { text: "指令已缓存", number: 2 },
      { text: "指令已下发", number: 3 }
    ]
  }),
  methods: {
    getOrderNumber(name) {
      // console.log(name);
      // 给指令类型加上数字
      var list = this.instruction;
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (name == list[i].text) {
          return str + list[i].num;
        }
      }
      return "";
    },
    changOrderName(num) {
      // 指令类型匹配到国际化文字
      var list = this.$t("deviceRecord.instruction");
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (num == list[i].num) {
          return str + list[i].text;
        }
      }
      return "";
    },
    getOrderStautsNumber(name) {
      // 给指令下发状态加上数字
      var list = this.orderStatus;
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (name == list[i].text) {
          return str + list[i].number;
        }
      }
      return "";
    },
    changOrderStautsName(number) {
      // 给加上数字的指令下达状态匹配到国际化
      var list = this.$t("deviceRecord.orderStatus");
      // console.log(list);
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (number == list[i].number) {
          return str + list[i].text;
        }
      }
      return "";
    },
    //加载设备指令记录
    loadDeviceRecord() {
      var that = this;
      var data = {
        deviceImei: this.imei,
        page: this.page.current,
        pageSize: that.page.pageSize
      };
      loadDeviceRecordInfo(data).then(res => {
        if (res.errCode == "200") {
          that.recordList = res.data.items;
          that.recordList.forEach(item => {
            item.num = that.getOrderNumber(item.orderName);
            item.number = that.getOrderStautsNumber(item.orderSts);
          });
          that.page.num = Math.ceil(res.data.itemCnt / that.page.pageSize);
          that.page.total = res.data.itemCnt;
        }
      });
    }, //处理设备详情对话框发过来设备号
    dealDevDialog(imei) {
      this.imei = imei;
      if (this.imei) {
        this.loadDeviceRecord();
      }
    },
    listenEvent() {
      this.app.$on("device-dialog", this.dealDevDialog);
    },
    offEvent() {
      this.app.$off("device-dialog", this.dealDevDialog);
    }
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.device-record {
  height: 520px;
  ::v-deep .el-table .cell,
  .el-table--border .el-table__cell:first-child .cell {
    padding-left: 5px;
  }
  ::v-deep .el-table .cell {
    padding-right: 5px;
    padding-left: 5px;
  }
}
</style>
