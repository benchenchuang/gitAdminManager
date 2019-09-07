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
    <Form ref="applyForm" :model="applyForm" class="panel-form mb-20 enterprise" inline>
        <FormItem>
            <Input v-model="applyForm.contactName" placeholder="请输入联系人姓名"/>
        </FormItem>
        <FormItem>
            <Input v-model="applyForm.companyName" placeholder="请输入公司名称"/>
        </FormItem>
        <FormItem>
            <Input v-model="applyForm.contactPhone" placeholder="请输入手机号码"/>
        </FormItem>
        <FormItem label="申请状态：" :label-width="80">
            <Select style="width:200px" v-model="applyForm.status">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem :label-width="10">
            <Button type="primary" @click="handleSubmit('applyForm')"><Icon type="ios-search" />查询</Button>
            <a :href="loadUrl">
                <Button type="primary">导出数据</Button>
            </a>
        </FormItem>
    </Form>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
      <Table :columns="columns" :data="enterpriseData"></Table>
      <div class="page_num">
        <Page :total="total" show-total :page-size="applyForm.pageSize" show-elevator @on-change="onChange"/>
      </div>
    </Card>
  </div>
</template>
<script>
import {homeApi,downloadApi} from '@/api/index'
export default {
  data() {
    return {
        loadUrl:downloadApi.getApplyList,
        applyForm:{
            contactName:'',
            companyName:'',
            contactPhone:'',
            status:'',
            pageNum:1,
            pageSize:10
        },
        total:0,
        applyId:'',
        remark:'',
        flag:'',
        statusList: [
            {
                value: "",
                label: "全部"
            },{
                value: "0",
                label: "未处理"
            },
            {
                value: "1",
                label: "已开通"
            },
            {
                value: "3",
                label: "驳回"
            }
        ],
        columns: [
            {
                title: "联系人",
                key: "contactName",
                align: 'center',
            },
            {
                title: "联系电话",
                key: "contactPhone",
                align: 'center',
            },
            {
                title: "公司名称",
                key: "companyName",
                align: 'center',
            },
            {
                title: "添加时间",
                key: "createTime",
                align: 'center',
            },
            {
                title: "申请状态",
                key: "status",
                align: 'center',
                render: (h, params) => {
                    if(params.row.status==0){
                        return h('div', [
                            h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, '未处理')
                        ]);
                    } else if(params.row.status==1){
                        return h('div', [
                            h('span', {
                                style: {
                                    color: '#19be6b'
                                }
                            }, '已开通')
                        ]);
                    }else if(params.row.status==2){
                        return h('div', [
                            h('span', {
                                style: {
                                    color: '#808695'
                                }
                            }, '试用结束')
                        ]);
                    }else{
                        return h('div', [
                            h('span', {
                                style: {
                                    color: '#ed4014'
                                }
                            }, '驳回')
                        ]);
                    }
                }
            },
            {
                title: "操作",
                align: 'center',
                width:'200px',
                render: (h, params) => {
                    if(params.row.status==0){
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
                                            this.doApply(params.index,params.row.id,1);
                                        }
                                    }
                                },
                                "开通"
                            ),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doApply(params.index,params.row.id,3);
                                    }
                                }
                            }, '驳回')
                        ]);
                    }
                }
            }
        ],
        enterpriseData: []
    };
  },
  created () {
      this.getApplyList();  
  },
  methods: {
    onChange(e) {//改变页码
      this.applyForm.pageNum = e;
      this.getApplyList();
    },
    handleSubmit(){//提交查询
        this.applyForm.pageNum = 1;
        this.getApplyList();
    },
    getApplyList(){//获取企业申请列表
        homeApi.getEnterpriseList(this.applyForm).then(res=>{
            this.enterpriseData = res.data_list;
            this.total = res.total_num;
        })
    },
    showApplyMsg(id,flag){
        this.applyId = id;
        this.flag = flag;
        this.$Modal.confirm({
            render: (h) => {
                return h('Input', {
                    props: {
                        value: this.value,
                        autofocus: true,
                        placeholder: '请输入操作理由'
                    },
                    on: {
                        input: (val) => {
                            this.remark = val;
                            this.value = val;
                            console.log(val)
                        }
                    }
                })
            }
        })
    },
    doApply(index,id,flag){//申请的开通或驳回
        homeApi.getEnterpriseList({id:id,flag:flag}).then(res=>{
            if(flag==1){
                this.$Message.success('开通成功');
            }else{
                this.$Message.success('操作成功');
            }
            this.getApplyList();
        })
    }
  }
};
</script>

