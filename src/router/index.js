import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/index'
const Login =() => import('@/pages/login');
import { AdminRouter } from '@/router/admin'

Vue.use(Router)
//公共页面
let routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: '登陆',
    component: Login
  }
];

let router = new Router({
  routes: routes,
  // mode: 'history'
})

router.beforeEach((to, from, next) => {
  let parentName = to.meta.parentName || to.name;
  store.dispatch('parentName', parentName)
  
  if(to.meta.title){
      document.title = to.meta.title;
  }
  let info = store.state.userInfo;//获取用户信息
  let infoLength = Object.keys(info).length===0;
  if(infoLength && to.path!='/login'){
    let userInfo = JSON.parse(localStorage.getItem('userInfo')) || '';
    if((userInfo.userName=='admin' && userInfo.password=='201910')||(userInfo.userName=='vistor' && userInfo.passWord=="123456")){
      store.dispatch('userInfo', userInfo)//用户信息存入vuex
      store.dispatch('permission', userInfo.type).then(()=>{
        router.addRoutes(store.state.navList, { replace: true });
        next({ ...to, replace: true })
      })
    }else{
      localStorage.removeItem('userInfo');
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      });
    }
  }else{
    let userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
    if(to.path=='/login'){
      if(userInfo){
        next({
          path: '/meke/index'
        });
      }else{
        next()
      }
    }else{
      next()
    }
  }
})
export default router