<style lang="less" scoped>
.virtual{
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
        <Form class="panel-form mb-20 virtual" inline>
            <FormItem>
                <Input v-model="addNum" type="number" size="large" placeholder="请输入添加人数"/>
            </FormItem>
            <FormItem :label-width="10">
                <Button type="primary" size="large" @click="addRobotModal"><Icon type="md-add" />添加</Button>
            </FormItem>
        </Form>
        <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
            <Table :columns="columns" :data="robotData"></Table>
            <div class="page_num">
                <Page :total="total" show-total :page-size="params.pageSize" show-elevator @on-change="onChange"/>
            </div>
        </Card>

        <Modal title="添加机器人提示" v-model="modal" class-name="vertical-center-modal" @on-ok="makeRobots">
            <p>是否确定添加 {{addNum}} 个机器人</p>
        </Modal>

    </div>
</template>
<script>
import {virtualApi} from '@/api/index'
export default {
    name:'virtual',
    data () {
        return {
            addNum:'',
            params:{
                pageNum:1,
                pageSize:15
            },
            total:0,
            modal:false,
            columns:[
                {
                    title: "编号",
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', (this.params.pageNum-1)*this.params.pageSize+params.index+1)
                        ]);
                    }
                },
                {
                    title: "用户昵称",
                    key: "nickName",
                    align: 'center',
                },
                {
                    title: "头像",
                    key: "headIcon",
                    align: 'center',
                    render: (h, { row, column, index }) => {
                        return h("Avatar", {
                            attrs: {
                                src: row.headIcon
                            }
                        });
                    }
                },
                {
                    title: "性别",
                    key: "sex",
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.sex==1){
                            return h('div', [
                                h('span', '男')
                            ]);
                        } else{
                            return h('div', [
                                h('span', '女')
                            ]);
                        }
                    }
                },
                {
                    title: "学校",
                    key: "school",
                    align: 'center',
                },
                {
                    title: "学历",
                    key: "education",
                    align: 'center',
                },
            ],
            robotData:[]
        }
    },
    created () {
        this.getRobotsList();
    },
    methods: {
        onChange(e){//改变分页
            this.params.pageNum = e;
            this.getRobotsList();
        },
        addRobotModal(){//添加提醒
            if(!this.addNum){
                this.$Message.error('请输入添加人数');
                return ;
            }
            this.modal = true;
        },
        makeRobots(){//确认添加机器人
            this.$Message.loading({
                content: '机器人创建中...',
                duration: 0
            });
            virtualApi.createRobots(this.addNum).then(res=>{
                this.$Message.destroy()
                if(res.state == 0){
                    this.$Message.success('添加成功');
                    this.params.pageNum = 1;
                    this.getRobotsList();
                }else{
                    this.$Message.error('添加失败，请重试');
                }
            })
        },
        getRobotsList(){
            virtualApi.getRobotsList(this.params).then(res=>{
                if(res.state == 0){
                    this.robotData = res.data.data_list;
                    this.total = res.data.total_num;
                }
            })
        }
    },
    destroyed () {
        this.$Message.destroy();
    }
}
</script>
