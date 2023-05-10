<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('common.record')"
    :dialog-width="800"
    iconWindow="icon-luyin"
  >
    <div class="recorder-content" id="recorder_list" v-show="isShow">
      <div style="padding: 0 20px 10px 20px; position: relative">
        <div style="font-size: 14px" class="luyin">
          <div class="directAudio">
            <h3>{{ $t("recorder.uploadAudio") }}:</h3>
            <div class="direct-cont">
              <div>
                <el-input
                  style="width: 200px"
                  size="small"
                  v-model="cmdContent"
                ></el-input
                >(10~500s)
                <el-button type="primary" @click="sendCustomAudio('custom')">{{
                  $t("recorder.upload")
                }}</el-button>
              </div>
              <div style="margin-top: 10px">
                <span>
                  <el-button
                    type="primary"
                    @click="sendCustomAudio('continue')"
                    >{{ $t("recorder.continueUpload") }}</el-button
                  >
                </span>
                <span>
                  <el-button type="primary" @click="sendCustomAudio('stop')">{{
                    $t("recorder.stopUpload")
                  }}</el-button>
                </span>
              </div>
            </div>
          </div>
          <h3>{{ $t("recorder.sendAudio") }}:</h3>
          <h4>
            {{ $t("recorder.recordTime") }}:{{
              recorder && recorder.duration.toFixed(3)
            }}
          </h4>
          <div class="luyin-start">
            <el-button type="primary" @click="handleStart">{{
              $t("recorder.startAudio")
            }}</el-button>
            <!-- <el-button type="info" @click="handlePause">暂停录音</el-button>
            <el-button type="success" @click="handleResume">继续录音</el-button> -->
            <el-button type="warning" @click="handleStop">{{
              $t("recorder.stopAudio")
            }}</el-button>
          </div>
          <div class="luyin-end">
            <h4>
              {{ $t("recorder.playTime") }}:{{
                recorder &&
                  (playTime > recorder.duration
                    ? recorder.duration.toFixed(3)
                    : playTime.toFixed(3))
              }}
            </h4>

            <el-button type="primary" @click="handlePlay">{{
              $t("common.play")
            }}</el-button>
            <!-- <el-button type="info" @click="handlePausePlay">暂停播放</el-button>
            <el-button type="success" @click="handleResumePlay">继续播放</el-button> -->
            <el-button type="warning" @click="handleStopPlay">{{
              $t("playback.stop")
            }}</el-button>
            <el-button type="error" @click="handleDestroy">{{
              $t("recorder.destroy")
            }}</el-button>
            <!-- <el-button type="warning" @click="handleDownload">{{ $t('common.download') }}</el-button> -->
            <el-button type="primary" @click="uploadRecord">{{
              $t("common.issue")
            }}</el-button>
          </div>
        </div>
        <div class="time-content">
          <el-button type="primary" @click="loadRecordList">{{
            $t("common.search1")
          }}</el-button>
        </div>
      </div>
      <!-- 列表查询 -->
      <div class="recorder-list">
        <div class="hanggang"></div>
        <!-- <div class="time-conent"> -->
        <!-- {{ $t("common.startTime") }}
          <el-date-picker v-model="startTime" type="date" size="small" :placeholder="$t('common.chooseTime')"> </el-date-picker>
          {{ $t("common.endTime") }}
          <el-date-picker v-model="endTime" type="date" size="small" :placeholder="$t('common.chooseTime')"> </el-date-picker> -->
        <!-- <el-button type="primary" @click="loadRecordList">{{ $t("common.search1") }}</el-button> -->
        <!-- </div> -->
        <div class="recorder-list-table">
          <el-table
            :data="recorderList"
            v-loadmore="loadmoreContent"
            style="width: 100%"
            height="280"
            ref="multipleTable"
          >
            <!-- <el-table-column label="#" fixed>
              <template slot-scope="scope">
                <span>{{ scope.$index }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              :label="$t('recorder.recorderingTime')"
              width="180"
              prop="generateTime"
            >
              <!-- <template slot-scope="scope">
                {{ scope.row.generateTime }}
              </template> -->
            </el-table-column>
            <el-table-column :label="$t('recorder.times')" prop="duration">
            </el-table-column>
            <el-table-column :label="$t('common.status')" prop="audioStatus">
            </el-table-column>
            <el-table-column :label="$t('recorder.recoderType')">
              <template slot-scope="scope">
                {{ scope.row.sendType }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.operation')" min-width="150">
              <template slot-scope="scope">
                <!-- <el-button class="play-audio" type="primary" size="small" @click="playAudio(scope.row)">{{ $t("common.play") }}</el-button>
                <el-button type="warning" size="small" @click="stopAudio(scope.row)">{{ $t("common.pause") }}</el-button> -->
                <a
                  class="play-audio btn-recorder"
                  :ref="'playAudio' + scope.$index"
                  type="primary"
                  size="small"
                  @click="playRecordIndex(scope.row, scope.$index)"
                  >{{
                    scope.row.isPlay ? $t("common.pause") : $t("common.play")
                  }}</a
                >
                <span>|</span>
                <a class="btn-recorder" @click="delAudio(scope.row)">{{
                  $t("common.delete")
                }}</a>
                <!-- <audio id="middlePlay" class="middlePlay" :ref="'middlePlay' + scope.$index" :src="scope.row.content" style="display:none"></audio> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 提示 -->
    <dialog-comp
      :visible.sync="dialogVisible"
      dialog-title="Tip"
      :dialog-width="350"
    >
      <div class="send-cmd-show">
        <span>Loading......</span>
      </div>
    </dialog-comp>
    <!-- 提示end -->
  </dialog-comp>
</template>

<script>
import Recorder from "js-audio-recorder";
import lamejs from "lamejs";
// console.log(Player);
import { sendDeviceCmd } from "@/api/common.js";
import {
  loadVoiceListInfo,
  uploadRecording,
  delDevAudio
} from "@/api/monitor.js";

export default {
  data() {
    return {
      deviceImei: "",
      isShow: false,
      recorder: null,
      playTime: 0,
      timer: null,
      src: null,
      startTime: new Date(),
      endTime: "",
      isluyin: false,
      recorderList: [],
      pager: {
        current: 0,
        limit: 60,
        num: 1
      },
      cmdContent: "",
      currentAudio: null,
      isOperation: false,
      refreshInterval: null, //定时器定时刷新获取新的语音
      timer1: null,
      dialogVisible: false, //发送指令的状态显示
      isRecord: false,
      isLoadMore: false,
      currentIndex: -1
    };
  },
  created() {
    // this.recorder = new Recorder();
    this.recorder = new Recorder({
      sampleBits: 8, // 采样位数，支持 8 或 16，默认是16
      sampleRate: 11025, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1 // 声道，支持 1 或 2， 默认是1
      // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    });
  },
  methods: {
    playRecordIndex(item, idx) {
      // 语音播放
      let timer = null;
      let index = idx;
      if (this.currentIndex == -1) {
        this.currentAudio.src = this.recorderList[index].content;
        // this.recorderList[index].isPlay = true;
      }
      if (this.currentIndex != -1 && this.currentIndex != index) {
        // 停止上一个播放
        item.isPlay = false;
        this.recorderList[this.currentIndex].isPlay = false;
        this.currentAudio.pause();
        this.currentAudio.src = this.recorderList[index].content;
      }

      if (this.recorderList[index].isPlay) {
        this.currentAudio.pause();
        item.isPlay = false;
      } else {
        this.currentAudio.play();
        item.isPlay = true;
        console.log(item);
        timer = setTimeout(() => {
          item.isPlay = false;
          clearTimeout(timer);
        }, item.duration * 1000);
      }
      this.currentIndex = index;
    },
    playRecordIndex1(item, index) {
      // 语音顺序播放（没有使用）
      var middlePlay = document.querySelectorAll(".middlePlay");
      var playAudio = document.querySelectorAll(".play-audio");
      for (var i = 0; i < middlePlay.length; i++) {
        // console.log(middlePlay);
        middlePlay[i].pause();
        console.log("chufa");
        middlePlay[i].currentTime = 0;
      }
      for (var j = 0; j < playAudio.length; j++) {
        playAudio[j].classList.remove("playing");
        playAudio[j].innerHTML = "播放";
      }
      var middlePlayIndex = "middlePlay" + index;
      var middlePlayContent;

      middlePlayContent = this.$refs[middlePlayIndex];
      middlePlayContent.play();
      // 按键
      var playAudioIndex = "playAudio" + index;
      var playAudioContent;
      playAudioContent = this.$refs[playAudioIndex];
      console.log(playAudioContent);
      playAudioContent.classList.add("playing"); //加效果的
      playAudioContent.innerHTML = "播放中"; //加效果的
      middlePlayContent.addEventListener("ended", () => {
        playAudioContent.classList.remove("playing"); //加效果的
        playAudioContent.innerHTML = "播放"; //加效果的
        item.isPlay = false;
      });
      this.currentIndex = index;
    },
    uniqueList(list) {
      list = list.map(value => {
        value.content = this.API.staticResource + value.content;
        value.duration = Math.ceil(value.duration / 1000);
        value.generateTime = new Date(value.generateTime).format(
          "yyyy-MM-dd hh:mm:ss"
        );
        value.audioStatus = this.getAudioStatus(value.msgStatus);
        value.sendType = this.getSendType(value.sendType);
        value.id = value.pkId;
        value.isPlay = false;
        return value;
      });
      return list;
    },
    getAudioStatus(num) {
      let list = this.$t("recorder.audioStatus");
      let sts = "";
      for (let i = 0; i < list.length; i++) {
        if (num == list[i].num) {
          return sts + list[i].text;
        }
      }
      return "";
    },
    getSendType(num) {
      // console.log(num);
      let list = this.$t("recorder.sendTypeList");
      let str = "";
      for (let i = 0; i < list.length; i++) {
        if (num == list[i].num) {
          return str + list[i].text;
        }
      }
      return "";
    },
    handleDownload() {
      // 下载本地录制的录音
      if (this.recorder == null || this.recorder.duration === 0) {
        this.$message({
          message: "请先录音",
          type: "error"
        });
        return false;
      }
      this.recorder.pause(); // 暂停录音
      this.timer = null;
      // this.recorder.downloadWAV("abc");
      const mp3Blob = this.convertToMp33(this.recorder.getWAV());
      this.recorder.download(mp3Blob, "recorder", "mp3");
    },
    /**
     * 文件格式转换 wav-map3
     * */
    getMp3Data() {
      const mp3Blob = this.convertToMp33(this.recorder.getWAV());
      // this.recorder.download(mp3Blob, new Date().getTime() + ".mp3");
      const file = new File([mp3Blob], new Date().getTime() + ".mp3");
      return file;
    },
    convertToMp33(wavDataView) {
      // 获取wav头信息
      const wav = lamejs.WavHeader.readHeader(wavDataView); // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
      const { channels, sampleRate } = wav;
      const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
      // 获取左右通道数据
      const result = this.recorder.getChannelData();
      const buffer = [];

      const leftData =
        result.left &&
        new Int16Array(result.left.buffer, 0, result.left.byteLength / 2);
      const rightData =
        result.right &&
        new Int16Array(result.right.buffer, 0, result.right.byteLength / 2);
      const remaining = leftData.length + (rightData ? rightData.length : 0);

      const maxSamples = 1152;
      for (let i = 0; i < remaining; i += maxSamples) {
        const left = leftData.subarray(i, i + maxSamples);
        let right = null;
        let mp3buf = null;

        if (channels === 2) {
          right = rightData.subarray(i, i + maxSamples);
          mp3buf = mp3enc.encodeBuffer(left, right);
        } else {
          mp3buf = mp3enc.encodeBuffer(left);
        }

        if (mp3buf.length > 0) {
          buffer.push(mp3buf);
        }
      }

      const enc = mp3enc.flush();

      if (enc.length > 0) {
        buffer.push(enc);
      }

      return new Blob(buffer, { type: "audio/mp3" });
    },

    sendCustomAudio(tag) {
      // 上传语音
      if (!this.isRecord) {
        this.app.$emit("show-alert-msg", this.$t("recorder.recorderTip1"));
        return;
      }
      var data = {
        deviceImei: this.deviceImei,
        isOfflineCmd: false
      };
      if (tag == "custom") {
        data.cmdContent = "JT," + this.cmdContent;
      }
      if (tag == "continue") {
        data.cmdContent = "JTCYCLE,1";
      }
      if (tag == "stop") {
        data.cmdContent = "JTCYCLE,0";
      }
      this.dialogVisible = true;
      sendDeviceCmd(data).then(res => {
        if (res.errCode == "200") {
          // console.log("上传成功");
          this.dialogVisible = false;
          this.app.$emit("show-alert-msg", res.data);
        } else {
          this.dialogVisible = false;
          this.app.$emit("show-alert-msg", "Fail:" + res.data);
        }
      });
    },
    playAudio(item) {
      // console.log(item);
      this.isOperation = true;
      let url = "http://test.domilink.cn:8888/" + item.content;
      console.log(url);
      this.currentAudio = new Audio();
      this.currentAudio.src = url;
      this.currentAudio.play();
      let playPromise;
      let timer = null;
      playPromise = this.currentAudio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            timer = setInterval(() => {
              item.duration--;
              if (item.duration <= 0) {
                this.currentAudio.pause();
                clearInterval(timer);
              }
            }, 1000);
          })
          .catch(e => {
            // 音频加载失败
            console.log(e);
          });
      }
      // 2022-1-4
    },
    stopAudio(item) {
      this.isOperation = false;
      this.currentAudio.pause();
    },
    delAudio(item) {
      let data = {
        "pkIds[]": Array.from([item.pkId]),
        deviceImei: this.deviceImei
      };
      console.log(data);
      delDevAudio(data).then(res => {
        if (res.errCode == 200) {
          console.log(res);
          this.loadRecordList();
        }
      });
    },
    // 开始录音
    handleStart() {
      this.recorder = new Recorder();
      Recorder.getPermission().then(
        () => {
          this.isluyin = true;
          this.recorder.start(); // 开始录音
        },
        error => {
          this.$message({
            message: "请先允许该网页使用麦克风",
            type: "info"
          });
          console.log(`${error.name} : ${error.message}`);
        }
      );
    },
    handlePause() {
      this.isluyin = false;
      this.recorder.pause(); // 暂停录音
    },
    handleResume() {
      this.isluyin = true;
      this.recorder.resume(); // 恢复录音
    },
    handleStop() {
      this.isluyin = false;
      this.recorder.stop(); // 停止录音
    },
    handlePlay() {
      this.isluyin = true;
      console.log(this.recorder);
      this.recorder.play(); // 播放录音

      // 播放时长
      this.timer = setInterval(() => {
        try {
          this.playTime = this.recorder.getPlayTime();
        } catch (error) {
          this.timer = null;
        }
      }, 100);
    },
    handlePausePlay() {
      this.isluyin = false;
      this.recorder.pausePlay(); // 暂停播放

      // 播放时长
      this.playTime = this.recorder.getPlayTime();
      this.time = null;
    },
    handleResumePlay() {
      this.isluyin = true;
      this.recorder.resumePlay(); // 恢复播放

      // 播放时长
      this.timer = setInterval(() => {
        try {
          this.playTime = this.recorder.getPlayTime();
        } catch (error) {
          this.timer = null;
        }
      }, 100);
    },
    handleStopPlay() {
      this.isluyin = false;
      this.recorder.stopPlay(); // 停止播放

      // 播放时长
      this.playTime = this.recorder.getPlayTime();
      this.timer = null;
    },
    handleDestroy() {
      this.isluyin = false;
      this.recorder.destroy(); // 毁实例
      this.timer = null;
    },
    uploadRecord() {
      // 上传语音
      if (!this.isRecord) {
        this.app.$emit("show-alert-msg", this.$t("recorder.recorderTip1"));
        return;
      }
      if (this.recorder == null || this.recorder.duration === 0) {
        this.$message({
          message: "请先录音",
          type: "error"
        });
        return false;
      }
      this.recorder.pause(); // 暂停录音
      this.timer = null;

      const formData = new FormData();
      const blob = this.recorder.getWAVBlob(); // 获取wav格式音频数据
      // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
      // const newbolb = new Blob([blob], { type: "audio/wav" });
      // const fileOfBlob = new File([newbolb], new Date().getTime() + ".wav");
      // 转成mp3格式
      const fileOfBlob = this.getMp3Data();
      console.log(fileOfBlob);
      formData.append("file", fileOfBlob);
      formData.append("deviceImei", this.deviceImei);
      formData.append("duration", Math.ceil(this.recorder.duration) * 1000);
      console.log(formData);
      const url = window.URL.createObjectURL(fileOfBlob);
      this.src = url;
      var that = this;
      uploadRecording(formData).then(res => {
        if (res.errCode == "200") {
          this.app.$emit("show-alert-msg", this.$t("recorder.sendSuccessTip"));
          this.loadRecordList();
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("recorder.sendFailTip") + ":" + res.errMsg
          );
        }
      });
    },
    loadRecordList() {
      // 加载语音列表
      if (!this.deviceImei) {
        return;
      }
      this.pager.current = 0;
      let data = {
        page: this.pager.current,
        pageSize: this.pager.limit,
        deviceImei: this.deviceImei
      };
      loadVoiceListInfo(data).then(res => {
        if (res.errCode == 200) {
          this.recorderList = this.uniqueList(res.data);
          console.log(this.recorderList);
          // this.recorderList.forEach((item) => {
          //   item.durationStr = Math.ceil(item.duration / 1000);
          //   item.audioStatus = this.getAudioStatus(item.msgStatus);
          // });
        }
      });
    },
    showDialog(op) {
      this.isShow = true;
      this.isLoadMore = false;
      this.isRecord = op.isRecord;
      this.deviceImei = op.imei;
      this.pager.current = 0;
      this.currentIndex = -1;
      this.loadRecordList();
    },
    scrollDevList() {
      var that = this;
      this.$refs.multipleTable.bodyWrapper.addEventListener(
        "scroll",
        res => {
          let height = res.target;
          // console.log("chufa");
          let clientHeight = height.clientHeight;
          let scrollTop = height.scrollTop;
          let scrollHeight = height.scrollHeight;
          if (that.isLoadMore) {
            return;
          }
          that.isLoadMore = true;
          setTimeout(() => {
            if (clientHeight + scrollTop + 300 > scrollHeight) {
              let data = {
                page: (that.pager.current += that.pager.limit),
                pageSize: that.pager.limit,
                deviceImei: that.deviceImei
              };
              loadVoiceListInfo(data).then(res => {
                if (res.errCode == 200) {
                  if (res.data.length > 0) {
                    that.recorderList = that.recorderList.concat(
                      that.uniqueList(res.data)
                    );
                    // that.recorderList.forEach((item) => {
                    //   item.durationStr = Math.ceil(item.duration / 1000);
                    //   item.audioStatus = that.getAudioStatus(item.msgStatus);
                    // });
                    that.isLoadMore = false;
                  } else {
                    that.isLoadMore = true;
                    return;
                  }
                }
              });
            }
            that.isLoadMore = false;
          }, 1000);
        },
        true
      );
    },
    loadmoreContent() {
      if (this.isLoadMore) {
        return;
      }
      let data = {
        page: (this.pager.current += this.pager.limit),
        pageSize: this.pager.limit,
        deviceImei: this.deviceImei
      };
      loadVoiceListInfo(data).then(res => {
        if (res.errCode == 200) {
          if (res.data.length > 0) {
            this.recorderList = this.recorderList.concat(
              this.uniqueList(res.data)
            );
          } else {
            this.isLoadMore = true;
            return;
          }
        }
      });
    },
    listenEvent() {
      this.app.$on("show-recording-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$off("show-recording-dialog", this.showDialog);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.currentAudio = new Audio();
    });
    this.listenEvent();
    this.loadRecordList();
    // this.scrollDevList();
  },
  beforeDestroy() {
    this.offEvent();
    if (this.refreshInterval)
      this.refreshInterval = window.clearInterval(this.refreshInterval);
  }
};
</script>

<style lang="scss">
.recorder-content {
  .btn-recorder {
    cursor: pointer;
    padding: 0 5px;
  }
  .recorder-list-table {
    height: calc(100% - 215px);
    overflow: scroll;
  }
  height: 100%;
  .hanggang {
    width: 100%;
    border-bottom: 1px solid #ddd;
  }
  .recorder-list {
    padding: 0 20px;
    height: calc(100% - 30px);
  }
  h3 {
    margin: 0;
    margin-top: 5px;
  }
  h4 {
    margin: 10px 0;
  }
}
.time-content {
  position: absolute;
  right: 20px;
  bottom: 10px;
}
.directAudio {
  display: flex;
  flex-direction: row;
}
.send-cmd-show {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.luyin-end {
  .el-button {
    padding: 8px 34px !important;
  }
}
</style>
