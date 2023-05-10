<template>
  <div
    class="result-box"
    v-show="isShow"
    style="overflow-y: hidden; overflow-x: auto"
  >
    <div style="height: calc(100% - 2.5rem); overflow: auto">
      <ul
        :id="'user_box_' + bname + randNum"
        class="ztree"
        v-show="!isSearch"
      ></ul>

      <!--用户搜索结果列表 start-->
      <ul class="result-list" v-if="userList.length > 0 && !isLoad && isSearch">
        <li v-for="(item, idx) in userList" @click="chooseItem(idx)" :key="idx">
          <div class="result-list-icon iconfont icon-user"></div>
          <div class="result-list-text">
            <div>{{ item.userName }}</div>
            <div color="gray">({{ item.userId }})</div>
          </div>
        </li>
      </ul>
      <!--用户搜索结果列表 end-->
      <!--用户搜索结果提示 start-->
      <div
        v-if="userList.length == 0 && !isLoad && isSearch"
        class="result-box-nodata"
        @click="isShow = false"
      >
        {{ $t("common.noresult") }}
      </div>

      <div
        v-if="isLoad && isSearch"
        class="result-box-nodata"
        style="color: red"
      >
        {{ $t("common.loading") }}
      </div>
      <!--用户搜索结果提示 end-->
    </div>

    <div style="text-align: right">
      <el-button
        type="info"
        size="small"
        @click="isSearch = true"
        v-show="!isSearch && searchKey"
        >{{ $t("common.searchResult") }}</el-button
      >
      <el-button
        type="success"
        size="small"
        @click="isSearch = false"
        v-show="isSearch"
        >{{ $t("common.backtree") }}</el-button
      >
      <el-button type="primary" size="small" @click="closeBox">{{
        $t("common.close")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import "ztree";
import "ztree/css/metroStyle/metroStyle.css";
import arraySort from "@/utils/sortUtil.js";
import rootIcon from "@/assets/img/root1.png";
import leafIcon from "@/assets/img/sub.png";
import { loadUserListInfo } from "@/api/account.js";
export default {
  name: "UserBox",
  props: {
    bname: {
      type: String,
      default: ""
    },
    searchKey: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isLoad: false,
    isSearch: false,
    randNum: Math.round(Math.random() * 1000),
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userList: [], //搜索结果列表
    originKey: ""
  }),
  watch: {
    isShow() {
      if (this.isShow) {
        this.loadUserList();
        this.initUserTree();
      }
    },
    searchKey() {
      if (this.isShow) {
        this.loadUserList();
        this.initUserTree();
      }
    }
  },
  methods: {
    chooseItem(idx) {
      //选择用户
      this.closeBox();
      this.$emit("select-result", {
        userId: this.userList[idx].userId,
        userName: this.userList[idx].userName
      });
    },
    loadUserList() {
      //搜索用户
      var that = this;
      if (this.searchKey) {
        this.isSearch = true;

        var data = {
          baseUserId: this.rootUser.userId,
          key: this.searchKey,
          overflow: 20
        };
        if (this.originKey == this.searchKey) {
          this.$emit("update:isShow", true);
        } else {
          this.isLoad = true;
          loadUserListInfo(data).then(res => {
            if (res.errCode == "200") {
              that.userList = res.data;
              that.originKey = that.searchKey + "";
            }

            that.isLoad = false;
          });
        }
      } else {
        this.isSearch = false;
        //this.closeBox();
      }
    },
    closeBox() {
      this.$emit("update:isShow", false);
    },
    sortTreeNode(treeId, parentNode, res) {
      //用户树节点名称排序
      if (res.errCode == "200") {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].name = res.data[i].userName;
          res.data[i].isParent = res.data[i].haveChild;
          res.data[i].icon = res.data[i].isParent ? rootIcon : leafIcon;
        }
        res.data.sort(arraySort("name"));
        return res.data;
      }
      return [];
    },
    clickUserNode(event, treeId, treeNode) {
      //选择用户树节点
      this.closeBox();
      this.$emit("select-result", {
        userId: treeNode.userId,
        userName: treeNode.name
      });
    },
    initUserTree(userId, userName) {
      console.log(userId, userName);
      //初始化单选用户树
      const url = this.API.userTreeExpand;
      console.log("url", url);
      var setting = {
        async: {
          enable: true,
          dataType: "json",
          autoParam: ["userId"],
          url: url,
          type: "post",
          dataFilter: this.sortTreeNode
        },

        callback: {
          onDblClick: this.clickUserNode
        }
      }; //setting
      var userTreeNodes = [
        {
          name: userName ? userName : this.rootUser.userName,
          userId: userId ? userId : this.rootUser.userId,
          open: false,
          isChildLoad: false,
          isParent: true,
          children: [],
          icon: rootIcon
        }
      ];
      this.tree = $.fn.zTree.init(
        $(`#user_box_${this.bname}${this.randNum}`),
        setting,
        userTreeNodes
      );
      this.tree.expandNode(this.tree.getNodes()[0], true, true);
    },
    listenEvent() {
      this.app.$on("close-user-box", this.closeBox);
    },
    offEvent() {
      this.app.$off("close-user-box", this.closeBox);
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
