<style lang="less" scoped>
.trend_header{
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 99;
    .trend_tab{
        display: inline-block;
        span{
            margin: 0 10px;
            font-size: 14px;
            color: #999;
            font-weight: 600;
            cursor: pointer;
            &.on{
                color: #2d8cf0;
            }
        }
    }
    .pick_date{
        display: inline-block;
        width: 200px;
    }
}
.empty_icon{
    display: inline-block;
    width: 20px;
}
</style>

<template>
    <div>
        <div class="statist_sider">
            <div class="sider_item">
                <p class="title">本月总数</p>
                <p class="value">{{chartData.thisMonth}}</p>
                <p class="trend add" v-if="chartData.monthPercent.type>0">
                    <Icon type="md-arrow-dropup" /><span class="percent">{{chartData.monthPercent.val}}</span><span class="txt">同比上月</span>
                </p>
                <p class="trend reduce" v-else-if="chartData.monthPercent.type<0">
                    <Icon type="md-arrow-dropdown" /><span class="percent">{{chartData.monthPercent.val}}</span><span class="txt">同比上月</span>
                </p>
                <p v-else>
                    <span class="empty_icon"></span><span class="percent">{{chartData.monthPercent.val}}</span><span class="txt">同比上月</span>
                </p>
            </div>
            <div class="sider_item">
                <p class="title">本周数量</p>
                <p class="value">{{chartData.thisWeek}}</p>
                <p class="trend add" v-if="chartData.weekPercent.type>0">
                    <Icon type="md-arrow-dropup" /><span class="percent">{{chartData.weekPercent.val}}</span><span class="txt">同比上周</span>
                </p>
                <p class="trend reduce"  v-else-if="chartData.weekPercent.type<0">
                    <Icon type="md-arrow-dropdown" /><span class="percent">{{chartData.weekPercent.val}}</span><span class="txt">同比上周</span>
                </p>
                <p v-else>
                    <span class="empty_icon"></span><span class="percent">{{chartData.weekPercent.val}}</span><span class="txt">同比上周</span>
                </p>
            </div>
        </div>
        <div class="statist_content">
            <div class="trend_header">
                <div class="trend_tab">
                    <span :class="tab.type == params.type?'on':''" @click="switchCharts(tab.type)" v-for="(tab,index) in tab" :key="index" :type="tab.type">{{tab.name}}</span>
                </div>
                <div class="pick_date">
                    <DatePicker @on-change="pickDateChange" :value="dateRange" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择日期范围"></DatePicker>
                </div>
            </div>
            <div class="trend_box" v-echarts="ChartOptions"></div>
        </div>
        
    </div>
</template>
<script>
import echarts from 'echarts';
import V_Echarts from 'vue-echarts-directive';
import {homeApi} from '@/api/index'
export default {
    name:'lineEcharts',
    directives: {
        'echarts': V_Echarts
    },
    data(){
        return{
            tab:[
                {
                    type:1,
                    name:'今日'
                },
                {
                    type:2,
                    name:'本周'
                },
                {
                    type:3,
                    name:'本月'
                }
            ],
            params:{
                type:1,
                startTime:'',
                endTime:''
            },
            chartData:{
                monthPercent:{type:'',val:''},
                weekPercent:{type:'',val:''},
            },
            dateRange:[],
            ChartOptions:{}
        }
    },
    watch: {
        params:{
            handler(val){
                this.getEchartsData();
            },
            deep:true
        }
    },
    mounted () {
        this.getEchartsData();
    },
    methods: {
        //切换 tab
        switchCharts(type){
            this.params.type = type;
        },
        //日期选择
        pickDateChange(e){
            this.dateRange = e;
            this.params.type = 4;
            this.params.startTime = e[0];
            this.params.endTime = e[1];
        },
        setOption(header,xData,yData){//设置统计表数据
            let lineColor="#2d8cf0";
            let areaStyle={
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(45, 140, 240, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(45, 140, 240, 0.04)'
                    }], false)
                }
            };
            let option={
                title: {
                    text: header,
                    show:true,
                    textStyle:{
                        color:'#999',
                        fontSize:12
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: lineColor
                        }
                    }
                },
                grid: {
                    left: '20',
                    right: '40',
                    bottom: '10',
                    top: '50',
                    containLabel: true
                },
                xAxis: [
                    {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#e4e4e4'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            color: '#666'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    data:xData
                }],
                yAxis: [{
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e4e4e4'
                        }
                    },
                    axisLabel: {
                        margin: 4,
                        textStyle: {
                            fontSize: 14,
                            color: '#666'
                        }
                    }
                }],
                series: [{
                    name: '',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    showSymbol: true,
                    animationDelay: 0,
                    animationDuration: 1000,
                    symbolSize: '6',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2, //折线宽度
                            },
                            color: lineColor
                        }
                    },
                    areaStyle:areaStyle,
                    data: yData
                } ]
            }
            this.ChartOptions=option;
        },
        getEchartsData(){//获取echarts数据
            homeApi.getEchartsData(this.params).then(res=>{
                if(res.state == 0){
                    let type = this.params.type;
                    let typeTitle = null;
                    switch(type){
                        case 1:
                            typeTitle='今日统计数据';
                            break;
                        case 2:
                            typeTitle="近一周统计数据";
                            break;
                        case 3:
                            typeTitle="本月统计数据";
                            break;
                        default:
                            typeTitle=this.params.startTime+ '-'+this.params.endTime
                    }
                    let getData = res.data;
                    let xData = getData.xdata;
                    let yData = getData.ydata;
                    this.chartData = {
                        lastMonth: getData.lastMonth,
                        lastWeek: getData.lastWeek,
                        thisMonth: getData.thisMonth,
                        thisWeek: getData.thisWeek,
                        monthPercent:this.getPercent(getData.thisMonth,getData.lastMonth),
                        weekPercent:this.getPercent(getData.thisWeek,getData.lastWeek),
                    }
                    this.setOption(typeTitle,xData,yData);
                }
            })
        },
        getPercent(thisVal,lastVal){
            if(thisVal == lastVal){
                return {type:0,val:0};
            }else if(thisVal == 0){
                return {type:-1,val:lastVal};
            }else if(lastVal == 0){
                return {type:1,val:thisVal};
            }else{
                if(thisVal>lastVal){
                    return {
                        type:1,
                        val:this.getNumFixed((thisVal-lastVal)/lastVal*100)
                    }
                }else{
                    return {
                        type:-1,
                        val:this.getNumFixed((lastVal-thisVal)/lastVal*100)
                    }
                }
            }
        },
        getNumFixed(num){
            let numString = num+'';
            let newVal = numString.split('.')[1]?numString.split('.')[1].length:0;
            if(newVal>2){
                return num.toFixed(2)+'%'
            }else{
                return num+'%';
            }
        },
    }
}
</script>
