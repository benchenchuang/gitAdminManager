<template>
    <div @keydown="keyLogin();">
        <div class="login">
            <div class="login-con">
            <Card icon="log-in" title="欢迎登录管理端" :bordered="false">
                <div class="form-con">
                    <Form ref="loginForm" :model="form">
                        <FormItem prop="userName">
                            <Input v-model="form.login" size="large" placeholder="请输入用户名">
                                <span slot="prepend">
                                <Icon :size="16" type="ios-person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" size="large" v-model="form.passWord" placeholder="请输入密码">
                                <span slot="prepend">
                                <Icon :size="14" type="md-lock"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="code">
                            <Col span="16">
                                <Input type="text" size="large" v-model="form.code" placeholder="请输入验证码">
                                    <span slot="prepend">
                                    <Icon :size="14" type="md-lock"></Icon>
                                    </span>
                                </Input>
                            </Col>
                            <Col span="6" offset="1">
                                <!-- <img class="code" :src="imgDataURL" @click="createVerfy"/> -->
                                <div  @click="refreshCode"><WebIdentify :identifyCode = "dataCode"/></div>
                            </Col>
                            
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" size="large" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/vuex/index'
import {homeApi}  from '@/api/index'
// import verification from 'verification-code';
import router from '../router/index'
import WebIdentify from '@/components/common/identify'
export default {
    name:'Login',
    components: {
        WebIdentify
    },
    data () {
        return {
            dataCode:'',
            imgDataURL:'',
            form: {
                login: '',
                passWord: '',
                code:'',
                ip:'',
                address:''
            }
        }
    },
    created () {
        this.refreshCode();
        this.form.ip = localStorage.getItem('Ip');
        this.form.address = localStorage.getItem('cityname');
    },
    methods: {
        refreshCode(){
            let code = Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0').substr(0,4);
            this.dataCode = code;
        },
        keyLogin(e){//回车登陆
           if(event.keyCode == 13){
               this.handleSubmit();
           }
        },
        handleSubmit() {//登陆
            let redirect = decodeURIComponent(this.$route.query.redirect || '/meke');
            let {login,passWord,code} = this.form;
            if(!login){
                this.$Message.error('用户名不能为空');
                return;
            }
            if(!passWord){
                this.$Message.error('密码不能为空');
                return;
            }
            if(!code){
                this.$Message.error('验证码不能为空');
                return;
            }
            if(code!=this.dataCode){
                this.$Message.error('验证码错误');
                return;
            }
            this.$Message.info('正在登陆中...');
            homeApi.userLogin(this.form).then(res=>{
                this.$Message.destroy()
                if(res.state==0){
                    this.$Message.success('登陆成功！');
                    let userInfo = res.data;
                    store.dispatch('userInfo', userInfo);
                    localStorage.setItem('userInfo',JSON.stringify(userInfo));
                    localStorage.setItem('sessionId',userInfo.session_id);
                    store.dispatch('permission').then(()=>{
                        router.addRoutes(store.state.navList);
                    })
                    setTimeout(()=>{
                        this.$router.push({
                            path: redirect
                        })
                    },1000)
                }else{
                    this.$Message.error(res.message);
                }
            })
        }
    }
}
</script>
<style lang="less">
.login{
    width: 100%;
    height: 100vh;
    background-image: url('../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con{
        position: absolute;
        right: 200px;
        top: 50%;
        transform: translateY(-50%);
        width: 400px;
        &-header{
            text-align: center;
            padding: 40px 0;
        }
        .ivu-card-head p{
            height: auto!important;
            font-size: 20px!important;
        }
        .form-con{
            padding: 10px 0 0;
        }
    }
    .ivu-input-group>.ivu-input-group-prepend{
        font-size: 16pximportant;
        padding: 15px 12px!important;
        height: 46px!important;
    }
    .ivu-input-group .ivu-input{
        height: 46px!important;
    }
    .ivu-btn-large{
        padding:10px 15px;
    }
    .code{
        width: 100%;
        height: 44px;
    }
}
</style>


