<style lang="less" scoped>
.page_num {
  margin: 30px 0;
  text-align: right;
}
.erweima img {
  width: 200px;
  height: 200px;
}
</style>
<template>
  <div>
    <Card :padding="22" :bordered="false" :dis-hover="true">
      <Form class="panel-form mb-20" inline :label-width="100">
        <FormItem label="用户姓名：">
          <Input v-model="params.nickName" placeholder="请输入用户姓名"/>
        </FormItem>
        <FormItem label="手机号：">
          <Input v-model="params.phone" placeholder="请输入手机号"/>
        </FormItem>
        <FormItem label="行业：">
          <Select style="width:140px" v-model="params.industry">
            <Option
              v-for="(item,index) in industryList"
              :value="item.id"
              :key="index"
            >{{ item.industry }}</Option>
          </Select>
        </FormItem>
        <FormItem label="魅力值：">
          <Row style="width:140px">
            <Col span="11">
              <Input v-model="params.minValue"></Input>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <Input v-model="params.maxValue"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="VIP会员：">
          <Select v-model="params.type" clearable>
            <Option
              v-for="(item,index) in typeList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="VIP到期时间：">
          <Select style="width:100px" v-model="params.dueDays" clearable>
            <Option
              v-for="(item,index) in areaList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序：">
          <Select style="width:140px" v-model="params.sortType" clearable>
            <Option
              v-for="(item,index) in sortList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="注册时间：">
          <DatePicker
            type="daterange"
            clearable
            @on-change="dateChange"
            placeholder="选择日期"
            style="width: 240px;margin-right: 30px;"
          ></DatePicker>
        </FormItem>
        <FormItem :label-width="1">
          <Button type="primary" @click.native="list">查询</Button>
        </FormItem>
        <FormItem label="导出数据：">
          <Select style="width:140px" v-model="type">
            <Option
              v-for="(item,index) in exportList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
          <a :href="loadUrl+'/'+type">
            <Button type="primary">导出</Button>
          </a>
        </FormItem>
      </Form>
    </Card>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
      <Table :columns="columns" :data="datas"></Table>
      <div class="page_num">
        <Page
          :current="params.pageNum"
          :total="page.totalNum"
          show-total
          :page-size="params.pageSize"
          show-elevator
          @on-change="onChange"
        />
      </div>
    </Card>

    <Modal title="二维码" v-model="isshow">
      <div class="erweima" align="center">
        <img :src="image">
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal title="提示" v-model="ishow" @on-ok="sure()" @on-cancel="cancelsure()">
      <div class="erweima" align="center">
       关闭会员后，该会员要重新购买，购买后会员有效开始时间为购买时间，请谨慎关闭。
      </div>
    </Modal>
    <Modal
      title="加粉丝"
      v-model="isjia"
      :loading="modloading"
      @on-ok="ok('formVaildate')"
      @on-cancel="cancel('formVaildate')"
    >
      <Form
        ref="formVaildate"
        :model="addparams"
        :rules="ruleValidate"
        :label-width="70"
        label-position="right"
      >
        <Row>
          <Col span="17">
            <FormItem label="粉丝数" prop="num">
              <Input type="text" v-model="addparams.num" placeholder="请输入粉丝数"/>
            </FormItem>
          </Col>
          <Col span="6" offset="1" style="line-height: 36px;"></Col>
        </Row>
      </Form>
    </Modal>
    <Look v-model="isgoNext" @modal="modal" :userId.sync="userId" v-if="isgoNext"></Look>
    <Edit v-model="isScan" @modes="modes" :userId.sync="userId" v-if="isScan"></Edit>
    <Publish v-model="isgoNextEd" @modeed="modeed" :userId.sync="userId" v-if="isgoNextEd"></Publish>
  </div>
