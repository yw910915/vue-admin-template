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
  
  