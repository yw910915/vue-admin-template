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

    };
  },
  watch: {
    list: {
       handler(val) {
        if(val && val.length>0) {
          this.dataList = val[0]
        }
       },
       immediate: true
    }
  },
  mounted() {
  },

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
      }
      return vnode;
    },
    // 以下是自定义编辑删除新增
    renderContent(h, data) {
      // console.log(data, "renderContent___________________________________");
      const id = `renderid_${data.id}`;
      return (
        <div style="margin:5px;" id={id}>
          <div class="label" style="display: inline-block;">
            {data.title }
          </div>
          <i class="el-icon-s-comment"></i>
          {/*JSON.stringify(data)*/}
          {this.getNodeAddDom(data)}
          {data.id == "833333" ? this.getTableData() : ""}
        </div>
      );
    },
    // 自定义的点击事件
    async onNodeClick(e, data) {
      // 打开右侧弹框
      this.$emit('onNodeClick',data)
    },
    // 鼠标移入
    onNodeMouseover(e, item) {},
    // 鼠标移出
    onNodeMouseout(e, item) {},
    // 移入
    onNodeMouseenter(e,item) {
      console.log(e, 'onNodeMouseenter',item)
      const { target, fromElement } = e;
      const { id } = item;
      // 新方式
      // 获取第一次进来的节点id
      if (!this.currentId || this.currentId != id) {
        this.currentId = id;
      }
      //获取当前节点的父节点
      const domid = `renderid_${this.currentId}`;
      const firstId = document.getElementById(domid);
      let parentNode = firstId.parentNode;
      // 给父节节点加边框
      parentNode.classList.add("hover-border");
      function addFieldToTree(treeArray, id, fieldName) {
        let data = [...treeArray];
        data.forEach(item => {
          if (item.id == id) {
            item[fieldName] = true;
          } else {
            item[fieldName] = false;
          }
          if (item.children && Array.isArray(item.children)) {
            addFieldToTree(item.children, id, fieldName);
          }
        });
        return data;
      }
      const temp = [{ ...this.dataList }];
      // const temp = [_.cloneDeep(this.dataList)];
      const da = addFieldToTree(temp, this.currentId, "isShowAddBtn")[0];
      this.dataList = da;

    },
    onNodeMouseleave(e,item) {
      console.log(e, 'onNodeMouseleave',item)
      const { target, fromElement } = e;
      const { id } = item;
      //获取当前节点的父节点
      const domid = `renderid_${id}`;
      const firstId = document.getElementById(domid);
      let parentNode = firstId.parentNode;
      // 移除的是当前节点则取消边框
      if (this.currentId == id) {
        parentNode.classList.remove("hover-border");
      }
      function editFieldToTree(treeArray, fieldName, fieldValue = false) {
        let data = [...treeArray];
        data.forEach(item => {
          item[fieldName] = fieldValue;

          if (item.children && Array.isArray(item.children)) {
            editFieldToTree(item.children, "isShowAddBtn");
          }
        });
        return data;
      }
      const temp = [_.cloneDeep(this.dataList)];
      const da = editFieldToTree(temp, "isShowAddBtn")[0];
      this.dataList = da;
    },
    onDragStart(e, data) {
      console.log(e, "onDragStart", data);
    },
    onDragOver(e, data) {
      console.log(e, "onDragOver", data);
    },
    onDrop(e, dragPre, dragCurr) {
      console.log(e, "onDrop", dragPre, dragCurr);
      // type,sorted,parentId,label,isShowAddBtn,id,desc,children
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
      //           id: 833333,
      //           label: "3.1佛挡杀佛东方饭店水电费的司法送达放大",
      //           type: "0",
      //           parentId: 10,
      //           desc: ""
      //         }
      //       ],
      //       id: 10,
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

      //           id: 83,
      //           label: "3.1附件房剑荡四方较大说法较大生发剂放大司马法打撒",
      //           type: "0",
      //           parentId: 10,
      //           desc: ""
      //         }
      //       ],
      //       id: 10,
      //       label: "2.1发生的疯疯癫癫更容易破塔月卡拖拉很尬",
      //       type: "0",
      //       parentId: 9,
      //       desc: ""
      //     }
      //   ],
      //   id: 9,
      //   label: "1.0福建师范束带结发都开始法大大大大大放大",
      //   type: "0",
      //   parentId: null,
      //   desc: ""
      // };
    },

    onClickTopAdd(e, data) {
      e.stopPropagation();
      console.log(e, "onClickTopAdd", data);
      // alert("点击增加上");
    },
    onClickBottomAdd(e, data) {
      e.stopPropagation();
      console.log(e, "onClickBottomAdd", data);
      // alert("点击增加下");
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

</style>