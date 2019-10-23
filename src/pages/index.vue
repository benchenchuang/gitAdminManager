<template>
    <div class="layout">
        <Layout>
            <siteHeader></siteHeader>
            <Layout>
                <Sider :style="{background: '#fff'}">
                    <happy-scroll color="rgba(0,0,0,0.2)" hide-horizontal resize size="2">
                        <mainMenu ref="siteMenu"/>
                    </happy-scroll>
                </Sider>
                <happy-scroll color="rgba(0,0,0,0.2)" resize hide-horizontal>
                    <Layout class="wrap_box">
                        <Content ref="siteWrap" class="site_content">
                            <transition name="fade" mode="out-in" enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
                                <router-view class="animated" />
                            </transition>
                        </Content>
                    </Layout>
                </happy-scroll>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import store from '@/vuex/index'
import * as axiosApi from '../api/index'
import siteHeader from '@/components/common/header'
import mainMenu from '@/components/common/mainMenu'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
export default {
    name:'Home',
    components:{
        siteHeader,
        mainMenu,
        HappyScroll
    }
}
</script>
<style lang="less">
.animated {
    -webkit-animation-duration: .4s !important;
    animation-duration: .4s !important;
}
.ivu-layout.wrap_box{
    padding: 20px 20px 74px;
    height:100%;
}
.ivu-layout-header{
    padding: 0 20px 0 50px;
    position: relative;
    z-index: 9;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    height: 100vh;
    overflow: hidden;
}
.layout-logo{
    // width: 100px;
    height: 32px;
    line-height: 32px;
    font-size: 20px;
    text-align: center;
    color: #fff;
    // background: #5b6270;
    // border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 10px;
}
.layout-nav{
    position: relative;
    float: right;
    margin-top: 16px;
    height: 32px;
    line-height: 32px;
    font-size:14px;
    color:#fff;
    cursor: pointer;
    .ivu-dropdown-rel{
        padding-bottom: 12px;
        a{
            color: #fff;
        }
    }
    span{
        margin-left: 6px;
        display: inline-block;
        vertical-align: top;
    }
    i{
        vertical-align: top;
        margin-top: 10px;
    }
    .ivu-icon-ios-person{
        margin-top: 0;
    }
}
.ivu-menu-submenu{
    .ivu-icon{
        font-size: 16px;
    }
}
.ivu-menu-submenu,
.ivu-menu-item{
    font-size: 16px !important;
    .ivu-menu-item{
        font-size: 14px !important;
    }
}
.ivu-layout-sider-children .happy-scroll-container{
    height: auto !important;
}
.ivu-layout-sider,
.main_menu{
    padding-top: 64px;
    margin-top: -64px;
    height: 100vh;
    box-sizing: border-box;
    &>.ivu-menu{
        padding-bottom: 40px;
    }
}
.happy-scroll-container .happy-scroll-content{
    display: block !important;
    border-right: 1px solid transparent !important;
}
.happy-scroll{
    overflow: auto!important;
    height: 100vh!important;
}
.happy-scroll-container{
    width: 100% !important;
    height: 100%!important;
}
.main_wrap{
    padding: 20px;
    background: #fff;
    .table_page{
        text-align: right;
        margin: 20px 0;
    }
}
</style>
