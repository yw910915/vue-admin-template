function addFieldToTree(treeArray, fieldName, fieldValue = false) {
    // 遍历树形结构数组的每一项
    treeArray.forEach(item => {
        if(item.id == 3) {
            item[fieldName] = true;
        } else {
            // 添加指定字段和值到当前项
            item[fieldName] = fieldValue;
        }
  
      // 如果当前项有子项（子数组），递归调用函数处理子项
      if (item.children && Array.isArray(item.children)) {
        addFieldToTree(item.children, fieldName, fieldValue);
      }
    });
  }
  
  // 示例树形结构数组
  const treeData = [
    {
      id: 1,
      name: "Node 1",
      children: [
        {
          id: 2,
          name: "Node 1.1",
          children: [
            {
              id: 3,
              name: "Node 1.1.1",
              children: []
            }
          ]
        },
        {
          id: 4,
          name: "Node 1.2",
          children: []
        }
      ]
    },
    {
      id: 5,
      name: "Node 2",
      children: []
    }
  ];
  
  // 调用函数添加字段
  addFieldToTree(treeData, "newField");
  
  console.log(treeData); // 查看添加字段后的树形结构数组




  
  function addNodeRelativeToId(treeData, targetId, newNode, position) {
    // 递归遍历树形结构数据
    function traverse(node, parentId, parentNode) {
      if (node.key == targetId) {
        // 找到匹配的节点
        if (!parentNode) {
          // 如果节点没有父节点，说明是根节点，直接插入新节点到树顶级
          if (position === 'top') {
            treeData.unshift(newNode);
          } else if (position === 'bottom') {
            treeData.push(newNode);
          }
        } else {
          // 否则，在父节点的children数组中找到当前节点的索引，然后根据位置插入新节点
          const index = parentNode.children.findIndex(child => child.key == targetId);
          if (index !== -1) {
            if (position === 'top') {
              parentNode.children.splice(index, 0, newNode);
            } else if (position === 'bottom') {
              parentNode.children.splice(index + 1, 0, newNode);
            }
          }
        }
      } else if (node.children) {
        // 继续遍历子节点
        for (let i = 0; i < node.children.length; i++) {
          traverse(node.children[i], targetId, node);
        }
      }
    }

    // 找到树中的根节点
    for (let i = 0; i < treeData.length; i++) {
      traverse(treeData[i], targetId, null);
    }

    return treeData;
  }
  const temp = [{ ...this.dataList }];
  const newNode = {
    key: '2-100',
    title: "New Node",
  };
  const position = 'top'; // 或 'bottom'
  const da = addNodeRelativeToId(temp, key, newNode, position)[0];
  console.log(da, 'addNodeRelativeToId')
  