<style lang="less" scoped>
.detailsModal form{
    margin: 80px auto 0;
    width: 500px;
}
</style>

<template>
    <div class="detailsModal">
        <Modal v-model="computedValue" :transfer="false" :mask-closable="false" footer-hide>
            <Form ref="memberInfo" :model="memberInfo" :rules="ruleValidate" :label-width="120">
                <FormItem label="成员名称：" prop="login">
                    <Input v-model="memberInfo.login" size="large" placeholder="请输入成员名称"></Input>
                </FormItem>
                <FormItem label="成员姓名：" prop="name">
                    <Input v-model="memberInfo.name" size="large" placeholder="请输入成员姓名"></Input>
                </FormItem>
                <!-- <FormItem label="手机号：" prop="phone">
                    <Input v-model="memberInfo.phone" disabled size="large" placeholder="请输入手机号"></Input>
                </FormItem> -->
                <FormItem label="邮箱地址：" prop="email">
                    <Input v-model="memberInfo.email" type="email" size="large" placeholder="请输入邮箱地址"></Input>
                </FormItem>
                <FormItem label="所属角色：" prop="type">
                    <Select v-model="memberInfo.type" size="large">
                        <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="部门名称：" prop="dept">
                    <Input v-model="memberInfo.dept" size="large" placeholder="请输入部门名称"></Input>
                </FormItem>
                <FormItem label="登录密码：" prop="passWord">
                    <Input v-model="memberInfo.passWord" type="password" size="large" placeholder="请输入登录密码"></Input>
                </FormItem>
                <FormItem label="确认密码：" prop="repassWord">
                    <Input v-model="memberInfo.repassWord" type="password" size="large" placeholder="请确认登录密码"></Input>
                </FormItem>
                <FormItem label="备注信息：">
                    <Input v-model="memberInfo.remark" type="textarea" size="large" placeholder="请输入内容"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" size="large" long @click="handleSubmit('memberInfo')">提交</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import {homeApi} from '@/api/index'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        roles: {
            type: Array,
            default: []
        },
        userId: {
            type: String,
            default: false
        }
    },
    data () {
        const pwdCheckValidate = (rule, value, callback) => {
            if ( !value) {
                callback(new Error('确认密码不能为空'));
            } else if (this.memberInfo.passWord != value) {
                callback(new Error('新密码和确认密码应相同'));
            } else {
                callback();
            }
        };
        return {
            memberInfo:{
                id:'',
                phone:'',
                login:'',
                passWord:'',
                repassWord:'',
                role:'',
                name:'',
                type:'',
                remark:'',
                dept:'',
                email:''
            },
            ruleValidate:{
                login: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '邮箱内容不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '成员姓名不能为空', trigger: 'blur' }
                ],
                dept: [
                    { required: true, message: '部门不能为空', trigger: 'blur' }
                ],
                type: [
                    { required: true, type:'number', message: '角色不能为空', trigger: 'change' }
                ],
                passWord: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                repassWord: [
                    { required: true, validator: pwdCheckValidate, trigger: 'blur'}
                ]
            }
        }
    },
    computed: {
        computedValue: {
            get() {
                this.getUserInfo(this.userId);
                return this.value;
            },
            set(value) {
                this.memberInfo = {};
                this.$emit("modal", false);
            }
        }
    },
    methods: {
        getUserInfo(userId){
            if(userId){
                homeApi.getUserInfo(userId).then(res=>{
                    if(res.state == 0){
                        res.data.passWord = '';
                        res.data.type+='';
                        this.memberInfo = res.data;
                    }
                })
            }
        },
        handleSubmit (name) {//提交信息
            this.$refs[name].validate((valid) => {
                if (valid) {
                    homeApi.addMember(this.memberInfo).then(res=>{
                        if(res.state == 0){
                            if(this.memberInfo.id){
                                this.$Message.success('修改成员成功!');
                            }else{
                                this.$Message.success('添加成员成功!');
                            }
                            this.memberInfo = {};
                            this.$emit("modal", true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                } else {
                    this.$Message.error('请补全信息');
                }
            })
        },
    }
}
</script>

