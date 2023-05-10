<template>
  <div
    style="height: 100%; width: 100%; overflow-x: hidden; overflow-y: hidden"
  >
    <!--用户树搜索框 start-->
    <div
      style="display: flex; padding-right: 0.8rem"
      v-show="isInput"
      class="tree-top-bar"
    >
      <el-input
        size="small"
        :placeholder="$t('common.searchUserTip')"
        v-model="searchKey"
        @keyup.enter="searchUser"
        style="flex: 1; margin-right: 0.5rem"
      />
      <el-button
        type="warning"
        size="small"
        style="margin-left:0.4rem;!important;padding:6px 20px !important;"
        @click="searchUser"
        >{{ $t("common.search") }}</el-button
      >
    </div>
    <!--用户树搜索框 end-->
    <!--用户树-->
    <ul
      :id="'user_tree_' + randomNum + treeName"
      class="ztree"
      style="height: calc(100% - 3.5rem); overflow-x: auto; overflow-y: auto"
      v-show="searchList.length > 0 || !isSearch"
    ></ul>
    <!--用户树搜索结果提示-->
    <div
      v-show="searchList.length == 0 && isSearch"
      style="height: calc(100% - 3rem); line-height: 10rem; text-align: center"
    >
      {{ $t("common.noresult") }}
    </div>
  </div>
</template>

