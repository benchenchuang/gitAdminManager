<style lang="less" scoped>
.download_btn{
    margin-bottom: 20px;
    text-align: right;
}
.page_num{
    margin: 30px 0;
    text-align: right;
}
</style>

<template>
    <div class="panel">
        <Card>
            <div slot="title">觅客圈数据</div>
            <div class="download_btn">
                <a :href="loadUrl">
                    <Button type="primary">导出数据</Button>
                </a>
                <Select v-model="params.sortType" style="margin-left:10px;width:150px" placeholder="请选择排序方式" @on-change="selectType">
                    <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
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
            loadUrl:downloadApi.getCircleList,
            params:{
                sortType:'',
                pageNum:1,
                pageSize:10
            },
            sortList:[
                {
                    value:'1',
                    label:'收藏数'
                },
                {
                    value:'2',
                    label:'转发数'
                },
                {
                    value:'3',
                    label:'点赞数'
                },
                {
                    value:'4',
                    label:'发布时间'
                },
                {
                    value:'5',
                    label:'评论数'
                },
                {
                    value:'6',
                    label:'浏览数'
                }
            ],
            total:100,
            columns: [
                {
                    title: '作品名称',
                    key: 'title',
                    align:'center'
                },
                {
                    title: '作品作者',
                    key: 'nickName',
                    align:'center'
                },
                {
                    title: '浏览数',
                    key: 'readCount',
                    align:'center'
                },
                {
                    title: '转发数',
                    key: 'share',
                    align:'center'
                },
                {
                    title: '收藏',
                    key: 'collectNum',
                    align:'center'
                },
                {
                    title: '点赞',
                    key: 'zanNum',
                    align:'center'
                },
                {
                    title: '评论数',
                    key: 'pingNum',
                    align:'center'
                }
            ],
            data: [],
        }
    },
    created () {
        this.getCircleList();
    },
    methods: {
        downLoad(){
            statementApi.downLoadCircle().then(res=>{
                let url = window.URL.createObjectURL(new Blob([res],{type: 'application/octet-stream'}));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute("download", '佣金列表.xls');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                this.$Message.success('文件下载中');
            }).catch(err=>{
                this.$Message.destroy();
                this.$Message.warning('网络异常，请稍后再试！');
            })
        },
        selectType(e){//选择排序
            this.params.pageNum = 1;
            this.getCircleList();
        },
        onChange(e){
            this.params.pageNum =e;
            this.getCircleList();
        },
        getCircleList(){
            statementApi.getCircleList(this.params).then(res=>{
                this.total = res.total_num;
                this.data = res.data_list
            })
        }
    }
}
</script>


