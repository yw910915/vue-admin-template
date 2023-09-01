<template>
  <vue2-org-tree
    :data="dataList"
    :horizontal="!horizontal"
    :collapsable="collapsable"
    :label-class-name="labelClassName"
    :render-content="renderContent"
    @on-node-click="onNodeClick"
    @on-node-mouseover="onNodeMouseover"
    @on-node-mouseout="onNodeMouseout"
    @on-node-mouseenter="onNodeMouseenter"
    @on-node-mouseleave="onNodeMouseleave"
    @on-node-drag-start="onDragStart"
    @on-node-drag-over="onDragOver"
    @on-node-drop="onDrop"
  />
</template> 
 
 
<script>
import vue2OrgTree from "../vue-org-tree/components/org-tree.vue";
import _ from "lodash";
export default {
  name: "vueOrgTree",
  components: { vue2OrgTree },
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {
      dataList: {}, // 模板绑定的数据
      horizontal: false, // 横版 竖版
      collapsable: false, // 子节点是否可折叠的
      expandAll: true, // 是否全部展开
      labelClassName: "bg-gray", // 默认颜色
      scrollTreeStyle: "width:100%;height:100%", // 行内样式
      imgUrl: "", // 转换base64存放

      dialogclick: false,
      childreninput: null,
      currentId: "",

      showTemp: false // 临时显影设置
    };
  },
  watch: {
    list: {
      handler(val) {
        if (val && val.length > 0) {
          this.dataList = val[0];
        }
      },
      immediate: true
    }
  },
  mounted() {},

  methods: {
    getTableData() {
      const tableData = [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        }
      ];
      return (
        <el-table data={tableData} style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          ></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      );
    },
    // 上下增加按钮dom
    getNodeAddDom(data) {
      const vnode = [];
      if (data.isShowAddBtn) {
        vnode.push(
          <i
            class="el-icon-circle-plus-outline topAddIcon"
            style="position:absolute"
            onClick={e => this.onClickTopAdd(e, data)}
          ></i>
        );
        vnode.push(
          <i
            class="el-icon-circle-plus-outline bottomAddIcon"
            style="position:absolute"
            onClick={e => this.onClickBottomAdd(e, data)}
          ></i>
        );
        if (data.showTopAddStutas) {
          vnode.push(
            <a-button-group size="small" class="top-add-btn">
              <a-button onClick={e => this.clickSameLever(e, data, "top")}>
                同级
              </a-button>
              <a-button onClick={e => this.clickChildLever(e, data, "top")}>
                子级
              </a-button>
            </a-button-group>
          );
        }
        if (data.showBottomAddStutas) {
          vnode.push(
            <a-button-group size="small" class="bottom-add-btn">
              <a-button onClick={e => this.clickSameLever(e, data, "bottom")}>
                同级
              </a-button>
              <a-button onClick={e => this.clickChildLever(e, data, "bottom")}>
                子级
              </a-button>
            </a-button-group>
          );
        }
      }
      return vnode;
    },
    // 以下是自定义编辑删除新增
    renderContent(h, data) {
      // console.log(data, "renderContent___________________________________");
      const id = `renderid_${data.key}`;
      return (
        <div style="margin:5px;" id={id}>
          <div class="label" style="display: inline-block;min-width:80px">
            {data.title}
          </div>
          <i class="el-icon-s-comment"></i>
          {/*JSON.stringify(data)*/}
          {this.getNodeAddDom(data)}
          {/*data.key == "833333" ? this.getTableData() : ""*/}
        </div>
      );
    },
    // 自定义的点击事件
    async onNodeClick(e, data, dataList) {
      // 打开右侧弹框
      this.$emit("onNodeClick", data, this.dataList);
    },
    // 鼠标移入
    onNodeMouseover(e, item) {},
    // 鼠标移出
    onNodeMouseout(e, item) {},
    // 移入
    onNodeMouseenter(e, item) {
      console.log(e, "onNodeMouseenter", item);
      const { target, fromElement } = e;
      const { key } = item;
      // 新方式
      // 获取第一次进来的节点id
      if (!this.currentId || this.currentId != key) {
        this.currentId = key;
      }
      //获取当前节点的父节点
      const domid = `renderid_${this.currentId}`;
      const firstId = document.getElementById(domid);
      let parentNode = firstId.parentNode;
      // 给父节节点加边框
      parentNode.classList.add("hover-border");
      function addFieldToTree(treeArray, key, fieldName) {
        let data = [...treeArray];
        data.forEach(item => {
          if (item.key == key) {
            item[fieldName] = true;
          } else {
            item[fieldName] = false;
          }
          if (item.children && Array.isArray(item.children)) {
            addFieldToTree(item.children, key, fieldName);
          }
        });
        return data;
      }
      const temp = [{ ...this.dataList }];
      // const temp = [_.cloneDeep(this.dataList)];
      const da = addFieldToTree(temp, this.currentId, "isShowAddBtn")[0];
      this.dataList = da;
    },
    onNodeMouseleave(e, item) {
      console.log(e, "onNodeMouseleave", item);
      const { target, fromElement } = e;
      const { key } = item;
      //获取当前节点的父节点
      const domid = `renderid_${key}`;
      const firstId = document.getElementById(domid);
      let parentNode = firstId.parentNode;
      // 移除的是当前节点则取消边框
      if (this.currentId == key) {
        parentNode.classList.remove("hover-border");
      }
      function editFieldToTree(treeArray, fieldName, fieldValue = false) {
        let data = [...treeArray];
        data.forEach(item => {
          item[fieldName] = fieldValue;
          // 同级和子级状态处理
          if (item.showTopAddStutas) {
            item.showTopAddStutas = false;
          }
          if (item.showBottomAddStutas) {
            item.showBottomAddStutas = false;
          }

          if (item.children && Array.isArray(item.children)) {
            editFieldToTree(item.children, "isShowAddBtn");
          }
        });
        return data;
      }
      const temp = [_.cloneDeep(this.dataList)];
      const da = editFieldToTree(temp, "isShowAddBtn")[0];
      this.dataList = da;

      this.showTemp = false;
    },
    onDragStart(e, data) {
      console.log(e, "onDragStart", data);
    },
    onDragOver(e, data) {
      console.log(e, "onDragOver", data);
    },
    onDrop(e, dragPre, dragCurr) {
      console.log(e, "onDrop", dragPre, dragCurr);
      // type,sorted,parentId,label,isShowAddBtn,key,desc,children
      // this.dataList = {
      //   sorted: 1,
      //   children: [
      //     // 拖拽后
      //     {
      //       sorted: 1,
      //       children: [
      //         {
      //           sorted: 1,
      //           children: [],
      //           key: 833333,
      //           label: "3.1佛挡杀佛东方饭店水电费的司法送达放大",
      //           type: "0",
      //           parentId: 10,
      //           desc: ""
      //         }
      //       ],
      //       key: 10,
      //       label: "2.2通融通融一桶一桶一体盆通一通i圆通(拖拽后2变成1)",
      //       type: "0",
      //       parentId: 9,
      //       desc: ""
      //     },
      //     {
      //       sorted: 1,
      //       children: [
      //         {
      //           sorted: 1,

      //           key: 83,
      //           label: "3.1附件房剑荡四方较大说法较大生发剂放大司马法打撒",
      //           type: "0",
      //           parentId: 10,
      //           desc: ""
      //         }
      //       ],
      //       key: 10,
      //       label: "2.1发生的疯疯癫癫更容易破塔月卡拖拉很尬",
      //       type: "0",
      //       parentId: 9,
      //       desc: ""
      //     }
      //   ],
      //   key: 9,
      //   label: "1.0福建师范束带结发都开始法大大大大大放大",
      //   type: "0",
      //   parentId: null,
      //   desc: ""
      // };
    },

    onClickTopAdd(e, item) {
      e.stopPropagation();
      console.log(e, "onClickTopAdd", item);
      const { target, fromElement } = e;
      const { key } = item;
      // alert("点击增加上");
      function addFieldToTree(treeArray, key, fieldName) {
        let data = [...treeArray];
        data.forEach(item => {
          if (item.key == key) {
            item[fieldName] = true;
          } else {
            item[fieldName] = false;
          }
          if (item.children && Array.isArray(item.children)) {
            addFieldToTree(item.children, key, fieldName);
          }
        });
        return data;
      }
      const temp = [{ ...this.dataList }];
      const da = addFieldToTree(temp, key, "showTopAddStutas")[0];
      this.dataList = da;
    },
    onClickBottomAdd(e, item) {
      e.stopPropagation();
      console.log(e, "onClickBottomAdd", item);
      const { target, fromElement } = e;
      const { key } = item;
      // alert("点击增加下");
      function addFieldToTree(treeArray, key, fieldName) {
        let data = [...treeArray];
        data.forEach(item => {
          if (item.key == key) {
            item[fieldName] = true;
          } else {
            item[fieldName] = false;
          }
          if (item.children && Array.isArray(item.children)) {
            addFieldToTree(item.children, key, fieldName);
          }
        });
        return data;
      }
      const temp = [{ ...this.dataList }];
      const da = addFieldToTree(temp, key, "showBottomAddStutas")[0];
      this.dataList = da;

      this.showTemp = true;
    },
    // 同级 按钮点击
    clickSameLever(e, item, type) {
      e.stopPropagation();
      console.log(e, "clickSameLever____同级", item, type);
      const { key } = item;
      
      function addNodeAfterIndex(treeData, targetId) {
        // 递归遍历树形结构数据
        function traverse(node, parentId, currentIndex, parentNode) {
          if (node.key == parentId) {
            // 找到匹配的节点
            if (!parentNode.children) {
              parentNode.children = [];
            }
            // 生成新的key
            let newKey = ''
            if(String(node.key).indexOf('-')> -1) {
              let lenArr = node.key.split('-')
              // const lastKeyNum = Number(lenArr[lenArr.length - 1]) + 1
              // 临时自增加大，后面调整
              const lastKeyNum = Number(lenArr[lenArr.length - 1]) + 100

              lenArr[lenArr.length - 1] = lastKeyNum
              newKey = lenArr.join('-')
            } else {
              newKey = Number(node.key)
            }
            let newNode = {
              key: newKey,
              title: " "
            };
            // 在当前索引的后面插入新节点
            parentNode.children.splice(currentIndex + 1, 0, newNode);
          } else if (node.children) {
            // 继续遍历子节点
            for (let i = 0; i < node.children.length; i++) {
              traverse(node.children[i], parentId, i, node);
            }
          }
        }

        // 找到树中的根节点
        for (let i = 0; i < treeData.length; i++) {
          traverse(treeData[i], targetId, -1, null);
        }

        return treeData;
      }
      const temp = [{ ...this.dataList }];
      const da = addNodeAfterIndex(temp, key)[0];
      this.dataList = da

    },
    // 子级 按钮点击
    clickChildLever(e, item, type) {
      e.stopPropagation();
      console.log(e, "clickChildLever____子级", item, type);
      const { key } = item;
      function addTreeChild(treeArray, key) {
        let data = [...treeArray];
        data.forEach(item => {
          if (item.key == key) {
            const curChildLength = item.children ? item.children.length : 0;
            const addChildren = {
              key: `${key}-${curChildLength + 1}`,
              title: " "
            };
            if(item.children && item.children.length>0) {
                item.children = [...item.children,addChildren]
            } else {
                Object.assign(item, {
                    children: [addChildren]
                })
            }
          }
          if (item.children && Array.isArray(item.children)) {
            addTreeChild(item.children, key);
          }
        });
        return data;
      }
      const temp = [{ ...this.dataList }];
      const da = addTreeChild(temp, key)[0];
      this.dataList = da
    },
    async expandClick() {
      // this.showDetailvisible = !this.showDetailvisible;
      // const data = await this.getDetailMockdata();
      // this.$nextTick(() => {
      //   this.$refs.orgRightDetail.setDetailData(data);
      // });
    },
    getDetailMockdata() {
      return new Promise(resolve => {
        setTimeout(() => {
          const data = {
            title: "5.1.1建立主控与辅助厂房402房间方式方法水电费地方",
            content: [
              {
                title: "设备名称",
                dataIndex: "name",
                value: "11111",
                componentType: "input"
              },
              {
                title: "设备名称22",
                dataIndex: "name111",
                value: "1",
                componentType: "select",
                optionList: [
                  { label: "正常", value: "1" },
                  { label: "异常", value: "2" }
                ]
              },
              {
                title: "设备名称",
                dataIndex: "name",
                value: "11111",
                componentType: "input"
              },
              {
                title: "设备名称",
                dataIndex: "name",
                value: "11111",
                componentType: "input"
              },
              {
                title: "设备名称",
                dataIndex: "name",
                value: "11111",
                componentType: "input"
              }
            ]
          };
          resolve(data);
        }, 500);
      });
    }
  }
};
</script>
 
<style lang="scss">
// 更改样式
.org-tree-node-label-inner {
  border: 1px solid #ccc;
  background: #f5f7fa69;
  position: relative;
  padding: 0 !important;
}
.hover-border {
  border: 1px solid #005aff;
}
.topAddIcon {
  top: -12px;
  left: calc(50% - 12px);
  color: #005aff;
  font-size: 24px;
  cursor: pointer;
  z-index: 900;
}
.bottomAddIcon {
  bottom: -13px;
  left: calc(50% - 12px);
  color: #005aff;
  font-size: 24px;
  cursor: pointer;
  z-index: 900;
}
// 同级和子级
.top-add-btn {
  position: absolute;
  top: -13px;
  left: calc(50% - 47px);
  color: #005aff;
  cursor: pointer;
  z-index: 1000;
}
.bottom-add-btn {
  position: absolute;
  bottom: -13px;
  left: calc(50% - 47px);
  color: #005aff;
  cursor: pointer;
  z-index: 1000;
}
</style>