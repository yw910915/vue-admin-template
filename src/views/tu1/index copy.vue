<template>
  <div style="overflow:auto;margin:60px">
    <el-button style="position: absolute; top: 0;" @click="clickGeneratePicture">下载</el-button>
    <vue2-org-tree
      :data="dataList"
      :horizontal="!horizontal"
      :collapsable="collapsable"
      :label-class-name="labelClassName"
      :render-content="renderContent"
      ref="imageDom"
      @on-expand="onExpand"
      @on-node-click="onNodeClick"
      @on-node-focus="onNodeFocus"
      @on-node-mouseover="onNodeMouseover"
      @on-node-mouseout="onNodeMouseout"
      @on-node-drag-start="onDragStart"
      @on-node-drag-over="onDragOver"
      @on-node-drop="onDrop"
    />
    <el-dialog title="预览" :visible.sync="dialogVisible" width="50%">
      <span>
        <img style="width: 100%;" :src="imgUrl" alt />
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">
          <a :href="imgUrl" download="组织架构.png" style="color: #fff;">下载</a>
        </el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogclick" width="30%">
      <span>
        <el-input v-model="childreninput"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogclick = false">取 消</el-button>
        <el-button type="primary" @click="dialogclicks(treeData)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template> 
 
 
<script>
import _ from "lodash";
import { mockdata } from "./mockdata.js";
export default {
  name: "TreeTest",
  data() {
    return {
      treeData: mockdata,
      dataList: {}, // 模板绑定的数据
      horizontal: false, // 横版 竖版
      collapsable: false, // 子节点是否可折叠的
      expandAll: true, // 是否全部展开
      labelClassName: "bg-gray", // 默认颜色
      scrollTreeStyle: "width:100%;height:100%", // 行内样式
      imgUrl: "", // 转换base64存放
      dialogVisible: false, // 预览盒子
      dialogclick: false,
      childreninput: null
    };
  },
  // 开启拖拽的指令
  // directives: {
  //   drag: {
  //     // 指令的定义
  //     bind: function (el) {
  //       const odiv = el // 获取当前元素
  //       odiv.onmousedown = (e) => {
  //         // 算出鼠标相对元素的位置
  //         const disX = e.clientX - odiv.offsetLeft
  //         const disY = e.clientY - odiv.offsetTop
  //         document.onmousemove = (e) => {
  //           // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
  //           const left = e.clientX - disX
  //           const top = e.clientY - disY
  //           // 移动当前元素
  //           odiv.style.left = left + 'px'
  //           odiv.style.top = top + 'px'
  //         }
  //         document.onmouseup = (e) => {
  //           document.onmousemove = null
  //           document.onmouseup = null
  //         }
  //       }
  //     }
  //   }
  // },
  mounted() {
    this.getList();
  },

  methods: {
    // 以下是base64图片生成
    clickGeneratePicture() {
      // this.dialogVisible = true
      // html2canvas(this.$refs.imageDom.$el).then(canvas => {
      //   // 转成图片，生成图片地址
      //   this.imgUrl = canvas.toDataURL('image/png')
      // })
    },

    getList() {
      // 后台回去的数据 赋值给data即可
      this.dataList = this.treeData[0];
    },
    // {data.isShowAddBtn ? <template><i class="el-icon-circle-plus-outline topAddIcon" style="position:absolute" onClick={(e)=> this.onClickTopAdd(e, data)}></i><i class="el-icon-circle-plus-outline bottomAddIcon" style="position:absolute" onClick={(e)=> this.onClickBottomAdd(e, data)}></i></template>: null}

    // {data.isShowAddBtn ? <i class="el-icon-circle-plus-outline topAddIcon" style="position:absolute" onClick={(e)=> this.onClickTopAdd(e, data)}></i>: null}
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
    getRenderDom(data) {
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
      // console.log(data, "renderContent____________________________________--");
      return (
        <div style="margin:5px">
          <div class="label" style="display: inline-block;">
            {data.label}
          </div>
          <i class="el-icon-s-comment"></i>
          {/*JSON.stringify(data)*/}
          {this.getRenderDom(data)}
          {data.id == "833333" ? this.getTableData() : ""}
        </div>
      );
    },
    // <div>
    //   <el-popover
    //     placement="bottom"
    //     width="225"
    //     trigger="click">
    //     <div style="text-align: right; margin: 0">
    //       <el-button size="mini" type="primary" onClick={(v) => this.onClick(v, data)}>编辑</el-button>
    //       <el-button size="mini" type="primary" onClick={(v) => this.onClick(v, data)}>新增子节点</el-button>
    //       <el-button type="primary" size="mini" onClick={(v) => this.onerror(v, data)}>删除</el-button>
    //     </div>
    //     <div slot="reference">
    //       <div><img src={ data.sorted === 2 ? require('../../icons/svg/user.svg') : require('../../icons/svg/user.svg') } style={{ height: '20px', width: '20px' }}></img></div>
    //       <div class="label">{data.label}</div>
    //     </div>
    //   </el-popover>
    // </div>
    onClick(v, data) {
      console.log();
      this.dialogclick = true;
    },
    dialogclicks(item) {},
    onerror(v, data) {
      console.log(data);
    },
    onExpand(e, data) {
      const _this = this;
      if ("expand" in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          _this.collapse(data.children);
        }
      } else {
        _this.$set(data, "expand", true);
      }
    },
    // 自定义您的点击事件
    onNodeClick(e, data) {
      // alert("点击");
    },
    collapse(list) {
      var _this = this;
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false;
        }
        child.children && _this.collapse(child.children);
      });
    },
    expandChange() {
      this.collapsable = true;
      this.toggleExpand(this.data, this.expandAll);
    },
    toggleExpand(data, val) {
      var _this = this;
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, "expand", val);
          if (item.children) {
            _this.toggleExpand(item.children, val);
          }
        });
      } else {
        this.$set(data, "expand", val);
        if (data.children) {
          _this.toggleExpand(data.children, val);
        }
      }
    },
    // ----------------------------
    onNodeFocus() {},
    onNodeMouseover(e, item) {
      console.log("onNodeMouseover", e, item);
      // debugger
      const { target, fromElement } = e;
      const { id } = item;
      function addFieldToTree(treeArray, id, fieldName) {
        let data = [...treeArray]
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
      const temp = [{...this.dataList}]
      const da = addFieldToTree(temp, id, "isShowAddBtn")[0];

      if (target?.className.includes("org-tree-node-label-inner")) {
        target.classList.add("hover-border");
        this.dataList = da;
      }
      if (fromElement?.className.includes("org-tree-node-label-inner")) {
        fromElement.classList.add("hover-border");
        this.dataList = da;
      }
      if (target?.className.includes("el-icon-circle-plus-outline")) {
        // fromElement.offsetParent.classList.add("hover-border");
        this.dataList = da;
      }
      // if (fromElement?.className.includes("el-icon-circle-plus-outline")) {
      //   fromElement.classList.add("hover-border");
      //   this.dataList = da;
      // }
    },
    onNodeMouseout(e, item) {
      console.log("onNodeMouseout", e, item);
      const { target, fromElement } = e;
      function addFieldToTree(treeArray, fieldName, fieldValue = false) {
        let data = [...treeArray]
        data.forEach(item => {
          item[fieldName] = fieldValue;

          if (item.children && Array.isArray(item.children)) {
            addFieldToTree(item.children, fieldName, fieldValue);
          }
        });
        return data;
      }
      const temp = [{...this.dataList}]
      const da = addFieldToTree(temp, "isShowAddBtn")[0];


      if (target?.className.includes("org-tree-node-label-inner")) {
        target.classList.remove("hover-border");
        this.dataList = da;
      }
      if (fromElement?.className.includes("org-tree-node-label-inner")) {
        fromElement.classList.remove("hover-border");
        this.dataList = da;
      }
      if (target?.className.includes("el-icon-circle-plus-outline")) {
        this.dataList = da;
      }
      if (fromElement?.className.includes("el-icon-circle-plus-outline")) {
        this.dataList = da;
      }
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
      this.dataList = {
        sorted: 1,
        children: [
          // 拖拽后
          {
            sorted: 1,
            children: [
              {
                sorted: 1,
                children: [],
                id: 833333,
                label: "3.1佛挡杀佛东方饭店水电费的司法送达放大",
                type: "0",
                parentId: 10,
                desc: ""
              }
            ],
            id: 10,
            label: "2.2通融通融一桶一桶一体盆通一通i圆通(拖拽后2变成1)",
            type: "0",
            parentId: 9,
            desc: ""
          },
          {
            sorted: 1,
            children: [
              {
                sorted: 1,

                id: 83,
                label: "3.1附件房剑荡四方较大说法较大生发剂放大司马法打撒",
                type: "0",
                parentId: 10,
                desc: ""
              }
            ],
            id: 10,
            label: "2.1发生的疯疯癫癫更容易破塔月卡拖拉很尬",
            type: "0",
            parentId: 9,
            desc: ""
          }
        ],
        id: 9,
        label: "1.0福建师范束带结发都开始法大大大大大放大",
        type: "0",
        parentId: null,
        desc: ""
      };
    },

    onClickTopAdd(e, data) {
      e.stopPropagation();
      console.log(e, "onClickTopAdd", data);
    },
    onClickBottomAdd(e, data) {
      e.stopPropagation();
      console.log(e, "onClickBottomAdd", data);
    }
  }
};
</script>
 
<style lang="less">
.bg-gray {
  color: gray;
  box-shadow: none !important;
}
// .org-tree-container {
//   position: relative; /*定位*/
//   top: 0;
//   left: 0;
// }
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
input {
  -webkit-user-select: auto; /*webkit浏览器*/
}
textarea {
  -webkit-user-select: auto; /*webkit浏览器*/
}

// 更改样式
.org-tree-node-label-inner {
  border: 1px solid #ccc;
  background: #f5f7fa69;
  position:relative;
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
</style>