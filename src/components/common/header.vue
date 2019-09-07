<template>
    <Header>
        <Menu mode="horizontal" theme="dark">
            <div class="layout-logo"><Avatar :src="logo" />觅场管理后台</div>
            <div class="layout-nav">
                <Avatar icon="ios-person" :src="userInfo.head_icon" />
                <Dropdown>
                    <a href="javascript:void(0)">
                        <span>{{userInfo.type==1?'超级管理员':userInfo.name}}</span>
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem><p @click="signOut">退出</p></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </Menu>
    </Header>
</template>
<script>
import { mapState } from 'vuex'
import store from '@/vuex/index'
import {homeApi} from '@/api/index'
const logo = require('@/assets/logo.png')
export default {
    name:'siteHeader',
    data () {
        return {
            logo:logo
        }
    },
    computed: {
        ...mapState({
            userInfo: function (state) {
                return state.userInfo;
            }
        })
    },
    created () {
        this.$bus.$on('changeInfo',info=>{
            this.userInfo.head_icon = info.avatar;
        })  
    },
    methods: {
        signOut(){//用户退出
            homeApi.loginOut().then(res=>{
                if(res.state ==0){
                    this.$Message.info('退出成功...');
                    setTimeout(()=>{
                        localStorage.removeItem('userInfo');
                        localStorage.removeItem('sessionId');
                        this.$router.push('/login');
                        window.location.reload();
                    },1000)
                }
            });
        }
    }
}
</script>
<style>
.layout-logo .ivu-avatar{
    margin-right: 10px;
    vertical-align: top;
}
</style>


