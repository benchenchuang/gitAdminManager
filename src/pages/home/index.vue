<style lang="less">
.trend_box{
    height: 500px;
    box-sizing: border-box;
    div:first-child,
    canvas{
        width: 100%!important;
    }
}
.total_box{
    margin: 30px 0;
    .item .ivu-card-body{
        padding: 20px 10px;
        position: relative;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        .ivu-icon{
            width: 68px;
            font-size: 48px;
            vertical-align: middle;
        }
        .item_side{
            flex: 1;
            -webkit-flex:1;
            .num{
                font-size: 28px;
                color: #2d8cf0;
            }
            .name{
                position: absolute;
                right: 10px;
                bottom:10px;
                font-size: 13px;
                color: #808695;
            }
        }
    }
}
.header{
    font-size: 16px;
    color: #333;
    i{
        font-size: 20px;
        margin-right: 4px;
        vertical-align: top;
    }
}
.ivu-card-head{
    background: #f8f8f8!important;
}
.statist_tip{
    text-align: center;
    padding: 40px 0;
    font-size: 18px;
}
</style>

<template>
    <div class="main_wrap panel">
        <div class="total_box">
            <Row type="flex" justify="space-between">
                <Col span="7">
                    <Card class="item">
                        <Icon type="md-contacts" />
                        <div class="item_side">
                            <p class="num">{{allNum}}</p>
                            <p class="name">总人数</p>
                        </div>
                    </Card>
                </Col>
                <Col span="7">
                    <Card class="item">
                        <Icon type="ios-cash" />
                        <div class="item_side">
                            <p class="num">{{todayNum}}</p>
                            <p class="name">今日人数</p>
                        </div>
                    </Card>
                </Col>
                <Col span="7">
                    <Card class="item">
                        <Icon type="ios-people" />
                        <div class="item_side">
                            <p class="num">{{tomorryNum}}</p>
                            <p class="name">明日预约人数</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
        <Card>
            <p slot="title" class="header">
                <Icon type="md-stats" />teamLab未来游乐园数据统计
            </p>
            <div class="statist_box" v-if="dailyData">
                <div class="trend_box" v-echarts="ChartOptions"></div>
            </div>
            <div class="statist_box" v-else>
                <p class="statist_tip">暂无统计数据</p>
            </div>
        </Card>
    </div>
</template>
<script>
import echarts from 'echarts';
import V_Echarts from 'vue-echarts-directive';
import {commonApi} from '@/api/index'
export default {
    name:'statics',
    directives: {
        'echarts': V_Echarts
    },
    data(){
        return{
            allNum: 0,
            todayNum: 0,
            tomorryNum: 0,
            ChartOptions:{},
            timer:null,
            dailyData:false,
            todayDay:null,
            tomorryDay:null,
        }
    },
    created(){
        let todayTime = new Date();
        let todayDay = todayTime.getFullYear()+'-'+this.toDouble(todayTime.getMonth()+1)+'-'+this.toDouble(todayTime.getDate());
        let tomorryTime =new Date(todayTime.getTime()+ 24 * 60 * 60 * 1000);
        let tomorryDay = tomorryTime.getFullYear()+'-'+this.toDouble(tomorryTime.getMonth()+1)+'-'+this.toDouble(tomorryTime.getDate());
        this.todayDay = todayDay;
        this.tomorryDay = tomorryDay;
        this.getDailyNum();
        this.timer = setInterval(()=>{
            this.getDailyNum();
        },1000*60*10)
    },
    methods:{
        getHomeData(){
            this.getNumByDay(todayDay+'','todayNum');
            this.getNumByDay(tomorryDay+'','tomorryNum');
            this.getDailyNum();
        },
        //获取单独日期的数据
        getNumByDay(date,numBox){
            commonApi.getNumByDay(date).then(res=>{
                if(res.code==200){
                    this[numBox] = res.data.totalNum;
                }
            });
        },
        //获取每日数据
        getDailyNum(){
            commonApi.getDailyNum().then(res=>{
                if(res.code==200){
                    let allNum = 0;
                    let dailyData = res.data;
                    let xData=[]
                    let yData=[]
                    if(dailyData.length){
                        this.dailyData = true;
                        dailyData.map(item=>{
                            if(item.day==this.todayDay){
                                this.todayNum = item.totalNum;
                            }
                            if(item.day==this.tomorryDay){
                                this.tomorryNum = item.totalNum;
                            }
                            allNum+=item.totalNum;
                            xData.push(item.day)
                            yData.push(item.totalNum)
                        });
                        this.allNum = allNum;
                        this.setOption(xData,yData);
                    }else{
                        this.dailyData = false;
                    }
                }
            })
        },
        setOption(xData,yData){//设置统计表数据
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
                // title: {
                //     text: '数据统计',
                //     show:true,
                //     x: 'center',
                //     textStyle:{
                //         color:'#050a40',
                //         fontSize:18
                //     }
                // },
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
        toDouble(num){
            return num<10?'0'+num:num;
        }
    },
    destroyed(){
        clearInterval(this.timer)
    }
}
</script>