</template>
<script>
import { userListApi, downloadApi } from "@/api/index";
import Look from "./components/look";
import Edit from "./components/edit";
import Publish from "./components/publish";
export default {
  components: {
    Look,
    Edit,
    Publish
  },
  data() {
    return {
      loadUrl: downloadApi.exportExcelByUserInfo,
      params: {
        nickName: "",
        phone: "",
        industry: "",
        minValue: "",
        maxValue: "",
        pageNum: 1,
        pageSize: 10,
        sortType: "",
        dueDays: "",
        type: "",
        startTime: "",
        endTime: ""
      },
      shuju:{},
      vipIndex:"",
      calling: false,
      image: null,
      isshow: false,
      ishow:false,
      isjia: false,
      isgoNext: false,
      isScan: false,
      isgoNextEd: false,
      daterangetime: [],
      userId: "",
      modloading: true,
      page: {
        totalNum: 0
      },
      typeList: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "0",
          label: "否"
        }
      ],
      areaList: [
        {
          value: "7",
          label: "剩余7天"
        },
        {
          value: "30",
          label: "剩余30天"
        },
        {
          value: "90",
          label: "剩余90天"
        }
      ],
      sortList: [
        {
          value: "1",
          label: "VIP到期时间"
        },
        {
          value: "2",
          label: "魅力值高低"
        },
        {
          value: "3",
          label: "名片关注数"
        },
        {
          value: "4",
          label: "作品收藏数"
        },
        {
          value: "5",
          label: "作品分享数"
        },
        {
          value: "6",
          label: "作品点赞数"
        }
      ],
      exportList: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "会员"
        },
        {
          value: "2",
          label: "非会员"
        }
      ],
      industryList: [],
      columns: [
        {
          title: "注册时间",
          key: "createTime",
          align: "center",
          width: 180
        },
        {
          title: "头像",
          key: "headIcon",
          align: "center",
          width: 80,
          render: (h, { row, column, index }) => {
            return h("img", {
              attrs: {
                src: row.headIcon,
                width: 40,
                height: 40
              }
            });
          }
        },
        {
          title: "用户姓名",
          key: "nickName",
          align: "center",
          width: 100
        },
        {
          title: "手机号",
          key: "phone",
          align: "center",
          width: 120
        },
        {
          title: "行业",
          key: "industry",
          align: "center",
          width: 100
        },
        {
          title: "职位",
          key: "position",
          align: "center"
        },
        {
          title: "魅力值",
          key: "charmValue",
          width: 80,
          align: "center"
        },
        {
          title: "二维码",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  // props: {
                  //   type: "primary",
                  //   size: "small"
                  // },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      let id = params.row.id;
                      this.showerweima(id);
                    }
                  }
                },
                "查看二维码"
              )
            ]);
          }
        },
        {
          title: "VIP会员",
          key: "type",
          align: "center",
          render: (h, { row, column, index }) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: row.type ===1
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  if (row.type === 1) {
                    this.vipIndex=index
                    row.type = 0;
                    let params={id: row.id,type:row.type}
                    this.showvip(params)
                  } else {
                   row.type = 1;
                    userListApi
                    .changeStauts({
                      id: row.id,
                      type:row.type
                    })
                    .then(data => {});
                  } 
                }
              }
            });
          }
        },
        {
          title: "VIP到期时间",
          key: "expireTime",
          align: "center"
        },
        {
          title: "账号启用状态",
          key: "cardNo",
          align: "center",
          render: (h, { row, column, index }) => {
            return h("i-switch", {
              props: {
                type: "primary",
                value: row.cardNo === 0
              },
              style: {
                marginRight: "5px"
              },
              on: {
                "on-change": value => {
                  if (row.cardNo === 1) {
                    row.cardNo = 0;
                  } else {
                    row.cardNo = 1;
                  }
                  userListApi
                    .changeStauts({
                      id: row.id,
                      cardNo: row.cardNo
                    })
                    .then(data => {});
                }
              }
            });
          }
        },
        {
          title: "操作",
          align: "center",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.userId = params.row.id;
                      this.isgoNext = true;
                    }
                  }
                },
                "查看"
              ),
              h(
                "a",
                {
                  // props: {
                  //   type: "primary",
                  //   size: "small"
                  // },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.userId = params.row.id;
                      this.isScan = true;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "a",
                {
                  // props: {
                  //   type: "primary",
                  //   size: "small"
                  // },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.userId = params.row.id;
                      this.isgoNextEd = true;
                    }
                  }
                },
                "帮发布"
              ),
              h(
                "a",
                {
                  // props: {
                  //   type: "primary",
                  //   size: "small"
                  // },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.addparams.id = params.row.id;
                      this.isjia = true;
                    }
                  }
                },
                "加粉丝"
              )
            ]);
          }
        }
      ],
      datas: [],
      type: "0",
      addparams: {
        id: "",
        num: ""
      },
      ruleValidate: {
        num: [{ required: true, message: "请输入粉丝数" }]
      }
    };
  },
  mounted() {
    this.getUserList();
    this.getIndustryList();
  },
  methods: {
    onChange(e) {
      //改变页码
      this.params.pageNum = e;
      this.getUserList();
    },
    //获取二维码
    showerweima(id) {
      userListApi.createWxAqrCode(id).then(res => {
        this.image = res.data.wxCodeUrl;
      });
      this.isshow = true;
    },
    showvip(params){
      this.ishow=true
      this.shuju=params
    },
    /**
     * 选择创建时间
     */
    dateChange(formate, date) {
      this.params.startTime = formate[0];
      this.params.endTime = formate[1];
    },
    modal(e) {
      this.isgoNext = false;
      this.userId = "";
      if (e) {
        this.params = {
          nickName: "",
          phone: "",
          industry: "",
          minValue: "",
          maxValue: "",
          pageNum: 1,
          pageSize: 10,
          sortType: "",
          dueDays: "",
          type: "",
          startTime: "",
          endTime: ""
        };
        this.getUserList();
      }
    },
    modes(e) {
      this.isScan = false;
      this.userId = "";
      if (e) {
        this.params = {
          nickName: "",
          phone: "",
          industry: "",
          minValue: "",
          maxValue: "",
          pageNum: 1,
          pageSize: 10,
          sortType: "",
          dueDays: "",
          type: "",
          startTime: "",
          endTime: ""
        };
        this.getUserList();
      }
    },
    modeed(e) {
      this.isgoNextEd = false;
      this.userId = "";
      if (e) {
        this.params = {
          nickName: "",
          phone: "",
          industry: "",
          minValue: "",
          maxValue: "",
          pageNum: 1,
          pageSize: 10,
          sortType: "",
          dueDays: "",
          type: "",
          startTime: "",
          endTime: ""
        };
        this.getUserList();
      }
    },
    //获取列表
    getUserList() {
      userListApi.getUserList(this.params).then(res => {
        this.datas = res.data.data_list;
        this.page.totalNum = res.data.total_num;
      });
    },
    //获取行业值
    getIndustryList() {
      userListApi.getIndustryList().then(res => {
        this.industryList = res.data;
        this.industryList.unshift({id:0,industry:"全部"})
      });
    },
    //查询
    list() {
      if (this.params.startTime && this.params.startTime.length < 11) {
        this.params.startTime = this.params.startTime + " 00:00:00";
      }
      if (this.params.endTime && this.params.endTime.length < 11) {
        this.params.endTime = this.params.endTime + " 23:59:59";
      }
      this.params.pageNum = 1;
      userListApi.getUserList(this.params).then(res => {
        this.datas = res.data.data_list;
        this.page.totalNum = res.data.total_num;
      });
    },
    exportData() {
      this.loadUrl = downloadApi.exportExcelByUserInfo(this.type);
    },
    ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          userListApi.addFans(this.addparams).then(res => {
            if (res.state == 0) {
              this.$Message.success("添加成功");
              this.isjia = false;
              this.cancel("formVaildate");
            } else {
              this.$Message.error(res.message);
              this.modloading = false;
              this.$nextTick(() => {
                this.modloading = true;
              });
            }
          });
        } else {
          this.modloading = false;
          this.$nextTick(() => {
            this.modloading = true;
          });
        }
      });
    },
    cancel(name) {
      this.$refs[name].resetFields();
    },
    sure(){
      userListApi.changeStauts(this.shuju).then(data => {});
    },
    cancelsure(){
       this.datas[this.vipIndex].type=0;
       this.datas[this.vipIndex].type=1;
       this.vipIndex=''
    }
  }
};
</script>