<style lang="less" scoped>
.record {
  color: black;
  font-size: 24px;
}
.page_num {
  margin: 30px 0;
  text-align: right;
}
</style>
<template>
  <div class="detailsModal">
    <Modal v-model="computedValue" :transfer="false" :mask-closable="false" footer-hide title="查看">
      <div slot="header">
        <div class="record">查看详情</div>
      </div>
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
import { distributionApi } from "@/api/index";
export default {
  data() {
    return {
      params: {
        userId: "",
        distributionLevel: "1",
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        {
          title: "用户姓名",
          key: "nickName",
          align: "center"
        },
        {
          title: "分销佣金",
          key: "contributeCommission",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center"
        }
      ],
      page: {
        totalNum: 0
      },
      datas: []
    };
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
  methods: {
    getData() {
      distributionApi.queryCustomer(this.params).then(res => {
        this.datas = res.data.data_list;
        this.page.totalNum = res.data.total_num;
      });
    },
    onChange(e) {
      //改变页码
      this.params.pageNum = e;
    }
  },
  computed: {
    computedValue: {
      get() {
        this.params.userId = this.userId;
        this.getData(this.userId);
        return this.value;
      },
      set(val) {
        this.$emit("modalone", val);
      }
    }
  }
};
</script>

