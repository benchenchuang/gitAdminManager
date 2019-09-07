import Vuex from 'vuex'
import Vue from 'vue'
import { AdminRouter } from '@/router/admin'//管理员

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: {},//用户信息
        navList: [],//权限路由
        parentName:'',//路由所属父级名称
    },
    mutations: {
        userInfo(state,userData){
            state.userInfo = Object.assign({},state.userInfo,userData)
        },
        navList(state,navList){
            state.navList = navList;
        },
        parentName(state,parentName){
            state.parentName = parentName
        },
        getParent(state){
            return state.parentName
        },
        CLEAR_MENU(state) {
            state.navList = []
        },
    },
    actions: {
        parentName:({commit},parentName)=>commit('parentName',parentName),
        userInfo:({commit},userData)=>commit('userInfo',userData),
        permission:({commit},role)=>{
            let routerArry= deepCopy(AdminRouter);
            commit('navList',routerArry)
        },
        getParentName:({commit})=>{
            return commit('getParent')
        }
    }
});
//深拷贝
function deepCopy(routerArr){
    return routerArr.map(arr=>{
        arr = Object.assign({},arr);
        return arr;
    })
}

export default store;