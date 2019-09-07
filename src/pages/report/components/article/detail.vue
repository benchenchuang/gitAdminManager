<template>
  <div class="details detailsModal">
    <Modal v-model="computedValue" @on-cancel="goback" :transfer="false" :mask-closable="false" footer-hide>
      <div slot="header">
        <div class="record">
          举报详情
        </div>
      </div>
      <div v-if="tDtas">
        <table class="mailTable" style="margin-top: 24px;">
          <tr>
            <td class="column">编号</td>
            <td>{{tDtas.nums}}</td>
          </tr>
          <tr>
            <td class="column">举报类型</td>
            <td>{{tDtas.reportTypeId}}</td>
          </tr>
          <tr>
            <td class="column">举报人</td>
            <td>{{tDtas.userName}}</td>
          </tr>
          <tr>
            <td class="column">被举报人</td>
            <td>{{tDtas.targetName}}</td>
          </tr>
          <tr>
            <td class="column">举报时间</td>
            <td>{{tDtas.createTime}}</td>
          </tr>
          <tr>
            <td class="column">举报状态</td>
            <td>{{tDtas.reportType == 1 ? '已处理' : '待处理'}}</td>
          </tr>
        </table>
        <table class="mailTable" style="margin-top: 24px;">
          <tr>
            <td class="column">处理人员</td>
            <td>{{tDtas.handelUserName?tDtas.handelUserName:'无'}}</td>
          </tr>
          <tr>
            <td class="column">处理时间</td>
            <td>{{tDtas.handelTime?tDtas.handelTime:'无'}}</td>
          </tr>
          <tr>
            <td class="column">处理结果</td>
            <td>{{tDtas.postResult?tDtas.postResult:'无'}}</td>
          </tr>
          <tr>
            <td class="column">处理备注</td>
            <td>{{tDtas.note?tDtas.note:'无'}}</td>
          </tr>
        </table>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "detail",
    data() {
      return {
        tDtas: null
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      tDta: {
        type: Object,
        default: false
      }
    },
    watch: {
      tDta(val) {
        this.tDtas = val
      }
    },
    methods: {
      goback() {
        this.computedValue = false
      },
    },
    computed: {
      computedValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('modes', val)
        }
      }
    },
  }
</script>

<style scoped lang="less">
  .record {
    font-size: 18px !important;
    font-weight: 600 !important;
    font-family: 微软雅黑 !important;
  }

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
    width: 48vw;
    height: 50px;
    line-height: 35px;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 14px;
  }

  　.mailTable tr td.column {
    background-color: #eff3f6;
    color: #666666;
    width: 18vw;
    text-align: right;
    padding: 0 20px;
    font-size: 15px;
  }
</style>
