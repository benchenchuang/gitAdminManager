<template>
  <div>
    <div class="top_card_out" @keydown="keySearch();">
      <Card :padding="0" :bordered="false" :dis-hover="true">
        <div class="picks">
          <span class="input_tip">举&nbsp;&nbsp;报&nbsp;&nbsp;人：</span>
          <Input placeholder="举报人姓名" style="width: 240px;margin-right: 30px;" v-model="searchModal.userName"/>
        </div>
        <div class="picks">
          <span class="input_tip">举报类型：</span>
          <Select v-model="searchModal.reportTypeId" clearable @on-change="typeChange"
                  style="width:240px;margin-right: 30px;">
            <Option v-for="item in reportTypeList" :value="item.reportName" :key="item.reportName">{{ item.reportName }}</Option>
          </Select>
        </div>
        <div class="picks">
          <Button type="primary" @click="search">搜索</Button>
        </div>
      </Card>
    </div>
    <div class="tabs_card_out" v-show="!isgoNext&&!isgoNextEd">
      <Card :padding="0" :bordered="false" :dis-hover="true"
            style="margin-top: 20px;padding-top: 10px !important;margin-bottom: 20px;">
        <Tabs v-model="searchModal.reportType" @on-click="changeTab">
          <TabPane v-for="(item,index) in tabs" :label="item.label" :name="item.name" :key="index">
            <!--table 表格-->
            <Table border ref="selection" :columns="columns" :data="datas"
                   @on-selection-change="selectionChange"></Table>
            <div class="page_num">
              <Page :current="searchModal.pageNum" :total="page.total_num" show-total :page-size='searchModal.pageSize'
                    show-elevator
                    @on-change="onChange"/>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
    <Details v-on:modes="modes" v-model="isgoNext" :tDta.sync="tDta" v-if="calling"></Details>
    <Edits v-on:modeed="modeed" v-model="isgoNextEd" :tDtaEd.sync="tDtaEd" v-if="callingEd"></Edits>
  </div>
</template>

<script>
  import {reportApi} from '@/api/index'
  import Details from './components/article/detail'
  import Edits from './components/article/edit'

  export default {
    name: "articles",
    components: {
      Details,
      Edits
    },
    data() {
      return {
        searchModal: {
          pageNum: 1,
          pageSize: 10,
          userName: null,
          reportTypeId: null,
          reportType: null,
          flag: 1//flag=1 表示作品举报     2表示名片举报
        },
        reportTypeList: [],
        datas: [],
        page: {
          total_num: 0
        },
        tabsCount: {
          t0: 0,
          t1: 0,
          t2: 0
        },
        tabs: [
          {
            label: (h) => {
              return h('div', [
                h('span', '全部'),
                h('Badge', {
                  props: {
                    count: this.tabsCount.t0
                  }
                })
              ])
            },
            name: ''
          },
          {
            label: (h) => {
              return h('div', [
                h('span', '待处理'),
                h('Badge', {
                  props: {
                    count: this.tabsCount.t1
                  }
                })
              ])
            },
            name: '0'
          },
          {
            label: (h) => {
              return h('div', [
                h('span', '已处理'),
                h('Badge', {
                  props: {
                    count: this.tabsCount.t2
                  }
                })
              ])
            },
            name: '1'
          }
        ],
        columns: [
          {
            title: '编号',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, ((this.searchModal.pageNum - 1) * 10) + params.index + 1)
            }
          },
          {
            title: '举报类型',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.reportTypeId ? params.row.reportTypeId : '')
            }
          },
          {
            title: '举报人',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.userName ? params.row.userName : '')
            }
          },
          {
            title: '被举报人',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.targetName ? params.row.targetName : '')
            }
          },
          {
            title: '举报时间',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.createTime ? params.row.createTime : '')
            }
          },
          {
            title: '举报类型',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.reportType==1 ? '已处理' : '待处理')
            }
          },
          {
            title: '处理结果',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.postResult ? params.row.postResult : '无')
            }
          },
          {
            title: '备注',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.note ? params.row.note : '无')
            }
          },
          {
            title: '操作',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    marginRight: '15px',
                    display: params.row.reportType==1?'none':'inline-block'
                  },
                  on: {
                    click: () => {
                      this.tDtaEd = {}
                      this.$nextTick(()=>{
                        this.tDtaEd = Object.assign(params.row,{nums: ((this.searchModal.pageNum - 1) * 10) + params.index + 1})
                        this.isgoNextEd = true
                      })
                    }
                  }
                }, '处理'),
                h('a', {
                  style: {
                    marginRight: '15px',
                    display: params.row.reportType==1?'inline-block':'none'
                  },
                  on: {
                    click: () => {
                      this.tDta = {}
                      this.$nextTick(()=>{
                        this.tDta = Object.assign(params.row,{nums: ((this.searchModal.pageNum - 1) * 10) + params.index + 1})
                        this.isgoNext = true
                      })
                    }
                  }
                }, '查看')
              ]);
            }
          }
        ],
        isgoNext: false,
        calling: true,
        tDta: null,

        isgoNextEd: false,
        callingEd: true,
        tDtaEd: null
      }
    },
    methods: {
      /**
       * 举报列表
       */
      _list() {
        let searchModal = Object.assign({}, {
          reportType: this.searchModal.reportType ? parseInt(this.searchModal.reportType) : null,
          pageNum: this.searchModal.pageNum,
          pageSize: this.searchModal.pageSize,
          userName: this.searchModal.userName ? this.searchModal.userName : null,
          reportTypeId: this.searchModal.reportTypeId ? this.searchModal.reportTypeId : null,
          flag: this.searchModal.flag
        });
        reportApi.reportList(searchModal).then(data => {
          this.datas = data.data_list;
          this.page.total_num = data.total_num;
          this.getDataNum(data.fnum, data.snum);
        })
      },
      /**
       * 举报类型列表
       */
      _reporttype() {
        reportApi.reportTypeList(2).then(data => {
          if (data.state == 0) {
            this.reportTypeList = data.data
          }
        })
      },
      /**
       *获取待处理和已处理数量
       */
      getDataNum(fn, sn) {
        this.tabsCount.t1 = fn;
        // this.tabsCount.t2 = sn;
      },
      /**
       * 回车搜索
       */
      keySearch() {
        if (event.keyCode == 13) {
          this.search();
        }
      },
      search() {
        this.searchModal.pageNum = 1;
        this._list();
      },
      /**
       * 举报类型切换
       */
      typeChange(e) {
        // console.log(this.searchModal.reportTypeId)
      },
      /**
       * 切换状态
       */
      changeTab(e) {
        console.log(this.searchModal.reportType)
        this.searchModal.pageNum = 1;
        this._list();
      },
      /**
       * 切换表格选中项
       */
      selectionChange(data) {
        console.log(data)
      },
      onChange(e) {//改变页码
        this.searchModal.pageNum = e;
        this._list();
      },
      modes(e) {
        if (!e) {
          this.calling = false
          this.$nextTick(() => {
            this.calling = true
            this.isgoNext = e
          })
        }
      },
      modeed(e) {
        if (!e) {
          this.callingEd = false
          this.$nextTick(() => {
            this.callingEd = true
            this.isgoNextEd = e
          })
        }
      },
    },
    created() {
      if (this.$route.params.from == '待处理') {
        this.searchModal.reportType = '0';
      }
      this._list()
      this._reporttype()
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
