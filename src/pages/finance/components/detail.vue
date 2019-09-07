<style lang="less" scoped>
.detailsModal{
     .record{
        padding: 8px 0;
        font-size: 18px;
     }
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
  width: 100%;
}
.mailTable tr td {
  border: 1px solid #e6eaee;
  height: 50px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
}
.single td.colum,
.mailTable tr td.column {
  background-color: #eff3f6;
  color: #393c3e;
  width: 200px!important;
  .must{
      margin-right: 3px;
      color: #ed4014;
  }
}
.finance_table .header{
    font-size: 16px;
    font-weight: 500;
    margin: 20px 0;
    &.top{
        margin-top: 0;
    }
    .ivu-icon{
        font-size: 18px;
    }
}
.submit_btn{
    margin: 30px 0 30px 200px;
    width: 200px;
}
</style>

<template>
    <div class="detailsModal">
        <Modal v-model="computedValue" :scrollable="true" :transfer="false" :mask-closable="false" footer-hide>
            <div slot="header">
                <div class="record">对账单信息</div>
            </div>
            <div class="finance_table">
                <h3 class="header top"><Icon type="ios-bookmark" />交易信息</h3>
                <table class="mailTable">
                    <tr>
                        <td class="column">用户姓名</td>
                        <td>{{accountData.nickName}}</td>
                        <td class="column">收款银行卡归属银行</td>
                        <td>{{accountData.bankName}}</td>
                    </tr>
                    <tr>
                        <td class="column">申请时间</td>
                        <td>{{accountData.createTime}}</td>
                        <td class="column">收款银行卡归属地</td>
                        <td>{{accountData.belongTo}}</td>
                    </tr>
                    <tr>
                        <td class="column">交易编号</td>
                        <td>{{accountData.withdrawalNo}}</td>
                        <td class="column">收款银行卡号</td>
                        <td>{{accountData.bankCard}}</td>
                    </tr>
                    <tr>
                        <td class="column">交易理由</td>
                        <td>{{accountData.withdrawalReason}}</td>
                        <td class="column">申请提现金额</td>
                        <td>{{accountData.withdrawalMoney}}</td>
                    </tr>
                    <tr>
                        <td class="column">收款人姓名</td>
                        <td>{{accountData.payeeName}}</td>
                        <td class="column">提现手续费</td>
                        <td>{{accountData.withdrawalCommission}}</td>
                    </tr>
                    <tr>
                        <td class="column">状态</td>
                        <td>{{accountData.status | filterStatus}}</td>
                        <td class="column"></td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div class="finance_table" v-for="(item ,index) in checkRecord" :key="index">
                <h3 class="header"><Icon type="ios-bookmark" />对账单信息</h3>
                <table class="mailTable single">
                    <tr>
                        <td class="column">审核状态</td>
                        <td>{{item.checkStatus}}</td>
                    </tr>
                    <tr>
                        <td class="column">审核人员</td>
                        <td>{{item.name}}</td>
                    </tr>
                    <tr>
                        <td class="column">审核时间</td>
                        <td>{{item.createTime}}</td>
                    </tr>
                </table>
                <table class="mailTable single">
                    <tr>
                        <td class="column">处理备注</td>
                        <td>{{item.handleRemark}}</td>
                    </tr>
                </table>
            </div>
            <div class="deal_box" v-if="checkRecord.length<2 && accountData.status!=3">
                <div class="finance_table">
                    <h3 class="header"></h3>
                    <table class="mailTable single">
                        <tr v-if="verify!=0 || verify==''">
                            <td class="column">处理备注</td>
                            <td><Input v-model="markTxt" placeholder="请输入备注信息" /></td>
                        </tr>
                        <tr v-else>
                            <td class="column"><i class="must">*</i>处理备注</td>
                            <td><Input v-model="markTxt" placeholder="请输入备注信息" /></td>
                        </tr>
                    </table>
                </div>
                <div class="finance_table" v-if="accountData.status==0">
                    <h3 class="header"></h3>
                    <table class="mailTable single">
                        <tr>
                            <td class="column"><i class="must">*</i>处理结果</td>
                            <td>
                                <RadioGroup v-model="verify" size="large">
                                    <Radio label="1">审核通过</Radio>
                                    <Radio label="0">驳回</Radio>
                                </RadioGroup>
                            </td>
                        </tr>
                    </table>
                    <Button type="primary" class="submit_btn" size="large" @click="handleCheck">提交审核</Button>
                </div>
                <div class="finance_table" v-if="accountData.status==1">
                    <h3 class="header"></h3>
                    <table class="mailTable single">
                        <tr>
                            <td class="column"><i class="must">*</i>处理结果</td>
                            <td>
                                <RadioGroup v-model="deal" size="large">
                                    <Radio label="2">确认发放</Radio>
                                </RadioGroup>
                            </td>
                        </tr>
                    </table>
                    <Button type="primary" class="submit_btn" size="large" @click="handleSuccess">确认提交</Button>
                </div>
                
            </div>
        </Modal>
    </div>
</template>
<script>
import { financeApi } from '@/api/index'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        orderData: {
            type: Object,
            default: {}
        }
    },
    data () {
        return {
            verify:'',//审核结果
            deal:'',//处理结果
            markTxt:'',
            accountData:null,
            checkRecord:[]
        }
    },
    computed: {
        computedValue: {
            get() {
                this.accountData = this.orderData;
                this.getCheckRecord(this.orderData.id);
                return this.value;
            },
            set(value) {
                this.$emit("modal", false);
            }
        }
    },
    methods: {
        getCheckRecord(id){//获取是否检查
            financeApi.getDealStatus(id).then(res=>{
                if(res.state == 0){
                    this.checkRecord = res.data;
                }
            })
        },
        handleCheck(){//处理审核
            let verify = this.verify;
            let markTxt = this.markTxt;
            let id = this.accountData.id;
            if(verify==''){
                this.$Message.error('处理结果不能为空！');
                return false;
            }
            if(verify==0 && markTxt==''){
                this.$Message.error('驳回备注不能为空！');
                return false;
            }
            this.postHandle(verify,markTxt,id)
        },
        handleSuccess(){//确认发放
            let deal = this.deal;
            let markTxt = this.markTxt;
            let id = this.accountData.id;
            if(deal==''){
                this.$Message.error('处理结果不能为空！');
                return false;
            }
            this.postHandle(deal,markTxt,id)
        },
        postHandle(verify,markTxt,id){
            financeApi.postDealRecord({checkStatus:verify,handleRemark:markTxt,withdrawalRecordId:id}).then(res=>{
                if(res.state==0){
                    this.$Message.success('提交成功！');
                    this.$emit("modal", true);
                }else{
                   this.$Message.error('提交失败，请重试'); 
                }
            })
        }
    },
    filters: {
        filterStatus(status){
            let type=null;
            switch(status){
                case '0':
                    type="待审核";
                    break;
                case '1':
                    type="待发放";
                    break;
                case '2':
                    type="已发放";
                    break;
                default:
                    type = '驳回'
            }
            return type;
        }
    }
}
</script>

