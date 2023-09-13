<template>
  <div>
    <!-- 内容区 -->
    <left-tree :list="line"></left-tree>
  </div>
</template>
 
<script>
import leftTree from "./lineItem.vue";
export default {
  components: {
    leftTree
  },
  props: {},
  data() {
    return {
      line: [
        {
          name: "A",
          type: 1,
          id: "1"
        },
        {
          name: "B",
          type: 1,
          id: "2"
        },
        {
          name: "C",
          type: 1,
          id: "3",

          children: [
            {
              name: "C-1",
              type: 2,
              id: "3-1",
              children: [
                { name: "C-1-a", type: 3, id: "3-1-1" },
                { name: "C-1-b", type: 3, id: "3-1-2" },
                { name: "C-1-c", type: 3, id: "3-1-3" },
                { name: "C-1-d", type: 3, id: "3-1-4" },
                { name: "C-1-e", type: 3, id: "3-1-5" }
              ]
            },
            { name: "C-2", type: 2, id: "3-2" }
          ]
        },
        {
          name: "D",
          type: 1,
          id: "4"
        }
      ]
    };
  }
};
</script>