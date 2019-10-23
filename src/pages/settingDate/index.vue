<style lang="less" scoped>
.box_content{
    .title{
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #515a6e;
    }
    .time_item{
        margin: 15px 0;
        .label{
            margin-left: 15px;
        }
    }
    .del_icon{
        font-size: 20px;
        color: #808695;
        cursor: pointer;
    }
}
</style>

<template>
    <div class="panel main_wrap">
        <Row style="margin-bottom:20px;">
            <Col span="24" style="text-align:right;">
                <Button size="large" type="primary" style="margin-right:10px;" @click="addDateModal">新增</Button>
            </Col>
        </Row>

        <Table border ref="selection" :columns="columns" :data="data"></Table>
        <div class="table_page">
            <Page :total="total" show-total :page-size="params.page_size" @on-change="changePage"/>
        </div>

        <Modal v-model="modal" title="新增日期时间段" width='500px'>
            <div class="box_content">
                <p class="title">日期范围</p>
                    <DatePicker size="large" :options="options" type="daterange" @on-change="changeDate" placeholder="选择日期范围" style="width: 375px"></DatePicker>
                <p class="title">时间段设置</p>
                <div class="time_item" v-for="(item,index) in dateParams.durations" :key="index">
                    <TimePicker :ref="`time_picker_${index}`" format="HH:mm" type="timerange" @on-change="changeTime(index)" v-model="item.duration" placeholder="选择时间" style="width: 200px"></TimePicker>
                    <span class="label">人数上限：</span><Input v-model="item.limitedNum" placeholder="输入人数" style="width: 100px" />
                    <Icon class="del_icon" type="md-remove-circle" @click="delTimes(index)"/>
                </div>
                <div style="width:375px;text-align:right;">
                    <Button type="primary" @click="addTimes">添加时间段</Button>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="sureAddDate">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {mixin} from "@/mixins/base.js";
import {commonApi} from '@/api/index'
export default {
    name:'settingDate',
    mixins: [mixin],
    data(){
        return{
            options: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            params:{
                page_size:10,
                page_num:1,
            },
            total:100,
            modal:false,
            columns: [
                {
                    title: '日期范围',
                    align: 'center',
                    key: 'date'
                },
                {
                    title: '时间段',
                    align: 'center',
                    key: 'time',
                    width:400,
                    render: (h, params) => {
                        let a = params.row.times
                        let b = []
                        a.map((val, index) => {
                        b.push(h('div', {
                            style:{
                            height:'40px',
                            lineHeight:'40px'
                            }
                        }, ' 时间段 '+val.time + ' 人数： ' +val.count))
                        if (a.length !== index + 1) {
                            b.push(h('hr', {}))
                        }
                        })
                        return b
                    }
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'status'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.show(params.index)
                                    }
                                }
                            }, '发布'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }
            ],
            data: [
                {
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03至2019-10-32',
                    times:[
                        {
                        time:'10:00-12:00',
                        count:200
                        },
                        {
                        time:'13:00-15:00',
                        count:300
                        },
                        {
                        time:'15:00-17:00',
                        count:400
                        }
                    ]
                },
                {
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01至2019-10-32',
                    times:[
                        {
                        time:'10:00-12:00',
                        count:200
                        },
                        {
                        time:'13:00-15:00',
                        count:300
                        },
                        {
                        time:'15:00-17:00',
                        count:400
                        }
                    ]
                },
                {
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-01至2019-10-32',
                    times:[
                        {
                        time:'10:00-12:00',
                        count:200
                        },
                        {
                        time:'13:00-15:00',
                        count:300
                        },
                        {
                        time:'15:00-17:00',
                        count:400
                        }
                    ]
                },
                {
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-01至2019-10-32',
                    times:[
                        {
                        time:'10:00-12:00',
                        count:200
                        },
                        {
                        time:'13:00-15:00',
                        count:300
                        },
                        {
                        time:'15:00-17:00',
                        count:400
                        }
                    ]
                }
            ],
            dateParams:{
                startDay:'',
                endDay:'',
                durations:[]
            },
        }
    },
    methods:{
        //选择日期
        changeDate(e){
            this.dateParams.startDay = e[0];
            this.dateParams.endDay = e[1];
        },
        changeSelect(index){
            console.log(index)
        },
        //选择时间段
        changeTime(key){
            console.log(key)
            var picker = this.$refs[`time_picker_${key}`];
            var newVal = picker[0].value;
            this.dateParams.durations[key].duration = newVal;
        },
        //添加日期
        addDateModal(){
            this.modal = true;
        },
        //确定添加日期时间段
        sureAddDate(){
            let params = JSON.parse(JSON.stringify(this.dateParams));
            if(!params.durations.length){
                this.$Message.error('时间段设置不能为空!');
                return false;
            }
            params.durations.map(item=>{
                if(!item.duration){
                    this.$Message.error('时间不能为空!');
                    return false;
                }
                if(!item.limitedNum){
                    this.$Message.error('人数不能为空!');
                    return false;
                }
                item.duration = item.duration[0]+'-'+item.duration[1];
            })
            params.durations = JSON.stringify(params.durations)
            commonApi.addDuration(params).then(res=>{
                this.modal = false;
                console.log(res);
                this.dateParams={
                    startDay:'',
                    endDay:'',
                    durations:[]
                }
            })
        },
        //添加时间段
        addTimes(){
            this.dateParams.durations.push({
                duration:null,
                limitedNum:''
            })
        },
        //删除时间段
        delTimes(index){
            this.dateParams.durations.splice(index,1);
        }
    }
}
</script>

