<style lang="less" scoped>
.page_num {
  margin: 30px 0;
  text-align: right;
}
</style>
<template>
  <div>
    <Card :padding="22" :bordered="false" :dis-hover="true">
      <Form class="panel-form mb-20" inline :label-width="100">
        <FormItem label="用户姓名：">
          <Input v-model="params.nickName" placeholder="请输入用户姓名"/>
        </FormItem>
        <FormItem label="创建时间：">
          <DatePicker
            type="daterange"
            clearable
            @on-change="dateChange"
            placeholder="选择日期"
            style="width: 240px;margin-right: 30px;"
          ></DatePicker>
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
        <FormItem :label-width="1">
          <Button type="primary" @click.native="list">查询</Button>
          <a :href="loadUrl">
          <Button type="primary">
            <Icon type="ios-download-outline"></Icon>导出数据
          </Button>
          </a>
        </FormItem>
      </Form>
    </Card>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
      <Table :columns="columns" :data="datas" ref="table"></Table>
      <div class="page_num">
        <Page
          :total="page.totalNum"
          show-total
          :page-size="params.pageSize"
          show-elevator
          @on-change="onChange"
        />
      </div>
    </Card>
    <Lookedit v-model="isgoNext" @modes="modes" :userId.sync="userId" v-if="calling"></Lookedit>
    <Oneedit v-model="isOne" @modalone="modalone" :userId.sync="userId" v-if="isOne"></Oneedit>
    <Twoedit v-model="isTwo" @modaltwo="modaltwo" :userId.sync="userId" v-if="isTwo"></Twoedit>
  </div>
</template>
<script>
import { distributionApi, downloadApi } from "@/api/index";
import Lookedit from "./components/lookedit";
import Oneedit from "./components/oneedit";
import Twoedit from "./components/twoedit";
export default {
  components: {
    Lookedit,
    Oneedit,
    Twoedit
  },
  data() {
    return {
      loadUrl:downloadApi.exportDistributors,
      params: {
        nickName: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
        startTime: "",
        endTime: "",
        sort: ""
      },
      isOne: false,
      isTwo: false,
      calling: false,
      isgoNext: false,
      userId: "",
      page: {
        totalNum: 0
      },
      sortList: [
        {
          value: "1",
          label: "邀请客户数高低"
        },
        {
          value: "2",
          label: "成交总金额高低"
        }
      ],
      columns: [
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
          align: "center"
        },
        {
          title: "邀请客户（一级）",
          align: "center",
          width: 150,
          children: [
            {
              title: "数目",
              align: "center",
              key: "customers"
            },
            {
              title: "操作",
              align: "center",
              render: (h, params) => {
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.userId = params.row.distributor;
                          this.isOne = true;
                        }
                      }
                    },
                    "查看"
                  )
                ]);
              }
            }
          ]
        },
        {
          title: "客户邀请的好友（二级）",
          align: "center",
          width: 200,
          children: [
            {
              title: "数目",
              align: "center",
              key: "customersChild"
            },
            {
              title: "操作",
              align: "center",
              render: (h, params) => {
                return h("div", [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.userId = params.row.distributor;
                          this.isTwo = true;
                        }
                      }
                    },
                    "查看"
                  )
                ]);
              }
            }
          ]
        },
        {
          title: "成交订单",
          key: "totalNum",
          align: "center"
        },
        {
          title: "成交总金额",
          key: "totalPrice",
          align: "center"
        },
        {
          title: "佣金一级",
          key: "customerCommissions",
          align: "center"
        },
        {
          title: "佣金二级",
          key: "customerCommissionsChild",
          align: "center"
        },
        {
          title: "累计佣金",
          key: "customerCommissionsTotal",
          align: "center"
        },
        {
          title: "已提现",
          key: "withdrawalMoney",
          align: "center"
        },
        {
          title: "未提现",
          key: "canWithdrawCommission",
          align: "center"
        },
        {
          title: "总计手续费",
          key: "withdrawalCommission",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.calling = false;
                      let id = params.row.distributor;
                      this.$nextTick(() => {
                        this.calling = true;
                        this.showedit(id);
                      });
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      datas: []
    };
  },
  mounted() {
    this.getlistDistribution();
  },
  methods: {
    onChange(e) {
      //改变页码
      this.params.pageNum = e;
      this.getUserList();
    },
    //跳转到编辑页
    showedit(id) {
      this.isgoNext = true;
      this.userId = id;
    },
    modes(e) {
      if (!e) {
        this.calling = false;
        this.$nextTick(() => {
          this.calling = true;
          this.userId = "";
          this.isgoNext = e;
        });
      }
    },
    modalone(e) {
      this.isOne = false;
      this.userId = "";
      if (e) {
        this.params = {
          nickName: "",
          endTime: "",
          pageNum: 1,
          pageSize: 10,
          startTime: "",
          endTime: "",
          sort: ""
        };
        this.getlistDistribution();
      }
    },
    modaltwo(e) {
      this.isTwo = false;
      this.userId = "";
      if (e) {
        this.params = {
          nickName: "",
          endTime: "",
          pageNum: 1,
          pageSize: 10,
          startTime: "",
          endTime: "",
          sort: ""
        };
        this.getlistDistribution();
      }
    },
    /**
     * 选择创建时间
     */
    dateChange(formate, date) {
      this.params.startTime = formate[0];
      this.params.endTime = formate[1];
    },
    //获取列表
    getlistDistribution() {
      distributionApi.listDistribution(this.params).then(res => {
        this.datas = res.data.data_list;
        this.page.totalNum = res.data.total_num;
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
      distributionApi.listDistribution(this.params).then(res => {
        this.datas = res.data.data_list;
        this.page.totalNum = res.data.total_num;
      });
    },
    // exportData() {
    //  distributionApi.exportDistributors().then((data=>{
    //    var fileDownload = require('js-file-download');
    //    fileDownload(data, 'hhhhh.xls')
    //  }))
    // }
  }
};
</script>
