<template>
  <div>
    <div
      id="mainContent"
      style="height: 800px; border:1px solid #eee"
    >
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
      >
       <!-- 利用插槽实现自定义节点 -->
        <template v-slot="{node}">
          <div class="card-main">
            <div :class="node.isRoot?'top-position top-position-root':'top-position'">
              <div
                v-if="!node.isRoot"
                @click="handleChangeNode($event,node,'before')"
              ><i class="el-icon-arrow-left" /></div>
              <div>{{ node.department }}</div>
              <div
                v-if="!node.isRoot"
                @click="handleChangeNode($event,node,'after')"
              ><i class="el-icon-arrow-right" /></div>
            </div>
            <!-- <div class="top-position">{{ node.department }}</div> -->
            <div class="p-title">{{ node.operation }}</div>
            <div class="p-people">
              <div class="p-peopleName">
                <div
                  v-if="node.name"
                  class="p-cicle"
                >{{ getNameCicle(node.name,node) }}</div>
                <template v-else>
                  <div class="p-cicle p-cicle-empty"><span>虚位</span><span>以待</span></div>
                </template>

                <div class="p-name">{{ node.name }}</div>
              </div>
            </div>
            <div :class="node.isRoot ? 'operation-btn operation-root-btn' :'operation-btn'">
              <div @click="onNodeHandleBtn('add',node)">
                <!-- <i class="iconfont icon-tianjia" /> -->
                <a-icon type="plus-circle" />
              </div>
              <!-- root节点只支持添加 -->
              <template v-if="!node.isRoot">
                <el-popover
                  :ref="`popover-${node.id}`"
                  placement="bottom"
                  trigger="click"
                  :append-to-body="false"
                  :popper-options="{ boundariesElement: 'body', gpuAcceleration: false,}"
                  popper-class="customCont"
                >
                  <div class="customCont-main">
                    <div
                      class="customCont-main-close"
                      @click="closePopover(`popover-${node.id}`)"
                    >
                      <!-- <i class="el-icon-close" /> -->
                      <a-icon type="shrink" />
                    </div>
                    <div
                      v-if="node.children && node.children.length"
                      class="organization"
                    >
                      <div
                        v-for="(item,index) in node.children"
                        :key="index"
                        class="organization-list"
                      >
                        <div class="organization-list-top">{{ item.department }}</div>
                        <div class="organization-list-content">{{ item.name }}</div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="organization organization-empty"
                    >
                      <div class="organization-empty-info">
                        暂无消息
                      </div>
                    </div>
                  </div>
                  <div slot="reference">
                    <i class="iconfont icon-zuzhijiagou" />
                  </div>
                </el-popover>
                <div @click="onNodeHandleBtn('edit',node)">
                  <!-- <i class="iconfont icon-bianjishuru-xianxing" /> -->
                  <a-icon type="edit" />
                </div>
                <div @click="onNodeDeleteBtn(node)">
                  <!-- <i class="iconfont icon-shanchu" /> -->
                  <a-icon type="delete" />
                </div>
              </template>
            </div>
          </div>
        </template>
      </zm-tree-org>
    </div>
    <el-dialog
      :title="dialogType==='add' ? '新增部门' :'编辑部门'"
      :visible.sync="dialogVisible"
      custom-class="custom-dialog"
      center
    >
      <el-input
        v-model="departmentName"
        autocomplete="off"
        placeholder="部门名称（50字内）"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handelDepartment"
        >保 存</el-button>
      </div>
    </el-dialog>
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
} from "./common";
export default {
  data() {
    return {
      toolBar: {
        scale: false,
      },
      data: {
        id: 1,
        department: "某某某死扣的公司",
        operation: "管理员",
        name: "哈哈哈哈",
        isRoot: true,
        children: [
          {
            id: 2,
            pid: 1,
            department: "产品研发部",
            operation: "研发主管",
            name: "张三",
            children: [
              {
                id: 3,
                pid: 2,
                department: "科技创新中心",
                operation: "研发-前端",
                name: "前端哈",
              },
            ],
          },
          {
            id: 4,
            pid: 1,
            department: "销售部",
            operation: "销售主管",
            name: "李四",
            children: [
              {
                id: 5,
                pid: 4,
                department: "销售一部",
                operation: "销售1",
                name: "李四1",
              },
              {
                id: 6,
                pid: 4,
                department: "销售二部",
                operation: "销售2",
                name: "李四2",
              },
            ],
          },
          {
            id: 7,
            pid: 1,
            department: "财务部",
            operation: "财务总监",
            name: "王二",
            children: [
              {
                id: 8,
                pid: 7,
                department: "销售一部",
                operation: "销售1",
                name: "李四1",
              },
              {
                id: 9,
                pid: 7,
                department: "销售二部",
                operation: "销售2",
                name: "李四2",
                children: [
                  {
                    id: 10,
                    pid: 9,
                    department: "销售一部",
                    operation: "销售1",
                    name: "李四1",
                  },
                  {
                    id: 11,
                    pid: 9,
                    department: "销售二部",
                    operation: "销售2",
                    name: "李四2",
                    children: [
                      {
                        id: 12,
                        pid: 11,
                        department: "销售一部",
                        operation: "销售1",
                        name: "李四1",
                      },
                      {
                        id: 13,
                        pid: 11,
                        department: "销售二部",
                        operation: "销售2",
                        name: "李四2",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      horizontal: false, // 是否横向
      collapsable: true, // 是否可展开收起
      onlyOneNode: false, // 是否仅拖动当前节点
      cloneNodeDrag: false, // 是否拷贝节点拖拽
      expandAll: true, //
      dialogVisible: false, // 弹框显隐
      dialogType: "", // 弹框类型
      departmentName: "", // 部门名称
      nodeTree: "", // 当前点击的nodeTree
    };
  },
  methods: {
    handleOnNodeDelete,
    // 隐藏左键菜单
    defineMenus() {
      return [];
    },

    // 截取名字
    getNameCicle(name, node) {
      const len = name && name.length;
      return name && len && name.slice(len - 2, len);
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
        this.departmentName = node.department;
      }
    },

    // 弹框保存按钮
    handelDepartment() {
      // 添加
      if (this.dialogType === "add") {
        const params = {
          id: Math.ceil(Math.random() * 1000 + 100),
          pid: this.nodeTree.id,
          level: this.nodeTree.level || -1,
          operation: "职位",
          name: "",
          department: this.departmentName,
        };
        if (Array.isArray(this.nodeTree["children"])) {
          this.nodeTree["children"].push(params);
        } else {
          this.$set(this.nodeTree, "children", [].concat(params));
        }
        // 编辑
      } else {
        this.$set(this.nodeTree, "department", this.departmentName);
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
      // 部门无职位信息
      const tips =
        node.children && node.children.length
          ? `<div>系统检测到该部门下仍有相关职位信息，请转移/删除对应职位后再试！</div>`
          : `<div>您确定要删除部门：<span style="color:#0469c0">${node.department}</span> 吗？</div>`;
      _this
        .$alert(tips, "提示", {
          dangerouslyUseHTMLString: true,
          customClass: "deleteDailog",
          showCancelButton: !(node.children && node.children.length),
          showConfirmButton: !(node.children && node.children.length),
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then(async () => {
          try {
            const parentNode = getParentNode(this.data, "id", node.pid);
            handleOnNodeDelete(this, node, parentNode);
          } catch (error) {
            _this.$message({
              type: "error",
              message: "操作失败，请重试！",
            });
          }
        })
        .catch(() => {});
    },

    // 同级部门交换节点
    handleChangeNode(e, node, type) {
      e.stopPropagation();
      const resultData = [].concat(this.data);
      if (type === "before") {
        // 判断是否有前面兄弟节点
        const isHasBeforNode = getBeforeBrotherNode(resultData, node, type);
        if (!isHasBeforNode?.id) {
          // 前面无兄弟节点
          return false;
        } else {
          // 有兄弟节点 进行交换处理
          const _data = Object.assign(
            {},
            { ...changeBeforeNode(resultData, isHasBeforNode, node) }
          )[0];
          this.$nextTick(() => {
            this.$set(
              this.data,
              "children",
              JSON.parse(JSON.stringify(_data.children))
            );
          });
          this.$message({
            message: "操作成功！",
            type: "success",
          });
        }
      } else {
        // 判断后面是否有兄弟节点
        const isHasAfterNode = getAfterBrotherNode(resultData, node, type);
        if (!isHasAfterNode?.id) {
          return false;
        } else {
          const _data = Object.assign(
            {},
            changeAfterNode(resultData, isHasAfterNode, node)
          )[0];
          this.$nextTick(() => {
            this.$set(
              this.data,
              "children",
              JSON.parse(JSON.stringify(_data.children))
            );
          });
          this.$message({
            message: "操作成功！",
            type: "success",
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/* 每个节点样式 */
.card-main {
  min-width: 15vw;
  font-size: 12px;
  .top-position {
    background-color: #899cc1;
    color: #ffffff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .top-position-root {
    justify-content: center;
  }
  .p-title {
    color: #868686;
    padding: 15px 0;
  }
  .p-people {
    display: flex;
    justify-content: space-evenly;
    .p-peopleName {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .p-cicle {
      background: rgba(4, 45, 124, 0.5);
      color: #ffffff;
      border-radius: 42px 42px 42px 42px;
      width: 48px;
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .p-cicle-empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 20px;
    }
    .p-name {
      color: #000000;
      min-height: 13.8px;
    }
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
/* 新增部门弹框 */
.custom-dialog {
  width: 18%;
  .el-dialog__header {
    border-bottom: 1px solid #e8e8e8;
    .el-dialog__title {
      font-size: 14px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      font-weight: 600;
    }
  }
  .el-dialog__body {
    .el-input.is-active .el-input__inner,
    .el-input__inner:focus {
      border-color: #042d7c;
      outline: 0;
    }
  }

  .dialog-footer {
    text-align: center;
    .el-button {
      background: #042d7c;
      color: #ffffff;
    }
  }
  .error-tips {
    font-size: 12px;
    color: #f56c6c;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
  }
}
.tree-org-node__inner:hover {
  box-shadow: 2px 2px 5px rgba(4, 45, 124, 0.55);
}
/* 删除部门弹框 */
.deleteDailog {
  min-width: 30vw;
  .el-message-box__header {
    border-bottom: 1px solid #e8e8e8;
  }
  .el-message-box__message {
    text-align: center;
  }

  /* .el-message-box__btns {
    .el-button:focus,
    .el-button:hover {
      color: #606266;
      border-color: #dcdfe6;
      background-color: #ffffff;
    }
    .el-button--primary {
      background-color: #042d7c;
      border-color: #042d7c;
    }
    .el-button--primary:focus,
    .el-button--primary:hover {
      background-color: #042d7c;
      color: #ffffff;
      border-color: #042d7c;
    }
  } */
}
</style>

