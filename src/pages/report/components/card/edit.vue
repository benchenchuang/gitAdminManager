<template>
  <div class="details detailsModal">
    <Modal v-model="computedValue" @on-cancel="goback" :transfer="false" :mask-closable="false" footer-hide>
      <div slot="header">
        <div class="record">
          处理举报
        </div>
      </div>
      <div v-if="tDtasEd">
        <table class="mailTable" style="margin-top: 24px;">
          <tr>
            <td class="column">编号</td>
            <td>{{tDtasEd.nums}}</td>
          </tr>
          <tr>
            <td class="column">举报类型</td>
            <td>{{tDtasEd.reportTypeId}}</td>
          </tr>
          <tr>
            <td class="column">举报人</td>
            <td>{{tDtasEd.userName}}</td>
          </tr>
          <tr>
            <td class="column">被举报人</td>
            <td>{{tDtasEd.targetName}}</td>
          </tr>
          <tr>
            <td class="column">举报时间</td>
            <td>{{tDtasEd.createTime}}</td>
          </tr>
          <tr>
            <td class="column">举报状态</td>
            <td>{{tDtasEd.reportType == 1 ? '已处理' : '待处理'}}</td>
          </tr>
        </table>
        <table class="mailTable editmailTable" style="margin-top: 24px;">
          <tr>
            <td class="column">处理备注</td>
            <td>
              <Input style="border: none !important;padding-top: 10px;padding-bottom: 10px;" v-model="tDtasEd.note"
                     type="textarea" :autosize="{minRows: 1,maxRows: 6}" placeholder="请输入"/>
            </td>
          </tr>
        </table>
        <table class="mailTable editmailTable" style="margin-top: 24px;">
          <tr>
            <td class="column columnMust">处理结果</td>
            <td>
              <RadioGroup v-model="tDtasEd.reportResult" @on-change="resultChange">
                <Radio label="1">有效举报</Radio>
                <Radio label="2">恶意举报</Radio>
                <Radio label="3">无效举报</Radio>
              </RadioGroup>
            </td>
          </tr>
        </table>
        <Button style="margin-top: 35px;width: 200px;margin-left: calc(50% - 100px);" type="primary" size="large"
                @click="submit" long>
          提交
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {reportApi} from '@/api/index'

  export default {
    name: "edit",
    data() {
      return {
        tDtasEd: null
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      tDtaEd: {
        type: Object,
        default: false
      }
    },
    watch: {
      tDtaEd(val) {
        console.log(val)
        this.tDtasEd = val
      }
    },
    methods: {
      goback() {
        this.computedValue = false
      },
      resultChange() {
        console.log(this.tDtasEd.reportResult)
      },
      submit() {
        if (!this.tDtasEd.reportResult) {
          this.$Message.warning('请选择处理结果')
          return
        }
        reportApi.handelReport({
          id: this.tDtasEd.id,
          note: this.tDtasEd.note,
          reportResult: parseInt(this.tDtasEd.reportResult)
        }).then(data => {
          this.$parent._list()
          this.goback();
        })
      },
    },
    computed: {
      computedValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('modeed', val)
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
    position: relative;
  }

  .columnMust:after {
    position: absolute;
    content: '*';
    color: red;
    width: 4px;
    height: 4px;
    right: 14px;
    top: 0;
  }
</style>
