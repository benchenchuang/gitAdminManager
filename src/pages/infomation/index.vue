<template>
    <div class="main_wrap panel">
        <Table size="large" :columns="columns" :data="data"></Table>
        <div class="table_page">
            <Page :total="total" show-total :current="params.page.current" :page-size="params.page.size" @on-change="changePage"/>
        </div>
    </div>
</template>
<script>
import {mixin} from "@/mixins/base.js";
import {commonApi} from '@/api/index'
export default {
  name:'infoList',
  mixins: [mixin],
  data(){
      return{
        params:{
            page:{
                size:10,
                current:1,
            },
            param: {}
        },
        total:0,
        columns: [
            {
                type: 'index',
                width: 60,
                align: 'center'
            },
            {
                title: '用户昵称',
                key: 'nickname',
                align: 'center',
                width:200,
            },
            {
                title: '预约日期',
                key: 'day',
                align: 'center'
            },
            {
                title: '预约时间段',
                key: 'duration',
                align: 'center'
            },
            {
                title: '预约人数',
                key: 'num',
                align: 'center'
            },
            {
                title: '状态',
                key: 'status',
                align: 'center',
                render: (h, params) => {
                    if(params.row.status==1){
                        return h('span', {style:{color:'#2b85e4'}},'已预约')
                    }else{
                        return h('span', {style:{color:'#ff9900'}}, '已取消')
                    }
                }
            },
            {
                title: '更新时间',
                key: 'update_time',
                width:196,
                align: 'center',
                render:(h,params)=>{
                    return h('span',this.turnTime(params.row.update_time))
                }
            },
            {
                title: '创建时间',
                key: 'create_time',
                width:196,
                align: 'center',
                render:(h,params)=>{
                    return h('span',this.turnTime(params.row.create_time))
                }
            }
        ],
        data: []
      }
  },
  created(){
      this.getInitList();
  },
  methods:{
      getInitList(){
          commonApi.getAllUsers(this.params).then(res=>{
              if(res.code==200){
                  this.data = res.data.records;
                  this.total = res.data.total
              }
          })
      },
      turnTime(date){
          var dateee = new Date(date).toJSON();
          return new Date(+new Date(dateee) - 5 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
        // let dateTimes = new Date(dateTime);
        // let getTime = dateTimes.getFullYear()+'-'+(dateTimes.getMonth()+1)+'-'+dateTimes.getDate()+' '+dateTimes.getHours()+':'+dateTimes.getMinutes()+':'+dateTimes.getSeconds();
        // return getTime;
      }
  }
}
</script>

