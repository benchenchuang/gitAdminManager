<style lang="less" scoped>
.mailTable,
.mailTable tr,
.mailTable tr td {
  border: 1px solid #e6eaee;
  border-collapse: collapse;
}
　　.mailTable {
  font-size: 12px;
  color: #71787e;
  margin-right: auto;
  margin-left: auto;
}
　　.mailTable tr td {
  border: 1px solid #e6eaee;
  width: 350px;
  height: 50px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
}
　.mailTable tr td.column {
  background-color: #eff3f6;
  color: #393c3e;
  width: 200px;
}
.record {
  color: black;
  font-size: 24px;
}
.page_num {
  margin: 30px 0;
  text-align: right;
}
.other {
  width: 100px !important;
  text-align: center;
}
.othervip {
  width: 150px;
  height: 30px;
  color: white;
  background-color: red;
  border-radius: 25px;
  margin-right: auto;
  margin-left: auto;
}
.xinxi {
  margin-top: 50px;
  margin-bottom: 30px;
}
.other img {
  width: 132px;
  height: 132px;
}
</style>
<template>
  <div class="edit detailsModal">
    <Modal v-model="computedValue" :transfer="false" :mask-closable="false" footer-hide title="查看">
      <div slot="header">
        <div class="record">查看详情</div>
      </div>
      <table class="mailTable">
        <tr>
          <td rowspan="9" class="other">
            <img :src="detail.headIcon" alt>
            <div>{{detail.phone}}</div>
            <div class="othervip" v-if="type==1">VIP会员</div>
            <div class="othervip" v-if="type==0">非VIP会员</div>
          </td>
          <td class="column">姓名</td>
          <td>{{detail.nickName}}</td>
          <td class="column">学历</td>
          <td>{{detail.education}}</td>
        </tr>
        <tr>
          <td class="column">性别</td>
          <td v-if="sex==1">男</td>
          <td v-if="sex==2">女</td>
          <td class="column">个性签名</td>
          <td>{{detail.profile}}</td>
        </tr>
        <tr>
          <td class="column">生日</td>
          <td>{{detail.birth}}</td>
          <td class="column">兴趣爱好</td>
          <td>
            <span v-for="item in interestList" :key="item.id">{{item.interest}}&nbsp;</span>
          </td>
        </tr>
        <tr>
          <td class="column">地址</td>
          <td>{{detail.address}}</td>
          <td class="column">注册时间</td>
          <td>{{detail.createTime}}</td>
        </tr>
        <tr>
          <td class="column">微信号</td>
          <td>{{detail.wechatId}}</td>
          <td class="column">公司</td>
          <td>{{detail.realName}}</td>
        </tr>
        <tr>
          <td class="column">邮箱</td>
          <td>{{detail.email}}</td>
          <td class="column">行业</td>
          <td>{{detail.industry}}</td>
        </tr>
        <tr>
          <td class="column">星座</td>
          <td>{{detail.constellation}}</td>
          <td class="column">职位</td>
          <td>{{detail.position}}</td>
        </tr>
        <tr>
          <td class="column">学校</td>
          <td>{{detail.shool}}</td>
          <td class="column">邀请码</td>
          <td>{{detail.inviteCode}}</td>
        </tr>
        <tr>
          <td class="column">会员到期时间</td>
          <td>{{detail.expireTime}}</td>
          <td class="column">魅力值</td>
          <td>{{detail.charmValue}}</td>
        </tr>
      </table>
      <div class="record xinxi">统计信息</div>
      <table class="mailTable">
        <tr>
          <td>关注</td>
          <td>粉丝</td>
          <td>获赞与收藏</td>
          <td>收藏作品</td>
          <td>总佣金</td>
          <td>收入排行榜</td>
          <td>查看他名片</td>
          <td>转发他名片</td>
          <td>作品评论</td>
          <td>作品转发</td>
          <td>作品点赞</td>
          <td>邀请好友</td>
          <td>连续签到</td>
          <td>电子名片夹</td>
        </tr>
        <tr>
          <td>{{detail.focusNum}}</td>
          <td>{{detail.fansNum}}</td>
          <td>{{detail.zanAndCollect?detail.zanAndCollect:0}}</td>
          <td>{{detail.collectNum}}</td>
          <td>{{detail.totalPrice?detail.totalPrice:0}}</td>
          <td>{{detail.ranking}}</td>
          <td>{{detail.lookNum}}</td>
          <td>{{detail.shareNum}}</td>
          <td>{{detail.commentNum}}</td>
          <td>{{detail.share?detail.share:0}}</td>
          <td>{{detail.circleZan}}</td>
          <td>{{detail.friendNum}}</td>
          <td>{{detail.logNum?detail.logNum:0}}</td>
          <td>{{detail.cardNum}}</td>
        </tr>
      </table>
      <div class="record xinxi">邀请记录</div>
      <Table :columns="columns" :data="datas"></Table>
      <div class="page_num">
        <Page
          show-total
          show-elevator
          :total="page.totalNum"
          :page-size="params.pageSize"
          @on-change="onChange"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
import { userListApi } from "@/api/index";
export default {
  data() {
    return {
      detail: {},
      interestList: [],
      datas: [],
      columns: [
        {
          title: "订单编号",
          key: "orderNum",
          align: "center"
        },
        {
          title: "提交时间",
          key: "payTime",
          align: "center"
        },
        {
          title: "用户姓名",
          key: "userName",
          align: "center"
        },
        {
          title: "订单金额",
          key: "totalPrice",
          align: "center"
        },
        {
          title: "贡献佣金",
          key: "commission",
          align: "center"
        }
      ],
      params: {
        id: "",
        pageNum: 1,
        pageSize: 10
      },
      page: {
        totalNum: 0
      },
      sex: null,
      type: null
    };
  },
  mounted() {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: false
    }
  },
  watch: {
    userId(val) {
      this.getData(val);
    }
  },
  methods: {
    getData(id) {
      userListApi.getUserInfo(id).then(res => {
        if (res.state == 0) {
          this.detail = res.data;
          this.interestList = res.data.interestList;
          this.type = res.data.type;
          this.sex = res.data.sex;
          this.params.id = res.data.id;
        }
        if(res.data.ranking==-1){
          this.detail.ranking='暂无信息'
        }
      });
    },
    onChange(e) {
      //改变页码
      this.params.pageNum = e;
      //   this.getUserList();
    },
    //获取邀请记录
    getOrderLog(id) {
      this.params.id=id
      userListApi.getOrderLog(this.params).then(res => {
        this.datas = res.data.data_list;
        this.page.totalNum = res.data.total_num;
      });
    }
  },
  computed: {
    computedValue: {
      get() {
        this.getData(this.userId);
        this.getOrderLog(this.userId);
        return this.value;
      },
      set(val) {
        this.$emit("modal", val);
      }
    }
  }
};
</script>
