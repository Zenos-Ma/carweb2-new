<template>
  <div style="height: 98%;width: 300px;" class="tree-comp">
    <!--用户树搜索框 start-->
    <div
      style="display: flex;padding-right:0.8rem;height:35px"
      class="tree-top-bar"
    >
      <el-input
        name="search-key"
        :placeholder="$t('common.searchUserTip')"
        v-model="searchKey"
        @keyup.enter.native="searchUser"
        style="flex: 1;margin-right: 0.5rem;"
        autocomplete="off"
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
    <div class="list system-scrollbar">
      <el-tree
        v-if="!isSearch"
        ref="tree"
        :show-checkbox="isCheck"
        class="my-tree"
        lazy
        :data="treeData"
        @check="getCheckedNode"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"
        :load="laodNode"
        @node-contextmenu="rightClickContent"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <!-- <i :class="['iconfont', node.isLeaf ? 'icon-zhengchangkehu' : 'icon-kehuzhongxin']"></i> -->
            <img
              v-if="data.icon"
              :src="data.icon"
              alt=""
              style="width: unset;"
            />
            <span class="name" :id="node.id">{{ node.label }}</span>
          </span>
          <span class="el-icon-more-r" v-if="data.level != 0">
            <i
              class="iconfont icon-diandiandianshu"
              @click.stop="() => append(data, node)"
            ></i>
          </span>
        </span>
      </el-tree>
      <el-tree
        v-if="isSearch"
        ref="tree"
        :show-checkbox="isCheck"
        class="my-tree"
        :data="userList"
        @check="getCheckedNode"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"
        @node-contextmenu="rightClickContent"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <img
              v-if="data.icon"
              :src="data.icon"
              alt=""
              style="width: unset;"
            />
            <span class="name" :id="node.id">{{ node.label }}</span>
          </span>
          <span class="el-icon-more-r" v-if="data.level != 0">
            <i
              class="iconfont icon-diandiandianshu"
              @click.stop="() => append(data, node)"
            ></i>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import arraySort from "@/utils/sortUtil.js";
