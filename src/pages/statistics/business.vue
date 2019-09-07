<style lang="less" scoped>
.panel_item{
    margin: 30px 0;
}
.filter_box{
    text-align: right;
}
.trade_box{
    margin: 30px 0;
    .trade_charts{
        height: 250px;
    }
}
</style>

<template>
    <div class="panel">
        <Card v-if="false">
            <p slot="title">交易数据</p>
            <div class="filter_box">
                <ButtonGroup style="margin:0 10px;">
                    <Button :type="tradeParams.type==btn.type?'primary':'default'" v-for="(btn,index) in tradeTabs" :key="index" @click="tradeTab(btn.type)">{{btn.name}}</Button>
                </ButtonGroup>
                <DatePicker @on-change="pickTradeDate" type="daterange" show-week-numbers placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
            </div>
            <div class="trade_box">
                <Row type="flex" justify="center" align="middle">
                    <Col span="24">
                        <Table border :columns="tradeColumns" :data="tradeData"></Table>
                    </Col>
                    <!-- <Col span="12">
                        <div class="trade_charts" v-echarts="ChartOptions"></div>
                    </Col> -->
                </Row>
            </div>
        </Card>
        <Card class="panel_item">
            <p slot="title">新老客户交易构成</p>
            <div class="filter_box">
                <ButtonGroup style="margin:0 10px;">
                    <Button  :type="customParams.type==btn.type?'primary':'default'" v-for="(btn,index) in customTabs" :key="index" @click="customTab(btn.type)">{{btn.name}}</Button>
                </ButtonGroup>
                <DatePicker @on-change="pickCustomDate" type="month" show-week-numbers placement="bottom-end" placeholder="选择月份" style="width: 200px"></DatePicker>
            </div>
            <div class="trade_box">
                <Table border :columns="customColumns" :data="customData"></Table>
            </div>
        </Card>
    </div>
</template>
<script>
import {statementApi} from '@/api/index'
import echarts from 'echarts';
import V_Echarts from 'vue-echarts-directive';
export default {
    name:'Business',
    directives: {
        'echarts': V_Echarts
    },
    data () {
        return {
            tradeTabs:[
                {
                    type:'0',
                    name:'昨天'
                },
                {
                    type:'1',
                    name:'最近7日'
                },
                {
                    type:'2',
                    name:'最近30日'
                }
            ],
            tradeParams:{
                type:'0',
                startTime:'',
                endTime:'',
            },
            ChartOptions:{},
            tradeColumns: [
                {
                    title: '注册人数',
                    key: 'signCount',
                    align:'center'
                },
                {
                    title: '购买人数',
                    key: 'buyCount',
                    align:'center'
                },
                {
                    title: '成交转化率',
                    key: 'dealPercent',
                    align:'center'
                },
                {
                    title: '总金额',
                    key: 'totalCommissions',
                    align:'center'
                }
            ],
            tradeData: [],
            customTabs:[
                {
                    type:'1',
                    name:'本月'
                },
                {
                    type:'2',
                    name:'上月'
                }
            ],
            customParams:{
                type:'1',
                time:''
            },
            customColumns: [
                {
                    title: '付款金额',
                    key: 'commission',
                    align:'center'
                },
                {
                    title: '较前一月',
                    key: 'commissionPercent',
                    align:'center',
                    render: (h, { row, column, index }) => {
                        return this.showDatainCrease(h, row.commission,row.frontCommission)
                    }
                },
                {
                    title: '付款人数',
                    key: 'buyCount',
                    align:'center'
                },
                {
                    title: '较前一月',
                    key: 'buyCountPercent',
                    align:'center',
                    render: (h, { row, column, index }) => {
                        return this.showDatainCrease(h, row.buyCount,row.frontBuyCount)
                    }
                }
            ],
            customData: []
        }
    },
    created () {
        this.getTradeData();
        this.getCustomData();
        // let xData=['成交转化率','下单转化率']
        // let yData=[21,45]
        // this.setOption(xData,yData);
    },
    methods: {
        tradeTab(type){//交易数据切换
            this.tradeParams.type = type;
            this.getTradeData();
        },
        pickTradeDate(e){
            this.tradeParams.type = '100';
            this.tradeParams.startTime = e[0];
            this.tradeParams.endTime = e[1];
            this.getTradeData();
        },
        getTradeData(){//获取交易表单数据
            statementApi.getTradeData(this.tradeParams).then(res=>{
                this.tradeData=[];
                if(res.state == 0){
                    this.tradeData.push(res.data);
                }
            })
        },
        customTab(type){//数据切换
            this.customParams.type = type;
            this.getCustomData();
        },
        pickCustomDate(e){
            this.customParams.type = '100';
            this.customParams.time = e;
            this.getCustomData();
        },
        getCustomData(){
            statementApi.getCustomData(this.customParams).then(res=>{
                this.customData=[];
                if(res.state == 0){
                    this.customData.push(res.data);
                }
            })
        },
        showDatainCrease(h, thisData,fromData){
            if(thisData == fromData){
                return h('div', [
                    h('span', 0)
                ]);
            }else if(fromData==0){
                return h('div', [
                    h('Icon',{
                        props:{
                            type: "ios-arrow-round-up" 
                        },
                            style: {
                            fontSize: '24px',
                            color: '#19be6b'
                        },
                    }),
                    h('span', thisData)
                ]);
            }else if(thisData==0){
                return h('div', [
                    h('Icon',{
                        props:{
                            type: "ios-arrow-round-down" 
                        },
                            style: {
                            fontSize: '24px',
                            color: '#ed4014'
                        },
                    }),
                    h('span', fromData)
                ]);
            }else{
                if(thisData>fromData){
                    return h('div', [
                        h('Icon',{
                            props:{
                                type: "ios-arrow-round-up" 
                            },
                            style: {
                                fontSize: '24px',
                                color: '#19be6b'
                            },
                        }),
                        h('span', this.getNumFixed((thisData-fromData)/fromData*100))
                    ]);
                }else{
                    return h('div', [
                        h('Icon',{
                            props:{
                                type: "ios-arrow-round-down" 
                            },
                            style: {
                                fontSize: '24px',
                                color: '#ed4014'
                            },
                        }),
                        h('span', this.getNumFixed((fromData-thisData)/fromData*100))
                    ]);
                }
            }
        },
        getNumFixed(num){
            let numString = num+'';
            let newVal = numString.split('.')[1]?numString.split('.')[1].length:0;
            if(newVal>2){
                let getVal = num.toFixed(2);
                if(getVal==Math.ceil(getVal)){
                    return Math.ceil(getVal)+'%';
                }
                return getVal+'%'
            }else{
                return num+'%';
            }
        },
        setOption(xData,yData){//设置订单数据表
            let option={
                title: {
                    text: '订单数据',
                    x:'center',
                    top: '25',
                    textStyle:{
                        color:'#666',
                        fontSize:16
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '交易统计',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'成交转化率'},
                            {value:310, name:'下单转化率'},
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
                color: [
                    '#00acee',
                    '#79d9f1',
                ],
            }
            this.ChartOptions=option;
        },
    }
}
</script>

