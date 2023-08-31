<template>
  <div class="container_warp">
    <div id="containerChart"></div>

    <div
      v-for="(item, index) in List"
      :key="index"
      class="btn"
      :title="item"
      @mousedown="startDrag(item, $event)"
    >
      <span>
        {{ item }}
      </span>
    </div>
  </div>
</template>
<script>
import "@antv/x6-vue-shape";
import { Graph, Shape, FunctionExt } from "@antv/x6";
import { startDragToGraph } from "./1.js";
export default {
  data() {
    return {
      List: [
        "目录监听",
        "数据组织",
        "影像发布",
        "目标检测",
        "变化检测",
        "地物分类",
        "专家候审",
        "样本入库",
        "影像入库",
        "目标入库",
        "图幅整饰",
        "打包下载",
      ],

      graph: "",
      type: "grid",
      selectCell: "",

      connectEdgeType: {
        //连线方式
        connector: "normal",
        router: {
          name: "",
        },
      },

      grid: {
        // 网格设置
        size: 20, // 网格大小 10px
        visible: true, // 渲染网格背景
        type: "mesh",
        args: {
          color: "#D0D0D0",
          thickness: 1, // 网格线宽度/网格点大小
          factor: 10,
        },
      },
    };
  },

  methods: {
    initX6() {
      this.graph = new Graph({
        container: document.getElementById("containerChart"),
        width: 1000,
        height: 500,
        grid: this.grid,
        connecting: {
          // 节点连接
          anchor: "center",
          connectionPoint: "anchor",
          allowBlank: false,
          snap: true,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: "#1890ff",
                strokeWidth: 1,
                targetMarker: {
                  name: "classic",
                  size: 8,
                },
                strokeDasharray: 0, //虚线
                style: {
                  animation: "ant-line 30s infinite linear",
                },
              },
            },
            label: {
              text: "",
            },
            connector: _that.connectEdgeType.connector,
            router: {
              name: _that.connectEdgeType.router.name || "",
            },
            zIndex: 0,
          });
        },
      });
      // 鼠标移入移出节点
      this.graph.on(
        "node:mouseenter",
        FunctionExt.debounce(() => {
          const container = document.getElementById("containerChart");
          const ports = container.querySelectorAll(".x6-port-body");
          this.showPorts(ports, true);
        }),
        500
      );
      this.graph.on("node:mouseleave", () => {
        const container = document.getElementById("containerChart");
        const ports = container.querySelectorAll(".x6-port-body");
        this.showPorts(ports, false);
      });

      this.graph.on("selection:changed", (args) => {
        args.added.forEach((cell) => {
          this.selectCell = cell;
          if (cell.isEdge()) {
            cell.isEdge() && cell.attr("line/strokeDasharray", 5); //虚线蚂蚁线
            cell.addTools([
              {
                name: "vertices",
                args: {
                  padding: 4,
                  attrs: {
                    strokeWidth: 0.1,
                    stroke: "#2d8cf0",
                    fill: "#ffffff",
                  },
                },
              },
            ]);
          }
        });
        args.removed.forEach((cell) => {
          cell.isEdge() && cell.attr("line/strokeDasharray", 0); //正常线
          cell.removeTools();
        });
      });
    },

    showPorts(ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    },
    // 拖拽生成正方形或者圆形
    startDrag(type, e) {
      console.log(type, e);
      console.log(this.graph);
      startDragToGraph(this.graph, type, e);
    },
  },
  mounted() {
    this.initX6();
  },
};
</script>
<style lang="scss">
#containerChart {
  width: 1000px;
  height: 500px;
  border: 1px solid red;
  float: left;
}
.btn {
  width: 400px;
  float: right;
  margin-right: 500px;
}
</style>
