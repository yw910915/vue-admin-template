<template>
  <div style="">
    <right-tree
      v-if="list && list.length"
      :list="list"
      :showfields="showFields"
    ></right-tree>
  </div>
</template>
<script>
import RightTree from './rightTree'
export default {
    components:{
        RightTree,
    },
    data(){
        return{
            list: [//datasource
                {
                    id: '1',
                    name: 'span1',
                    serviceId: 'service1',
                    children: [
                        {
                            id: '1-1',
                            name: 'user',
                            serviceId: 'service-user',
                            children: [
                                {
                                    id: '1-1-1',
                                    name: 'shop',
                                    serviceId: '18',
                                    children: [
                                        {
                                            id: '1-1-1-1',
                                            name: 'common',
                                            serviceId: 'common-service',
                                        },
                                    ],
                                },
                                {
                                    id: '1-1-2',
                                    name: 'account1',
                                    serviceId: 'account-service',
                                },
                                {
                                    id: '1-1-3',
                                    name: 'account2',
                                    serviceId: 'account-service',

                                },
                                {
                                    id: '1-1-4',
                                    name: 'account3',
                                    serviceId: 'account-service',
                                },
                            ],
                        },
                        {
                            id: '1-2',
                            name: 'truck',
                            serviceId: 'truck-pay',
                            work: 'web',
                        },
                    ],
                },
            ],
            showFields: [
                {
                    name: '服务名称：',
                    key: 'name',
                },
                {
                    name: '服务编号：',
                    key: 'serviceId',
                },
            ],
        }
    },
    methods:{

    },
    
}
</script>
