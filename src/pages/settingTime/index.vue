<style lang="less" scoped>
.panel_header{
    padding-bottom: 30px;
}
.box_content{
    .title{
        margin-top: 15px;
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
    .val{
        margin-top: 5px;
        font-size: 16px;
        color: #808695;
    }
}
</style>

<template>
    <div class="panel main_wrap">
        <Row class="panel_header">
            <Col span="12">
                筛选 <DatePicker @on-change="searchDate" size="large" type="date" placeholder="选择日期" style="width: 250px"></DatePicker>
                <Button size="large" type="primary" @click="searchHandle">搜索</Button>
            </Col>
            <Col span="12" style="text-align:right;">
                <Button size="large" type="primary" style="margin-right:10px;" @click="addDateModal">新增</Button>
            </Col>
        </Row>
        <Table size="large" border ref="selection" @on-selection-change="selectItems" :columns="columns" :data="data"></Table>
        <div class="table_page">
            <!-- <Button style="float:left;" :disabled="selectedItems.length?false:true" size="large">批量删除</Button> -->
            <Page :total="total" show-total :current="params.page.current" :page-size="params.page.size" @on-change="changePage"/>
        </div>

        <Modal v-model="modal" title="新增日期时间段" width='500px'>
            <div class="box_content">
                <p class="title">日期范围</p>
                    <DatePicker v-if="modal" size="large" :options="options" type="daterange" @on-change="changeDate" placeholder="选择日期范围" style="width: 375px"></DatePicker>
                <p class="title">时间段设置</p>
                <div class="time_item" v-for="(item,index) in dateParams.durations" :key="index">
                    <TimePicker hide-disabled-options :disabled-hours="[0,1,2,3,4,5,6,7]" :steps="[1, 10]" :ref="`time_picker_${index}`" format="HH:mm" type="timerange" @on-change="changeTime(index)" v-model="item.duration" placeholder="选择时间" style="width: 200px"></TimePicker>
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

        <Modal v-model="updateModal" title="更新人数上限" width='500px' @on-cancel="cancelUserData">
            <div class="box_content">
                <p class="title">日期</p>
                   <p class="val">{{editData.day}}</p>
                <p class="title">时间段</p>
                    <p class="val">{{editData.duration}}</p>
                <p class="title">预约人数上限</p>
                    <Input v-model="editData.limited_num" size="large" placeholder="输入人数" style="width: 200px;margin-top:10px;" />
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="sureEditUser">确认</Button>
            </div>
        </Modal>


    </div>
</template>
<script>
import {mixin} from "@/mixins/base.js";
import {commonApi} from '@/api/index'
export default {
    name:'settingTimes',
    mixins: [mixin],
    data(){
        return{
            modal:false,
            updateModal:false,
            params:{
                page:{
                    size:10,
                    current:1,
                },
                param: {}
            },
            total:100,
            options: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            columns: [
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center'
                // },
                {
                    title: '日期',
                    align: 'center',
                    key: 'day'
                },
                {
                    title: '时间段',
                    align: 'center',
                    key: 'duration'
                },
                {
                    title: '当前预约人数',
                    align: 'center',
                    key: 'current_num'
                },
                {
                    title: '席位上限',
                    align: 'center',
                    key: 'limited_num'
                },
                {
                    title: '预约状态',
                    align: 'center',
                    key: 'status',
                    render: (h, params) => {
                        if(params.row.status==0){
                            return h('span', {style:{color:'#19be6b'}},'畅通')
                        }else if(params.row.status==1){
                            return h('span', {style:{color:'#2db7f5'}}, '一般')
                        }else if(params.row.status==2){
                            return h('span', {style:{color:'#ff9900'}}, '拥挤')
                        }else{
                            return h('span', {style:{color:'#808695'}}, '已满')
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 240,
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.current_num){
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style:{
                                        marginRight:'10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editReservation(params.row)
                                        }
                                    }
                                }, '修改预约人数')
                            ]);
                        }else{
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style:{
                                        marginRight:'10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editReservation(params.row)
                                        }
                                    }
                                }, '修改预约人数'),
                                h('Button', {
                                    props: {
                                        type: 'warning'
                                    },
                                    on: {
                                        click: () => {
                                            let isNum = params.row.current_num;
                                            let desc='';
                                            if(isNum){
                                                desc = `<p>确定要删除${params.row.day} ${params.row.duration}时间段（包含${isNum}条数据）？</p>`
                                            }else{
                                                desc = `<p>确定要删除${params.row.day} ${params.row.duration}时间段？</p>`
                                            }
                                            this.$Modal.confirm({
                                                title: '删除提示',
                                                content: desc,
                                                onOk: () => {
                                                    this.delDayTime(params.row.id,params.index);
                                                },
                                                onCancel: () => {
                                                    console.log('放弃修改')
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                }
            ], 
            data: [],
            dateParams:{
                startDay:'',
                endDay:'',
                durations:[]
            },
            selectedItems:[],
            editData:{}
        }
    },
    created(){
        this.getInitList();
    },
    methods:{
        //删除某个时间段
        delDayTime(id,index){
            commonApi.delDayTime({id:id}).then(res=>{
                if(res.code==200){
                    let param = this.params.page
                    let lastNum= this.total-param.size*param.current;
                    if(this.data.length==1 || (this.data.length+lastNum-1)<=10){
                        this.params.page.current = 1;
                        this.getInitList();
                    }else{
                        this.data.splice(index,1)
                    }
                    this.$Message.success('删除成功!');
                }
            });
        },
        //确认修改预约人数
        sureEditUser(){
            if(!this.editData.limited_num){
                this.$Message.error('人数不能为空!');
                return false;
            }
            let id = this.editData.id;
            let limitedNum = this.editData.limited_num;
            commonApi.updateLimitedNum({id,limitedNum}).then(res=>{
                if(res.code==200){
                    this.editData = {};
                    this.updateModal = false;
                    this.$Message.success('修改成功!');
                    this.getInitList();
                }
            })
        },
        //取消预约人数修改
        cancelUserData(){
            this.editData = {};
            this.updateModal = false;
        },
        //修改预约人数
        editReservation(row){
            this.editData = row;
            this.updateModal = true;
        },
        //选择查询
        searchHandle(){
            this.params.page.current = 1;
            this.getInitList();
        },
        //选择日期筛选
        searchDate(e){
            if(e){
                this.params.param.day = e;
            }else{
                this.params.param={}
            }
        },
        //获取时间段数据
        getInitList(){
            commonApi.getDayTimes(this.params).then(res=>{
                if(res.code==200){
                    this.data = res.data.records,
                    this.total = res.data.total;
                }
            })
        },
        //
        selectItems(e){
            this.selectedItems = e;
        },
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
            let isTrue = true;
            let params = JSON.parse(JSON.stringify(this.dateParams));
            if(!params.startDay || !params.endDay){
                this.$Message.error('日期设置不能为空!');
                isTrue = false;
                return false;
            }
            if(!params.durations.length){
                this.$Message.error('时间段设置不能为空!');
                isTrue = false;
                return false;
            }
            params.durations.map(item=>{
                if(!item.duration){
                    this.$Message.error('时间不能为空!');
                    isTrue = false;
                    return false;
                }
                if(!item.limitedNum){
                    this.$Message.error('人数不能为空!');
                    isTrue = false;
                    return false;
                }
                item.limitedNum = parseInt(item.limitedNum)
                item.duration = item.duration[0]+'-'+item.duration[1];
            })
            if(isTrue){
                commonApi.addDuration(params).then(res=>{
                    if(res.code==200){
                        this.modal = false;
                        this.$Message.success('添加成功!');
                        this.dateParams={
                            startDay:'',
                            endDay:'',
                            durations:[]
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }
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

