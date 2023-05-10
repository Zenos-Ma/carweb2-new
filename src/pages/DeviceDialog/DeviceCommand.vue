<template>
  <div style="padding: 0.8rem;" class="device-command">
    <!--设备当前情况 start-->
    <div class="command-header">
      <span class="command-tip" v-if="isOnline">{{
        $t("deviceCommand.deviceOnline")
      }}</span>
      <span class="command-tip" v-if="!isOnline"
        >{{ $t("deviceCommand.deviceOffline") }}{{ signalTime }}</span
      >
      <div class="orange-box">
        <p v-html="$t('deviceCommand.commandTip')"></p>
        <div style="display: flex; flex-direction: row">
          {{ $t("deviceCommand.answer") }}
          <div style="display: inline-block; flex: 1">
            <p v-html="$t('deviceCommand.commandTip1')"></p>
            <p v-html="$t('deviceCommand.commandTip2')"></p>
            <p v-html="$t('deviceCommand.commandTip3')"></p>
          </div>
        </div>
      </div>
    </div>
    <!--设备当前情况 end-->
    <!--指令类型 start-->
    <div style="line-height: 4rem; display: flex; flex-direction: row">
      {{ $t("deviceCommand.commandKind") }}:
      <div
        class="command-box"
        v-for="(item, idx) in cmdList"
        :key="'command-box' + idx"
      >
        <button>{{ item.text }}</button>
        <div class="command-hint">
          <p
            class="left-right-box"
            @click="changeCurrentCommand(it)"
            v-for="(it, id) in item.secList"
            :key="'secList' + idx + '-' + id"
          >
            <span class="left-box">{{ it.text }}</span>
            <span class="right-box">{{ $t("deviceCommand.setting") }}</span>
          </p>
        </div>
      </div>
    </div>
    <!--指令类型 end-->

    <!--指令操作表单 start-->
    <div class="command-content left-right-box">
      <div class="left-box" style="width: 50%">
        <div
          class="orange-box"
          style="display: flex; flex-direction: row"
          v-if="currentCmd.panelId == 'manual'"
        >
          <!-- <div style="padding: 1rem 0; padding-right: 0.8rem">
            <span class="iconfont icon-dengpao" style="color: orange"></span>
          </div> -->
          <span class="color-red">*</span>
          <div style="flex: 1">{{ $t("deviceCommand.customCommandTip") }}</div>
        </div>
        <!-- 省电运动上报 -->
        <div
          class="orange-box"
          style="display: flex; flex-direction: row"
          v-if="currentCmd.panelId == 'play-report'"
        >
          <!-- <div style="padding: 10px 0; padding-right: 8px">
            <span class="iconfont icon-dengpao" style="color: orange"></span>
          </div> -->
          <span class="color-red">*</span>
          {{ $t("deviceCommand.shengdianyundongTip") }}
        </div>
        <!-- end -->
        <!-- 在线运动上报 -->
        <div
          class="orange-box"
          style="display: flex; flex-direction: row"
          v-if="currentCmd.panelId == 'realtime-mode'"
        >
          <!-- <div>
            <span class="iconfont icon-dengpao" style="color: orange"></span>
          </div> -->
          <span class="color-red">*</span>
          {{ $t("deviceCommand.zaixianyundongTip") }}
        </div>
        <!-- end -->
        <!-- 在线定时上报 -->
        <div
          class="orange-box"
          style="display: flex; flex-direction: row"
          v-if="currentCmd.panelId == 'timing-online'"
        >
          <!-- <div>
            <span class="iconfont icon-dengpao" style="color: orange"></span>
          </div> -->
          <span class="color-red">*</span>
          {{ $t("deviceCommand.zaixiandingshiTip") }}
        </div>
        <!-- end -->
        <!-- 省电闹铃上报 -->
        <div
          class="orange-box"
          style="display: flex; flex-direction: row"
          v-if="currentCmd.panelId == 'timing-mode'"
        >
          <!-- <div style="padding: 10px 0; padding-right: 8px">
            <span class="iconfont icon-dengpao" style="color: orange"></span>
          </div> -->
          <span class="color-red">*</span>
          {{ $t("deviceCommand.shengdiannaolingTip") }}
        </div>
        <!-- end -->
        <table style="line-height: 3rem; width: 100%" v-show="isSet">
          <tr v-if="currentCmd.panelId == 'manual'">
            <td>{{ $t("deviceCommand.inputCommand") }}:</td>
            <td>
              <input type="text" class="text-input small" v-model="customCmd" />
            </td>
          </tr>

          <tr v-if="currentCmd.panelId != 'manual'">
            <td>{{ $t("deviceCommand.commandName") }}:</td>
            <td style="font-weight: bold">{{ currentCmd.text }}</td>
          </tr>
          <tr v-if="currentCmd.panelId != 'manual'">
            <td>{{ $t("common.deviceName") }}:</td>
            <td>{{ imei }}</td>
          </tr>

          <tr v-if="currentCmd.panelId == 'defaultpw'">
            <td>{{ $t("deviceCommand.confirmPwd") }}:</td>
            <td>
              <input
                type="password"
                class="text-input small"
                v-model="cmdPwd"
              />
            </td>
          </tr>

          <tr v-if="currentCmd.panelId == 'position-type'">
            <td></td>
            <td>
              <div>
                <input
                  type="radio"
                  class="text-input"
                  v-model="currentLoca"
                  value="0"
                />
                {{ $t("deviceCommand.loca1") }}
              </div>
              <div>
                <input
                  type="radio"
                  class="text-input"
                  v-model="currentLoca"
                  value="1"
                />
                {{ $t("deviceCommand.loca2") }}
              </div>
              <div>
                <input
                  type="radio"
                  class="text-input"
                  v-model="currentLoca"
                  value="2"
                />
                {{ $t("deviceCommand.loca3") }}
              </div>
              <div>
                <input
                  type="radio"
                  class="text-input"
                  v-model="currentLoca"
                  value="3"
                />
                {{ $t("deviceCommand.loca4") }}
              </div>
            </td>
          </tr>
          <tr v-if="currentCmd.panelId == 'find-car-by-time'">
            <td>{{ $t("deviceCommand.workMode") }}:</td>
            <td>
              <input type="radio" checked class="text-input" />
              {{ $t("deviceCommand.gpsMode") }}
            </td>
          </tr>
          <tr
            v-show="currentCmd.panelId == 'find-car-by-time'"
            v-for="(item, idx) in workModeList"
            :key="'workModeList' + idx"
          >
            <td>{{ $t("deviceCommand.timePoint") + (idx + 1) }}:</td>
            <td>
              <input
                type="number"
                v-model.number="workModeList[idx].hour"
                class="text-input small"
                style="width: 5rem"
                max="23"
                min="0"
              />
              {{ $t("deviceCommand.hours") }}
              <input
                type="number"
                v-model.number="workModeList[idx].minute"
                class="text-input small"
                style="width: 5rem"
                max="59"
                min="0"
              />
              {{ $t("deviceCommand.minutes") }}
              <input
                type="checkbox"
                class="text-input"
                v-model="workModeList[idx].enable"
              />
              {{ $t("deviceCommand.use") }}
            </td>
          </tr>

          <tr v-if="currentCmd.panelId == 'circle-update'">
            <td>{{ $t("deviceCommand.timeRange") }}:</td>
            <td>
              <div>
                <input
                  type="number"
                  v-model.number="circleUp.hour"
                  class="text-input small"
                  style="width: 5rem"
                  max="6"
                  min="0"
                />
                {{ $t("deviceCommand.hour") }}
                <input
                  type="number"
                  v-model.number="circleUp.minute"
                  class="text-input small"
                  style="width: 5rem"
                  max="59"
                  min="0"
                />
                {{ $t("deviceCommand.minute") }}
              </div>
              <div>{{ $t("deviceCommand.circleTip") }}</div>
            </td>
          </tr>
          <!-- 新增4个 start-->
          <!-- 运动上报模式 -->
          <tr v-if="currentCmd.panelId == 'play-report'">
            <td>{{ $t("deviceCommand.playReport") }}:</td>
            <td>
              <div>
                <input
                  type="text"
                  v-model.number="staticTime"
                  class="text-input small"
                  style="width: 50px; text-align: center"
                  min="30"
                />
              </div>
              <div>{{ $t("deviceCommand.staticReport") }}(M)</div>
            </td>
          </tr>
          <!-- 实时上报模式 -->
          <tr v-if="currentCmd.panelId == 'realtime-mode'">
            <td>{{ $t("deviceCommand.realTimeMode") }}:</td>
            <td>
              <div>
                <input
                  type="text"
                  v-model.number="realtimeMode"
                  class="text-input small"
                  style="width: 5rem; text-align: center"
                  min="10"
                />
              </div>
              <div>{{ $t("deviceCommand.importTimeTip") }}</div>
            </td>
          </tr>
          <!-- 在线定时上报 -->
          <tr v-if="currentCmd.panelId == 'timing-online'">
            <td>{{ $t("deviceCommand.onlineTimeMode") }}:</td>
            <td>
              <div>
                <input
                  type="text"
                  v-model.number="onlineTimeMode"
                  class="text-input small"
                  style="width: 5rem; text-align: center"
                  min="10"
                />
              </div>
              <div>{{ $t("deviceCommand.circleTip1") }}</div>
            </td>
          </tr>
          <!-- 周期上报模式 -->
          <tr v-if="currentCmd.panelId == 'circle-update1'">
            <td>{{ $t("deviceCommand.shengDianDingShi") }}:</td>
            <td>
              <div>
                <input
                  type="number"
                  v-model.number="circleUp.hour"
                  class="text-input small"
                  style="width: 5rem"
                  max="6"
                  min="0"
                />
                {{ $t("deviceCommand.hour") }}
                <input
                  type="number"
                  v-model.number="circleUp.minute"
                  class="text-input small"
                  style="width: 5rem"
                  max="59"
                  min="0"
                />
                {{ $t("deviceCommand.minute") }}
              </div>
              <div>{{ $t("deviceCommand.circleTip") }}</div>
            </td>
          </tr>
          <!-- 定时上报模式 -->
          <tr v-if="currentCmd.panelId == 'timing-mode'">
            <td>{{ $t("deviceCommand.timingMode") }}:</td>
            <td>
              <div>
                <div>
                  <input
                    type="number"
                    v-model.number="daytime"
                    class="text-input small"
                    style="width: 5rem"
                    max="30"
                    min="1"
                  />天
                </div>
              </div>
            </td>
          </tr>
          <tr
            v-show="currentCmd.panelId == 'timing-mode'"
            v-for="(item, idx) in workModeList"
            :key="'workModeList1' + idx"
          >
            <td>{{ $t("deviceCommand.timePoint") + (idx + 1) }}:</td>
            <td>
              <input
                type="number"
                v-model.number="workModeList[idx].hour"
                class="text-input small"
                style="width: 5rem"
                max="23"
                min="0"
              />
              {{ $t("deviceCommand.hours") }}
              <input
                type="number"
                v-model.number="workModeList[idx].minute"
                class="text-input small"
                style="width: 5rem"
                max="59"
                min="0"
              />
              {{ $t("deviceCommand.minutes") }}
              <input
                type="checkbox"
                class="text-input"
                v-model="workModeList[idx].enable"
              />
              {{ $t("deviceCommand.use") }}
            </td>
          </tr>
          <!-- end -->
          <tr v-if="currentCmd.panelId == 'find-car-by-period'">
            <td>{{ $t("deviceCommand.workMode") }}:</td>
            <td>
              <input type="radio" class="text-input" checked />
              {{ $t("deviceCommand.workModeTrack") }}
            </td>
          </tr>
          <tr
            v-if="
              currentCmd.panelId == 'find-car-by-period' ||
                currentCmd.panelId == 'hb'
            "
          >
            <td>{{ $t("deviceCommand.intervaTime") }}:</td>
            <td>
              <input
                type="text"
                v-model.number="intervalTime"
                class="text-input small"
                style="width: 5rem; text-align: center"
                min="10"
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td style="text-align: right">
              <el-button
                type="primary"
                size="small"
                @click="doCommand"
                v-show="sendable"
              >
                {{ $t("deviceCommand.send") }}
              </el-button>
            </td>
          </tr>
        </table>

        <!-- 2021-12-29 新增s0s -->
        <!-- sos上报 2021-12-29 -->
        <div class="right-item1" v-show="currentCmd.panelId == 'sos-send'">
          <div class="sos-acontent">
            <el-tabs v-model="activeName" @tab-click="changeTabs">
              <el-tab-pane label="SOS号码添加" name="first">
                <!-- start -->
                <!-- <span class="sos-title">添加号码</span> -->
                <el-form label-width="30px">
                  <el-form-item prop="ParameterDataList">
                    <el-col :span="18">
                      <el-input
                        v-model="postForm.ParameterDataList[0]"
                        size="small"
                        placeholder="请填写"
                      ></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        size="small"
                        type="info"
                        icon="el-icon-plus"
                        @click="addItem"
                        style="margin-left: 5px !important;padding: 8px 12px !important"
                        :disabled="isbtnSOS"
                      ></el-button>
                    </el-col>
                  </el-form-item>
                  <div
                    v-for="(item, index) in postForm.ParameterDataList"
                    :key="index"
                  >
                    <el-form-item v-if="index !== 0">
                      <el-col :span="18">
                        <el-input
                          size="small"
                          v-model="postForm.ParameterDataList[index]"
                          placeholder="请填写"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          size="small"
                          type="info"
                          icon="el-icon-delete"
                          @click="deleteItem(item, index)"
                          style="margin-left: 5px !important;padding: 8px 12px !important"
                        ></el-button>
                      </el-col>
                    </el-form-item>
                  </div>
                </el-form>
                <!-- end -->
              </el-tab-pane>
              <el-tab-pane label="SOS号码删除" name="second">
                <el-form label-width="30px">
                  <el-form-item prop="ParameterDataList">
                    <el-col :span="18">
                      <el-input
                        v-model="postForm.ParameterDataList[0]"
                        size="small"
                        placeholder="请填写"
                      ></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        size="small"
                        type="info"
                        icon="el-icon-plus"
                        @click="addItem"
                        style="margin-left: 5px !important;padding: 8px 12px !important"
                        :disabled="isbtnSOS"
                      ></el-button>
                    </el-col>
                  </el-form-item>
                  <div
                    v-for="(item, index) in postForm.ParameterDataList"
                    :key="index"
                  >
                    <el-form-item v-if="index !== 0">
                      <el-col :span="18">
                        <el-input
                          size="small"
                          v-model="postForm.ParameterDataList[index]"
                          placeholder="请填写"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          size="small"
                          type="info"
                          icon="el-icon-delete"
                          @click="deleteItem(item, index)"
                          style="margin-left: 5px !important;padding: 8px 12px !important"
                        ></el-button>
                      </el-col>
                    </el-form-item>
                  </div>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- sos上报 end -->
        <!-- sosend -->
      </div>
      <div
        class="right-box"
        style="border-left: dashed 0.1rem gainsboro; width: 50%"
      >
        <div
          style="text-align: left;line-height: 4rem;border-bottom: dashed 0.1rem gainsboro;padding-left: 1.6rem; "
        >
          {{ $t("deviceCommand.backInfo") }}
        </div>
        <div
          style=" height: calc(100% - 4rem);padding-left: 0.8rem; overflow-x: hidden;overflow-y: auto;"
        >
          <ul class="log-list">
            <li
              v-for="(item, idx) in logList"
              :style="{ color: item.isSend ? 'green' : 'red' }"
              :key="'logList' + idx"
            >
              <div class="left-right-box">
                <span class="left-box" v-if="item.isSend">SEND &gt;&gt;</span>
                <span v-else>RECV &lt;&lt;</span>
                <span class="right-box">{{ item.utcTime }}</span>
              </div>
              <div
                style="text-align: left;word-break: break-word;white-space: normal;"
              >
                {{ item.cmdContent }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--指令操作表单 start-->
  </div>
</template>

<script src="@/pages/DeviceDialog/deviceCommand.js"></script>
<style lang="scss">
.device-command {
  height: 520px;
  .command-content > .left-box {
    height: 100%;
    overflow-x: auto;
    overflow-y: auto;
    font-size: 1.2rem;
  }
  .log-list {
    display: block;
    list-style: none;

    margin: 0;
    padding: 0;
    font-size: 1.2rem;
    line-height: 3rem;
    > li {
      display: block;
      margin: 0;
      padding: 0;
    }
  }

  .command-header {
    line-height: 3rem;
    cursor: pointer;
  }
  .command-content {
    border-top: solid 0.1rem gainsboro;
    height: calc(100% - 7rem);
  }

  .orange-box {
    display: none;
    white-space: normal;
  }

  .command-header:hover .orange-box {
    display: none;
    position: absolute;
    z-index: 9;
    margin: 0;
    width: 47rem;
    line-height: 2.4rem;
    left: 1.6rem;
    top: 16rem;
    padding: 0px 0.4rem;
    p {
      margin: 0;
      padding: 0;
    }
  }

  .command-header:hover .orange-box {
    display: inline-block;
  }

  .command-tip {
    font-size: 1.2rem;
    color: gray;
    border-bottom: dashed 0.1rem gray;
  }

  .command-box {
    flex: 1;
    display: inline-block;
    margin-left: 0.8rem;
    button {
      padding: 0;
      width: 90%;
      border-radius: 0.2rem;
      background: #fdfdfd;
      box-shadow: 0 0 0.3rem inset gainsboro;
      line-height: 3rem;
      height: 3rem;
      font-size: 1.4rem;
      cursor: pointer;
      border: solid 0.1rem gainsboro;
    }
    button:hover {
      color: #0095ec;
    }

    .command-hint {
      display: none;
      position: absolute;
      z-index: 9;
      border-radius: 0.2rem;
      background: #fdfdfd;
      box-shadow: 0.1rem 0.1rem 0.3rem #aaa;
      padding: 0.8rem;
      width: 16rem;
      text-overflow: ellipsis;
      > p.left-right-box {
        cursor: pointer;
        margin: 0;
        padding: 0;
        line-height: 2.4rem;
        font-size: 1.2rem;

        .left-box {
          overflow-x: hidden;
          overflow-y: hidden;
          flex: 1;
          max-width: 14rem;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .right-box {
          flex: none;
        }
      }
      > p:hover {
        color: #0095ec;
      }
    }
  }
  .command-box:last-child .command-hint {
    width: 13rem;
  }
  .command-box:hover .command-hint {
    display: block;
  }
  .sos-acontent {
    margin-bottom: 0 !important;
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      font-size: 12px;
    }
    .el-form-item {
      margin-bottom: 0 !important;
    }
    .el-tabs__header {
      margin: 0 0 5px;
    }
    .sos-title {
      font-size: 12px;
      font-weight: 500;
      color: #303133;
    }
  }
}
</style>
