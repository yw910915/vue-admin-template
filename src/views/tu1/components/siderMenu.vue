<template>
  <div class="cus-side-memu">
    <div class="serch">
      <a-input-search placeholder="输入关键字进行过滤"></a-input-search>
    </div>
    <div>
      <a-directory-tree
        ref="menuTree"
        :tree-data="treeArr"
        node-key="id"
        blockNode
        default-expand-all
        @select="handleClick"
        @expand="onExpand"
      >
        <template slot="title" slot-scope="{title}">
          <span>{{ title }}</span>
        </template>
      </a-directory-tree>
    </div>
  </div>
</template>
<script>
export default {
  name: "siderMenu",
  components: {},
  props: {
    dataList: {
      type: Array
    }
  },
  data() {
    return {
      treeArr: []
    };
  },
  watch: {
    dataList: {
       handler(val) {
        this.treeArr = val
       },
       immediate: true
    }
  },
  methods: {
    handleClick(keys, event) {
      console.log("Trigger Select", keys, event);
    },
    onExpand() {
      console.log("Trigger Expand");
    }
  }
};
</script>
<style lang="less" scoped>
.cus-side-memu {
  width: 240px;
  padding: 10px;
  background: #cccccc14;
  .serch {
    margin: 10px 5% 0 5%;
  }
  /deep/ .ant-tree li .ant-tree-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    width: 90%;
  }
}
</style>
  