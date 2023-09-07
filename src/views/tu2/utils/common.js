// 递归查找父节点
/**
 *
 * @param {*} treeData 整个组织架构数据
 * @param {*} key id键值名
 * @param {*} pid 父节点id
 * @returns
 */
export const getParentNode = (treeData, key, pid) => {
    if (treeData[key] === pid) {
      return treeData;
    } else if (Array.isArray(treeData.children)) {
      const list = treeData.children;
      for (let i = 0, len = list.length; i < len; i++) {
        const row = list[i];
        const pNode = getParentNode(row, key, pid);
        if (pNode) {
          return pNode;
        }
      }
    }
  }
  
  // 查找前面兄弟节点
  /**
   *
   * @param {*} treeData 整个组织架构数据
   * @param {*} nowNode 当前节点
   * @returns
   */
  export const getBeforeBrotherNode = (treeData, nowNode) => {
    for (let i = 0, len = treeData.length; i < len; i++) {
      if (treeData[i].id === nowNode.id) {
        if (i > 0) {
          return treeData[i - 1];
        } else {
          // 没有前面兄弟节点
          return false;
        }
      } else if (treeData[i].children) {
        const isHasBeforNode = getBeforeBrotherNode(treeData[i].children, nowNode);
        if (isHasBeforNode) return isHasBeforNode;
      }
    }
  }
  
  // 和前面兄弟节点进行交换
  /**
   *
   * @param {*} treeData 整个组织架构数据
   * @param {*} beforeNode 前兄弟节点
   * @param {*} nowNode 当前节点
   * @returns
   */
  export const changeBeforeNode = (treeData, beforeNode, nowNode) => {
    for (let i = 0, len = treeData.length; i < len; i++) {
      if (treeData[i].id === nowNode.id) {
        let obj = {};
        obj = treeData[i];
        treeData[i] = beforeNode;
        treeData[i - 1] = nowNode;
        break;
      } else if (treeData[i].children) {
        changeBeforeNode(treeData[i].children, beforeNode, nowNode);
      }
    }
    return treeData;
  }
  
  // 查找后面的兄弟节点
  /**
   *
   */
  export const getAfterBrotherNode = (treeData, nowNode) => {
    for (let i = 0, len = treeData.length; i < len; i++) {
      if (treeData[i].id === nowNode.id) {
        if (i < treeData.length - 1) {
          return treeData[i + 1];
        } else {
          // 没有后面兄弟节点
          return false;
        }
      } else if (treeData[i].children) {
        const isHasAfterNode = getAfterBrotherNode(
          treeData[i].children,
          nowNode
        );
        if (isHasAfterNode) return isHasAfterNode;
      }
    }
  }
  
  // 和后面兄弟节点进行交换
  /**
   *
   * @param {*} treeData 整个组织架构数据
   * @param {*} beforeNode 后兄弟节点
   * @param {*} nowNode 当前节点
   * @returns
   */
  export const changeAfterNode = (treeData, afterNode, nowNode) => {
    for (let i = 0, len = treeData.length; i < len; i++) {
      if (treeData[i].id === nowNode.id) {
        let obj = {};
        obj = treeData[i];
        treeData[i] = afterNode;
        treeData[i + 1] = nowNode;
        break;
      } else if (treeData[i].children) {
        changeAfterNode(treeData[i].children, afterNode, nowNode);
      }
    }
    return treeData;
  }
  
  // 处理删除节点（调用原组件事件）
  /**
   *
   * @param {*} nowNode  当前节点
   * @param {*} parentNode 父节点
   */
  export const handleOnNodeDelete = (_, nowNode, parentNode) => {
    const list = parentNode["children"];
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i]["id"] === nowNode["id"]) {
        list.splice(i, 1);
        _.$emit("on-node-delete", nowNode, parentNode);
        break;
      }
    }
  }


  export const findParentNodeAndIndex = (data, parentId) => {
    let parentNode = null;
    let parentIndex = -1;
  
    // 递归遍历树形结构数据
    function traverse(node, parentArray, index) {
      if (node.id === parentId) {
        // 找到匹配的父节点
        parentNode = node;
        parentIndex = index;
        return;
      } else if (node.children) {
        // 继续遍历子节点
        for (let i = 0; i < node.children.length; i++) {
          traverse(node.children[i], node.children, i);
          if (parentNode) break; // 如果已经找到匹配的父节点，停止遍历
        }
      }
    }
  
    // 遍历树形结构数据
    for (let i = 0; i < data.length; i++) {
      traverse(data[i], data, i);
      if (parentNode) break; // 如果已经找到匹配的父节点，停止遍历
    }
  
    return { parentNode, parentIndex };
  }
  
  // 示例用法
  // const treeData = [
  //   {
  //     id: 1,
  //     name: "Node 1",
  //     children: [
  //       {
  //         id: 2,
  //         name: "Node 2",
  //         children: [
  //           {
  //             id: 3,
  //             name: "Node 3",
  //           },
  //         ],
  //       },
  //       {
  //         id: 4,
  //         name: "Node 4",
  //       },
  //     ],
  //   },
  // ];
  
  // const parentId = 2; // 当前节点的父级id
  
  // const { parentNode, parentIndex } = findParentNodeAndIndex(treeData, parentId);
  // console.log(parentNode); // 父节点对象
  // console.log(parentIndex); // 父节点在树形结构数据中的层级索引


  /**
   * 同级增加节点
   * @param {*} author  yw
   * @param {*} illustrate  同级增加节点
   * @param {*} treeData  树形结构数据
   * @param {*} targetId 节点id
   * @param {*} newNode 增加的对象
   * @param {*} position right则后面加，left则前面加
   */
  export const addNodeToTree = (treeData, targetId, newNode, position = 'right') => {
    let found = false;
    function traverse(node, parentArray, index) {
      if (node.id == targetId) {
        found = true;
        if (position === 'left') {
          // 在当前id所在数组对象的索引的前面插入新节点
          parentArray.splice(index, 0, newNode);
        } else if (position === 'right') {
          // 在当前id所在数组对象的索引的后面插入新节点
          parentArray.splice(index + 1, 0, newNode);
        }
      } else if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          traverse(node.children[i], node.children, i);
          if (found) break; 
        }
      }
    }

    for (let i = 0; i < treeData.length; i++) {
      traverse(treeData[i], treeData, i);
      if (found) break; 
    }

    return treeData;
  }
  


  
  