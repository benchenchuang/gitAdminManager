<style lang="less">
.enterprise{
    padding: 20px 20px 0 20px;
    background: #fff;
}
.page_num{
    margin: 30px 0;
    text-align: right;
}
</style>
<template>
  <div class="panel">
    <Form ref="memberForm" :model="memberForm" class="panel-form mb-20 enterprise" inline>
        <FormItem>
            <Input v-model="memberForm.name" placeholder="用户名/姓名"/>
        </FormItem>
        <FormItem label="所属角色：" :label-width="80">
            <Select style="width:200px" v-model="memberForm.type">
                <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="排序方式：" :label-width="80">
            <Select style="width:200px" v-model="memberForm.sortType">
                <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem :label-width="10">
            <Button type="primary" @click="handleSubmit('memberForm')"><Icon type="ios-search" />搜索</Button>
        </FormItem>
        <FormItem :label-width="1">
          <Button type="primary" @click="isScan = true">添加</Button>
        </FormItem>
    </Form>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
      <Table :columns="columns" :data="memberData"></Table>
      <div class="page_num">
        <Page :total="total" show-total :page-size="memberForm.pageSize" show-elevator @on-change="onChange"/>
      </div>
    </Card>
    <Detail v-model="isScan" @modal="modal" :roles="roleList" :userId.sync="userId" v-if="isScan"></Detail>
  </div>
</template>
<script>
import { homeApi } from '@/api/index'
import Detail from "./components/detail";
export default {
    components: {
        Detail
    },
    data() {
        return {
            memberForm:{
                name:'',
                type:'',
                sortType:'',
                pageNum:1,
                pageSize:10
            },
            total:0,
            isScan:false,
            userId:'',
            sortList:[
                {
                    value:1,
                    label:'时间倒序'
                },
                {
                    value:2,
                    label:'所属部门'
                }
            ],
            roleList: [
                {
                    value: 1,
                    label: "超级管理员"
                },
                {
                    value: 2,
                    label: "运营人员"
                },
                {
                    value: 3,
                    label: "审核人员"
                },
                {
                    value: 4,
                    label: "财务审核"
                },
                {
                    value: 5,
                    label: "财务发放"
                },
                {
                    value: 6,
                    label: "活动管理"
                },
                {
                    value: 7,
                    label: "行政人员"
                }
            ],
            columns: [
                {
                    title: "成员账号",
                    key: "login",
                    align: 'center',
                },
                {
                    title: "姓名",
                    key: "name",
                    align: 'center',
                },
                {
                    title: "邮箱地址",
                    key: "email",
                    align: 'center',
                },
                {
                    title: "所属部门",
                    key: "dept",
                    align: 'center',
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    align: 'center',
                },
                {
                    title: "最后登陆",
                    key: "loginTime",
                    align: 'center',
                },
                {
                    title: "是否启用",
                    key: "status",
                    width:'100px',
                    align: 'center',
                    render: (h, { row, column, index }) => {
                        return h("i-switch", {
                            props: {
                                type: "primary",
                                value: row.status == 0
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {"on-change": value => {
                                if (row.status == 1) {
                                    row.status = 0;

                                } else {
                                    row.status = 1;
                                }
                                this.isShowMember(row.id,row.status)
                            }}
                        });
                    }
                },
                {
                    title: "操作",
                    align: 'center',
                    width:'200px',
                    render: (h, {row, column, index }) => {
                        return h("div", [
                            h("Button",
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
                                    this.userId = row.id;
                                    this.isScan = true;
                                  }
                                }
                                },
                                "编辑"
                            ),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.delMember(index,row.id)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            memberData: []
        };
    },
    created () {
        this.getMemberList();  
    },
    methods: {
        onChange(e) {
        this.memberForm.pageNum = e;
        this.getMemberList();
        },
        handleSubmit(){//提交查询
            this.memberForm.pageNum = 1 ;
            this.memberForm.pageSize = 10 ;
            this.getMemberList();
        },
        getMemberList(){//获取成员列表
            homeApi.getMemberList(this.memberForm).then(res=>{
                if(res.state ==0){
                    let getData = res.data
                    this.memberData = getData.data_list;
                    this.total = getData.total_num;
                }
            })
        },
        isShowMember(userId,status){//是否启用
            homeApi.changeMemberStatus(userId,status).then(res=>{
                if(res.state==0){
                    if(status==0){
                        this.$Message.success('已启用');
                    }else{
                        this.$Message.success('已停用');
                    }
                }
            })
        },
        delMember(index,userId){//删除账号
            this.$Modal.confirm({
                title: '删除提示',
                content: '<p>是否确定删除此成员用户</p>',
                loading: true,
                onOk: () => {
                    homeApi.delMember(userId).then(res=>{
                        if(res.state==0){
                            this.$Message.success('用户已删除');
                            this.memberData.splice(index,1);
                            this.total -=1;
                        }
                        this.$Modal.remove();
                    })
                }
            });
            
        },
        modal(e) {
            this.isScan = false
            this.userId = '';
            if(e){
                // this.memberForm = {
                //     name:'',
                //     type:'',
                //     sortType:'',
                //     pageNum:1,
                //     pageSize:10
                // }
                this.getMemberList();
            }
        },
    }
};
</script>

