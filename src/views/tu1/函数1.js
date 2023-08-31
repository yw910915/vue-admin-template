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
  