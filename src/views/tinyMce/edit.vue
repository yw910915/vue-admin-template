<template>
  <div class="tinymce-editor">

    111
    <!-- <Editor id="uTinymce" v-if="reloading" v-model="myValue" :init="init" @onClick="onClick"></Editor> -->

    <Editor id="uTinymce" v-model="myValue" :init="init" @onClick="onClick"></Editor>
  </div>
</template>
   
  <script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import '/public/tinymce/themes/silver/theme.min.js'
import '/public/tinymce/skins/ui/oxide/skin.min.css'
import '/public/tinymce/langs/zh_CN.js'
import "/public/tinymce/icons/default";



export default {
  components: {
    Editor
  },
  
  data() {
    return {
      //初始化配置
      myValue: '',
      init: {
        selector: '#uTinymce',
        height: 500,
        language: 'zh_CN',
        skin_url: '/public/tinymce/skins/ui/oxide/skin.min.css'
        // language_url: '../../../public/tinymce/langs/zh_CN.js',
      },
    }
  },
  props: {
    visible: Boolean,
  },
  computed: {
    showEditor() {
      return this.visible
    }
  },
  // watch: {
  //   'showEditor': {
  //     handler() {

  //     }
  //   }
  // },
  mounted() {
    // tinymce.remove('#uTinymce');
    tinymce.init({})
    // tinymce.init({
    //   selector: '#uTinymce',
    //     height: 500,
    //     language: 'zh_CN',
    //     skin_url: '/public/tinymce/skins/ui/oxide/skin.min.css',
    //   auto_focus: true
    // });
    // this.initATabsChangeAutoReload()
  },
  methods: {
    // init() {
    //   tinymce.init({});
    // },
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    initATabsChangeAutoReload() {
      // 获取父级
      let modal = this.getVmParentByName(this,'ADrawer')
      if(modal){
        this.reload();
      }
    },
    reload() {
      this.reloading = true
      this.$nextTick(() => this.reloading = false)
    },
    /** * 根据组件名获取父级 *
     * @param vm * @param name * @returns {Vue | null|null|Vue}
     *
     */
     getVmParentByName(vm, name) {
      let parent = vm.$parent;
      if (parent && parent.$options) {
        if (parent.$options.name === name) {
          return parent;
        } else {
          let res = this.getVmParentByName(parent, name);
          if (res) {
            return res;
          }
        }
      }
      return null;
    }
  },
  destroyed() {
    // const tinymce = window.tinymce.get(this.tinymceId)
    // if (tinymce) {
    //   tinymce.destroy()
    // }
    // tinymce.activeEditor.destroy();
  }
};
</script>
  <style scoped>
</style>
  