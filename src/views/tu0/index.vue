<template>
  <div>
    <div style="display: flex; padding: 10px 0">
      <div style="margin-right: 10px">
        <el-switch v-model="horizontal"></el-switch> {{ horizontal? "横向": "纵向" }}
      </div>
      <div style="margin-right: 10px">
        <el-switch v-model="collapsable"></el-switch> {{ collapsable? "可收起": "仅展开" }}
      </div>
      <div style="margin-right: 10px">
        <el-switch v-model="disaled"></el-switch> {{ disaled? "禁止编辑": "可编辑" }}
      </div>
      <div style="margin-right: 10px">
        <el-switch v-model="onlyOneNode"></el-switch> {{ onlyOneNode? "仅拖动当前节点": "拖动当前节点树" }}
      </div>
      <div style="margin-right: 10px">
        <el-switch v-model="cloneNodeDrag"></el-switch> {{ cloneNodeDrag? "拖动节点副本": "拖动节点本身" }}
      </div>
      <div style="margin-right: 10px">
        <el-switch v-model="pop"></el-switch> {{ pop? "弹窗修改节点": "标签修改节点" }}
      </div>
    </div>
    <div style="padding-bottom: 10px" class="pickers">
      背景色：
      <el-color-picker v-model="style.background" size="small"></el-color-picker>&nbsp; 文字颜色：
      <el-color-picker v-model="style.color" size="small"></el-color-picker>&nbsp;
      搜索：
      <input type="text" v-model="keyword" placeholder="请输入搜索内容" @keydown.enter="filter" />
    </div>
    <div style="height: 400px; border:1px solid #eee">
      <zm-tree-org
        ref="tree"
        :data="data"
        :disabled="disaled"
        :horizontal="horizontal"
        :collapsable="collapsable"
        :label-style="style"
        :node-draggable="true"
        :default-expand-level="1"
        :only-one-node="onlyOneNode"
        :clone-node-drag="cloneNodeDrag"
        :node-draging="nodeDragMove"
        :before-drag-end="beforeDragEnd"
        :node-drag-end="nodeDragEnd"
        :toolBar="toolBar"
        :filterNodeMethod="filterNodeMethod"
        @on-contextmenu="onMenus"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
        @on-node-dblclick="onNodeDblclick"
        @on-node-copy="onNodeCopy"
      >
        <template v-slot="{node}">
            <div class="tree-org-node__text node-label">{{node.label}}</div>
        </template>
        <template v-slot:expand="{node}">
          <div>{{node.children.length}}</div>
        </template>
      </zm-tree-org>
    </div>
  </div>
