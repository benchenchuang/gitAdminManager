const Index = () => import('@/pages/index');
const Home = () => import('@/pages/home/index');
const Concats = () => import('@/pages/concats/index');
const Bill = () => import('@/pages/bill/index');
const systemHome = () => import('@/pages/home/home');
const homeRecord = () => import('@/pages/home/record');
const Error = () => import('@/pages/error');
const Enlist = () => import('@/pages/enlist/enlist');
const SettingIndex = () => import('@/pages/setting/index');
const Trade = () => import('@/pages/setting/trade');
const Hobby = () => import('@/pages/setting/hobby');
const Report = () => import('@/pages/setting/report');
const myInfo = () => import('@/pages/setting/myInfo');
const Mass = () => import('@/pages/setting/mass');
const Commission = () => import('@/pages/setting/commission');
const UserlistIndex = () => import('@/pages/userlist/index');
const Userlist = () => import('@/pages/userlist/userlist');
const enterpriseApply = () => import('@/pages/enterpriseApply/index');
const memberShip = () => import('@/pages/memberShip/index');
const Finance = () => import('@/pages/finance/index');
const Circle = () => import('@/pages/circle/index');
const Distribution = () => import('@/pages/distribution/index');
const Statistics = () => import('@/pages/statistics/index');
const Business = () => import('@/pages/statistics/business');
const searchStatis = () => import('@/pages/statistics/search');
const circleStatis = () => import('@/pages/statistics/circle');
const Reports = () => import('@/pages/report/index');
const CardReports = () => import('@/pages/report/card');
const ArticleReports = () => import('@/pages/report/article');
const virtualList=() => import('@/pages/virtual/index');

