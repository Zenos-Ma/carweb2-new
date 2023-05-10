<template>
  <section style="height: 100%;width: 100%;" class="playback">
    <div
      style="width: 100%;box-shadow: 0 0 1rem 0 rgba(0,0,0,0.3);z-index: 9;background: white;position: relative;text-align:center;line-height:3rem;padding-top:5px"
    >
      <div style="margin:0 auto;white-space:nowrap;font-size:14px">
        {{ deviceImei }}
        <!-- 快速选择时间 -->
        {{ $t("playback.start") }}:
        <el-date-picker
          v-model="startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 190px"
          @click="handleChange"
        ></el-date-picker>
        {{ $t("playback.end") }}:
        <el-date-picker
          v-model="endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 190px"
        ></el-date-picker>
        <!-- 快速选择项 -->
        <div class="choosequick" style="display:inline-block;margin:0 5px">
          <!--  :title="$t('common.options')" -->
          <el-popover placement="bottom" trigger="hover" popper-class="option">
            <div style="padding:2px 20px">
              <div class="option-item">
                <span class="but-bar" @click="changeTimeRange('hour')">{{
                  $t("playback.lastHour")
                }}</span
                ><span class="bar">|</span>
                <span class="but-bar" @click="changeTimeRange('today')">{{
                  $t("playback.today")
                }}</span
                ><span class="bar">|</span>
                <span class="but-bar" @click="changeTimeRange('yesterday')">{{
                  $t("playback.yesterday")
                }}</span
                ><span class="bar">|</span>
                <span class="but-bar" @click="changeTimeRange('7days')">{{
                  $t("playback.day7")
                }}</span>
              </div>
              <div class="option-item ml-20">
                <el-checkbox v-model="isFilter">{{
                  $t("playback.filter")
                }}</el-checkbox>
              </div>
              <div class="option-item ml-20">
                {{ $t("playback.stayMarker") }}:
                <el-select
                  class="text-input small"
                  v-model="selectStay"
                  style="width:10rem"
                  size="small"
                >
                  <el-option
                    v-for="(item, idx) in $t('playback.stayTime')"
                    :value="item.val"
                    :key="'stayTime' + idx"
                    :label="item.text"
                  ></el-option>
                </el-select>
              </div>
              <!-- 超速 -->
              <div class="option-item ml-20">
                <!-- 超速显示设置 -->
                <el-checkbox v-model="isSpeed">{{
                  $t("playback.showSpeed")
                }}</el-checkbox>
                <el-input
                  style="width: 5rem;text-align:center;"
                  size="small"
                  v-model="speed"
                />
                km/h
              </div>
              <div class="option-item local-type-span ml-20">
                <span v-show="isLocaType">
                  <el-checkbox-group
                    v-model="selectLocaType"
                    v-for="(item, idx) in $t('playback.locaTypes')"
                    :key="'locaTypes' + idx"
                    style="display:inline-block;margin-right:10px"
                  >
                    <el-checkbox :label="item.val">{{ item.text }}</el-checkbox>
                  </el-checkbox-group>
                </span>
              </div>
            </div>
            <!-- 点击 -->
            <span slot="reference" style="font-size:18px">
              <i class="el-icon-s-operation" slot="reference"></i>
              <span style="font-size: 14px;">{{ $t("common.options") }}</span>
            </span>
          </el-popover>
        </div>
        <!-- 查询轨迹点击 -->
        <div class="btn-search-track" style="display:inline-block">
          <el-button type="primary" @click="loadRecord">
            <i class="el-icon-video-play"></i>
            {{ $t("playback.searchTrack") }}
          </el-button>
        </div>
        <el-button
          type="success"
          @click="showDownloadTrack"
          :disabled="!isLoadTrack"
          style="margin-left:5px"
        >
          <i class="el-icon-download"></i>
          {{ $t("trackTable.download") }}
        </el-button>
        <!-- <el-button type="success" @click="loadRecord('local')" style="margin-left:15px">
          <i class="el-icon-video-play"></i>
          回放本地的文件
        </el-button> -->
      </div>
      <!-- {{ $t(isStart ? "playback.stop" : "playback.start") }} -->
      <div
        style="margin:0px auto;white-space:nowrap;padding:5px 0;font-size:14px"
      >
        <el-button
          :type="isStart ? 'info' : 'warning'"
          @click="
            trackListlength > 0
              ? isStart
                ? stopTrack()
                : startTrack()
              : (isStart = false)
          "
        >
          {{ isStart ? $t("playback.stop") : $t("playback.start") }}
        </el-button>
        <el-button type="info" @click="resetTrack">{{
          $t("common.reset")
        }}</el-button>
        <input
          type="range"
          class="text-input"
          :style="{
            width: '60rem',
            backgroundImage:
              'linear-gradient(to right,#f5a403 ' +
              (currentTrack / (trackListlength - 1)) * 100 +
              '%, gray ' +
              (currentTrack / (trackListlength - 1)) * 100 +
              '%)'
          }"
          v-model.number="currentTrack"
          :max="isLoadTrack ? trackListlength - 1 : 100"
          min="0"
        />
        {{ $t("playback.playSpeed") }}:
        <el-select v-model="playSpeed" style="width:8rem">
          <el-option value="50" label="X50"></el-option>
          <el-option value="100" label="X100"></el-option>
          <el-option value="200" label="X200"></el-option>
          <el-option value="500" label="X500"></el-option>
        </el-select>

        <!-- <button @click="exportMileageDates">Mileage</button> -->
        <!-- <button class="btn-orange small" @click="showTrackTable" v-show="isLoadTrack">{{ $t("playback.trackDetail") }}</button> -->
        <el-button type="info" @click="showTrackRoute" v-show="isLoadTrack">
          <i class="el-icon-view"></i>
          {{ $t("playback.trackRoute") }}
        </el-button>
        <!-- 地图类型的选择 -->
        <div class="map-type-choose">
          <!-- 2021-9-29 -->
          <el-popover placement="bottom" trigger="hover">
            <ul
              class="map-type"
              @click="mapNavigation"
              style="padding:0;margin:0"
            >
              <li
                v-for="(item, idx) in theMapLists"
                :key="idx"
                :data-index="item.name"
              >
                <img
                  :src="require('@/assets/img/mapicon/' + item.img + '.png')"
                  alt=""
                />
                {{ item.text }}
                <span
                  ><i
                    :class="['iconfont', currentMap == idx ? 'icon-check' : '']"
                    style="font-weight:bold"
                  ></i
                ></span>
              </li>
            </ul>
            <span
              slot="reference"
              style="cursor:pointer;padding:9px 16px;background:#f5a403;color:#fff"
            >
              <i class="el-icon-copy-document" slot="reference"></i>
              <span style="font-size: 14px;">{{ $t("common.maptype") }}</span>
            </span>
          </el-popover>
        </div>
      </div>
    </div>

    <div style="height: calc(100% - 8.5rem);width:100%;">
      <!-- 切换到实时监控的平台 2021-8-8隐藏-->
      <div
        class="circle-btn"
        @click="showChartPage"
        v-show="isLoadTrack"
        style="position:absolute;margin-left:6rem;margin-top:2rem;z-index:8;"
      >
        <i class="iconfont icon-chart"></i>
      </div>
      <el-button
        size="small"
        v-show="theMap == 'a-map'"
        class="btn-orange small"
        style="position:absolute;right:1rem;margin-top:2rem;z-index:8;"
        @click="isSatellite = isSatellite ? false : true"
      >
        {{ $t(isSatellite ? "playback.normal" : "playback.satellite") }}
      </el-button>

      <!--切换地图 end-->

      <component
        :is="theMap"
        :map-name="mapName"
        :is-satellite="isSatellite"
        @map-zoom="onMapZoom"
        @save-map="saveMap"
      ></component>
    </div>

    <track-table
      v-show="isLoadTrack"
      :is-show.sync="isTrackTable"
    ></track-table>

    <info-box
      :map-name="mapName"
      :device-name="deviceName"
      :device-imei="deviceImei"
    ></info-box>

    <dialog-comp
      :visible.sync="isShowOver"
      :dialog-title="$t('playback.playbackOver')"
      :dialog-width="350"
    >
      <div
        style="display: flex;justify-content: center;align-items: center;flex-direction: column;height: 100%;width: 100%;"
      >
        <!--回放轨迹信息 start-->
        <div style="line-height:3rem;font-size:2.5rem;">
          <span
            class="iconfont icon-warn"
            style="font-size:3.2rem;color:dodgerblue"
          ></span>
          {{ $t("playback.playbackOver") }}
        </div>
        <table class="form-table" style="margin:0.8rem auto;">
          <tr>
            <td>{{ $t("playback.playbackTime") }}:</td>
            <td>{{ trackInfo.playbackTime }}</td>
          </tr>
          <tr>
            <td>{{ $t("playback.runTime") }}:</td>
            <td>{{ trackInfo.runTime }}</td>
          </tr>
          <tr>
            <td>{{ $t("playback.runMileage") }}:</td>
            <td>{{ trackInfo.mileage }}</td>
          </tr>
        </table>

        <div class="btn-cont-complete">
          <el-button type="warning" @click="isShowOver = false">{{
            $t("common.ok")
          }}</el-button>

          <!-- <el-button type="warning" @click="exportTrack">{{ $t("playback.download") }}</el-button> -->
          <el-button type="warning" @click="showDownloadTrack">{{
            $t("trackTable.download")
          }}</el-button>
          <!-- <el-button type="warning" @click="downloadTrackKml">{{ $t("playback.download1") }}</el-button> -->

          <el-button type="warning" @click="showTrackRoute">{{
            $t("playback.trackRoute")
          }}</el-button>
        </div>
      </div>
    </dialog-comp>

    <dialog-comp
      :visible.sync="isShowRoute"
      :dialog-title="$t('playback.trackRoute')"
      :dialog-width="800"
      :dialog-height="54"
    >
      <!--查看行程tab和操作 start-->
      <ul class="select-tabs1">
        <li :class="[currentTab == 0 ? 'active' : '']" @click="currentTab = 0">
          {{ $t("playback.trackRoute") }}
        </li>
        <li :class="[currentTab == 1 ? 'active' : '']" @click="currentTab = 1">
          {{ $t("playback.trackStay") }}
        </li>
        <li style="flex:1;text-align:right;">
          <el-select size="small" v-model="selectStay1" style="width:12rem">
            <el-option
              v-for="(item, idx) in $t('playback.stayTime')"
              :value="item.val"
              :key="'' + idx"
              :label="item.text"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            style="padding:8px 16px;vertical-align: middle;"
            @click="exportTable"
            >{{ $t("common.download") }}</el-button
          >
        </li>
      </ul>
      <!--查看行程tab和操作 start-->

      <div
        style="height:calc(100% - 4rem);margin-top:0.8rem;width:100%;overflow-x:auto;overflow-y:hidden;"
      >
        <!--查看行程表格-->
        <data-table
          style="width:132rem;"
          :is-num="true"
          :table-data="routeList"
          v-show="currentTab == 0"
        >
          <template slot="data-table-head">
            <th style="width:10rem">{{ $t("playbackRouteDialog.mileage") }}</th>
            <th style="width:12rem">
              {{ $t("playbackRouteDialog.driveTime") }}
            </th>
            <th style="width:22rem">
              {{ $t("playbackRouteDialog.startEndTime") }}
            </th>
            <th style="width:22rem">
              {{ $t("playbackRouteDialog.startEndLatLng") }}
            </th>
            <th style="width:30rem">
              {{ $t("playbackRouteDialog.startAddress") }}
            </th>
            <th style="flex:1">{{ $t("playbackRouteDialog.endAddress") }}</th>
          </template>
          <template slot="data-table-content">
            <data-table-row
              v-for="(item, idx) in routeList"
              :key="'routeList' + idx"
              :idx="idx"
              :item="item"
            >
              <td style="width:10rem">{{ item.mileage }}</td>
              <td style="width:12rem">
                {{ item.driveTime ? item.driveTime : "--" }}
              </td>
              <td style="width:22rem">{{ item.startEndTime }}</td>
              <td style="width:24rem">{{ item.startEndLatLng }}</td>
              <td style="width:30rem">
                {{
                  item.startAddress
                    ? item.startAddress
                    : $t("playbackRouteDialog.searchAddress")
                }}
              </td>
              <td style="flex:1">
                {{
                  item.endAddress
                    ? item.endAddress
                    : $t("playbackRouteDialog.searchAddress")
                }}
              </td>
            </data-table-row>
          </template>
        </data-table>
        <!--查看停留表格-->
        <data-table
          style="width:82rem;"
          :is-num="true"
          :table-data="stayList"
          v-show="currentTab == 1"
        >
          <template slot="data-table-head">
            <th style="width:12rem">
              {{ $t("playbackRouteDialog.stayTime") }}
            </th>

            <th style="width:22rem">
              {{ $t("playbackRouteDialog.startEndTime") }}
            </th>
            <th style="width:12rem">
              {{ $t("playbackRouteDialog.location") }}
            </th>
            <th style="flex:1">{{ $t("common.address") }}</th>
          </template>
          <template slot="data-table-content">
            <data-table-row
              v-for="(item, idx) in stayList"
              :key="'stayList' + idx"
              :idx="idx"
              :item="item"
            >
              <td style="width:12rem">
                {{ item.stayTime ? item.stayTime : "--" }}
              </td>
              <td style="width:22rem">{{ item.startEndTime }}</td>
              <td style="width:12rem">{{ item.location }}</td>
              <td style="flex:1">
                {{
                  item.address
                    ? item.address
                    : $t("playbackRouteDialog.searchAddress")
                }}
              </td>
            </data-table-row>
          </template>
        </data-table>
      </div>
    </dialog-comp>

    <dialog-comp
      :visible.sync="isShowDownload"
      :dialog-title="$t('trackTable.download')"
      :dialog-width="300"
    >
      <div class="down-content" style="text-align:center">
        <div class="title">
          <span class="title-co">
            <i class="iconfont icon-warn"></i>
            {{ $t("playback.limit") }}
          </span>
        </div>
        <table class="form-table" style="margin:0.8rem auto;">
          <tr>
            <td>{{ $t("common.deviceImei") }}：</td>
            <td>{{ deviceImei }}</td>
          </tr>
          <tr>
            <td>{{ $t("playback.start") }}:</td>
            <td>
              <!-- <datetime-picker :datetime.sync="startTime" disabled></datetime-picker> -->
              <el-date-picker
                v-model="startTime"
                type="datetime"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 185px"
                disabled
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>{{ $t("playback.end") }}:</td>
            <td>
              <!-- <datetime-picker :datetime.sync="endTime" disabled></datetime-picker> -->
              <el-date-picker
                v-model="endTime"
                type="datetime"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 185px"
                disabled
              ></el-date-picker>
            </td>
          </tr>
        </table>

        <div class="down-load mt10">
          <div class="mb5">
            <button class="btn-download" @click="exportTrack">
              <i class="iconfont icon-biaoge"></i>
              {{ $t("playback.download") }}
            </button>
          </div>
          <span class="pt10">{{ $t("playback.downloadXls") }}</span>
        </div>
        <div class="down-load mt10">
          <div class="mb5">
            <button class="btn-download" @click="downloadTrackKml">
              <i class="iconfont icon-daoruGoogleKML"></i>
              {{ $t("playback.download1") }}
            </button>
          </div>
          <span class="pt10">{{ $t("playback.downloadKml") }}</span>
          <a
            target="_blank"
            href="https://www.google.com/earth/download/gep/agree.html"
            class="download-earth"
            >»{{ $t("playback.downloadEarth") }}</a
          >
        </div>
      </div>
    </dialog-comp>
    <!-- <dialog-comp :visible.sync="isShowLocal" :dialog-title="'导入本地的文件'" :dialog-width></dialog-comp> -->
  </section>
