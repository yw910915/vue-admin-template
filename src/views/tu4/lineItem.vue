<template>
  <div>
    <ul class="all-list">
      <li v-for="(item, i) in list" :key="i">
        <div class="tree-item expend">
          
          <div
            v-if="item.type !== 3"
            class=" icon-size"
            :class="openArr.includes(i) ? 'reduce-icon' : 'expend-icon'"
            @click="toggle(i)"
          ></div>
          <span class="content" @click="toggle(i)">{{ item.name }}</span>
        </div>
        <div
          v-show="openArr.includes(i)"
          v-if="item.children && item.children.length"
        >
          <leftTree class="item" :list="item.children"></leftTree>
        </div>
      </li>
    </ul>
  </div>
</template>
 
<script>
export default {
  name: "leftTree111",
  data() {
    return {
      openArr: [],
      checkboxIds: [],
    };
  },
  props: {
    list: {
      type: Array,
    },
  },
 
  methods: {
    toggle(i) {
      // 如果有则删除
      if (this.openArr.includes(i)) {
        let index = this.openArr.indexOf(i);
        this.openArr.splice(index, 1);
      } else {
        // 如果没有则添加
        this.openArr.push(i);
      }
    },
 
    changeBox(data) {
      this.$store.commit('changeBox', data)
    }
  },
};
</script>
<style lang='scss' scoped>
.item {
  padding-left: 4px;
}
.bold {
  font-weight: bold;
}
ul {
  line-height: 1.5em;
  list-style-type: none;
  white-space: nowrap;
  position: relative;
}
li {
  list-style-type: none;
  padding: 4px;
  user-select: none;
}
input[type="checkbox"] {
  position: relative;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  margin: 1.5px;
  margin-right: 4px;
  z-index: 0;
}
 
.tree-item {
  display: flex;
  align-items: center;
}
.expend {
  position: relative;
}
 
.expend::before {
  content: "";
  position: absolute;
  width: 6px;
  left: 15px;
  top: 9px;
  border-top: 1px dotted #c3c5c8;
}
 
.all-list::before {
  content: "";
  position: absolute;
  width: 1px;
  height: calc(100% - 40px);
  left: 12px;
  top: 20px;
  border-left: 1px dotted #c3c5c8;
}
 
.item .expend::before {
  content: "";
  position: absolute;
  width: 6px;
  left: -4px;
  top: 9px;
  border-top: 1px dotted #c3c5c8;
}
 
.item .all-list::before {
  content: "";
  position: absolute;
  width: 1px;
  height: calc(100% - 12px);
  left: 22px;
  top: 0;
  border-left: 1px dotted #c3c5c8;
}
 
.item ul {
  padding-left: 2em;
}
 
.content {
  padding-left: 4px;
}
.spacing {
  display: inline-block;
  width: 18.5px;
  height: 1em;
}
.icon-size {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
 
.expend-icon {
  // background: url("../../../assets/tree/expend.png") #05193a no-repeat center;
  background-size: cover;
}
.reduce-icon {
  // background: url("../../../assets/tree/reduce.png") #05193a no-repeat center;
  background-size: cover;
}
</style>