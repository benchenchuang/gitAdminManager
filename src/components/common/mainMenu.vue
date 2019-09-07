<template>
    <div ref="mainMenu" class="main_menu">
        <Menu theme="light" width="auto" :active-name="activeName" :open-names="openNames" accordion ref="mekeMenu">
            <div v-for="(item, index) in navList" :key="index">
                <div v-if="item.children">
                    <Submenu :name="item.name">
                        <template slot="title">
                            <Icon :type="item.icon"/>{{item.title}}
                        </template>
                        <MenuItem v-for="(child, k) in item.children" :key="k" :to="child.path" :name="child.name">{{child.title}}</MenuItem>
                    </Submenu>
                </div>
                <div v-else>
                    <MenuItem :name="item.name" :to="item.path"><Icon :type="item.icon"/>{{item.title}}</MenuItem>
                </div>
            </div>
        </Menu>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { AdminRouter } from '@/router/admin'
import store from '@/vuex/index'
export default {
    name:'mainMenu',
    data () {
        return {
            activeName:'',
            openNames:[]
        }
    },
    watch:{
        $route(to,from){
            this.activeName = '';
            this.openNames = []
            this.$nextTick(()=>{
                this.activeName = to.name;
                let openName = to.meta.parentName?to.meta.parentName:to.name;
                this.openNames.push(openName)
                this.$refs.mekeMenu.updateOpened();
                this.$refs.mekeMenu.updateActiveName();
            })
        }
    },
    created () {
        this.setMenuItem();
    },
    computed: {
        ...mapState({
            navList: function (state) {
                if (state.userInfo.type) {
                    return state.navList[0].children;
                }
            }
        })
    },
    methods: {
        setMenuItem(){//设置路由显示
            let state = store.state;
            this.openNames=[];
            this.openNames.push(state.parentName)
            let pathArray = this.$route.path.slice(1).split('/');
            if(pathArray.length>1){
                this.activeName = pathArray[pathArray.length-1];
            }else{
                this.activeName = state.parentName;
            }
        }
    }
}
</script>