// import '@/assets/scss/ztree.css';
import rootIcon from "@/assets/img/root1.png";
import leafIcon from "@/assets/img/sub.png";
import {
  searchUserInfo,
  getUserTreeExpand,
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
    userId: {
      //当前选中的用户id
      type: [Number, String],
      default: JSON.parse(window.localStorage.getItem("carweb_user")).userId
    },
    isInput: {
      //是否显示搜索输入框
      default: true,
      type: Boolean
    }
  },
  data: () => ({
    searchKey: "",
    searchList: [],
    isSearch: false,
    userList: [],
    treeData: [
      {
        id: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
        label: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
        children: [],
        hasChild: true,
        level: 0,
        icon: rootIcon
      }
    ],
    defaultProps: {
      children: "children",
      userName: "label",
      userId: "id",
      isLeaf: data => {
        // console.log("data", data);
        return !data.hasChild;
      }
    },
    defaultSelectCids: [], // 选出所有cid
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    isShowRight: false,
    isLoad: false,
    parentTree: {},
    selectedNode: null,
    firstNode: null,
    isFirst: true
  }),
  watch: {
    searchKey(val) {
      // this.$refs.tree.filter(val);
      // if (val) {
      //   this.$refs.tree.$data.store.lazy = false;
      //   this.searchUser();
      // } else {
      //   this.$refs.tree.$data.store.lazy = true;
      // }
      if (!this.searchKey) {
        this.isSearch = false;
      }
    },
    userId() {
      // 会频繁请求接口，造成闪
      this.selectTreeNode(this.userId);
    }
  },
  methods: {
    rightClickContent(event, data, node, target) {
      // 鼠标右击
      // console.log("data", data);
      let dataObj = {
        userId: data.id,
        userName: data.label
      };
      this.$emit("usertree-right", {
        event: event,
        treeNode: dataObj,
        tag: "rightClick"
      });
    },
    append(data, node) {
      // 点击右上角的三点
      // console.log("data", data);
      // console.log("node", node);
      let dataObj = {
        userId: data.id,
        userName: data.label
      };
      this.$emit("usertree1-right", {
        node: node,
        treeNode: dataObj,
        tag: "click"
      });
    },
    async laodNode(node, resolve) {
      // console.log("node", node);
      // console.log("resolve", resolve);
      let treeDataFirst = [
        {
          id: this.rootUser.userId,
          label: this.rootUser.userName,
          children: [],
          hasChild: true,
          level: 0,
          icon: rootIcon
        }
      ];
      if (node && node.level === 0) {
        // 第一层的数据
        // console.log("zhixngdiyicijiazzai");
        this.parentTree = node;
        resolve(this.treeData);
        this.$nextTick(() => {
          this.firstNode = node.childNodes[0];
          this.firstNode.expanded = true;
          this.firstNode.loadData();
        });
      } else {
        // 子用户的数据
        // const data = await this.getTreeData(node.data.id);
        // resolve(this.data2treeDG(data.data));
        this.loadNodeChildren(node, resolve);
      }
      if (this.rootUser.userId == this.userId) {
        this.isFirst = false;
      }
    },
    //
    async loadNodeChildren(node, resolve) {
      console.log("nodechild", node);
      if (node.data.hasChild) {
        const data = await this.getTreeData(node.data.id);
        console.log("data", data);
        let childList = this.data2treeDG(data.data);
        this.$refs.tree.updateKeyChildren(node.data.id, childList);
        return resolve(childList);
      } else {
        return resolve([]);
      }
    },
    //
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async searchUser() {
      //
      this.isSearch = true;
      const data = {
        baseUserId: this.rootUser.userId,
        key: this.searchKey.replace(/[\r\t\n\s\f]/g, ""),
        overflow: 10
      };
      searchUserInfo(data).then(res => {
        if (res.errCode == 200) {
          let arrList = this.initUserTreeSearch(res.data);
          this.userList = arrList;
        }
      });
    },
    initUserTreeSearch(searchList) {
      var list = [];
      for (var i = 0; i < searchList.length; i++) {
        list.push({
          label: searchList[i].userName,
          id: searchList[i].userId,
          open: false,
          children: [],
          icon: leafIcon
        });
      }
      var userTreeNodes = list;

      // console.log("userTreeNodes", userTreeNodes);
      return userTreeNodes;
    },
    //  实现el-tree复选框选中父级的同时选中父级的第一子级
    // （只需选中第一子级，往下的第二第三子级不需选中）
    selectedChild(checkedNodes, isSelected) {
      //checkedNodes.children是当前节点的第一级子节点checkedNodes.children.children是第二级
      for (let i = 0; i < checkedNodes.children.length; i++) {
        this.$refs.tree.setChecked(checkedNodes.children[i].id, isSelected);
      }
    },
    getCheckedNode(checkedNodes, checkedKeys) {
      // console.log("val", checkedNodes, checkedKeys);
      let selected = checkedKeys.checkedKeys.indexOf(checkedNodes.id);
      // 当前结点未选中状态时，selected为-1
      if (checkedNodes.children !== undefined) {
        //如果存在子级
        if (selected !== -1) {
          //如果选中
          this.selectedChild(checkedNodes, true); //第一级子级选中
        } else {
          //取消选中时
          this.selectedChild(checkedNodes, false); //第一级子级取消选中
        }
      }
      //获取当前所选节点的数据数组
      let checkdata = this.$refs.tree.getCheckedNodes();
      // console.log("checkdata", checkdata);
      this.$emit("usertree-check", checkdata);
    },

    data2treeDG(data) {
      // console
      let arrList = [];
      arrList = data.map(item => {
        return {
          id: item.userId,
          label: item.userName,
          hasChild: item.haveChild,
          icon: item.haveChild ? rootIcon : leafIcon
        };
      });
      arrList.sort(arraySort("label"));
      // console.log("arrList", arrList);
      return arrList;
    },
    getTreeData(userId) {
      return getUserTreeExpand({
        userId: userId ? userId : this.rootUser.userId
      });
    },
    handleNodeClick(row) {
      //选择用户树节点
      console.log("row", row);

      // if (!this.isFirst) {
        //非首次加载才能执行点击选中操作，防止展开树过程中频繁发送点为选中点
        this.$emit("usertree-select", row.id, row.label);

        if (this.isSearch) {
          setTimeout(() => {
            this.isSearch = false;
            // console.log("tree", this.$refs.tree.getNodes());
            this.refreshTreeNode();
            this.selectTreeNode(row.id);
          }, 200);
        }
      // }
    },
    refreshTreeNode(userId) {
      // 刷新
      let id = userId ? userId : this.treeData[0].id;
      if (id && id !== 0) {
        // 第一层再次加载
        this.firstNode.expanded = true;
        this.firstNode.loadData();
        this.treeData[0].children = [];
        // this.parentTree = null;
        setTimeout(() => {
          // console.log("zhiiiiiiiiiiiiiiiiiiiiiiiii");
          // 防止还没加载树就执行获取树的信息
          let node = this.$refs.tree.getNode(id);
          node.loaded = false;
          node.expand();
        }, 500);
      }
    },
    expandTheNode(node, idx, relation) {
      // 递归展开树节点并选中
      // console.log("idx, relation", node, idx, relation);
      if (idx < relation.length && idx >= 0) {
        setTimeout(() => {
          var userId = relation[idx].userId;
          // console.log("userId", userId);
          // console.log("node.childNodes", node);
          if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
              if (userId == node.childNodes[i].data.id) {
                this.selectedNode = node.childNodes[i];
                // console.log(
                //   "this.selectedNode.data.id",
                //   this.selectedNode.data.id
                // );
                let nodeData = this.selectedNode;
                nodeData.expanded = true;
                nodeData.loadData();
                //
                // this.$refs.tree.setCurrentKey(nodeData.id);//通过 key 设置某个节点的当前选中状态
                this.$refs.tree.setCurrentNode(nodeData.data); //通过 node 设置某个节点的当前选中状态
                const nodeDom = document.getElementById(nodeData.id);
                // console.log("nodeDom", nodeDom);

                this.$nextTick(() => {
                  nodeDom.scrollIntoView(
                    { block: "end" },
                    { behavior: "smooth" }
                  );

                  this.expandTheNode(node.childNodes[i], idx - 1, relation);

                  setTimeout(() => {
                    // 设置选中的状态，包含子用户
                    this.$refs.tree.setChecked(this.selectedNode, true, true);
                    // 通过key设置选中的状态,不异步选中不了汗
                    // this.$refs.tree.setCheckedKeys([this.selectedNode.data.id], true);
                  }, 200);
                });
                break;
              }
            }
          }
        }, 1000);
      }
      if (idx <= 0) {
        // 不需要再展开，选中用户就在上次展开下
        this.isSearch = false;
        this.isFirst = false;
      }
    },
    selectTreeNode(userId) {
      // 获取关系的去循环
      // console.log("获取关系", userId);
      getUserRelation({ userId: userId }).then(res => {
        if (res.errCode == 200) {
          var relation = res.data;
          this.expandTheNode(
            this.parentTree.childNodes[0],
            res.data.length - 2,
            relation
          );
        }
      });
    },

    listenEvent() {
      this.app.$on("usertree-refresh", this.refreshTreeNode);
    },
    offEvent() {
      this.app.$off("usertree-refresh", this.refreshTreeNode);
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

<style scoped lang="scss">
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  position: relative;
  .el-icon-more-r {
    position: absolute;
    right: 5px;
    display: none;
    .iconfont {
      font-size: 14px;
    }
  }
  &:hover {
    .el-icon-more-r {
      display: block;
      color: #ff9934;
    }
  }
}

