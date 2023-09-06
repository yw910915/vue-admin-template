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