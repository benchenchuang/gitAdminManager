<style lang="less" scoped>
.download_btn{
    text-align: right;
    margin-bottom: 20px;
}
.page_num{
    margin: 30px 0;
    text-align: right;
}
</style>

<template>
    <div class="panel">
        <Card>
            <div slot="title">搜索数据</div>
            <div class="download_btn">
                <a :href="loadUrl">
                    <Button type="primary">导出数据</Button>
                </a>
            </div>
            <Table border :columns="columns" :data="data"></Table>
            <div class="page_num">
                <Page :total="total" show-total :page-size="params.pageSize" show-elevator @on-change="onChange"/>
            </div>
        </Card>
    </div>
</template>
<script>
import {statementApi,downloadApi} from '@/api/index'
export default {
    name:'search',
    data(){
        return{
            loadUrl:downloadApi.exportSearch,
            params:{
                pageNum:1,
                pageSize:10
            },
            total:0,
            columns: [
                {
                    title: '搜索关键词',
                    key: 'keyword',
                    align:'center'
                },
                {
                    title: '总搜索次数',
                    key: 'frequency',
                    align:'center'
                },
                {
                    title: '本月',
                    key: 'frequencyMonth',
                    align:'center'
                },
                {
                    title: '本周',
                    key: 'frequencyWeek',
                    align:'center'
                },
                {
                    title: '今日',
                    key: 'frequencyToday',
                    align:'center'
                }
            ],
            data: [],
        }
    },
    created () {
        this.getSearchList();
    },
    methods: {
        onChange(e){
            this.params.pageNum =e;
            this.getSearchList();
        },
        getSearchList(){
            statementApi.getSearchList(this.params).then(res=>{
                if(res.state ==0 && res.data.data_list){
                    this.data = res.data.data_list;
                    this.total = res.data.total_num;
                }
            })
        }
    }
}
</script>