.is-leaf::before {
  // 隐藏或加透明都可以
  // display: none;
  opacity: 0;
}

.list {
  flex: 1;
  overflow: auto;
}
.my-tree {
  :deep(.el-tree-node__content) {
    height: 36px;
  }
  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: rgba(64, 158, 255, 0.4);
  }
  :deep(.el-tree-node > .el-tree-node__content) {
    transition: 0.2s;
  }
  > :deep(.el-tree-node > .el-tree-node__content) {
    .el-icon-more-r {
      display: none !important;
    }
  }
}

.system-scrollbar {
  margin-top: 10px;
  padding: 0 10px;
  height: calc(100% - 50px);
  overflow: scroll;
  ::v-deep .el-icon-loading {
    font-size: 14px !important;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(144, 147, 153, 0.3);
  }
}

.tree-comp ::v-deep .el-tree {
  background: unset;
}

.tree-comp ::v-deep .el-tree-node__expand-icon.el-icon-caret-right:before {
  content: "";
}
.tree-comp ::v-deep .el-tree-node__expand-icon.expanded {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk0Qjg1QkJGOTA5MzExRTg4MEEzOEZEQzI5MzkxREZCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk0Qjg1QkMwOTA5MzExRTg4MEEzOEZEQzI5MzkxREZCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTRCODVCQkQ5MDkzMTFFODgwQTM4RkRDMjkzOTFERkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTRCODVCQkU5MDkzMTFFODgwQTM4RkRDMjkzOTFERkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73BvjgAAAAN0lEQVR42mJcvvEQAyWABYj/U6CfkYmBQjBqABUMYEHmRPjZEtSwYtNh1HgEJqTRdDDkDQAIMAC8/AlX9PqLuQAAAABJRU5ErkJggg==);

  background-size: 14px;
  background-repeat: no-repeat;
  height: 4px;
  width: 4px;
  transform: none;
}
.tree-comp ::v-deep .el-tree-node__expand-icon {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhGRDkwNzIyOTA5MzExRTg4NjVERTFFQjFGNUVBRDRGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhGRDkwNzIzOTA5MzExRTg4NjVERTFFQjFGNUVBRDRGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEZEOTA3MjA5MDkzMTFFODg2NURFMUVCMUY1RUFENEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEZEOTA3MjE5MDkzMTFFODg2NURFMUVCMUY1RUFENEYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz769A2lAAAARElEQVR42mJcvvEQAyWABYj/U6CfkYmBQkBbAyL8bAfYBXQxgIWQn9HFVmw6jNsAdEmQZnSxYRiIeA0g5P/B4QWAAAMAg1sPQJ21Kv4AAAAASUVORK5CYII=);

  background-size: 14px;
  background-repeat: no-repeat;
  height: 4px;
  width: 4px;
  transform: none;
}
.tree-comp ::v-deep .el-tree-node__expand-icon.is-leaf {
  background: none;
  pointer-events: none;
}
.tree-comp
  ::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e2eef7;
}
</style>
