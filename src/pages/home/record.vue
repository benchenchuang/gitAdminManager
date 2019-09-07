<style lang="less" scoped>
.page_num{
    margin: 30px 0;
    text-align: right;
}
</style>

<template>
    <div>
        <Card :padding="22" :bordered="false" :dis-hover="true">
            <Table size="default" :columns="columns" :data="logData">
                <template slot-scope="{ row }" slot="adminName">
                    <p>{{row.adminName?row.adminName:'超级管理员'}}</p>
                </template>
            </Table>
            <div class="page_num">
                <Page :total="total" show-total :page-size='params.pageSize' show-elevator @on-change="onChange"/>
            </div>
        </Card>
    </div>
</template>
<script>
    import {homeApi} from '@/api/index'
    export default {
        data () {
            return {
                params:{
                    pageNum:1,
                    pageSize:15
                },
                total:0,
                columns: [
                    {
                        title: '时间',
                        key: 'createTime'
                    },
                    {
                        title: 'IP',
                        key: 'ip'
                    },
                    {
                        title: '地区',
                        key: 'address'
                    },
                    {
                        title: '用户名',
                        slot: 'adminName'
                    }
                ],
                logData: []
            }
        },
        watch: {
            'params.pageNum':function(val){
                console.log(val)
                this.getLogs();
            }  
        },
        created () {
            this.getLogs();  
        },
        methods: {
            onChange(e){//改变页码
                this.params.pageNum = e;
            },
            getLogs(){//获取登陆日志
                homeApi.getLogs(this.params).then(res=>{
                    let resData = res.data;
                    if(res.state == 0){
                        this.logData = resData.data_list;
                        this.total = resData.total_num;
                    }
                })
            }
        }
    }
</script>
