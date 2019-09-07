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
        <FormItem label="标签名称：">
          <Input v-model="params.label" placeholder="请输入标签名称"/>
        </FormItem>
        <FormItem :label-width="1">
          <Button type="primary" @click.native="list">查询</Button>
        </FormItem>
        <FormItem :label-width="1">
          <Button type="primary" @click="addCatery">添加</Button>
        </FormItem>
      </Form>
    </Card>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
      <Table :columns="columns" :data="datas"></Table>
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
    <Modal
      title="添加分类"
      v-model="keepAlive"
      :loading="modloading"
      @on-ok="submit('formVaildate')"
      @on-cancel="cancleSubmit('formVaildate')"
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
            <FormItem label="分类名称" prop="label">
              <Input type="text" v-model="addparams.label" placeholder="分类名称限制20字"/>
            </FormItem>
          </Col>
          <Col span="6" offset="1" style="line-height: 36px;"></Col>
        </Row>
      </Form>
    </Modal>
    <Modal title="删除" v-model="isDel" :closable="false" @on-ok="delCircle">确定删除标签吗？</Modal>
  </div>
</template>
<script>
import { settingApi } from "@/api/index";
export default {
  data() {
    return {
      columns: [
        {
          title: "编号",
          type: "index"
        },
        {
          title: "标签名称",
          key: "industry"
        },

        {
          title: "添加时间",
          key: "createTime"
        },
        {
          title: "操作",
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
                      this.addparams.id = params.row.id;
                      this.isDel = true;
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      datas: [],
      params: {
        pageNum: 1,
        pageSize: 10,
        label: ""
      },
      ruleValidate: {
        label: [
          { required: true, message: "请输入分类名称" },
          { max: 20, message: "分类名称限制20个字" }
        ]
      },
      page: {
        totalNum: 0
      },
      modloading: true,
      keepAlive: false,
      addparams: {
        id: "",
        label: "",
        flag: null
      },
      isDel: false
    };
  },
  created() {
    this.getindustry();
  },
  methods: {
    onChange(e) {
      //改变页码
      this.params.pageNum = e;
      this.getindustry();
    },
    getindustry() {
      settingApi.industry(this.params).then(res => {
        this.datas = res.data_list;
        this.page.totalNum = res.total_num;
      });
    },
    list() {
      this.params.pageNum = 1;
      settingApi.industry(this.params).then(res => {
        this.datas = res.data_list;
        this.page.totalNum = res.total_num;
      });
    },
    addCatery() {
      this.addparams = {
        id: "",
        label: "",
        flag: null
      };
      this.keepAlive = false;
      this.$nextTick(() => {
        this.keepAlive = true;
      });
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.addparams.flag = 1;
          settingApi.industry(this.addparams).then(res => {
            this.$Message.success("操作成功");
            this.keepAlive = false;
            this.cancleSubmit("formVaildate");
            this.params.label = "";
            this.getindustry();
          });
        } else {
          /**
           * 校验失败
           * 确定按钮的loarding效果不触发
           * @type {boolean}
           */
          this.modloading = false;
          this.$nextTick(() => {
            this.modloading = true;
          });
        }
      });
    },
    cancleSubmit(name) {
      this.$refs[name].resetFields();
    },
    delCircle() {
      this.addparams.flag = 2;
      this.addparams.label = "";
      settingApi.industry(this.addparams).then(data => {
        this.getindustry();
        this.$Message.success("删除成功");
      });
    }
  }
};
</script>