<script>
import "ztree";
import "ztree/css/metroStyle/metroStyle.css";
import arraySort from "@/utils/sortUtil.js";
// import '@/assets/scss/ztree.css';
import rootIcon from "@/assets/img/root2.png";
import leafIcon from "@/assets/img/sub2.png";
import {
  searchUserInfo,
  getUserInfoMation,
  getUserRelation
} from "@/api/common.js";
export default {
  name: "UserTree",
  props: {
    isCheck: {
      //是否多选框树
      default: false,
      type: Boolean
    },
    treeName: {
      //用户树名字
      type: String,
      default: ""
    },
    userId: {
      //当前选中的用户id
      type: Number,
      default: JSON.parse(window.localStorage.getItem("carweb_user")).userId
    },
    isInput: {
      //是否显示搜索输入框
      default: true,
      type: Boolean
    }
  },
  data: () => ({
    tree: null,
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")), //当前登录用户
    searchKey: "", //搜索关键词
    isSearch: false, //是否搜索
    searchList: [], //搜索结果列表

    selectedNode: null, //已选中的用户树节点
    isFirst: true, //是否第一次加载,
    randomNum: Math.round(Math.random() * 1000) //防止用户树重名的随机数
  }),
  watch: {
    searchKey() {
      if (!this.searchKey) {
        //搜索关键词为空返回用户树
        this.backTree();
      }
    },
    userId() {
      this.selectTreeNode(this.userId);
    }
  },
  methods: {
    backTree() {
      //返回用户树
      this.isSearch = false;
      if (this.isCheck) {
        this.initUserTreeCheck();
      } else {
        this.initUserTree();
      }
    },
    rightUserTreeNode(event, treeId, treeNode) {
      //右击用户树
      this.$emit("usertree-right", {
        event: event,
        treeNode: treeNode
      });
    },
    clickUserNode(event, treeId, treeNode) {
      //选择用户树节点
      if (!this.isFirst) {
        //非首次加载才能执行点击选中操作，防止展开树过程中频繁发送点为选中点
        this.$emit("usertree-select", treeNode.userId, treeNode.name);
        this.selectedNode = treeNode;
        if (this.isSearch && !this.isCheck) {
          //如果是搜索状态，选中了用户树节点，展开用户树至该用户
          this.backTree();
          var that = this;
          setTimeout(function() {
            that.selectTreeNode(treeNode.userId);
          }, 200);
        }
      }
    },
    checkUserTree() {
      //多选用户树
      this.$emit("usertree-check", this.tree.getCheckedNodes(true)); //返回已勾选的用户树节点
    },
    expandTheNode(node, idx, relation) {
      //递归展开树节点并选中
      var that = this;
      if (idx < relation.length && idx >= 0) {
        var userId = relation[idx].userId;
        if (node.children) {
          for (var j = 0; j < node.children.length; j++) {
            if (userId == node.children[j].userId) {
              this.selectedNode = node.children[j];
              this.tree.expandNode(node.children[j], true, true); //展开用户树节点
              setTimeout(function() {
                that.expandTheNode(node.children[j], idx - 1, relation); //该用户的下一级
              }, 200);
              break;
            }
          }
        }
      }

      if (idx <= 0) {
        //不需要再展开，选中用户就在上次展开下
        this.isSearch = false;
        if (this.tree.getSelectedNodes().length > 0) {
          //取消已选中的点
          this.tree.cancelSelectedNode(this.tree.getSelectedNodes()[0]);
        }
        setTimeout(() => {
          that.tree.selectNode(that.selectedNode, true, true);
        }, 200);

        this.isFirst = false;
      }
    },

    selectTreeNode(userId) {
      //获取用户的关系，并递归展开至该用户
      getUserRelation({ userId: userId }).then(res => {
        if (res.errCode == "200") {
          var relation = res.data;
          this.expandTheNode(
            this.tree.getNodes()[0],
            res.data.length - 2,
            relation
          );
        }
      });
    },
    initUserTreeCheck(userId, userName) {
      //设置多选框用户树
      const contentPath = "/carweb2/" + this.API.userTreeExpand;
      console.log("contentPath", contentPath);
      var setting = {
        check: {
          enable: true,
          chkboxType: {
            Y: "",
            N: ""
          }
        },
        async: {
          //异步加载用户树数据
          enable: true,
          dataType: "json",
          autoParam: ["userId"],
          url: this.API.userTreeExpand,
          type: "post",
          dataFilter: this.sortTreeNode
        },
        callback: {
          onCheck: this.checkUserTree
        }
      };

      var userTreeNodes = [
        {
          name: userName ? userName : this.rootUser.userName,
          userId: userId ? userId : this.rootUser.userId,
          open: false,
          isParent: true,
          children: [],
          icon: rootIcon
        }
      ];
      this.tree = $.fn.zTree.init(
        $(`#user_tree_${this.randomNum}${this.treeName}`),
        setting,
        userTreeNodes
      );
      this.tree.expandNode(this.tree.getNodes()[0], true, true);
    }, //initUserTreeCheck

    //单选用户树
    initUserTree(userId, userName) {
      const contentPath = "/carweb2/" + this.API.userTreeExpand;
      // console.log('contentPath', contentPath)
      var setting = {
        async: {
          enable: true,
          dataType: "json",
          autoParam: ["userId"],
          url: this.API.userTreeExpand,
          type: "post",
          dataFilter: this.sortTreeNode
        },
        callback: {
          onClick: this.clickUserNode,
          onRightClick: this.rightUserTreeNode
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
      ]; //userTreeNodes
      this.tree = $.fn.zTree.init(
        $(`#user_tree_${this.randomNum}${this.treeName}`),
        setting,
        userTreeNodes
      );
      this.tree.expandNode(this.tree.getNodes()[0], true, true);
      if (this.rootUser.userId == this.userId) {
        this.isFirst = false;
      }
    }, //initUserTree
    //初始化搜索结果用户树
    initUserTreeSearch() {
      var setting = null;
      if (this.isCheck) {
        setting = {
          check: {
            enable: true,
            chkboxType: {
              Y: "s",
              N: "ps"
            }
          },
          callback: {
            onCheck: this.checkUserTree
          }
        };
      } else {
        setting = {
          callback: {
            onClick: this.clickUserNode,
            onRightClick: this.rightUserTreeNode
          }
        };
      }
      var list = [];
      for (var i = 0; i < this.searchList.length; i++) {
        list.push({
          name: this.searchList[i].userName,
          userId: this.searchList[i].userId,
          open: false,
          isParent: this.searchList[i].hasChild,
          children: [],
          icon: leafIcon
        });
      }
      var userTreeNodes = list;
      this.tree = $.fn.zTree.init(
        $(`#user_tree_${this.randomNum}${this.treeName}`),
        setting,
        userTreeNodes
      );
      this.tree.expandNode(this.tree.getNodes()[0], true, true);
    },
    sortTreeNode(treeId, parentNode, res) {
      //用户树节点排序
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
    searchUser() {
      //搜索用户
      if (this.searchKey == "") {
        this.backTree();
        return;
      }
      const data = {
        baseUserId: this.rootUser.userId,
        key: this.searchKey,
        overflow: 10
      };
      searchUserInfo(data).then(res => {
        this.isSearch = true;
        if (res.errCode == "200") {
          this.searchList = res.data;
          this.initUserTreeSearch();
        }
      });
    },
    initUserTreeByUserId(userId) {
      //获取用户某用户id的用户信息并加载对应的用户树
      getUserInfoMation({ userId: userId }).then(res => {
        if (res.errCode == "200") {
          if (this.isCheck) {
            this.initUserTreeCheck(res.data.userId, res.data.userName);
          } else {
            this.initUserTree(res.data.userId, res.data.userName);
          }
        }
      });
    },
    refreshUserTree() {
      //重新加载用户树
      if (this.isCheck) {
        this.initUserTreeCheck();
      } else {
        this.initUserTree();
      }
    },
    listenEvent() {
      this.app.$on("usertree-refresh", this.refreshUserTree);
    },
    offEvent() {
      this.app.$off("usertree-refresh", this.refreshUserTree);
    }
  },
  mounted() {
    this.listenEvent();
    if (this.isCheck) {
      this.initUserTreeCheck();
    } else {
      this.initUserTree();
    }
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>
