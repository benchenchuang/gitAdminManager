<style lang="less" scoped>
.page_num {
  margin: 30px 0;
  text-align: right;
}
</style>
<template>
  <div class="panel">
    <Card :padding="22" :bordered="false" :dis-hover="true">
      <Form class="panel-form mb-20" inline :label-width="80">
        <FormItem label="用户姓名：">
          <Input v-model="params.realName" placeholder="请输入用户姓名" />
        </FormItem>
        <FormItem label="手机号：">
          <Input placeholder="请输入手机号" v-model="params.phone" />
        </FormItem>
        <FormItem label="参选类别：">
          <Select style="width:100px" v-model="params.enrollType" clearable>
            <Option v-for="item in typeList" :value="item.label" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="参选区域：">
          <Cascader :data="areadata" @on-change="getProvince" v-model="selectedData"></Cascader>
        </FormItem>
        <!-- <FormItem label="排序：">
          <Select style="width:200px">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>-->
        <FormItem label="提交时间：" :label-width="100">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            format="yyyy-MM-dd"
            clearable
            @on-change="dateChange"
            placeholder="请选择日期范围"
            style="width:250px"
          />
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
    <Look v-model="isgoNextUs" @modal="modal" :userId.sync="userId" v-if="isgoNextUs"></Look>
    <Modal v-model="modalCode" :footerHide="true">
      <div>
        <img :src="softImgUrl" width="400px" />
      </div>
    </Modal>
    <Modal v-model="textCode" :footerHide="true">
      <div>
        {{text}}
      </div>
    </Modal>
  </div>
</template>
<script>
import { userListApi, downloadApi } from "@/api/index";
import provinceArr from "../../../static/provincelist"; // 引入省市数据
import Look from "../userlist/components/look";
export default {
  components: {
    Look
  },
  data() {
    return {
      loadUrl: downloadApi.exportSong,
      selectedData: [],
      modalCode: false,
      textCode:false,
      softImgUrl: "",
      text:"",
      params: {
        realName: "",
        phone: "",
        enrollType: "",
        enrollArea: "",
        pageNum: 1,
        pageSize: 10,
        startTime: "",
        endTime: ""
      },
      userId: "",
      isgoNextUs: false,
      page: {
        totalNum: 0
      },
      typeList: [
        {
          value: "0",
          label: "演员"
        },
        {
          value: "1",
          label: "唱跳新人"
        },
        {
          value: "2",
          label: "唱作人"
        },
        {
          value: "3",
          label: "原创歌曲"
        },
        {
          value: "4",
          label: "校园乐队"
        }
      ],
      areadata: provinceArr, //接收省市数据
      province: "", //选中的省
      city: "", //选中的市
      columns: [
        {
          title: "提交时间",
          key: "createTime"
        },
        {
          title: "微信头像",
          key: "headIcon",
          render: (h, { row, column, index }) => {
            return h("img", {
              attrs: {
                src: row.headIcon,
                width: 40,
                height: 40
              },
              on: {
                click: () => {
                  this.modalCode = true;
                  this.softImgUrl = row.headIcon;
                }
              }
            });
          }
        },
        {
          title: "姓名",
          key: "realName"
        },
        {
          title: "参选类别",
          key: "enrollType"
        },
        {
          title: "参选区域",
          key: "enrollArea"
        },
        {
          title: "半身正面照",
          key: "halfBody",
          render: (h, { row, column, index }) => {
            return h("img", {
              attrs: {
                src: row.halfBody,
                width: 40,
                height: 40
              },
              on: {
                click: () => {
                  this.modalCode = true;
                  this.softImgUrl = row.halfBody;
                }
              }
            });
          }
        },
        {
          title: "全身正面照",
          key: "fullBody",
          render: (h, { row, column, index }) => {
            return h("img", {
              attrs: {
                src: row.fullBody,
                width: 40,
                height: 40
              },
              on: {
                click: () => {
                  this.modalCode = true;
                  this.softImgUrl = row.fullBody;
                }
              }
            });
          }
        },
        {
          title: "手机号",
          key: "phone",
          width: 150
        },
        {
          title: "出生日期",
          key: "birth"
        },
        {
          title: "年龄",
          key: "age"
        },
        {
          title: "身高",
          key: "height"
        },
        {
          title: "体重",
          key: "weight"
        },
        {
          title: "兴趣爱好",
          key: "hobby",
          render: (h, { row, column, index }) => {
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
                      this.textCode = true;
                      this.text = row.hobby;
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        },
        {
          title: "特长",
          key: "skill",
          render: (h, { row, column, index }) => {
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
                      this.textCode = true;
                      this.text = row.skill;
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        },
        // {
        //   title: "自我介绍视频链接",
        //   key: "name"
        // },
        // {
        //   title: "才艺展示链接",
        //   key: "name"
        // },
        {
          title: "操作",
          key: "name",
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
                      this.isgoNextUs = true;
                      this.userId = params.row.userId;
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
    this.getUserList();
  },
  methods: {
    onChange(e) {
      //改变页码
      this.params.pageNum = e;
      this.getUserList();
    },
    getUserList() {
      userListApi.getList(this.params).then(res => {
        this.datas = res.data_list;
        this.page.totalNum = res.total_num;
      });
    },
    /**
     * 选择创建时间
     */
    dateChange(formate, date) {
      this.params.startTime = formate[0];
      this.params.endTime = formate[1];
    },
    getProvince(value, selectedData) {
      if (selectedData.length == 2) {
        this.province = selectedData[0].label;
        this.city = selectedData[1].label;
        this.params.enrollArea = this.province + this.city + "";
      } else {
        // 这里的判断是因为数据源中直辖市和特别行政区等一些特别的地区没有省
        this.params.enrollArea = "";
      }
    },
    list() {
      // if (this.params.startTime && this.params.startTime.length < 11) {
      //   this.params.startTime = this.params.startTime + " 00:00:00";
      // }
      // if (this.params.endTime && this.params.endTime.length < 11) {
      //   this.params.endTime = this.params.endTime + " 23:59:59";
      // }
      this.params.pageNum = 1;
      userListApi.getList(this.params).then(res => {
        this.datas = res.data_list;
        this.page.totalNum = res.total_num;
      });
    },
    modal() {
      this.isgoNextUs = false;
      this.userId = "";
    }
  }
};
</script>

