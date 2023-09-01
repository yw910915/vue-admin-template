<template>
  <div class="org-page-container">
    <siderMenu :dataList="dataList"></siderMenu>
    <div class="org-page-middle">
      <vueOrgTree :list="dataList" @onNodeClick="onNodeClick" />
      <div class="org-page-middle-expand" @click="expandClick">
        <a-icon type="caret-left" />
      </div>
    </div>
    <div class="org-page-right">
      <orgRightDetail ref="orgRightDetail" v-model="showDetailvisible" />
    </div>
  </div>
</template> 
 
 
<script>
import siderMenu from "./components/siderMenu.vue";
import vueOrgTree from "./components/vueOrgTree.vue";
import orgRightDetail from "./components/orgRightDetail.vue";
import { mockdata } from "./mockdata.js";
import _ from "lodash";
export default {
  name: "TreeTest",
  components: { siderMenu, vueOrgTree,orgRightDetail },
  data() {
    return {
      dataList: [],
      
      // 右侧
      showDetailvisible: false
    };
  },
  created() {
    this.getInitData()
  },

  methods: {
    // 点击节点
    async onNodeClick(value) {
      this.showDetailvisible = true
      const data = await this.getDetailMockdataApi();
      this.$nextTick(() => {
        this.$refs.orgRightDetail.setDetailData(data);
      });
    },
    // 点击右侧展开按钮
    async expandClick() {
      this.showDetailvisible = !this.showDetailvisible;
      const data = await this.getDetailMockdataApi();
      this.$nextTick(() => {
        this.$refs.orgRightDetail.setDetailData(data);
      });
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
    // 获取右侧数据
    getDetailMockdataApi() {
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
.org-page-container {
  height: calc(100vh - 50px);
  // height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  .org-page-middle {
    flex: 1;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    .org-page-middle-expand {
      width: 10px;
      height: 40px;
      border-radius: 4px 0 0 4px;
      background: #ccc;
      position: absolute;
      right: 0;
      top: calc(50% - 20px);
      cursor: pointer;
      line-height: 40px;
      i {
        font-size: 14px;
      }
    }
  }
  .org-page-right {
    height: 100%;
  }
}

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

</style>