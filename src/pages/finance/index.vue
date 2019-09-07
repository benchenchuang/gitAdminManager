<style lang="less">
.finance{
    padding: 20px 20px 0 20px;
    background: #fff;
}
.switch_tab{
    margin-bottom: 10px;
}
.page_num{
    margin: 30px 0 0;
    text-align: right;
}
.ivu-table-column-center{
    text-align: center;
    .ivu-btn{
        width: 64px;
    }
}
</style>
<template>
  <div class="panel">
    <Form class="panel-form mb-20 finance" inline :label-width="80">
        <FormItem label="用户姓名：">
            <Input v-model="params.nikeName" placeholder="用户名/姓名"/>
        </FormItem>
        <FormItem label="归属银行：">
            <Select style="width:160px" v-model="params.bankName" clearable>
                <Option v-for="item in bankList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="银行卡号：">
            <Input v-model="params.bankCard" placeholder="银行卡号"/>
        </FormItem>
        <FormItem label="交易编号：">
            <Input v-model="params.withdrawalNo" placeholder="交易编号"/>
        </FormItem>
        <FormItem label="创建时间：">
            <DatePicker @on-change="pickDateChange" :value="dateRange" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择创建时间"></DatePicker>
        </FormItem>
        <FormItem label="排序：">
            <Select style="width:160px" v-model="params.sort">
                <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        
        <FormItem :label-width="10">
            <Button type="primary" @click="searchFinance"><Icon type="ios-search" />搜索</Button>
        </FormItem>
        <FormItem :label-width="1">
            <a :href="loadUrl">
                <Button type="primary">导出数据</Button>
            </a>
        </FormItem>
    </Form>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
        <Tabs :value="params.status" @on-click="switchTab" class="switch_tab">
            <TabPane label="全部" name="100"></TabPane>
            <TabPane :label="verify" name="0"></TabPane>
            <TabPane :label="grant" name="1"></TabPane>
            <TabPane label="已发放" name="2"></TabPane>
        </Tabs>
      <Table :columns="columns" :data="financeData"></Table>
      <div class="page_num">
        <Page :total="total" show-total :page-size="params.pageSize" show-elevator @on-change="onChange"/>
      </div>
    </Card>
    <Detail v-model="isScan" @modal="modal" :orderData.sync="orderData" v-if="isScan"></Detail>
  </div>
