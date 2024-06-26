<template>
  <div ref="zm-tree-org" class="zm-tree-org">
    <div
      ref="zoom"
      class="zoom-container"
      :class="{'is-center': center && !horizontal}"
      :style="zoomStyle"
      @wheel="zoomWheel"
    >
      <zm-draggable
        :x="left"
        :y="top"
        :class="{ dragging: autoDragging }"
        @dragging="onDrag"
        @dragstop="onDragStop"
        :draggable="draggable"
        :drag-cancel="dragCancel"
      >
        <div :class="horizontal? 'heng': 'zong'">
            <div ref="tree-org" class="tree-org" :class="{horizontal, collapsable}">
              <tree-org-node
                :data="data"
                :props="keys"
                :lazy="lazy"
                :key="nodeKey"
                :suffix="suffix"
                :horizontal="horizontal"
                :label-style="labelStyle"
                :collapsable="collapsable"
                :default-expand-level="defaultExpandLevel"
                :render-content="renderContent"
                :label-class-name="labelClassName"
                v-nodedrag.l.t="nodeargs"
                @on-expand="handleExpand"
                @on-node-click="handleClick"
                @on-node-dblclick="handleDblclick"
                @on-node-mouseenter="nodeMouseenter"
                @on-node-mouseleave="nodeMouseleave"
                @on-node-contextmenu="nodeContextmenu"
                @on-node-focus="(e, data) => { $emit('on-node-focus', e, data)}"
                @on-node-blur="handleBlur"
              >
              <template v-if="$scopedSlots.default" v-slot="{node}">
                <slot :node="node"></slot>
              </template>
              <template v-if="$scopedSlots.expand" v-slot:expand="{node}">
                <slot name="expand" :node="node"></slot>
              </template>
              </tree-org-node>
            </div>
        </div>
      </zm-draggable>
    </div>
    <template v-if="tools">
      <div class="zm-tree-handle">
        <div v-if="tools.scale" class="zm-tree-percent">{{zoomPercent}}</div>
        <div v-if="tools.expand" @click="expandChange" :title="expandTitle" class="zm-tree-handle-item">
          <span class="zm-tree-svg">
            <i :class="['treefont', expanded ? 'icon-collapse' : 'icon-expand']"></i>
          </span>
        </div>
        <div v-if="tools.zoom" @click="enlargeOrgchart" title="放大" class="zm-tree-handle-item zoom-out">
          <span class="zm-tree-icon">+</span>
        </div>
        <div v-if="tools.zoom" @click="narrowOrgchart" title="缩小" class="zm-tree-handle-item zoom-in">
          <span class="zm-tree-icon">-</span>
        </div>
        <div v-if="tools.restore" @click="restoreOrgchart" title="还原" class="zm-tree-handle-item">
          <span class="zm-tree-restore"></span>
        </div>
        <div v-if="tools.fullscreen" @click="handleFullscreen" :title="fullTiltle" class="zm-tree-handle-item">
          <span class="zm-tree-svg">
            <i :class="['treefont', fullscreen ? 'icon-unfullscreen' : 'icon-fullscreen']"></i>
          </span>
        </div>
      </div>
    </template>
    <clone-org
      v-if="nodeDraggable"
      v-show="nodeMoving"
      :props="keys"
      :data="cloneData" 
      :horizontal="horizontal"
      :label-style="labelStyle"
      :collapsable="collapsable"
      :render-content="renderContent"
      :label-class-name="labelClassName"
    >
    <template v-if="$scopedSlots.default" v-slot="{node}">
      <slot :node="node"></slot>
    </template>
    <template v-if="$scopedSlots.expand" v-slot:expand="{node}">
      <slot name="expand" :node="node"></slot>
    </template>
    </clone-org>
    <zm-contextmenu
      v-if="nodeMenus.length"
      :visible.sync="contextmenu"
      :x="menuX"
      :y="menuY"
      :node="menuData"
      :data="data"
      :props="keys"
      :menus="nodeMenus"
      :disabled="disabled"
      :node-add="nodeAdd"
      :node-delete="nodeDelete"
      :node-edit="nodeEdit"
      :node-copy="nodeCopy"
      @contextmenu="(arg) => { $emit('on-contextmenu', arg) }"
      @on-node-copy="(txt) => { $emit('on-node-copy', txt)}"
      @on-node-delete="(node, parentNode) => { $emit('on-node-delete', node, parentNode)}"
       />
  </div>
