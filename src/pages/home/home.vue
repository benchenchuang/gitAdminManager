<style lang="less">
.real_time{
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    background: #fff;
    .title{
        font-size: 16px;
        color:#333;
    }
    .time{
        margin-left: 10px;
        font-size: 13px;
        color: #999;
        .ivu-icon{
            vertical-align: -2px;
        }
    }
}
.total_box{
    margin:30px auto;
    .item{
        position: relative;
        background: #fff;
        .ivu-card-body{
            display: flex;
            display: -webkit-flex;
            align-items: center;
        }
        .ivu-icon{
            font-size: 48px;
            color: #2d8cf0;
        }
        .item_side{
            margin-left: 10px;
            color: #333;
            font-size: 16px;
            .name{
                font-size: 14px;
                color:#999;
            }
            .increase{
                position: absolute;
                right: 10px;
                bottom: 10px;
                font-size: 12px;
                color: #999;
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
.deal_events{
    .event_box{
        .event_item{
            display: block;
            padding: 15px 10px;
            border-bottom: 1px solid #e6e6e6;
            color: #666;
            &:last-child{
                border-bottom: none;
            }
            .num{
                float: right;
                color:crimson;
            }
            &:hover{
                color: #2d8cf0;
            }
        }
    }
}
.statistics{
    margin:30px auto;
    .statist_box{
        .statist_sider{
            float: left;
            padding: 20px 0 20px 20px;
            width: 160px;
            .sider_item{
                margin-bottom: 30px;
                font-size: 12px;
                color: #999;
                .value{
                    margin: 3px 0;
                    font-size: 24px;
                    color: #333;
                }
                .reduce{
                    i,.percent{
                        color: crimson;
                    }
                }
                .add{
                    i,.percent{
                        color: #19be6b;
                    }
                }
                i{
                    font-size: 20px;
                }
                .txt{
                    margin-left: 10px;
                }
            }
        }
        .statist_content{
            position: relative;
            margin-left: 160px;
            border-left: 1px solid #e6e6e6;
            padding: 20px 0 20px 20px;
            box-sizing: border-box;
            .trend_box{
                height: 300px;
                box-sizing: border-box;
                div:first-child,
                canvas{
                    width: 100%!important;
                }
            }
        }
    }
}
</style>

<template>
    <div>
        <div class="real_time">
            <span class="title">实时概况</span>
            <span class="time">更新时间：{{thisTime}} <Icon type="md-alarm" size="18"/></span>
        </div>
        <div class="total_box">
            <Row type="flex" justify="space-between">
                <Col span="4">
                    <Card class="item">
                        <Icon type="ios-paper" />
                        <div class="item_side">
                            <p class="name">名片销量总数</p>
                            <p class="num">{{realData.totalNum?realData.totalNum:0}}</p>
                            <p class="increase">昨日：{{realData.zuoNum?realData.zuoNum:0}}</p>
                        </div>
                    </Card>
                </Col>
                <Col span="4">
                    <Card class="item">
                        <!-- <Icon type="logo-yen" /> -->
                        <Icon type="ios-cash" />
                        <div class="item_side">
                            <p class="name">今日销售总额</p>
                            <p class="num">￥{{realData.totalPrice?realData.totalPrice:0}}</p>
                            <p class="increase">昨日：{{realData.zuoPrice?realData.zuoPrice:0}}</p>
                        </div>
                    </Card>
                </Col>
                <Col span="4">
                    <Card class="item">
                        <Icon type="ios-people" />
                        <div class="item_side">
                            <p class="name">累计用户数</p>
                            <p class="num">{{realData.totalUser?realData.totalUser:0}}</p>
                            <p class="increase">昨日：{{realData.zuoUser?realData.zuoUser:0}}</p>
                        </div>
                    </Card>
                </Col>
                <Col span="4">
                    <Card class="item">
                        <Icon type="md-pricetag" />
                        <div class="item_side">
                            <p class="name">一级佣金总额</p>
                            <p class="num">￥{{realData.totalLevelOne?realData.totalLevelOne:0}}</p>
                            <p class="increase">昨日：{{realData.zuototalLevelOne?realData.zuototalLevelOne:0}}</p>
                        </div>
                    </Card>
                </Col>
                <Col span="4">
                    <Card class="item">
                        <Icon type="md-pricetags" />
                        <div class="item_side">
                            <p class="name">二级佣金总额</p>
                            <p class="num">￥{{realData.totalLevelTwo?realData.totalLevelTwo:0}}</p>
                            <p class="increase">昨日：{{realData.zuototalLevelTwo?realData.zuototalLevelTwo:0}}</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>

        <div class="deal_events" v-if="dealEvents && userType<6">
            <Card>
                <p slot="title" class="header">
                    <Icon type="ios-paper" />待处理事务
                </p>
                <div class="event_box">
                    <router-link :to="{name:'card',params:{from:'待处理'}}" class="event_item" v-if="userType<=3">
                        <span>待举报处理-名片</span>
                        <span class="num">( {{dealEvents.cardsNum}} )</span>
                    </router-link>
                    <router-link  :to="{name:'article',params:{from:'待处理'}}" class="event_item" v-if="userType<=3">
                        <span>待举报处理-作品</span>
                        <span class="num">( {{dealEvents.circleNum}} )</span>
                    </router-link>
                    <router-link :to="{ name: 'finance',params:{to:'bill'}}" class="event_item" v-if="userType ==1 || userType==4 || userType==5">
                        <span>待提现</span>
                        <span class="num">( {{dealEvents.billNum}} )</span>
                    </router-link>
                </div>
            </Card>
        </div>

        <div class="statistics">
            <Card>
                <p slot="title" class="header">
                    <Icon type="md-stats" />名片销售统计
                </p>
                <div class="statist_box">
                    <lineEcharts/>
                </div>
            </Card>
        </div>

    </div>
</template>
<script>
import lineEcharts from './components/lineEcharts'
import {homeApi,filterDate} from '@/api/index'
import { mapState } from 'vuex'
export default {
    name:'home',
    components: {
        lineEcharts
    },
    data () {
        return {
            realData:{},
            thisTime:'',
            dealEvents:null
        }
    },
    created () {
        this.getRealData();
        this.getRealTime();
        this.getDealList();
    },
    computed: {
        ...mapState({
            userType: function (state) {
                return Number(state.userInfo.type);
            }
        })
    },
    methods: {
        getRealData(){//获取实时概况
            homeApi.getTotalInfo().then(res=>{
                if(res.state ==0){
                    this.realData = res.data;
                }
            })
        },
        getRealTime(){//获取实时时间
            let realTime = new Date();
            this.thisTime = filterDate.msToDate(realTime)
        },
        getDealList(){//获取待处理事务
            homeApi.getDealEvents().then(res=>{
                if(res.state == 0){
                    this.dealEvents = res.data;
                }
            })
        }
    }
}
</script>


