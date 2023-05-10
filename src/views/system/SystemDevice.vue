<template>
  <div class="layout-container" style="display:block">
    <!--导入新设备 start-->
    <div class="form-card half">
      <div class="card-header">{{ $t("systemDevice.importDevice") }}</div>
      <div class="card-body1">
        <div class="orange-box">
          <div>
            <span v-html="$t('systemDevice.importTip')"></span>
          </div>
          <div>
            <span style="color: red; font-weight: bold"
              >{{ $t("common.template") }}#1</span
            >
            <a class="btn-white" :href="API.batchAddXls">{{
              $t("common.download")
            }}</a>
          </div>
        </div>
        <!--上传导入新设备文件 start-->
        <form
          style="display: flex; flex-direction: row"
          ref="batch_add"
          enctype="multipart/form-data"
          method="post"
          @submit.prevent="
            doBatchAdd();
            return false;
          "
        >
          <file-upload
            accept="application/vnd.ms-excel"
            @select-file="onUploadFileAdd"
          ></file-upload>
          <span class="btn-primary-system1" @click="resetFormDate('isFile1')">{{
            $t("common.reset")
          }}</span>
          <button class="btn-primary-system">{{ $t("common.submit") }}</button>
        </form>
        <!--上传导入新设备文件 end-->
      </div>
    </div>
    <!--导入新设备 end-->
    <!--更新设备 start-->
    <div class="form-card half">
      <div class="card-header">{{ $t("systemDevice.changeDeviceInfo") }}</div>
      <div class="card-body1">
        <div class="orange-box">
          <div>
            <span v-html="$t('systemDevice.updateTip')"></span>
          </div>
          <div>
            <span style="color: red; font-weight: bold"
              >{{ $t("common.template") }}#2</span
            >
            <a class="btn-white" :href="API.batchAddXls1">{{
              $t("common.download")
            }}</a>
          </div>
        </div>
        <!--上传更新设备文件 start-->
        <form
          style="display: flex; flex-direction: row"
          enctype="multipart/form-data"
          method="post"
          :action="API.batchModify"
          ref="batch_modify"
        >
          <div class="file-input" style="width: 200px">
            <input
              type="file"
              id="batch_modify_upload"
              name="file"
              ref="batch_modify_upload"
            />
            <div class="file-btn" style="text-align: center" v-show="!isFile2">
              {{ $t("common.chooseFile") }}
            </div>
            <div class="file-btn" style="text-align: center" v-show="isFile2">
              {{ $t("common.selectedFile") }}:{{ file2 }}
            </div>
          </div>
          <span class="btn-primary-system1" @click="resetUpdateDevice">{{
            $t("common.reset")
          }}</span>
          <button class="btn-primary-system">{{ $t("common.submit") }}</button>
          <!-- <file-upload accept="application/vnd.ms-excel" @select-file="onUploadFileUpdate"></file-upload> -->
        </form>
        <!--上传更新设备文件 end-->
      </div>
    </div>
    <!--更新设备 end-->

    <!--导入sim start-->
    <div class="form-card half">
      <div class="card-header">{{ $t("systemDevice.importSim") }}</div>
      <div class="card-body1">
        <div class="orange-box">
          <div>
            <span v-html="$t('systemDevice.importSimTip')"></span>
          </div>
          <div>
            <span style="color: red; font-weight: bold"
              >{{ $t("common.template") }}#3</span
            >
            <a class="btn-white" :href="API.batchSimXls">{{
              $t("common.download")
            }}</a>
          </div>
        </div>
        <!--上传sim文件 start-->
        <form
          ref="batch_sim"
          enctype="multipart/form-data"
          method="post"
          @submit.prevent="
            doBatchSim();
            return false;
          "
        >
          <div style="display: flex; flex-direction: row">
            <file-upload
              accept="application/vnd.ms-excel"
              @select-file="onUploadFileSim"
            ></file-upload>
            <span
              class="btn-primary-system1"
              @click="resetFormDate('isFile3')"
              >{{ $t("common.reset") }}</span
            >
            <button class="btn-primary-system">
              {{ $t("common.submit") }}
            </button>
          </div>
          <!--sim提供商 start-->
          <div style="line-height: 30px; white-space: nowrap">
            {{ $t("systemDevice.chooseProvider") }}:
            <input
              type="radio"
              name="supplierID"
              class="text-input"
              v-model="provider"
              value="S002GM"
            />
            {{ $t("systemDevice.gpsoo") }}
            <input
              type="radio"
              name="supplierID"
              class="text-input"
              v-model="provider"
              value="S001SW"
            />
            {{ $t("systemDevice.swd") }}
            <input
              type="radio"
              name="supplierID"
              class="text-input"
              v-model="provider"
              value="S003ST"
            />
            {{ $t("systemDevice.shangtong") }}
            <input
              type="radio"
              name="supplierID"
              class="text-input"
              v-model="provider"
              value="S004YD"
            />
            {{ $t("systemDevice.cnyd") }}
            <input
              type="radio"
              name="supplierID"
              class="text-input"
              v-model="provider"
              value="S005LT"
            />
            {{ $t("systemDevice.cnlt") }}
            <input
              type="radio"
              name="supplierID"
              class="text-input"
              v-model="provider"
              value="S006XY"
            />
            {{ $t("systemDevice.xuyu") }}
          </div>
          <!--sim提供商 end-->
        </form>
        <!--上传sim文件 end-->
      </div>
    </div>
    <!--导入sim end-->

    <!--更新sim start-->
    <div class="form-card half">
      <div class="card-header">{{ $t("systemDevice.updateSim") }}</div>
      <div class="card-body1">
        <div class="orange-box">
          <div>
            <span v-html="$t('systemDevice.importSimTip1')"></span>
          </div>
          <div>
            <span style="color: red; font-weight: bold"
              >{{ $t("common.template") }}#4</span
            >
            <a class="btn-white" :href="API.batchUpdateSimXls">{{
              $t("common.download")
            }}</a>
          </div>
        </div>
        <!--上传sim文件 start-->
        <form
          style="display: flex; flex-direction: row"
          ref="batch_update_sim"
          enctype="multipart/form-data"
          method="post"
          @submit.prevent="
            doBatchUpdateSim();
            return false;
          "
        >
          <file-upload
            accept="application/vnd.ms-excel"
            @select-file="onUploadFileSimUpdate"
          ></file-upload>
          <span class="btn-primary-system1" @click="resetFormDate('isFile4')">{{
            $t("common.reset")
          }}</span>
          <button class="btn-primary-system">{{ $t("common.submit") }}</button>
        </form>
        <!--上传sim文件 end-->
      </div>
    </div>
    <!--更新sim end-->

    <!--更新设备用户到期时间 start-->
    <div class="form-card half">
      <div class="card-header">{{ $t("systemDevice.updateDevSim") }}</div>
      <div class="card-body1">
        <div class="orange-box">
          <div>
            <span v-html="$t('systemDevice.importDevSimTip1')"></span>
          </div>
          <div>
            <span style="color: red; font-weight: bold"
              >{{ $t("common.template") }}#5</span
            >
            <a class="btn-white" :href="API.updateDevSimXls">{{
              $t("common.download")
            }}</a>
          </div>
        </div>
        <!--上传sim文件 start-->
        <form
          style="display: flex; flex-direction: row"
          ref="update_dev_sim"
          enctype="multipart/form-data"
          method="post"
          @submit.prevent="
            doUpdateDevSim();
            return false;
          "
        >
          <file-upload
            accept="application/vnd.ms-excel"
            @select-file="onUploadFileDevSim"
          ></file-upload>
          <span class="btn-primary-system1" @click="resetFormDate('isFile6')">{{
            $t("common.reset")
          }}</span>
          <button class="btn-primary-system">{{ $t("common.submit") }}</button>
        </form>
        <!--上传sim文件 end-->
      </div>
    </div>

    <!--导入保单 start-->
    <div class="form-card half">
      <div class="card-header">{{ $t("systemDevice.policyImport") }}</div>
      <div class="card-body1">
        <div class="orange-box">
          <div>
            <span v-html="$t('systemDevice.policyTip')"></span>
          </div>
          <div>
            <span style="color: red; font-weight: bold"
              >{{ $t("common.template") }}#6</span
            >
            <a class="btn-white" :href="API.policyXls">{{
              $t("common.download")
            }}</a>
          </div>
        </div>
        <!--上传保单文件 start-->
        <form
          style="display: flex; flex-direction: row"
          ref="import_policy"
          enctype="multipart/form-data"
          method="post"
          @submit.prevent="
            doPolicy();
            return false;
          "
        >
          <file-upload
            accept="application/vnd.ms-excel"
            @select-file="onUploadFilePolicy"
          ></file-upload>
          <span class="btn-primary-system1" @click="resetFormDate('isFile5')">{{
            $t("common.reset")
          }}</span>
          <button class="btn-primary-system">{{ $t("common.submit") }}</button>
        </form>
        <!--上传保单文件 end-->
      </div>
    </div>
    <!--导入sim end-->
    <!--批量更新sim到期时间 2021-12-15 start-->
    <div class="form-card half">
      <div class="card-header">{{ $t("systemDevice.importSimUpdate") }}</div>
      <div class="card-body">
        <div class="orange-box">
          <div>
            <span v-html="$t('systemDevice.importSimTip2')"></span>
          </div>
          <div>
            <span style="color: red; font-weight: bold"
              >{{ $t("common.template") }}#7</span
            >
            <a class="btn-white" :href="API.batchUpdateSimXlsUpdate">{{
              $t("common.download")
            }}</a>
          </div>
        </div>
        <!--上传保单文件 start-->
        <form
          style="display: flex; flex-direction: row"
          ref="update_sim_new"
          enctype="multipart/form-data"
          method="post"
          @submit.prevent="
            doBatchUpdateSimNew();
            return false;
          "
        >
          <file-upload
            accept="application/vnd.ms-excel"
            @select-file="onUploadFileUpdateSimNew"
          ></file-upload>
          <span class="btn-primary-system1" @click="resetFormDate('isFile7')">{{
            $t("common.reset")
          }}</span>
          <button class="btn-primary-system" style="margin-left: 8px">
            {{ $t("common.submit") }}
          </button>
        </form>
        <!--上传保单文件 end-->
      </div>
    </div>
    <!--批量更新sim到期时间  end-->
  </div>
</template>

<script src="./js/systemDevice.js"></script>

<style scoped>
.form-card.half {
  width: calc(49% - 8px);
  margin: 5px;
  display: inline-flex;
}
</style>
