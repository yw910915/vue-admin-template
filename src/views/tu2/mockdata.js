export const mockdata = [
  {
    id: 1,
    title: "某某某的公司",
    isRoot: true,
    children: [
      {
        id: 2,
        pid: 1,
        title: "产品研发部",
        type: "text",
        children: [
          {
            id: 3,
            pid: 2,
            type: "text",
            // title: "科技创新中心",
            tableSlot: {
              name: "风险分析",
              id: "table298332838",
              type: "table",
              columns: [
                {
                  title: "序号",
                  align: "center",
                  width: 60,
                  customRender: (text, record, index) => {
                    return `${index + 1}`;
                  }
                },
                {
                  dataIndex: "name",
                  id: "name",
                  title: "name"
                },
                {
                  title: "Age",
                  dataIndex: "age",
                  id: "age"
                },
                {
                  title: "Address",
                  dataIndex: "address",
                  id: "address"
                }
              ],
              data: [
                {
                  id: "1",
                  name: "John Brown",
                  age: 32,
                  address: "New York No. 1 Lake Park"
                },
                {
                  id: "2",
                  name: "Jim Green",
                  age: 42,
                  address: "London No. 1 Lake Park"
                },
                {
                  id: "3",
                  name: "Joe Black",
                  age: 32,
                  address: "Sidney No. 1 Lake Park"
                }
              ]
            }
          }
        ]
      },
      {
        id: 4,
        pid: 1,
        title: "销售部",
        children: [
          {
            id: 5,
            pid: 4,
            // title: "销售一部",
            imgSlot: {
              name: "图片测试",
              id: "img2392383292",
              type: "img",
              // imgSrc: require("../../../assets/404_images/404.png"),
              styles: {
                width: "250px",
                height: "150px"
              }
            }
          },
          {
            id: 6,
            pid: 4,
            title: "销售二部",
          }
        ]
      },
      {
        id: 7,
        pid: 1,
        title: "财务部",
        children: [
          {
            id: 8,
            pid: 7,
            title: "销售一部",
            content: "李四1"
          },
          {
            id: 9,
            pid: 7,
            title: "销售二部",
            content: "李四2",
            children: [
              {
                id: 10,
                pid: 9,
                title: "销售一部",
                content: "李四1"
              },
              {
                id: 11,
                pid: 9,
                title: "销售二部",
                content: "李四2",
                children: [
                  {
                    id: 12,
                    pid: 11,
                    title: "销售一部",
                    content: "李四1"
                  },
                  {
                    id: 13,
                    pid: 11,
                    title: "销售二部",
                    content: "李四2"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]