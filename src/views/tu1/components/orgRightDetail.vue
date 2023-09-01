<template>
  <div class="org-right-container" v-show="visible">
    <!-- <div class="title">{{title}}</div> -->
    <a-input class="title" v-model="currentData.title" allow-clear />
    <div class="split-line"></div>
    <div class="btn-img">
      <div class="btn-img-item" v-for="(item,index) in arrImg" :key="index">
        <a-icon :type="item" />
      </div>
    </div>
    <div class="edit-content">
      <div class="edit-content-item" v-for="(item,index) in currentData.content" :key="index">
        <div class="edit-content-item-title">
          <div class="edit-content-item-title-left">
            <span>{{item.title}}</span>
            <a-icon type="edit" style="color:#1890ff;margin-left:2px" />
          </div>
          <div class="edit-content-item-title-right">
            <a-icon type="delete" />
          </div>
        </div>
        <a-input v-if="item.componentType == 'input'" v-model="item.value" class="edit-content-item-content" placeholder="input with clear icon" allow-clear />
        <a-select
            style="width:100%"
            class="edit-content-item-content"
            v-if="item.componentType == 'select'"
            v-model="item.value"
            :options="item.optionList"
            :allow-clear="true"
            :get-popup-container="(triggerNode)=>triggerNode.parentNode"
            v-bind="item.props"
            v-on="item.event"
        />
      </div>
    </div>
    <div class="other-option">
      <div class="title">其他操作</div>
      <div class="other-option-btn">
        <a-button style size="small" type="link" disabled>前一步骤</a-button>
        <a-button style size="small" type="link">并行步骤</a-button>
        <a-button style size="small" type="link">跳转步骤</a-button>
        <a-button style size="small" type="link">互拆步骤</a-button>
        <a-button style size="small" type="link">升级</a-button>
        <a-button style size="small" type="link">降级</a-button>
        <a-button style size="small" type="link">插入子集</a-button>
        <a-button style size="small" type="link">插入子集</a-button>
      </div>
    </div>
    <div class="bottom-btn">
      <a-button block>新增属性</a-button>
      <div class="del-save">
        <a-button style="flex:1" @click="del">删除</a-button>
        <a-button style="flex:1;margin-left: 10px;" type="primary" @click="save">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orgRightDetail',
  props: {
    showDetailvisible: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "showDetailvisible",
    event: "hide"
  },
  computed: {
    visible: {
      get() {
        return this.showDetailvisible;
      },
      set(val) {
        this.$emit("hide", val);
      }
    }
  },
  data() {
    return {
      arrImg: [
        "menu-fold",
        "border-outer",
        "radius-bottomleft",
        "menu-fold",
        "border-outer",
        "radius-bottomleft",
        "radius-bottomleft",
        "menu-fold",
        "border-outer",
        "radius-bottomleft",
        "radius-bottomleft",
        "menu-fold",
        "border-outer",
        "radius-bottomleft",
      ],
      currentData: {}, // 当前所有的数据
    };
  },

  methods: {
    setDetailData(data,dataList) {
      if (!this.showDetailvisible) return;
      const { title, content } = data;
      this.title = title;
      this.contentList = content || [];
      this.currentData = data
    },
    del() {
      console.log(this.currentData, 'currentData____del')
      this.$emit('del', this.currentData)
    },
    save() {
      console.log(this.currentData, 'currentData____del')
      this.$emit('save', this.currentData)
    }
  }
};
</script>
<style scoped lang='scss'>
.org-right-container {
  width: 250px;
  background: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  position: relative;
  .title {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  .btn-img {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 5px 0;
    &-item {
      margin-right: 5px;
    }
  }
  .edit-content {
    height: calc(100% - 255px);
    overflow: auto;
    &-item {
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-left {
        }
      }
      &-content {
        margin-top: 5px;
        width:100%；
      }
    }
  }
  .other-option {
    margin-bottom: 100px;
    &-btn {
      margin: -7px;
      display: inline-flex;
      flex-wrap: wrap;
      align-items: flex-start;
      // ::v-deep .ant-btn-block {
      //     // width: none;
      // }
    }
  }
  .bottom-btn {
    height: 75px;
    width: 220px;
    position: absolute;
    bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .del-save {
      display: flex;
      justify-content: space-between;
    }
  }

  .split-line {
    width: 100%;
    height: 1px;
    background: #ccc;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    opacity: 0.2;
    background: #ccc;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: #ccc;
  }
}
</style>

