// export const mockdata = [  // 后台返回的数据，此处是从别处复制
// {
//       sorted: 1,
//       children: [
//         {
//           sorted: 1,
//           children: [
//             {
//               sorted: 1,

//               key: 83,
//               title: "3.1附件房剑荡四方较大说法较大生发剂放大司马法打撒",
//               type: "0",
//               parentId: 10,
//               desc: "",
//               isShowAddBtn: false
//             }
//           ],
//           key: 10,
//           title: "2.1发生的疯疯癫癫更容易破塔月卡拖拉很尬",
//           type: "0",
//           parentId: 9,
//           desc: "",
//           isShowAddBtn: false
//         },
//         {
//           sorted: 1,
//           children: [
//             {
//               sorted: 1,
//               children: [],
//               key: 833333,
//               title: "3.1佛挡杀佛东方饭店水电费的司法送达放大",
//               type: "0",
//               parentId: 10,
//               desc: "",
//               isShowAddBtn: false
//             }
//           ],
//           key: 12,
//           title: "2.2通融通融一桶一桶一体盆通一通i圆通",
//           type: "0",
//           parentId: 9,
//           desc: "",
//           isShowAddBtn: false
//         }
//       ],
//       key: 9,
//       title: "1.0福建师范束带结发都开始法大大大大大放大",
//       type: "0",
//       parentId: null,
//       desc: "",
//       isShowAddBtn: false
//     }
// ]

export const mockdata = [
  {
    key: 1,
    title: "汽轮机1-8轴承全面检查",
    // percentageData: {
    //   percentage: '10%',
    //   percentageType: 'percentage',
    // },
    children: [
      {
        key: '1-1',
        title: "1.概述",
        content: '内容为以下附三方啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦'
      },
      {
        key: '1-2',
        title: "2.风险分析及注意事项",
        children: [
          {
            key: '1-2-1',
            title: "2.1风险分析",
            tableSlot: {
              name: '风险分析',
              key: 'table298332838',
              type: 'table',
              columns: [
                {
                  title: '序号',
                  align: "center",
                  width: 60,
                  customRender: (text, record, index) => {
                      return `${ index + 1 }`;
                  }
                },
                {
                  dataIndex: 'name',
                  key: 'name',
                  title: 'name',
                },
                {
                  title: 'Age',
                  dataIndex: 'age',
                  key: 'age',
                },
                {
                  title: 'Address',
                  dataIndex: 'address',
                  key: 'address',
                }
              ],
              data: [
                {
                  key: '1',
                  name: 'John Brown',
                  age: 32,
                  address: 'New York No. 1 Lake Park',
                },
                {
                  key: '2',
                  name: 'Jim Green',
                  age: 42,
                  address: 'London No. 1 Lake Park',
                },
                {
                  key: '3',
                  name: 'Joe Black',
                  age: 32,
                  address: 'Sidney No. 1 Lake Park',
                },
              ]
            },
            imgSlot: {
              name: '图片测试',
              key: 'img2392383292',
              type: 'img',
              imgSrc: require('../../assets/404_images/404.png'),
              styles: {
                width: '250px',
                height: '150px'
              }
            }
          },
        ]
      }
    ]
  }
]