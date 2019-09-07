<style lang="less" scoped>
.record {
  color: black;
  font-size: 24px;
}
.demo-split {
  height: calc(100vh - 200px);
  border: 1px solid #dcdee2;
}
.othervip {
  width: 150px;
  height: 30px;
  color: white;
  background-color: red;
  border-radius: 25px;
  margin-right: auto;
  margin-left: auto;
  line-height: 30px;
}
.demo-split-pane {
  padding: 10px;
}
.left {
  text-align: center;
  line-height: 50px;
  margin-top: 200px;
}
.imgC {
  width: 132px;
  height: 132px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9) inset;
  position: absolute;
  left: 0px;
  top: 0;
  z-index: 10000;
  cursor: pointer;
}
.imgC .item {
  height: 132px;
  position: relative;
}
.imgC .item img {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.poster {
  position: relative;
  z-index: 1;
  width: 132px;
  top: 10px;
  margin-right: auto;
  margin-left: auto;
}
.poster img {
  width: 132px;
  height: 132px;
}
</style>
<template>
  <div class="edit detailsModal">
    <Modal v-model="computedValue" :transfer="false" :mask-closable="false" footer-hide title="查看">
      <div slot="header">
        <div class="record">编辑</div>
      </div>
      <div class="demo-split">
        <Split v-model="split1">
          <div slot="left" class="demo-split-pane left">
            <div>
              <Form ref="memberInfo" :model="memberInfo" :rules="ruleValidate">
                <FormItem class="circle-cover-img" prop="headIcon" v-show="memberInfo.headIcon">
                  <div class="poster" @mouseenter="onMouse" @mouseleave="offMouse">
                    <img :src="memberInfo.headIcon" alt />
                    <div class="imgC" v-show="seen">
                      <!-- <div
                          class="item"
                          @mouseenter="eyesOnMeth"
                          @mouseleave="eyesOffMeth"
                          @click="lookUrlMean(memberInfo.headIcon)"
                        >
                          <img v-show="!eyesOn" src="../../../../assets/images/eyes.png">
                          <img v-show="eyesOn" src="../../../../assets/images/eyes-on.png">
                      </div>-->
                      <div
                        class="item"
                        @mouseenter="delsOnMeth"
                        @mouseleave="delsOffMeth"
                        @click="delUrlMean"
                      >
                        <img src="../../../assets/images/dels.png" />
                        <img src="../../../assets/images/dels-on.png" />
                      </div>
                    </div>
                  </div>
                  <Input v-show="false" v-model="memberInfo.headIcon"></Input>
                </FormItem>
                <FormItem prop="headIcon" v-show="!memberInfo.headIcon" class="mt-25">
                  <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :data="qiNiuData"
                    :max-size="5120"
                    :on-error="onError"
                    :on-exceeded-size="onExceeded"
                    :on-success="handleSuccess"
                    :action="uploadUrl"
                    style="display: inline-block"
                  >
                    <Button type="primary">上传图片</Button>
                  </Upload>
                </FormItem>
                <FormItem prop="phone">
                  <Input v-model="memberInfo.phone" size="large" placeholder="请输入手机号码"></Input>
                </FormItem>
              </Form>
            </div>
            <div class="othervip" v-if="type==1">VIP会员</div>
            <div class="othervip" v-if="type==0">非VIP会员</div>
          </div>
          <div slot="right" class="demo-split-pane">
            <Form ref="memberInfo" :model="memberInfo" :rules="ruleValidate" :label-width="120">
              <Row>
                <Col span="12">
                  <FormItem label="姓名：" prop="nickName">
                    <Input v-model="memberInfo.nickName" size="large" placeholder="请输入成员名称"></Input>
                  </FormItem>
                  <FormItem label="性别：">
                    <RadioGroup v-model="memberInfo.sex">
                      <Radio label="1">男</Radio>
                      <Radio label="2">女</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="生日：" prop="birth">
                    <DatePicker
                      type="date"
                      format="yyyy-MM-dd"
                      v-model="memberInfo.birth"
                      placeholder="请输入生日"
                      style="width: 200px"
                      @on-change="changebirth"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="地址：">
                    <Input v-model="memberInfo.address" size="large" placeholder="请输入地址"></Input>
                  </FormItem>
                  <FormItem label="微信号：">
                    <Input v-model="memberInfo.wechatId" size="large" placeholder="请输入微信号"></Input>
                  </FormItem>
                  <FormItem label="邮箱：">
                    <Input v-model="memberInfo.email" size="large" placeholder="请输入邮箱"></Input>
                  </FormItem>
                  <FormItem label="星座：">
                    <Input
                      v-model="memberInfo.constellation"
                      disabled
                      size="large"
                      placeholder="请输入星座"
                    ></Input>
                  </FormItem>
                  <FormItem label="学校：" prop="shool">
                    <Input v-model="memberInfo.shool" size="large" placeholder="请输入学校"></Input>
                  </FormItem>
                  <FormItem label="学历：" prop="education">
                    <Input v-model="memberInfo.education" size="large" placeholder="请输入学历"></Input>
                  </FormItem>
                  <FormItem label="个性签名：">
                    <Input
                      v-model="memberInfo.profile"
                      type="textarea"
                      :autosize="{minRows: 5,maxRows: 5}"
                      placeholder="请输入个性签名"
                    ></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="注册时间：">
                    <DatePicker
                      type="datetime"
                      placeholder="请输入注册时间"
                      format="yyyy-MM-dd HH:mm:ss"
                      style="width: 200px"
                      v-model="memberInfo.createTime"
                      disabled
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="会员到期时间：">
                    <DatePicker
                      type="datetime"
                      placeholder="请输入会员到期时间"
                      format="yyyy-MM-dd HH:mm:ss"
                      style="width: 200px"
                      v-model="memberInfo.expireTime"
                      disabled
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="公司：">
                    <Input v-model="memberInfo.realName" size="large" placeholder="请输入公司"></Input>
                  </FormItem>
                  <FormItem label="行业：">
                    <Select v-model="memberInfo.industryId">
                      <Option
                        v-for="item in industry"
                        :key="item.id"
                        :value="item.id"
                      >{{item.industry}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="职位：">
                    <Input v-model="memberInfo.position" size="large" placeholder="请输入职位"></Input>
                  </FormItem>
                  <FormItem label="邀请码：">
                    <Input
                      v-model="memberInfo.inviteCode"
                      disabled
                      size="large"
                      placeholder="请输入邀请码"
                    ></Input>
                  </FormItem>
                  <FormItem label="关注：">
                    <Input v-model="memberInfo.focusNum" size="large" placeholder="请输入关注数"></Input>
                  </FormItem>
                  <FormItem label="收藏：">
                    <Input v-model="memberInfo.collectNum" size="large" placeholder="请输入收藏数"></Input>
                  </FormItem>
                  <FormItem label="魅力值：">
                    <Input v-model="memberInfo.charmValue" size="large" placeholder="请输入魅力值数"></Input>
                  </FormItem>
                  <FormItem label="点赞与收藏：">
                    <Input v-model="memberInfo.zanAndCollect" size="large" placeholder="请输入点赞与收藏数"></Input>
                  </FormItem>
                  <FormItem label="兴趣爱好：">
                    <CheckboxGroup v-model="memberInfo.interestList">
                      <Checkbox v-for="item in interestList" :key="item.id" :label="item.interest"></Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </Col>
              </Row>

              <FormItem>
                <Button
                  type="primary"
                  size="large"
                  class="submit"
                  @click="handleSubmit('memberInfo')"
                >提交</Button>
              </FormItem>
              <!-- <Cascader
                trigger="hover"
                @on-change="getProvince"
                class="slect_province"
                :data="provinceList"
              ></Cascader>-->
            </Form>
          </div>
        </Split>
      </div>
    </Modal>
  </div>
</template>
<script>
import { userListApi, uploadApi } from "@/api/index";
import UploadImg from "../components/uploadImg";
// import provinceArr from '../../../../static/provincelist'; // 引入省市数据
export default {
  components: {
    UploadImg
  },
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
  data() {
    return {
      split1: 0.2,
      // provinceList: provinceArr, //接收省市数据
      // province: "", //选中的省
      // city: "" //选中的市
      memberInfo: {
        id: "",
        phone: "",
        role: "",
        sex: "",
        nickName: "",
        birth: "",
        address: "",
        email: "",
        wechatId: "",
        constellation: "",
        shool: "",
        education: "",
        interestList: [],
        createTime: "",
        expireTime: "",
        realName: "",
        industryId: "",
        position: "",
        inviteCode: "",
        focusNum: "",
        collectNum: "",
        charmValue: "",
        zanAndCollect: "",
        profile: "",
        headIcon: ""
      },
      seen: false,
      qiNiuData: {},
      uploadUrl: "",
      eyesOn: false,
      delOn: false,
      type: null,
      dataValue: null,
      ruleValidate: {
        nickName: [{ required: true, message: "请输入姓名" }],
        birth: [{ required: true, message: "请选择生日" }],
        shool: [{ required: true, message: "请输入学校" }],
        education: [{ required: true, message: "请输入学历" }],
        phone: [{ required: true, message: "请输入手机号码" }],
        headIcon: [{ required: true, message: "请上传图片" }]
      },
      industry: null,
      interestList: null
    };
  },
  computed: {
    computedValue: {
      get() {
        this.getData(this.userId);
        this.getIndustryAndHobby();
        return this.value;
      },
      set(value) {
        this.memberInfo = {};
        this.$emit("modes", false);
      }
    }
  },
  mounted() {
    this.getQiNiuToken();
  },
  methods: {
    //获取列表
    getData(id) {
      userListApi.getUserInfo(id).then(res => {
        this.memberInfo = res.data;
        let interestList = res.data.interestList;
        interestList = interestList.map(item => item.interest);
        this.memberInfo.interestList = interestList;
        this.memberInfo.id = res.data.id;
        this.type = res.data.type;
      });
    },

    //获取兴趣列表和行业
    getIndustryAndHobby() {
      userListApi.getIndustryAndHobby().then(res => {
        this.industry = res.data.industryList;
        this.interestList = res.data.interestList;
      });
    },
    handleSubmit(name) {
      let interest = [];
      this.interestList.forEach(item => {
        this.memberInfo.interestList.forEach(items => {
          if (item.interest === items) {
            interest.push(item);
          }
        });
      });
      this.memberInfo.interestList = interest;
      if (this.memberInfo.headIcon == "") {
        this.$Message.error("请添加头像");
        return;
      }
      if (this.memberInfo.phone == "") {
        this.$Message.error("请输入手机号");
        return;
      }
      if (!/^1[34578]\d{9}$/.test(this.memberInfo.phone)) {
        this.$Message.error("请输入正确手机号");
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          userListApi.changeUserInfoDetails(this.memberInfo).then(res => {
            if (res.state == 0) {
              this.$Message.success("修改成员成功!");
              this.memberInfo = {};
              this.$emit("modes", true);
            }
          });
        } else {
          this.$Message.error("请补全信息");
        }
      });
    },
    onMouse() {
      this.seen = true;
    },
    offMouse() {
      this.seen = false;
    },
    eyesOnMeth() {
      this.eyesOn = true;
    },
    eyesOffMeth() {
      this.eyesOn = false;
    },
    delsOnMeth() {
      this.delOn = true;
    },
    delsOffMeth() {
      this.delOn = false;
    },
    delUrlMean() {
      this.memberInfo.headIcon = "";
    },
    //获取七牛Token
    async getQiNiuToken() {
      const configData = await uploadApi.getServerConfig();
      this.configData = configData;
      this.qiNiuData = {
        token: configData.token
      };
      this.uploadUrl = `${configData.zoneUrl}?token=${configData.token}`;
    },
    onExceeded(e) {
      this.$Message.error("请上传小于2MB图片！");
    },
    onError() {
      this.$Message.error("图片上传失败,请重新上传！");
    },
    handleSuccess(res, file) {
      this.$Message.success("上传成功！");
      let generalUrl = uploadApi.generalUrl(this.configData, res);
      this.memberInfo.headIcon = generalUrl;
      setTimeout(() => {
        this.$Message.destroy();
      }, 1000);
    },
    //星座选择
    changebirth(daterange) {
      this.memberInfo.birth=daterange
      this.dataValue = daterange;
      let ls = this.dataValue.split("-");
      let s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
      let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
      let month = parseInt(ls[1]);
      let day = parseInt(ls[2]);
      let x_zuo = `${s.substr(
        month * 2 - (day < arr[month - 1] ? 2 : 0),
        2
      )}座`;
      this.memberInfo.constellation = x_zuo;
    }
    // 选择事件
    // getProvince(value,selectedData){
    //   if (selectedData.length ==2) {
    //     this.province = selectedData[0].label;
    //     this.city = selectedData[1].label;
    //   }else {// 这里的判断是因为数据源中直辖市和特别行政区等一些特别的地区没有省
    //     this.province = selectedData[0].label;
    //     this.city = '';
    //   }
    // },
  }
};
</script>

