const Index = () => import('@/pages/index');
const Home = () => import('@/pages/home/index');
const Infomation = () => import('@/pages/infomation/index');
const settingTimes = () => import('@/pages/settingTime/index');
const settingDate = () => import('@/pages/settingDate/index');
const settingTip = () => import('@/pages/settingTip/index');

const roleRouters = [
  {
    path: '/meke/index',
    title: '首页',//路由显示
    name: "index",//name 与 path最后一个路径相同
    icon: 'md-stats',
    component: Home,
    meta: {
      title: "首页",
      role: [1,2],
    }
  },
  {
    path: '/meke/infomation',
    title: '预约信息',
    name: "infomation",
    icon: 'md-laptop',
    component: Infomation,
    meta: {
      title: "预约信息",
      role: [1,2],
    }
  },
  {
    path: '/meke/setting_times',
    title: '日期时间段',
    name: "setting_times",
    icon: 'md-time',
    component: settingTimes,
    meta: {
      title: "实时时间段",
      role: [1],
    }
  },
  // {
  //   path: '/meke/setting_date',
  //   title: '设置日期时间段',
  //   name: "setting_date",
  //   icon: 'md-calculator',
  //   component: settingDate,
  //   meta: {
  //     title: "设置日期时间段"
  //   }
  // },
  {
    path: '/meke/setting_tip',
    title: '设置预约提示',
    name: "setting_tip",
    icon: 'md-ionic',
    component: settingTip,
    meta: {
      title: "设置预约提示",
      role: [1],
    }
  }
]
export const AdminRouter = [
  {
    path: '/meke',
    title: 'home_index',
    icon: 'stats-bars',
    component: Index,
    redirect: '/meke/index',
    children: roleRouters,
    meta: {role: [1,2]}
  },
  {
    path: '*',
    name: '404页面',
    icon: 'md-error',
    component: Error,
    meta: {role: [1,2]}
  },
]
