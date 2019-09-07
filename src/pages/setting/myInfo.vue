<style lang="less">
.ivu-card-head{
    background: #f6f6f6;
}
.info_box{
    margin: 20px auto; 
    width:400px;
    .info_avatar{
        text-align: center;
        margin: 20px auto;
        .ivu-avatar{
            display: inline-block;
            font-size: 80px;
            width: 100px;
            height: 100px;
            line-height: 100px;
            border-radius: 100%;
        }
        .tip{
            margin-top: 10px;
            font-size: 12px;
            color: #2d8cf0;
        }
    }
}
</style>

<template>
    <div class="myInfo">
        <Card class="item">
            <p slot="title">账户设置</p>
            <div class="info_box">
                <div class="info_avatar">
                    <Upload 
                        ref="upload"
                        :show-upload-list="false"
                        :data="qiNiuData"
                        :max-size="5120"
                        :on-error="onError"
                        :on-exceeded-size="onExceeded"
                        :on-success="handleSuccess"
                        :action="uploadUrl">
                        <Avatar icon="ios-person" :src="formData.headIcon" size="large" />
                    </Upload>
                    <p class="tip">上传头像</p>
                </div>
                <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                    <FormItem label="用户名" prop="login">
                        <Input v-model="formData.login" disabled size="large" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="Email" prop="email">
                        <Input v-model="formData.email" disabled size="large" placeholder="请输入邮箱"></Input>
                    </FormItem>
                    <FormItem label="旧密码" prop="oldPassWord">
                        <Input v-model="formData.oldPassWord" type="password" size="large" placeholder="请输入旧密码"></Input>
                    </FormItem>
                    <FormItem label="新密码" prop="newPassWord">
                        <Input v-model="formData.newPassWord" type="password" size="large" placeholder="请输入新密码"></Input>
                    </FormItem>
                    <FormItem label="确定密码" prop="rePassWord">
                        <Input v-model="formData.rePassWord" type="password" size="large" placeholder="请再次输入新密码"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" size="large" long @click="handleSubmit('formData')">提交</Button>
                    </FormItem>
                </Form>
            </div>
        </Card>
    </div>
</template>
<script>
import {homeApi,settingApi,uploadApi} from '@/api/index'
export default {
    name:'myInfo',
    data () {
        const pwdCheckValidate = (rule, value, callback) => {
            if ( !value) {
                callback(new Error('确认密码不能为空'));
            } else if (this.formData.newPassWord != value) {
                callback(new Error('新密码和确认密码应相同'));
            } else {
                callback();
            }
        };
        return {
            formData:{
                headIcon:'',
                email:'',
                login:'',
                oldPassWord:'',
                newPassWord:'',
                rePassWord:''
            },
            ruleValidate: {
                login: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '邮箱内容不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
                oldPassWord: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPassWord: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                rePassWord: [
                    { required: true, validator: pwdCheckValidate, trigger: 'blur'}
                ]
            },
            qiNiuData: {},
            configData: null,
            uploadUrl: "",
        }
    },
    created () {
        this.getQiNiuToken();
        this.getUserInfo();
    },
    methods: {
        onExceeded(e) {
            this.$Message.error("请上传小于5MB图片！");
        },
        onError() {
            this.$Message.error("图片上传失败,请重新上传！");
        },
        handleSuccess(res, file){//上传图片成功
            this.$Message.success("上传成功！");
            let generalUrl = uploadApi.generalUrl(this.configData, res);
            this.formData.headIcon = generalUrl;
            this.$bus.$emit('changeInfo',{avatar:generalUrl})
        },
        handleSubmit (name) {//提交账户设置
            this.$refs[name].validate((valid) => {
                let formData = this.formData;
                if (valid) {
                    settingApi.editUserCount(formData).then(res=>{
                        if(res.state == 0){
                            this.$Message.success('修改信息成功!');
                            homeApi.loginOut().then(res=>{
                                if(res.state ==0){
                                    setTimeout(()=>{
                                        localStorage.removeItem('userInfo');
                                        localStorage.removeItem('sessionId');
                                        this.$router.push({
                                            path: '/login'
                                        })
                                        // this.$router.push({
                                        //     path: '/login',
                                        //     query: {redirect: '/meke/myInfo'}
                                        // })
                                    },500)
                                }
                            });
                        }else{
                            this.$Message.error(res.message);
                        }
                        console.log(res)
                    })
                } else {
                    this.$Message.error('请补全信息');
                }
            })
        },
        //获取七牛token
        async getQiNiuToken(){
            const configData = await uploadApi.getServerConfig();
            this.configData = configData;
            this.qiNiuData = {
                token: configData.token
            };
            this.uploadUrl = `${configData.zoneUrl}?token=${configData.token}`;
        },
        getUserInfo(){//获取用户信息
            homeApi.getUserInfo().then(res=>{
                if(res.state == 0){
                    this.formData = res.data;
                }
            })
        }
    }
}
</script>