</template>

<script type="text/babel">
  import render from './node';
  import zmDraggable from "../../components/zm-draggable/index.vue"
  import cloneOrg from "../../components/clone-org"
  import ZmContextmenu from "../../components/contextmenu"
  import drag from "../../directives/drag/index.js"
  import { menus } from "../../components/contextmenu/menus"
  import { randomString } from "../../utils/fns"
  export default {
    name: 'ZmTreeOrg',
    components: {
      cloneOrg,
      zmDraggable,
      ZmContextmenu,
      TreeOrgNode: {
        render,
        functional: true
      }
    },
    directives: {
      // 自定义指令
      nodedrag: drag,
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      center: Boolean,
      props: {
        type: Object,
        default: () => ({
          id: "id",
          pid: "pid",
          label: 'label',
          expand: 'expand',
          children: 'children'
        })
      },
      toolBar:{
        type:[Object, Boolean],
        default: ()=>({
          expand: true,
          scale: true,
          zoom: true,
          restore: true,
          fullscreen: true,
        })
      },
      disabled:{ // 是否禁用编辑
        type: Boolean,
        default: false
      },
      draggable:{ // 是否可拖拽移动位置
        type: Boolean,
        default: true
      },
      draggableOnNode: { // 是否可拖拽节点移动位置
        type: Boolean,
        default: false
      },
      nodeDraggable: { // 节点是否可拖拽
        type: Boolean,
        default: true
      },
      cloneNodeDrag: { // 拷贝并拖拽节点
        type: Boolean,
        default: true
      },
      onlyOneNode: { // 是否仅拖动当前节点
        type: Boolean,
        default: true
      },
      clickDelay: { // 是否仅拖动当前节点
        type: Number,
        default: 260
      },
      scalable: { // 是否可缩放
        type: Boolean,
        default: true
      },
      lazy: Boolean,
      load: Function,
      defaultExpandLevel: Number,
      beforeDragEnd: Function,
      horizontal: Boolean,
      selectedKey: String,
      collapsable: Boolean,
      renderContent: Function,
      filterNodeMethod: Function,
      labelStyle: Object,
      labelClassName: [Function, String],
      selectedClassName: [Function, String],
      defineMenus: {
        type: [Array, Function],
        default() {
          return menus;
        },
      },
      nodeAdd: Function,
      nodeDelete: Function,
      nodeEdit: Function,
      nodeCopy: Function,
    },
    data(){
      return {
        treeData:{},
        keys:{
          id: "id",
          pid: "pid",
          label: 'label',
          expand: 'expand',
          children: 'children'
        },
        tools:{
          expand: true,
          scale: true,
          zoom: true,
          restore: true,
          fullscreen: true,
        },
        autoDragging: false,
        scale: 1,
        left: 0,
        top: 0,
        expanded: false,
        fullscreen: false,
        nodeMoving: false,
        cloneData:{},
        copyText:"",
        contextmenu: false,
        nodeMenus: [],
        menuData:{},
        menuX: 0,
        menuY: 0,
        stopClick: false,
        nodeKey: +new Date(),
        suffix: randomString(6),
        timer: null,
      }
    },
    computed:{
      zoomStyle() {
        const { scale } = this;
        return {
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          transform: `scale(${scale})`,
        };
      },
      zoomPercent(){
        return `${Math.round(this.scale * 100)}%`
      },
      dragCancel(){
        return this.draggableOnNode && !this.nodeDraggable ? '' : `.tree-org-node__content:not(.is-root_${this.suffix})>.tree-org-node__inner`
      },
      expandTitle(){
        return this.expanded ? "收起全部节点" : "展开全部节点";
      },
      fullTiltle(){
        return this.fullscreen ? "退出全屏" : "全屏";
      },
      nodeargs(){
        return {
          drag: this.nodeDraggable,
          beforeDragEnd: this.beforeDragEnd
        }
      }
    },
    watch:{
      horizontal(){
        // 改变架构图方向时，防止溢出边界
        this.$nextTick(() => {
          this.onDragStop(this.left, this.top);
        });
      }
    },
    created(){
      this.keys = Object.assign(this.keys, this.props);
      if(typeof this.toolBar === 'object') {
        Object.assign(this.tools, this.toolBar);
      } else if(!this.toolBar){
        this.tools = false;
      }
    },
    methods:{
      onDrag(x, y) {
        this.dragging = true;
        this.stopClick = true;
        this.autoDragging = false;
        this.left = x;
        this.top = y;
        this.$emit('on-drag', {x, y})
      },
      onDragStop(x, y) {
        // 防止拖拽出边界
        this.dragging = false;
        const zoom = this.$refs.zoom;
        const orgchart = this.$refs["tree-org"];
        const maxY = zoom.clientHeight / 2;
        let maxX = zoom.clientWidth / 2;
        let minY = zoom.clientHeight - orgchart.clientHeight;
        let minX = zoom.clientWidth - orgchart.clientWidth;
        if (minY > 0) {
          minY = 0;
        }
        if (minX > 0) {
          minX = 0;
        }
        if (this.center) {
          const deviation = (zoom.clientWidth - orgchart.clientWidth) / 2
          minX = minX - deviation
          maxX = maxX - deviation
        }
        if (x > maxX) {
          this.left = maxX;
        } else if (x < minX) {
          this.left = minX;
        } else {
          this.left = x;
        }
        if (y < minY) {
          this.top = minY;
        } else if (y > maxY) {
          this.top = maxY;
        } else {
          this.top = y;
        }
        this.$emit('on-drag-stop', {x, y})
        setTimeout(() => {
          this.stopClick = false;
        }, 200)
      },
      nodeMouseenter(e, data){
        if (this.nodeMoving) {
          this.parenNode = data;
        }
        this.$emit('on-node-mouseenter', e, data)
      },
      nodeMouseleave(e, data){
        if (this.nodeMoving) {
          this.parenNode = null;
        }
        this.$emit('on-node-mouseleave', e, data)
      },
      nodeContextmenu(e, data){
        e.stopPropagation();
        e.preventDefault();
        if (Array.isArray(this.defineMenus)) {
          this.nodeMenus = this.defineMenus
        } else if (typeof this.defineMenus === 'function') {
          this.nodeMenus = this.defineMenus(e, data) || []
        }
        this.contextmenu = true;
        this.menuX = e.clientX;
        this.menuY = e.clientY;
        this.menuData = data;
        
      },
      zoomWheel(e) {
        if(!this.scalable) return;
        e.preventDefault();
        // 鼠标滚轮缩放
        if (e.deltaY > 0) {
          this.narrowOrgchart();
        } else {
          this.enlargeOrgchart();
        }
        this.$emit('on-zoom', this.scale)
      },
      enlargeOrgchart() {
        if(!this.scalable) return;
        // 鼠标滚轮向上滚动放大
        if (Number(this.scale) < 3) {
          let scale = Number(this.scale) + 0.1;
          this.scale = Number(scale).toFixed(1);
        }
      },
      narrowOrgchart() {
        if(!this.scalable) return;
        // 鼠标滚轮向下滚动缩小
        if (Number(this.scale) > 0.3) {
          let scale = Number(this.scale) - 0.1;
          this.scale = Number(scale).toFixed(1);
        }
      },
      restoreOrgchart(){
        this.scale = 1;
        this.left = 0;
        this.top = 0;
      },
      autoDrag(el, left, top) {
        // 计算偏移量，保持根节点相对页面位置不变
        this.autoDragging = true;
        this.dragging = false;
        if (!this.center || this.horizontal) {
          const x = el.offsetLeft - left
          this.left -= x;
        }
        const y = el.offsetTop - top;
        this.top -= y;
      },
      handleClick(e, data){
        // 由于鼠标事件执行顺序
        // mouseover--> mousedown-->mouseup-->click -->mouseout
        // 拖拽时会触发node-click
        // 通过 stopClick 判断，如果执行了拖拽，则不再执行node-click
        if (this.stopClick) return;
        // 取消上次延时未执行的方法
        clearTimeout(this.timer);
        //执行延时
        this.timer = setTimeout(() => {
          //此处为单击事件要执行的代码
          this.$emit('on-node-click', e, data)
        }, this.clickDelay);
      },
      handleDblclick(e, data){
        // 取消上次延时未执行的方法
        clearTimeout(this.timer);
        //此处为单击事件要执行的代码
        this.$emit('on-node-dblclick', e, data)
      },
      handleExpand(e, data) {
        e.stopPropagation();
        const el = document.querySelector(`.is-root_${this.suffix}`);
        const left = el.offsetLeft;
        const top = el.offsetTop;
        const { expand, children } = this.keys
        if (expand in data) {
          this.$set(data, expand, !data.expand);
          if (!data.expand && data[children]) {
            this.collapse(data[children], {expand, children});
          }
        } else {
          this.$set(data, expand, true);
        }
        let nm = true
        if (data.expand && this.lazy && this.load) {
          nm = false
          this.loadData(data, this.load, () => {
            this.nodeKey = +new Date()
            this.$nextTick(() => {
              this.autoDrag(el, left, top);
            });
          })
        }
        this.nodeKey = +new Date()
        this.$nextTick(() => {
          // nm && this.autoDrag(el, left, top);
        });
        this.$emit('on-expand', e, data)
      },
      loadData (node, load, cb) {
        load(node, (data, auto) => {
          const { children } = this.keys
          node.isLeaf = !data.length
          if (data.length) {
            node[children] = data
            auto && cb()
          }
        })
      },
      handleBlur(e, data){
        const { children, id, label } = this.keys;
        const childNodes = this.menuData[children] || [];
        for (let i = childNodes.length; i > 0; i--){
          let item = childNodes[i - 1]
          if (item[id] == "" && item[label]==""){
            childNodes.splice(i - 1, 1)
            break;
          }
        }
        this.$emit('on-node-blur', e, data)
      },
      handleFullscreen(){
        this.fullscreen = !this.fullscreen;
        if(this.fullscreen) {
          this.launchIntoFullscreen();
        } else {
          this.exitFullscreen();
        }
      },
      launchIntoFullscreen() {
        // 全屏
        const element = this.$refs['zm-tree-org']
        if(element.requestFullscreen){
            element.requestFullscreen();
        }
        else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
      },
      exitFullscreen() {
        // 退出全屏
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
      },
      collapse(list, {expand, children}) {
        list.forEach(child => {
          if (child[expand]) {
            child[expand] = false;
          }
          child[children] && this.collapse(child[children], {expand, children});
        });
      },
      expandChange() {
        this.expanded = !this.expanded
        this.toggleExpand(this.data, this.expanded);
        if(!this.expanded){
          this.$nextTick(() => {
            this.onDragStop(this.left, this.top);
          });
        }
      },
      toggleExpand(data, val) {
        const { expand, children } = this.keys
        if (Array.isArray(data)) {
          data.forEach(item => {
            this.$set(item, expand, val);
            if (item[children]) {
              this.toggleExpand(item[children], val);
            }
          });
        } else {
          this.$set(data, expand, val);
          if (data[children]) {
            this.toggleExpand(data[children], val);
          }
        }
      },
      filter(value) {
        const filterNodeMethod = this.filterNodeMethod;
        if (!filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        const { children, expand } = this.keys
        const { $set } = this
        const traverse = function(node) {
          const childNodes = node[children] || [];

          childNodes.forEach((child) => {
            const hidden = !filterNodeMethod.call(child, value, child);
            if('hidden' in child) {
              child.hidden = hidden
            } else {
              $set(child, 'hidden', hidden)
            }
            traverse(child);
          });

          if (node.hidden && childNodes.length) {
            let unHidden = true;
            unHidden = childNodes.some(child => !child.hidden);

            node.hidden = !unHidden;
          }
          if (!value) return;

          if (!node.hidden && !node.isLeaf) node[expand] = true;
        };

        traverse(this.data);
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>