</template>
<script>
import { financeApi,downloadApi } from '@/api/index'
import {baseUrl} from '@/api/axios'
import Detail from "./components/detail";
import { mapState } from 'vuex'
export default {
    components: {
        Detail
    },
    data() {
        return {
            loadUrl:downloadApi.getFinacelList,
            tabName:'all',
            waitCheck:0,
            baseUrl,
            waitDeliver:0,
            verify: (h) => {
                return h('div', [
                    h('span', '待审核'),
                    h('Badge', {
                        props: {
                            count: parseInt(this.waitCheck)
                        }
                    })
                ])
            },
            grant: (h) => {
                return h('div', [
                    h('span', '待发放'),
                    h('Badge', {
                        props: {
                            count: parseInt(this.waitDeliver)
                        }
                    })
                ])
            },
            dateRange:[],
            params:{
                bankCard:'',
                bankName:'',
                nikeName:'',
                withdrawalNo:'',
                startTime:'',
                endTime:'',
                status:'',
                sort:'',
                pageNum:1,
                pageSize:10
            },
            total:0,
            isScan:false,
            orderData:{},//查看、审核的数据
            sortList:[
                {
                    value:0,
                    label:'按申请时间排序'
                },
                {
                    value:1,
                    label:'按申请金额从高到低'
                }
            ],
            bankList: [
                {
                    value: "工商银行",
                    label: "工商银行"
                },
                {
                    value: "农业银行",
                    label: "农业银行"
                },
                {
                    value: "中国银行",
                    label: "中国银行"
                },
                {
                    value: "建设银行",
                    label: "建设银行"
                },
                {
                    value: "交通银行",
                    label: "交通银行"
                },
                {
                    value: "邮政银行",
                    label: "邮政银行"
                },
                {
                    value: "招商银行",
                    label: "招商银行"
                },
                {
                    value: "光大银行",
                    label: "光大银行"
                },
                {
                    value: "平安银行",
                    label: "平安银行"
                },
                {
                    value: "中信银行",
                    label: "中信银行"
                },
                {
                    value: "民生银行",
                    label: "民生银行"
                },
                {
                    value: "兴业银行",
                    label: "兴业银行"
                },
                {
                    value: "浦发银行",
                    label: "浦发银行"
                },
                {
                    value: "广发银行",
                    label: "广发银行"
                },
                {
                    value: "北京银行",
                    label: "北京银行"
                }
            ],
            columns: [
                {
                    title: "用户姓名",
                    key: "nickName",
                    align: 'center',
                },
                {
                    title: "申请时间",
                    key: "createTime",
                    align: 'center',
                },
                {
                    title: "交易编号",
                    key: "withdrawalNo",
                    align: 'center',
                },
                {
                    title: "交易理由",
                    key: "withdrawalReason",
                    align: 'center',
                },
                {
                    title: "收款人姓名",
                    key: "payeeName",
                    align: 'center',
                },
                {
                    title: "收款人身份证号码",
                    key: "identityCard",
                    align: 'center',
                },
                {
                    title: "银行卡归属银行",
                    key: "bankName",
                    align: 'center',
                },
                {
                    title: "银行卡归属地",
                    key: "belongTo",
                    align: 'center',
                },
                {
                    title: "银行卡号",
                    key: "bankCard",
                    align: 'center',
                },
                {
                    title: "提现金额",
                    key: "withdrawalMoney",
                    align: 'center',
                },
                {
                    title: "提现手续费",
                    key: "withdrawalCommission",
                    align: 'center',
                },
                {
                    title: "状态",
                    key: "status",
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.status==0){
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: '#ff9900'
                                    }
                                }, '待审核')
                            ]);
                        } else if(params.row.status==1){
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: '#5cadff'
                                    }
                                }, '待发放')
                            ]);
                        }else if(params.row.status==2){
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: '#19be6b'
                                    }
                                }, '已发放')
                            ]);
                        }else{
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: '#ed4014'
                                    }
                                }, '驳回')
                            ]);
                        }
                    }
                },
                {
                    title: "处理备注",
                    key: "withdrawalReason",
                    align: 'center',
                },
                {
                    title: "操作",
                    align: 'center',
                    width:'100px',
                    render: (h, params) => {
                        if(params.row.status==0 && this.userType==5){
                            return '';
                        }else if(params.row.status==0 && this.userType!=5){
                            return h('div', [
                                h("Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        on: {
                                            click: () => {
                                                this.orderData = params.row;
                                                this.isScan = true;
                                            }
                                        }
                                    },
                                    "去审核"
                                )
                            ]);
                        }else if(params.row.status==1 && this.userType==4){
                            return '';
                        }else if(params.row.status==1 && this.userType!=4){
                            return h('div', [
                                h("Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        on: {
                                            click: () => {
                                                this.orderData = params.row;
                                                this.isScan = true;
                                            }
                                        }
                                    },
                                    "去发放"
                                )
                            ]);
                        }else{
                            return h('div', [
                                h("Button",
                                    {
                                        props: {
                                            type: "success",
                                            size: "small"
                                        },
                                        on: {
                                            click: () => {
                                                this.orderData = params.row;
                                                this.isScan = true;
                                            }
                                        }
                                    },
                                    "查看详情"
                                )
                            ]);
                        }
                    }
                }
            ],
            financeData: []
        };
    },
    computed: {
        ...mapState({
            userType: function (state) {
                return Number(state.userInfo.type);
            }
        })
    },
    created () {
        let query = this.$route.params.to;
        if(query){
            this.params.pageNum = 1;
            this.params.status = '0';
        }
        this.getFinanceList();
    },
    methods: {
        //tab切换
        switchTab(e){
            this.params.status = e;
            this.params.pageNum = 1;
            this.getFinanceList();
        },
        //日期选择
        pickDateChange(e){
            this.dateRange = e;
        },
        onChange(e) {
            this.params.pageNum = e;
            this.getFinanceList();
        },
        searchFinance(){//提交查询
            this.params.pageNum = 1 ;
            this.getFinanceList();
        },
        getFinanceList(){//获取佣金列表
            financeApi.getFinanceList(this.params).then(res=>{
                if(res.state ==0){
                    let getData = res.data
                    this.waitCheck = getData.waitCheck;
                    this.waitDeliver = getData.waitDeliver;
                    this.financeData = getData.rspPage.data_list;
                    this.total = getData.rspPage.total_num;
                }
            })
        },
        modal(e) {
            this.isScan = false
            if(e){
                this.getFinanceList();
            }
        },
        //点击导出订单
        getOrderExcel () {
            financeApi.exporRecord().then(res=>{
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
    }
};
</script>

