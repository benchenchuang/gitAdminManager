<style lang="less" scoped>
.count{
    text-align: right;
}
</style>

<template>
  <div class="panel main_wrap" style="text-align:center;">
      <Form ref="formValidate" size="large" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:600px;margin:40px auto;">
        <p class="count">{{formValidate.reservationTip.length}} / 50</p>
        <FormItem label="预约提示" prop="reservationTip">
            <Input v-model="formValidate.reservationTip" type="textarea" 
            :maxlength="50" :autosize="{minRows: 4,maxRows: 5}" placeholder="Enter something...">
            </Input>
        </FormItem>
        <p class="count">{{formValidate.changeTip.length}} / 50</p>
        <FormItem label="换票提示" prop="changeTip">
            <Input v-model="formValidate.changeTip" type="textarea" 
            :maxlength="50" :autosize="{minRows: 4,maxRows: 5}" placeholder="Enter something...">
            </Input>
        </FormItem>
        <p class="count">{{formValidate.visitTip.length}} / 50</p>
        <FormItem label="参观提示" prop="visitTip">
            <Input v-model="formValidate.visitTip" type="textarea" 
            :maxlength="50" :autosize="{minRows: 4,maxRows: 5}" placeholder="Enter something...">
            </Input>
        </FormItem>
        <FormItem>
            <Button size="large" type="primary" @click="handleSubmit('formValidate')">提交</Button>
        </FormItem>
    </Form>
  </div>
</template>
<script>
import {commonApi} from '@/api/index'
export default {
    name:'settingTip',
    data(){
        return{
            formValidate: {
                changeTip: '',
                reservationTip: '',
                visitTip: '',
                id:''
            },
            ruleValidate: {
                changeTip: [
                    { required: true, message: '输入不能为空', trigger: 'change' },
                    { type: 'string', min: 4,max:50, message: '最少4个字符,最多50个字符', trigger: 'change' }
                ],
                reservationTip: [
                    { required: true, message: '输入不能为空', trigger: 'change' },
                    { type: 'string', min: 4,max:50, message: '最少4个字符,最多50个字符', trigger: 'change' }
                ],
                visitTip: [
                    { required: true, message: '输入不能为空', trigger: 'change' },
                    { type: 'string', min: 4,max:50, message: '最少4个字符,最多50个字符', trigger: 'change' }
                ]
            }
        }
    },
    created(){
        this.getTipsMessages();
    },
    methods:{
        //提交信息
         handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    commonApi.saveTipMessages(this.formValidate).then(res=>{
                        if(res.code==200){
                            this.$Message.success('保存成功!');
                        }else{
                            this.$Message.error('保存失败，请重新提交!');
                        }
                    })
                }
            })
        },
        //获取提示信息
        getTipsMessages(){
            commonApi.getTipMessages().then(res=>{
                if(res.code==200){
                    let data= res.data;
                    this.formValidate.changeTip = data.change_ticket_tip
                    this.formValidate.reservationTip = data.reservation_tip
                    this.formValidate.visitTip = data.visit_tip
                    this.formValidate.id = data.id
                }
            })
        }
    }
}
</script>

