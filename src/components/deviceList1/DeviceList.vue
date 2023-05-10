<template>
  <div
    style="height: 100%; overflow-x: hidden; overflow-y: hidden"
    class="deivce-list1"
  >
    <!-- 搜索设备框 start -->
    <div style="display: flex; flex-direction: row" class="device-list-top-bar">
      <el-input
        size="small"
        v-model="searchKey"
        :placeholder="$t('common.searchDevTip')"
        @keyup.enter="searchDevice"
        style="flex: 1; margin-right: 5px"
      />
      <el-button
        type="warning"
        size="small"
        style="margin-left: 8px; padding: 6px 20px !important"
        @click="searchDevice"
        >{{ $t("common.search") }}</el-button
      >
    </div>
    <!-- 搜索设备框 end -->

    <div
      style="height: calc(100% - 34px); overflow-x: hidden; overflow-y: hidden; display: flex; flex-direction: column; position: relative; margin-top: 5px"
    >
      <div
        v-show="isSearch"
        style="line-height: 32px; height: 32px; font-weight: bold"
      >
        {{ $t("common.searchResultNum") }}:{{ devList.length }}
      </div>
      <!-- 设备分类Tab start-->
      <ul class="dev-tabs" style="display: flex" v-show="!isSearch">
        <li
          :class="[currentTab == 1 ? 'active' : '']"
          @click="changeCurrentTab(1)"
        >
          {{ $t("common.all") }}({{ devKinds.all }})
        </li>
        <li
          :class="[currentTab == 2 ? 'active' : '']"
          @click="changeCurrentTab(2)"
        >
          {{ $t("deviceList.online") }}({{ devKinds.online }})
        </li>
        <li
          :class="[currentTab == 3 ? 'active' : '']"
          @click="changeCurrentTab(3)"
        >
          {{ $t("deviceList.offline") }}({{ devKinds.offline }})
        </li>
        <li>
          <select
            v-model="selectOrder"
            style="margin-left: 4px; width: 60px; height: 30px !important"
            class="text-input small"
          >
            <option value="time">{{ $t("deviceList.time") }}</option>
            <option value="name">{{ $t("deviceList.name") }}</option>
          </select>
          <i
            :class="[
              'iconfont',
              currentOrder == 'down' ? 'icon-paixuimei' : 'icon-paixuimei1-copy'
            ]"
            @click="currentOrder = currentOrder == 'down' ? 'up' : 'down'"
          ></i>
        </li>
      </ul>
      <!-- 设备分类Tab end-->
      <!-- 设备列表 start-->
      <ul
        id="dev_list"
        class="device-list"
        style="height: calc(100% - 24px); overflow-x: auto; overflow-y: auto"
        v-show="devList.length > 0 && !isLoad"
      >
        <li
          v-for="(item, idx) in devList"
          @click="onSelectDev(item)"
          :key="'devList' + idx"
        >
          <div
            :class="[
              'device-list-item',
              currentDev == item.deviceImei ? 'active' : '',
              getStsClass(item)
            ]"
            v-if="item.deviceImei"
          >
            <div class="item-content-left" style="width: 48%">
              <div class="item-title">
                <div class="item-title-text">
                  <!-- {{ item.name }} -->
                  <!-- <span class="point iconfont icon-qichedingwei"></span> -->
                  <span class="device-title"
                    >{{ item.name }}
                    <div class="device-text-label">
                      <!-- <span>{{ item.signalTime | fdatetime }}</span> -->
                      <span v-show="item.stsNum == 1"
                        >{{ $t("alarm.speed") }} {{ item.speed }}
                      </span>
                    </div>
                  </span>
                  <div v-if="item.enableSts == 1 && item.enableDate">
                    <div v-if="item.isflowExpireTime" style="color: red">
                      {{ $t("infobox.flowExpireTip1") }}
                    </div>
                    <div v-if="item.isplatformExpireTime" style="color: red">
                      {{ $t("infobox.platExpireTip1") }}
                    </div>
                    <div v-if="item.flowTime" style="color: red">
                      {{ $t("infobox.flowTime") }}{{ item.flowTime
                      }}{{ $t("infobox.timeExpire") }}
                    </div>
                    <div v-if="item.platTime" style="color: red">
                      {{ $t("infobox.platTime") }}{{ item.platTime
                      }}{{ $t("infobox.timeExpire") }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-tip">
                <div>({{ item.deviceImei }})</div>
              </div>
              <div class="item-title-tip1" v-show="item.sts != '过期'">
                {{ getSts(item) }}
              </div>
            </div>
            <div
              class="item-content-right"
              style="display: flex; align-items: center"
              v-show="item.enableSts == 1"
            >
              <div class="item-title-tip">{{ getSts(item) }}</div>
              <div class="item-btn" style="white-space: nowrap">
                <!-- <span v-for="(it, id) in $t('deviceList.btnList[' + btnType + ']')" @click="doBtn(id, item.deviceImei)" :key="'btnType' + idx + '-' + id" :title="it.text">
                  <img :src="require('@/assets/img/location/' + it.img + '.png')" alt="" />
                </span> -->
                <span
                  v-for="(it, id) in $t('deviceList.btnList[' + btnType + ']')"
                  @click="doBtn(id, item.deviceImei)"
                  :key="'btnType' + idx + '-' + id"
                >
                  <el-tooltip :content="it.text" effect="light">
                    <img
                      :src="require('@/assets/img/location/' + it.img + '.png')"
                      alt=""
                    />
                  </el-tooltip>
                </span>
              </div>
            </div>
            <!-- 激活功能 -->
            <div
              class="item-btn-active"
              style="display: flex; align-items: center"
              v-show="item.enableSts != 1"
            >
              <span style="color: red" @click="dealDeviceActive(item)">{{
                $t("common.activing")
              }}</span>
            </div>
          </div>
        </li>
      </ul>
      <!-- 设备列表 end-->

      <!-- 设备列表提示 start-->
      <div
        v-if="devList.length == 0 && !isLoad"
        style="display: flex; justify-content: center; align-items: center; height: calc(100% - 62px)"
      >
        {{ $t("common.nodata") }}
      </div>
      <div
        v-if="isLoad"
        style="display: flex; justify-content: center; align-items: center; height: calc(100% - 62px); color: red"
      >
        {{ $t("common.loading") }}
      </div>
      <!-- 设备列表提示 end-->
      <!-- 分页器 -->
      <!-- <pager :pname="pager.name" :is-current="false" v-show="!isSearch" :num="pager.num" :limit="pager.limit" :current.sync="pager.current" @change-current="loadDeviceList"></pager> -->
      <el-pagination
        center
        :pager-count="5"
        :page-size="page.limit"
        :total="page.total"
        background
        layout="prev,pager,next"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <!-- 2021-2-1 end -->
    </div>
  </div>
</template>

<script src="./deviceList.js"></script>

<style scoped lang="scss">
.device-text-label {
  font-weight: normal;
  span {
    padding: 0 5px;
  }
}
.deivce-list1 {
  .device-title {
    display: flex;
  }
  ::v-deep .el-pagination {
    text-align: center;
  }
}
</style>