const roleRouters = [
  {
    path: '/meke/index',
    title: '首页',//路由显示
    name: "index",//name 与 path最后一个路径相同
    icon: 'md-laptop',
    component: Home,
    redirect: '/meke/home',
    meta: {
      title: "管理首页"
    },
    children: [
      {
        path: '/meke/home',
        title: '系统首页',
        name: "home",
        icon: 'md-laptop',
        component: systemHome,
        meta: {
          title: "系统首页",
          parentName: 'index'
        },
      },
      {
        path: '/meke/daily_record',
        title: '登陆日志',
        name: "daily_record",
        icon: 'md-laptop',
        component: homeRecord,
        meta: {
          title: "登陆日志",
          parentName: 'index'
        },
      }
    ]
  },
  {
    path: '/meke/circle',
    title: '觅客圈',
    name: "circle",
    icon: 'md-aperture',
    component: Circle,
    meta: {
      title: "觅客圈",
    }
  },
  {
    path: '/meke/concats',
    title: '人脉宝藏',
    name: "concats",
    icon: 'ios-cube-outline',
    component: Concats,
    meta: {
      title: "人脉宝藏",
    }
  },
  {
    path: '/meke/finance',
    title: '佣金列表',
    name: "finance",
    icon: 'logo-bitcoin',
    component: Finance,
    meta: {
      title: "佣金列表",
    },
  },
  {
    path: '/meke/distribution',
    title: '分销列表',
    name: "distribution",
    icon: 'logo-yen',
    component: Distribution,
    meta: {
      title: "分销列表",
    }
  },
  {
    path: '/meke/enlist',
    title: '报名列表',
    name: "enlist",
    icon: 'md-clipboard',
    component: Enlist,
    meta: {
      title: "报名列表",
    },
  },
  {
    path: '/meke/bill',
    title: '海报库',
    name: "bill",
    icon: 'ios-list-box-outline',
    component: Bill,
    meta: {
      title: "海报库",
    }
  },
  {
    path: '/meke/setting_index',
    title: '设置',
    name: "setting_index",
    icon: 'ios-build-outline',
    component: SettingIndex,
    redirect: '/meke/hobby',
    meta: {
      title: "设置",
    },
    children: [
      {
        path: '/meke/commission',
        title: '佣金比例',
        name: "commission",
        icon: 'ios-build-outline',
        component: Commission,
        meta: {
          title: "佣金比例",
          parentName: 'setting_index'
        },
      },
      {
        path: '/meke/myInfo',
        title: '账户设置',
        name: "myInfo",
        icon: 'ios-build-outline',
        component: myInfo,
        meta: {
          title: "账户设置",
          parentName: 'setting_index'
        },
      },
      {
        path: '/meke/mass',
        title: '群发管理',
        name: "mass",
        icon: 'ios-build-outline',
        component: Mass,
        meta: {
          title: "群发管理",
          parentName: 'setting_index'
        },
      },
      {
        path: '/meke/hobby',
        title: '兴趣爱好',
        name: "hobby",
        icon: 'ios-build-outline',
        component: Hobby,
        meta: {
          title: "兴趣爱好",
          parentName: 'setting_index'
        },
      },
      {
        path: '/meke/report_type',
        title: '举报类型',
        name: "report_type",
        icon: 'ios-build-outline',
        component: Report,
        meta: {
          title: "举报类型",
          parentName: 'setting_index'
        },
      },
      {
        path: '/meke/trade',
        title: '行业',
        name: "trade",
        icon: 'ios-build-outline',
        component: Trade,
        meta: {
          title: "行业",
          parentName: 'setting_index'
        },
      }
    ]
  },
  {
    path: '/meke/userlist_index',
    title: '用户',
    name: "userlist_index",
    icon: 'ios-people',
    component: UserlistIndex,
    meta: {
      title: "管理用户"
    },
    children: [
      {
        path: '/meke/userlist',
        title: '用户列表',
        name: "userlist",
        icon: 'md-body',
        component: Userlist,
        meta: {
          title: "用户列表",
          parentName: 'userlist_index'
        }
      }
    ]
  },
  {
    path: '/meke/member_ship',
    title: '账户管理',
    name: "member_ship",
    icon: 'md-person-add',
    component: memberShip,
    meta: {
      title: "账户管理",
    },
  },
  {
    path: '/meke/enterprise',
    title: '企业申请',
    name: "enterprise",
    icon: 'md-paper',
    component: enterpriseApply,
    meta: {
      title: "企业申请",
    },
  },
  {
    path: '/meke/statistics',
    title: '数据统计',
    name: "statistics",
    icon: 'ios-stats-outline',
    component: Statistics,
    meta: {
      title: "数据统计",
    },
    children: [
      {
        path: '/meke/business',
        title: '交易统计',
        name: "business",
        icon: 'md-body',
        component: Business,
        meta: {
          title: "交易统计",
          parentName: 'statistics'
        }
      },
      {
        path: '/meke/search_statis',
        title: '搜索统计',
        name: "search_statis",
        icon: 'ios-search',
        component: searchStatis,
        meta: {
          title: "搜索统计",
          parentName: 'statistics'
        }
      },
      {
        path: '/meke/circle_statis',
        title: '觅客圈统计',
        name: "circle_statis",
        icon: 'ios-search',
        component: circleStatis,
        meta: {
          title: "觅客圈统计",
          parentName: 'statistics'
        }
      }
    ]
  },
  {
    path: '/meke/report',
    title: '举报管理',
    name: "report",
    icon: 'md-flag',
    component: Reports,
    redirect: '/report/card',
    meta: {
      title: "举报管理",
    },
    children: [
      {
        path: '/report/card',
        title: '名片举报',
        name: "card",
        icon: 'md-laptop',
        component: CardReports,
        meta: {
          title: "名片举报",
          parentName: 'report'
        },
      },
      {
        path: '/report/article',
        title: '作品举报',
        name: "article",
        icon: 'md-laptop',
        component: ArticleReports,
        meta: {
          title: "作品举报",
          parentName: 'report'
        },
      }
    ]
  },
  {
    path: '/meke/virtual',
    title: '机器人',
    name: "virtual",
    icon: 'ios-bug-outline',
    component: virtualList,
    meta: {
      title: "机器人",
    },
  },
]
export const AdminRouter = [
  {
    path: '/meke',
    title: 'home_index',
    icon: 'stats-bars',
    component: Index,
    redirect: '/meke/index',
    children: roleRouters,
  },
  {
    path: '*',
    name: '404页面',
    icon: 'md-error',
    component: Error,
  },
]
