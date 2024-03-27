
<template>
  <div ref="replayModal">
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal v-if="showvisible" :visible.sync="visible" :getContainer="()=>$refs.replayModal" :destroyOnClose="true" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <myEditor ref="myEditor"></myEditor>
    </a-modal>
    <!-- <el-dialog
        title="提示"
        :visible.sync="visible"
        width="30%"
    >
        <myEditor></myEditor>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="visible = false">确 定</el-button>
        </span>
    </el-dialog> -->
  </div>
</template>
  <script>
import myEditor from "./edit.vue";
export default {
  components: { myEditor },
  data() {
    return {
      visible: false,
      showvisible: false
    };
  },
  methods: {
    showModal() {
        this.showvisible = true
      this.visible = true;
    //   this.$nextTick(()=> {
    //     this.$refs.myEditor.init()
    //   })
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    
  }
};
</script>