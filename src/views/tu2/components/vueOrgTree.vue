<template>
  <div style="width:100%;height:100%;position:relative">
    <a-switch
      style="position:absolute;top:5px;left:5px;z-index: 100;"
      checked-children="横向"
      un-checked-children="纵向"
      @change="(value) => this.horizontal = value"
      :checked="horizontal"
    />
    <div id="mainContent" style="height: 800px; border:1px solid #eee">
      <zm-tree-org
        ref="treeRefs"
        node-key="id"
        :data="data"
        :horizontal="horizontal"
        :collapsable="collapsable"
        :node-draggable="true"
        :only-one-node="onlyOneNode"
        :clone-node-drag="cloneNodeDrag"
        :tool-bar="toolBar"
        :default-expand-level="5"
        :define-menus="defineMenus"
        :node-delete="handleOnNodeDelete"
        :selectedKey="'mynodeActive'"
        :selectedClassName="'node-active-my'"
        @on-node-click="onNodeClick"
      >
        <template v-slot="{node}">
          <div class="card-main">
            <div class="p-title">{{ node.title }}</div>
            <!-- <div v-if="node.type" class="p-content">{{ node.content }}</div> -->
            <div v-if="node.tableSlot" class="p-content">
              <a-table
                style="width:400px"
                :columns="node.tableSlot.columns"
                :data-source="node.tableSlot.data"
              ></a-table>
            </div>
            <div v-if="node.imgSlot" class="p-content">
              <img :style="node.imgSlot.styles" :src="node.imgSlot.imgSrc" />
            </div>
            <div :class="'operation-btn'">
              <div @click="onNodeHandleBtn('add_same',node)">
                <a-popover>
                  <template slot="content">
                    <p>同级添加</p>
                  </template>
                  <a-icon type="plus-circle" />
                </a-popover>
              </div>
              <div @click="onNodeHandleBtn('add_level',node)">
                <a-popover>
                  <template slot="content">
                    <p>子级添加</p>
                  </template>
                  <a-icon type="plus" />
                </a-popover>
              </div>
              <div @click="onNodeHandleBtn('edit',node)">
                <a-popover>
                  <template slot="content">
                    <p>编辑</p>
                  </template>
                  <a-icon type="edit" />
                </a-popover>
              </div>
              <div @click="onNodeDeleteBtn(node)">
                <a-popover>
                  <template slot="content">
                    <p>删除</p>
                  </template>
                  <a-icon type="delete" />
                </a-popover>
              </div>
            </div>
          </div>
        </template>
      </zm-tree-org>
    </div>
    <a-modal v-model="dialogVisible" :title="dialogType.includes('add') ? '新增' :'编辑'" @ok="handelDepartment">
      <a-input v-model="departmentName" allow-clear placeholder="请输入内容" />
    </a-modal>
  </div>
