<template>
  <div>
    <div class="top_card_out" @keydown="keySearch();">
      <Card :padding="0" :bordered="false" :dis-hover="true">
        <div class="picks" style="margin-right: 30px">
          <span class="input_tip">用户姓名：</span>
          <Input v-model="params.nickName" placeholder="用户姓名" style="width: 240px"/>
        </div>
        <div class="picks" style="margin-right: 30px">
          <span class="input_tip">排序方式：</span>
          <Select v-model="params.sortType" clearable style="width:240px" @on-change="sorttypeChange">
            <Option v-for="item in sortypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="picks" style="margin-right: 30px">
          <span class="input_tip">分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类：</span>
          <Select v-model="params.categoryId" clearable @on-change="typeChange" style="width:240px">
            <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.category }}</Option>
          </Select>
        </div>
        <div class="picks">
          <Button type="primary" @click="search">搜索</Button>
        </div>
      </Card>
    </div>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;padding-top: 10px !important;">
      <Table border :columns="columns" :data="datas"></Table>
      <div class="page_num">
        <Page :current="params.pageNum" :total="page.total_num" show-total :page-size='params.pageSize' show-elevator
              @on-change="onChange"/>
      </div>
    </Card>

    <!-- 更改排序弹窗 -->
    <Modal
      title="排序"
      v-model="sortmodal"
      :loading="sortmodalloading"
      :closable="false"
      @on-ok="sortSubmit">
      <Input v-model="sortmodalVal" type="number" placeholder="输入排序"/>
    </Modal>
    <!-- 更改分类弹窗 -->
    <Modal
      title="分类"
      v-model="catertypemodal"
      :loading="catertypemodalloading"
      :closable="false"
      @on-ok="caterSubmit">
      <RadioGroup v-model="catertypemodalval" @on-change="changeCategre">
        <Radio v-for="item in typeList" :label="item.id" :key="item.id">
          <span>{{item.category}}</span>
        </Radio>
      </RadioGroup>
    </Modal>
  </div>
</template>

<script>
  import {concatsApi} from '@/api/index'

  export default {
    name: "concats",
    data() {
      return {
        sortypeList: [
          {
            value: 1,
            label: '按照个人魅力值'
          },
          {
            value: 2,
            label: '按照用户创建时间'
          },
        ],
        typeList: [],
        sortypeSelect: '',
        columns: [
          {
            title: '用户头像',
            width: 240,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.headIcon
                  },
                  style: {
                    width: '36px',
                    height: '36px'
                  }
                })
              ])
            }
          },
          {
            title: '用户姓名',
            key: 'nickName'
          },
          {
            title: '注册时间',
            key: 'createTime'
          },
          {
            title: '魅力值',
            key: 'charmValue'
          },
          {
            title: '排序',
            render: (h, params) => {
              return h('a', {
                style: {
                  height: '100%',
                  width: '100%',
                  display: 'inline-block'
                },
                on: {
                  click: () => {
                    // alert('切换排序')
                    this.sortmodal = true
                    this.sortmodalloading = true
                    this.sortmodalVal = params.row.sort
                    this.handelId = params.row.id
                    this.userId = params.row.userId
                  }
                }
              }, params.row.sort?params.row.sort: '无')
            }
          },
          {
            title: '所属分类',
            render: (h, params) => {
              return h('a', {
                style: {
                  height: '100%',
                  width: '100%',
                  display: 'inline-block'
                },
                on: {
                  click: () => {
                    // alert('切换分类')
                    this.catertypemodal = true
                    this.catertypemodalloading = true
                    this.catertypemodalval = params.row.categoryId
                    this.handelId = params.row.id
                    this.userId = params.row.userId
                  }
                }
              }, params.row.category ? params.row.category : '暂无分类')
            }
          }
        ],
        datas: [],
        page: {
          total_num: 0
        },
        sortmodal: false,
        sortmodalVal: 0,
        sortmodalloading: true,

        catertypemodal: false,
        catertypemodalval: '',
        catertypemodalloading: true,

        params: {
          pageNum: 1,
          pageSize: 10,
          categoryId: null,
          nickName: null,
          sortType: null
        },
        total: 2,
        handelId: null,

        userId: null
      }
    },
    created() {
      this._list()
      this._types()
    },
    methods: {
      /**
       * 人脉宝藏列表
       */
      _list() {
        concatsApi.concatsList(this.params).then(data => {
          this.datas = data.data_list;
          this.page.total_num = data.total_num;
        })
      },
      /**
       * 分类列表
       */
      _types() {
        concatsApi.typeList().then(data => {
          this.typeList = data
        })
      },
      /**
       * 切换排序方式搜索项
       * @param e
       */
      sorttypeChange(e) {
        this.params.sortType = e
      },
      /**
       * 切换分类搜索项
       * @param e
       */
      typeChange(e) {
        this.params.categoryId = e
      },
      /**
       * 回车搜索
       * @param e
       */
      keySearch() {
        if (event.keyCode == 13) {
          this.search();
        }
      },
      search() {
        this.params.pageNum = 1;
        this._list();
      },
      /**
       * 重置单条所属分类
       */
      changeCategre(e) {
        this.catertypemodalval = e
      },
      /**
       * 重置单条所属分类action
       */
      caterSubmit() {
        this.catertypemodalloading = true
        concatsApi.handel({id: this.handelId, categoryId: this.catertypemodalval,userId: this.userId}).then(data => {
          if (data.state == 1) {
            this.$Message.success('操作成功')
            this.catertypemodalloading = false
            this.catertypemodal = false
            this._list()
          }
        })
      },
      /**
       * 重置单条排序action
       */
      sortSubmit() {
        this.sortmodalloading = true
        concatsApi.handel({id: this.handelId, sort: this.sortmodalVal?this.sortmodalVal:0,userId: this.userId}).then(data => {
          if (data.state == 1) {
            this.$Message.success('操作成功')
            this.sortmodalloading = false
            this.sortmodal = false
            this._list()
          }
          if(data.state == -1){
            this.$Message.error(data.message)
            this.sortmodalloading = false
          }
        })
      },
      onChange(e) {//改变页码
        this.params.pageNum = e;
        this._list();
      },
    }
  }
</script>

<style scoped>
  .picks {
    display: inline-block;
    margin-bottom: 22px;
  }

  .input_tip {
    display: inline-block;
    font-size: 15px;
    color: #666666;
    margin-right: 6px;
    font-weight: normal;
  }

  .page_num {
    margin: 30px 0 10px;
    text-align: right;
  }
</style>
