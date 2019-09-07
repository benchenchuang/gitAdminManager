<style lang="less" scoped>
.mass_header{
    padding: 20px 20px 0;
    margin-bottom: 30px;
    background: #fff;
}
.page_num{
    margin: 30px 0 0;
    text-align: right;
}
</style>

<template>
    <div>
        <Form class="panel-form mass_header" inline>
            <FormItem>
                <Input type="text" size="large" placeholder="请输入标题关键字" v-model.trim="params.title"></Input>
            </FormItem>
            <FormItem :label-width="80" label="状态筛选">
                <Select v-model="params.status" style="width:140px" size="large" clearable>
                    <Option v-for="(item,index) in filters" :key="index" :value="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem :label-width="1">
                <Button type="primary" size="large" @click="search"><Icon type="ios-search" />搜索</Button>
            </FormItem>

            <FormItem :label-width="1" inline>
                <Tooltip placement="bottom-end">
                    <Button @click="sendModal(0)" size="large" type="primary">唤醒用户群发</Button>
                    <div slot="content" style="width:200px;white-space: normal;">
                        <p>添加信息模板后，系统会自动发给5日没有查看名片的用户</p>
                    </div>
                </Tooltip>
            </FormItem>
            <FormItem :label-width="1" inline>
                <Tooltip content="该模板目前仅用于提醒用户" placement="bottom-end">
                    <Button type="primary" size="large" @click="sendModal(1)">新建群发</Button>
                </Tooltip>
            </FormItem>

        </Form>
        <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
            <Table size="large" :columns="columns" :data="messageList"></Table>
            <div class="page_num">
                <Page :total="total" show-total :page-size="params.pageSize" show-elevator @on-change="onChange"/>
            </div>
        </Card>
        <massDetail v-model="isScan" @modal="modal" :massId.sync="massId" :type.sync="type" v-if="isScan"/>
    </div>
</template>
<script>

import { massApi } from '@/api/index'
import massDetail from './components/mass_detail'
export default {
    components: {
        massDetail
    },
    data(){
        return{
            isScan:false,
            massId:'',
            type:'',
            columns:[
                {
                    title:'消息标题',
                    key: 'title',
                    align: 'center',
                },
                {
                    title:'发送内容',
                    key: 'details',
                    align: 'center',
                },
                {
                    title:'发送时间',
                    key:'sendTime',
                    align: 'center',
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.status==0){
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: '#5cadff'
                                    }
                                }, '待发送')
                            ]);
                        } else if(params.row.status==1){
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: '#19be6b'
                                    }
                                }, '已发送')
                            ]);
                        }
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.status==1){
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
                                            this.sendModal(2,params.row.id)
                                        }
                                    }
                                }, '查看')
                            ]);
                        } else if(params.row.status==0){
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
                                            this.sendModal(2,params.row.id)
                                        }
                                    }
                                }, '查看'),
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
                                            this.sendModal(1,params.row.id)
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                }
            ],
            messageList: [],
            filters: [
                {
                    label: '待发送',
                    value: 0
                },
                {
                    label: '已发送',
                    value: 1
                }
            ],
            total:0,
            params:{
                title:'',
                status:'',//0待发送，1已发送
                page_num:1,
                page_size:10,
            },
        }
    },
    watch: {
        status(val){
            this.page_num=0;
            this.status = val;
            this.getMessageList();
        }
    },
    mounted () {
      this.getMessageList();
    },
    methods:{
        onChange(e){
            this.params.page_num = e;
            this.getMessageList();
        },
        getMessageList(){
            massApi.getMessageList(this.params).then(res=>{
                this.messageList = res.data_list;
                this.total = res.total_num;
            })
        },
        //打开模态框
        sendModal(type,id='') {
            this.type = type;
            this.massId = id;
            this.isScan = true;
        },
        search(){
            this.params.page_num = 1;
            this.getMessageList();
        },
        modal(e){//是否更改信息
            this.isScan = false;
            this.massId = '';
            if(e){
                this.getMessageList();
            }
        }
    }
}
</script>
<style lang="less" scoped>
.panel_head{
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background: #f90;
}
.panel_form{
    margin: 30px 0;
    .phone_box{
        float: left;
        width: 380px;
        margin: 0 40px 0 20px;
        height: 464px;
        background: #f1f1f1;
        .phone_body{
            margin: 10px;
            background: #fff;
            .common_info{
                padding: 10px;
                border-bottom: 1px solid #e4e4e4;
                .username{
                    margin-left: 10px;
                    font-size: 15px;
                    color: #666;
                    vertical-align: middle;
                }
                .msg_item{
                    margin: 15px 0;
                    overflow: hidden;
                    .label{
                        font-size: 14px;
                        width: 70px;
                        float: left;
                    }
                    .content{
                        margin-left: 80px;
                        color: #333;
                        word-break: break-all;
                    }
                }
                &:last-child{
                    border-bottom: none;
                }
            }
        }
    }
    .mini_header{
        width: 380px;
    }
    .form_box{
        float: left;
        .send_box{
            .name{
                display: inline-block;
                font-size: 14px;
                color: #666;
                width: 100px;
                i{
                    margin-right: 4px;
                    color: #ed4014;
                    vertical-align: middle;
                }
            }
            .red{
                color: #ed4014;
            }
        }
    }
}
</style>