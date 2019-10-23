<template>
    <Header>
        <Menu mode="horizontal" theme="dark">
            <div class="layout-logo"><Avatar :src="logo" />昆明恒隆-teamLab未来游乐园</div>
            <div class="layout-nav">
                <Avatar icon="ios-person" :src="logo" />
                <Dropdown>
                    <a href="javascript:void(0)">
                        <span>昆明恒隆管理员</span>
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
            this.$Message.info('退出成功...');
            setTimeout(()=>{
                localStorage.removeItem('userInfo');
                localStorage.removeItem('sessionId');
                this.$router.push('/login');
                // window.location.reload();
            },1000)
        }
    }
}
</script>
<style>
.layout-logo .ivu-avatar{
    margin-right: 10px;
    vertical-align: top;
}
.ivu-layout-header,
.ivu-menu-dark{
    background: #050a40;
}
</style>


