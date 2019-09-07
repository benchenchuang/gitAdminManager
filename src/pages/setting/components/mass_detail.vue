<style lang="less" scoped>
.panel_head{
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background: #f90;
}
.panel_form{
    margin: 30px auto;
    .phone_box{
        float: left;
        width: 380px;
        margin: 0 40px 0 20px;
        height: 464px;
        background: #f1f1f1;
        .phone_body{
            margin: 10px;
            background: #fff;
            .common_info{
                padding: 10px;
                border-bottom: 1px solid #e4e4e4;
                .username{
                    margin-left: 10px;
                    font-size: 15px;
                    color: #666;
                    vertical-align: middle;
                }
                .msg_item{
                    margin: 15px 0;
                    overflow: hidden;
                    .label{
                        font-size: 14px;
                        width: 70px;
                        float: left;
                    }
                    .content{
                        margin-left: 80px;
                        color: #333;
                        word-break: break-all;
                    }
                }
                &:last-child{
                    border-bottom: none;
                }
            }
        }
    }
    .mini_header{
        width: 380px;
    }
    .form_box{
        float: left;
        .send_box{
            .name{
                display: inline-block;
                font-size: 14px;
                color: #666;
                width: 100px;
                i{
                    margin-right: 4px;
                    color: #ed4014;
                    vertical-align: middle;
                }
            }
            .red{
                color: #ed4014;
            }
        }
    }
}
</style>
<template>
    <div class="detailsModal">
        <Modal v-model="computedValue" :transfer="false" :mask-closable="false" footer-hide>
            <!-- <div class="panel_head">每天最多发送1条群发消息，建议在活动促销场景中使用，请勿发送骚扰信息，严重违规者将受到微信的惩罚</div> -->
            <Row class="panel_form">
                <div class="phone_box">
                    <div class="phone_head">
                        <img :src="miniHeader" class="mini_header"/>
                    </div>
                    <div class="phone_body">
                        <div class="common_info">
                            <Avatar size="large" :src="userInfo.head_icon" />
                            <span class="username">{{userInfo.name}}</span>
                        </div>
                        <div class="common_info">
                            <div class="msg_item">
                                <span class="label">主题</span>
                                <p class="content">{{messageInfo.title}}</p>
                            </div>
                            <div class="msg_item">
                                <span class="label">消息内容</span>
                                <p class="content">{{messageInfo.details}} </p>
                            </div>
                        </div>
                        <div class="common_info">
                            <div class="info_item">进入小程序查看<Icon class="fr" size="16" type="ios-arrow-forward"/></div>
                        </div>
                        <div class="common_info">
                            <div class="info_item">拒收通知<Icon class="fr" size="16" type="ios-arrow-forward"/></div>
                        </div>
                    </div>
                </div>
                <div class="form_box">
                    <Form class="send_box" ref="messageInfo" :model="messageInfo" :rules="ruleValidate" :label-width="80">
                        <FormItem label="消息名称" prop="messageName">
                            <Input :disabled="messageInfo.status==1" placeholder="请输入消息名称" v-model="messageInfo.messageName" style="width: 400px"></Input>
                        </FormItem>
                        <FormItem label="主题" prop="title">
                            <Input :disabled="messageInfo.status==1" placeholder="请输入主题名称" v-model="messageInfo.title" style="width: 400px"></Input>
                        </FormItem>
                        <FormItem label="消息内容" prop="details">
                            <Input :disabled="messageInfo.status==1" type="textarea" :rows="4"  v-model="messageInfo.details" placeholder="请输入消息内容" style="width: 400px"/>
                        </FormItem>
                        <FormItem label="发送时间" prop="sendTime" v-if="messageInfo.isTemplate !=0 && is_template!=0">
                            <span v-if="messageInfo.status==1">{{messageInfo.sendTime}}</span>
                            <RadioGroup v-model="mode" v-else>
                                <div>
                                    <Radio label="0">
                                        <span>立即发送</span>
                                    </Radio>
                                </div>
                                <div>
                                    <Radio label="1">
                                        <span>设置时间</span>
                                    </Radio>
                                    <DatePicker type="datetime" :disabled="mode!=1" v-model="messageInfo.sendTime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择发送时间" style="width: 160px"></DatePicker>
                                </div>
                            </RadioGroup>
                        </FormItem>
                        <FormItem>
                            <Button size="large" v-if="messageInfo.status==1" @click="cancelModal">返回</Button>
                            <div v-else>
                                <Button type="primary" size="large" @click="handleSubmit('messageInfo')" style="margin-right:20px;">保存</Button>
                                <Button size="large"  @click="cancelModal">取消</Button>
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </Row>
        </Modal>
    </div>
</template>
<script>
import miniHeader from '@/assets/images/mini_header.png'
import { massApi,filterDate } from '@/api/index'
export default {
    name:'massDetail',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        massId: {
            type: String,
            default: false
        },
        type: {
            type: Number,
            default: false
        }
    },
    data () {
        const checkSend = (rule, value, callback) => {
            if(!this.mode && !this.messageInfo.sendTime){
                callback(new Error('请选择立即发送或设置时间'));
            }else if(this.mode==1 && !this.messageInfo.sendTime){
                callback(new Error('请选择发送时间'));
            }else {
                callback();
            }
        };
        return {
            miniHeader,
            messageInfo:{},
            getInfo:{},
            userInfo:{},
            status:1,
            is_template:'',
            mode:'',
            ruleValidate: {
                messageName: [
                    { required: true, message: '消息名称不能为空', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '主题名称不能为空', trigger: 'blur' }
                ],
                details: [
                    { required: true, message: '消息内容不能为空', trigger: 'blur' }
                ],
                sendTime: [
                    { required: true, validator: checkSend, trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        computedValue: {
            get() {
                this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.getMessageData(this.type,this.massId);
                return this.value;
            },
            set(value) {
                this.$emit("modal", false);
            }
        }
    },
    methods: {
        getMessageData(status,massId){
            this.is_template = status;
            if(status==0 || massId){
                let data={
                    id: massId,
                    is_template:status
                }
                massApi.getMessageInfo(data).then(res=>{
                    this.messageInfo = res;
                    this.getInfo = res;
                    if(res.sendTime){
                        this.mode = '1';
                    }else{
                        this.mode = res.status
                    }
                });
            }
        },
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.mode==0){
                        this.messageInfo.sendTime = '';
                    }
                    this.messageInfo.is_template = this.is_template;
                    this.messageInfo.message_name = this.messageInfo.messageName;
                    this.messageInfo.send_time = this.messageInfo.sendTime;
                    massApi.addMessage(this.messageInfo).then(res=>{
                        this.$Message.success('保存成功!');
                        this.$emit("modal", true);
                    })
                } else {
                    this.$Message.error('请填写完整信息!');
                }
            })
        },
        cancelModal(){
            this.$emit("modal", false);
        }
    }
}
</script>