</template>

<script src="./playback.js"></script>

<style lang="scss" scoped>
.btn-cont-complete {
  padding: 0 10px;
  ::v-deep .el-button + .el-button {
    margin-left: 0;
  }
}
.btn-search-track {
}
::v-deep .el-input__icon {
  line-height: 30px !important;
}
.local-type-span {
  span {
    margin-right: 2px;
  }
}
.option-item {
  // padding-left: 50px;
  margin-bottom: 10px;
  .el-checkbox__label {
    padding-left: 5px;
  }
  .but-bar {
    color: #2cabe3;
    cursor: pointer;
  }
  .bar {
    padding: 0 10px;
  }
  ::v-deep .el-input--small .el-input__inner {
    border-radius: 0 !important;
  }
}
.ml-20 {
  margin-left: 20px;
}
.option-item:nth-of-type(1) {
  // text-align: center;
  // padding-left: 0;
}

.playback {
  ::v-deep .el-button + .el-button {
    margin-left: 0;
  }
  ::v-deep .el-button {
    padding: 8px 12px;
  }
  .selected.active {
    color: #0066ff;
    font-weight: bold;
  }
  .title-co {
    width: 100%;
    padding: 8px 16px;
    margin: 0;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    opacity: 1;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    transition: opacity 0.2s;
    background-color: #f4f4f5;
    color: #909399;
    justify-content: center;
  }
  .down-load {
    font-size: 12px;
    border-radius: 5px;
    padding: 10px 10px 5px;
    line-height: 21px;
    background-color: #f6f6f6;
  }
  .mt10 {
    margin-top: 10px;
  }
  .pt10 {
    padding-top: 10px;
  }
  .mb5 {
    margin-bottom: 5px;
  }
  .btn-download {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 8px 10px;
    font-size: 14px;
    border-radius: 4px;
    background-color: #67c23a;
    border-color: #67c23a;
    color: #fff;
  }
  table.form-table > tr {
    // line-height: 3rem;
  }
  ::v-deep .el-input__inner {
    height: 34px !important;
    line-height: 34px !important;
    padding-right: 10px;
    // border: 0.1rem solid #a2a9ba !important;
    // box-shadow: 0 0.1rem 0 0 white, inset 0.1rem 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.2) !important;
  }
  ::v-deep .el-input__suffix {
    height: 34px;
  }
  ::v-deep .el-input__icon {
    line-height: 34px !important;
  }
  ::v-deep .el-input__inner {
    height: 34px !important;
    line-height: 34px !important;
  }
}
</style>

<style lang="scss">
.playback {
  .leaflet-popup-content {
    .osm-map-sign {
      margin-left: -70px !important;
      margin-top: -160px !important;
    }
  }
  .leaflet-popup-content-wrapper {
    background: unset !important;
    color: unset;
    box-shadow: unset !important;
  }
  .leaflet-popup-tip {
    background: unset !important;
    color: unset;
    box-shadow: unset !important;
  }
}
</style>