</template>
<script>
import {
  getParentNode,
  getBeforeBrotherNode,
  getAfterBrotherNode,
  changeBeforeNode,
  changeAfterNode,
  handleOnNodeDelete,
  findParentNodeAndIndex,
  addNodeToTree
} from "../utils/common";
// import zmTreeOrg from './zmTreeOrg/src.index'
export default {
  // components: { zmTreeOrg },
  data() {
    return {
      toolBar: {
        scale: false
      },
      data: {
        id: 1,
        title: "某某某的公司",
        isRoot: true,
        children: [
          {
            id: 2,
            pid: 1,
            title: "产品研发部",
            type: "text",
            mynodeActive: true,
            children: [
              {
                id: 3,
                pid: 2,
                type: "text",
                // title: "科技创新中心",
                tableSlot: {
                  name: "风险分析",
                  key: "table298332838",
                  type: "table",
                  columns: [
                    {
                      title: "序号",
                      align: "center",
                      width: 60,
                      customRender: (text, record, index) => {
                        return `${index + 1}`;
                      }
                    },
                    {
                      dataIndex: "name",
                      key: "name",
                      title: "name"
                    },
                    {
                      title: "Age",
                      dataIndex: "age",
                      key: "age"
                    },
                    {
                      title: "Address",
                      dataIndex: "address",
                      key: "address"
                    }
                  ],
                  data: [
                    {
                      key: "1",
                      name: "John Brown",
                      age: 32,
                      address: "New York No. 1 Lake Park"
                    },
                    {
                      key: "2",
                      name: "Jim Green",
                      age: 42,
                      address: "London No. 1 Lake Park"
                    },
                    {
                      key: "3",
                      name: "Joe Black",
                      age: 32,
                      address: "Sidney No. 1 Lake Park"
                    }
                  ]
                }
              }
            ]
          },
          {
            id: 4,
            pid: 1,
            title: "销售部",
            children: [
              {
                id: 5,
                pid: 4,
                // title: "销售一部",
                imgSlot: {
                  name: "图片测试",
                  id: "img2392383292",
                  type: "img",
                  imgSrc: require("../../../assets/404_images/404.png"),
                  styles: {
                    width: "250px",
                    height: "150px"
                  }
                }
              },
              {
                id: 6,
                pid: 4,
                title: "销售二部",
              }
            ]
          },
          {
            id: 7,
            pid: 1,
            title: "财务部",
            children: [
              {
                id: 8,
                pid: 7,
                title: "销售一部",
                content: "李四1"
              },
              {
                id: 9,
                pid: 7,
                title: "销售二部",
                content: "李四2",
                children: [
                  {
                    id: 10,
                    pid: 9,
                    title: "销售一部",
                    content: "李四1"
                  },
                  {
                    id: 11,
                    pid: 9,
                    title: "销售二部",
                    content: "李四2",
                    children: [
                      {
                        id: 12,
                        pid: 11,
                        title: "销售一部",
                        content: "李四1"
                      },
                      {
                        id: 13,
                        pid: 11,
                        title: "销售二部",
                        content: "李四2"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      horizontal: true, // 是否横向
      collapsable: true, // 是否可展开收起
      onlyOneNode: false, // 是否仅拖动当前节点
      cloneNodeDrag: false, // 是否拷贝节点拖拽
      expandAll: true, //
      dialogVisible: false, // 弹框显隐
      dialogType: "", // 弹框类型
      departmentName: "", // 部门名称
      nodeTree: "" // 当前点击的nodeTree
    };
  },
  methods: {
    onNodeClick(e,node) {
      console.log(e,node, 'onNodeClick')
    },
    handleOnNodeDelete,
    // 隐藏左键菜单
    defineMenus() {
      return [];
    },

    // 关闭组织架构
    closePopover(refs) {
      document.body.click();
    },

    // 增加/编辑部门节点
    onNodeHandleBtn(type, node) {
      this.dialogType = type;
      this.dialogVisible = true;
      this.nodeTree = node;
      if (type === "edit") {
        this.departmentName = node.title;
      }
    },

    // 弹框保存按钮
    handelDepartment() {
      // 添加
      if (this.dialogType.includes("add")) {
        if (this.dialogType.includes("level")) {
          // 子级添加
          const params = {
            id: Math.ceil(Math.random() * 1000 + 100),
            pid: this.nodeTree.id,
            level: this.nodeTree.level || -1,
            content: "",
            title: this.departmentName
          };
          if (Array.isArray(this.nodeTree["children"])) {
            this.nodeTree["children"].push(params);
          } else {
            this.$set(this.nodeTree, "children", [].concat(params));
          }
        } else {
          // 同级添加
          console.log("同级");
          // 找改同级的父节点id
          const paramsItem = {
            id: Math.ceil(Math.random() * 1000 + 100),
            pid: this.nodeTree.pid, // 找改同级的父节点id
            level: this.nodeTree.level - 1 || -1,
            content: "",
            title: this.departmentName
          };
          const tempData = [_.cloneDeep(this.data)];
          const da = addNodeToTree(tempData, this.nodeTree.id, paramsItem, 'right')
          console.log(da)
          this.data = da[0]
        }
      } else {
        // 编辑
        this.$set(this.nodeTree, "title", this.departmentName);
      }
      this.dialogVisible = false;
      this.departmentName = "";
    },

    // 删除部门节点
    onNodeDeleteBtn(node) {
      const _this = this;
      if (node.root) {
        // 根节点不允许删除
        this.$Message.warning("根节点不允许删除!");
        return false;
      }
      const parentNode = getParentNode(this.data, "id", node.pid);
      handleOnNodeDelete(this, node, parentNode);

    }

  }
};
</script>
<style lang="scss" scoped>
.node-active-my {
  border:1px solid red;
  color: green;
}
/* 每个节点样式 */
.card-main {
  min-width: 15vw;
  font-size: 12px;
  // .top-position {
  //   background-color: #899cc1;
  //   color: #ffffff;
  //   padding: 10px;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  // }
  // .top-position-root {
  //   justify-content: center;
  // }
  .p-title {
    color: #868686;
    padding: 15px 0;
  }
  .p-content {
    display: flex;
    justify-content: space-evenly;
    color: #000000;
    min-height: 13.8px;
  }

  .operation-btn {
    display: flex;
    justify-content: space-between;
    background: #f9f9f9;
    height: 40px;
    padding: 0 10px;
    align-items: center;
    margin-top: 15px;
    position: relative;
  }
  .operation-root-btn {
    justify-content: flex-end;
  }
}
/* 节点操作按钮 */
.iconfont {
  font-size: 20px;
  color: #878787;
}
/* popover样式 */
.operation-btn ::v-deep.customCont {
  background: #e2f4e9;
  margin-top: 15px;
  .popper__arrow::after {
    border-bottom-color: #e2f4e9;
  }
}
.customCont-main {
  position: relative;

  &-close {
    position: absolute;
    z-index: 10;
    top: -5px;
    right: 0;
    .el-icon-close:before {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
.organization {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px 18px;
  min-width: 30vw;
}
.organization-list {
  font-size: 12px;
  min-height: 80px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 18px;
  width: 45%;

  &-top {
    background: rgba(42, 178, 98, 0.88);
    color: #ffffff;
    padding: 10px;
    text-align: center;
  }
  &-content {
    padding: 20px;
    color: #000000;
    background: #ffffff;
  }
}
.organization-empty {
  min-width: 20vw;
  min-height: 50px;
  padding: 0;

  &-info {
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #000000;
  }
}
</style>
<style lang="scss">
.zm-tree-handle {
  bottom: 110px;
}
/* 新增部门弹框 */
// .custom-dialog {
//   width: 18%;
//   .el-dialog__header {
//     border-bottom: 1px solid #e8e8e8;
//     .el-dialog__title {
//       font-size: 14px;
//     }
//     .el-dialog__headerbtn .el-dialog__close {
//       font-weight: 600;
//     }
//   }
//   .el-dialog__body {
//     .el-input.is-active .el-input__inner,
//     .el-input__inner:focus {
//       border-color: #042d7c;
//       outline: 0;
//     }
//   }

//   .dialog-footer {
//     text-align: center;
//     .el-button {
//       background: #042d7c;
//       color: #ffffff;
//     }
//   }
//   .error-tips {
//     font-size: 12px;
//     color: #f56c6c;
//     line-height: 1;
//     padding-top: 4px;
//     position: absolute;
//   }
// }
// .tree-org-node__inner:hover {
//   box-shadow: 2px 2px 5px rgba(4, 45, 124, 0.55);
// }
// /* 删除部门弹框 */
// .deleteDailog {
//   min-width: 30vw;
//   .el-message-box__header {
//     border-bottom: 1px solid #e8e8e8;
//   }
//   .el-message-box__message {
//     text-align: center;
//   }
// }
</style>