</template>
<script>
import { mockdata } from "./mockdata.js";
export default {
  data() {
    return {
      toolBar: {
        scale: false
      },
      keyword: "",
      data: {
        id: 1,
        label: "xxx科技有限公司",
        children: [
          {
            id: 2,
            pid: 1,
            label: "产品研发部",
            style: { color: "#fff", background: "#108ffe" },
            expand: false,
            children: [
              {
                id: 6,
                pid: 2,
                label: "禁止编辑节点",
                disabled: true
              },
              {
                id: 7,
                pid: 2,
                label: "研发-后端"
              },
              {
                id: 8,
                pid: 2,
                label: "禁止拖拽节点",
                noDragging: true
              },
              {
                id: 9,
                pid: 2,
                label: "产品经理"
              },
              {
                id: 10,
                pid: 2,
                label: "测试"
              }
            ]
          },
          {
            id: 3,
            pid: 1,
            label: "客服部",
            children: [
              {
                id: 11,
                pid: 3,
                label: "客服一部"
              },
              {
                id: 12,
                pid: 3,
                label: "客服二部"
              }
            ]
          },
          {
            id: 4,
            pid: 1,
            label: "业务部"
          },
          {
            id: 5,
            pid: 1,
            label: "人力资源中心"
          }
        ]
      },
      horizontal: false,
      collapsable: true,
      onlyOneNode: false,//仅拖动当前节点
      cloneNodeDrag: false,//是否拷贝节点拖拽 false仅拖拽  true拷贝+保留原位
      expandAll: true,
      disaled: false,
      style: { color: "rgb(56 50 50)", background: "#fff" },
      treeScope: false,
      //弹窗
      pop: false,
      //card组件信息
      cardOne: {},
    };
  },
  created() {
    this.getInitData()
    // this.toggleExpand(this.data, this.expandAll);
  },
  methods: {
    //动态赋值
    terFun(node) {
      console.log(node)
      if (node.disabled || this.disaled) { this.menus = [{ name: '复制文本', command: 'copy' }] } else {
        this.menus = [{ name: '复制文本', command: 'copy' }, { name: '新增节点', command: 'add' }, { name: '编辑节点', command: 'edit1' }, { name: '删除节点', command: 'delete' }]
      }
    },
    //右侧菜单点击事件
    onMenus({ node, command }) {
      //自定义编辑--弹窗编辑
      let labelOld = node.label
      if (command === 'edit1' && this.pop && !node.disabled) {
        this.$prompt('修改当前信息', '编辑', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: labelOld
        }).then((val) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          // this.editFun(this.data.children, node, val.value)
          this.$set(node, 'label', val.value)
        }).catch(action => {
          if (action === 'cancel') {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          }
        });
        //当前不允许编辑
      } else if (node.disabled && command === 'edit1') {
        this.$message({
          type: 'info',
          message: '当前内容不可编辑'
        });
        //自定义编辑--card
      } else if (command === 'edit1' && !this.pop && !node.disabled) {
        this.$set(node, 'open', true)
        this.cardOne = node
        this.treeScope = true
      }
    },
    //自定义修改属性值
    editFun(data, node, val) {
      if (!data || !data.length) {
        return;
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === node.id) {
          data[i].label = val;
          break;
        }
        this.editFun(data[i].children, node, val);
      }
    },
    //确定 关闭car界面
    close(val) {
      this.$delete(val, 'open')
      this.treeScope = false
    },
    //颠倒编辑外区域，关闭
    closeO(event) {
      var currentCli = document.getElementById("lateId");
      if (currentCli) {
        if (!currentCli.contains(event.target)) {
          this.treeScope = false;
        }
      }
    },
    //自定义card显示
    filter() {
      this.$refs.tree.filter(this.keyword);
    },
    filterNodeMethod(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //展开事件
    onExpand(e, data) {
    },
    nodeDragMove(data) {
    },
    nodeDragEnd(data, isSelf) {
      // isSelf && this.$Message.info("移动到自身");
    },
    //点击节点
    onNodeClick(e, data) {
      // this.$Message.info(data.label);
    },
    onNodeDblclick() {
      // this.$Message.info("双击节点");
    },
    onNodeCopy() {
      // this.$Message.success("复制成功");
    },
    handleNodeAdd(node) {
      // this.$Message.info("新增节点");
    },
    expandChange() {
      this.toggleExpand(this.data, this.expandAll);
    },
    //递归创建节点树
    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          this.$set(item, "expand", val);
          if (item.children) {
            this.toggleExpand(item.children, val);
          }
        });
      } else {
        this.$set(data, "expand", val);
        if (data.children) {
          this.toggleExpand(data.children, val);
        }
      }
    },




    // 获取初始化数据
    async getInitData() {
      this.dataList = await this.getInitDataAPI()
    },
    getInitDataAPI() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockdata);
        }, 1000);
      });
    },
  }
};
</script>
  <style scoped>
.pickers {
  display: flex;
}

.node {
  position: relative;
}

.nodeOne {
  height: 800px;
}

.late {
  position: absolute;
  top: 20px;
  right: -100px;
  width: 200px;
  min-height: 100px;
  z-index: 999;
  background: #f2e2be;
  padding: 10px;
}

.onCloseCss {
  width: 50px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: #108ffe;
  margin: 10px auto;
  z-index: 999;
}

::v-deep .is-edit {
  background: palegoldenrod !important;
}
</style>