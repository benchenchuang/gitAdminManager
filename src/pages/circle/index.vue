<template>
  <div>
    <div class="top_card_out" @keydown="keyLogin();">
      <Card :padding="0" :bordered="false" :dis-hover="true">
        <div class="picks">
          <span class="input_tip">作&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;者：</span>
          <Input placeholder="作者姓名" style="width: 240px;margin-right: 30px;" v-model="searchModal.nickName"/>
        </div>
        <div class="picks">
          <span class="input_tip">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题：</span>
          <Input placeholder="标题关键字" style="width: 240px;margin-right: 30px;" v-model="searchModal.title"/>
        </div>
        <div class="picks">
          <span class="input_tip">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签：</span>
          <Select filterable v-model="searchModal.label" clearable @on-change="tagChange"
                  style="width:240px;margin-right: 30px;">
            <Option v-for="item in tagtypeList" :value="item.interest" :key="item.interest">{{ item.interest }}</Option>
          </Select>
        </div>
        <div class="picks">
          <span class="input_tip">排序方式：</span>
          <Select filterable v-model="searchModal.sortType" clearable @on-change="sortTypeChange"
                  style="width:240px;margin-right: 30px;">
            <Option v-for="item in sortypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="picks">
          <span class="input_tip">创建时间：</span>
          <DatePicker type="daterange" clearable @on-change="dateChange" placeholder="选择日期"
                      style="width: 240px;margin-right: 30px;"></DatePicker>
        </div>
        <div class="picks">
          <Button type="primary" @click="search">搜索</Button>
        </div>
        <br/>
        <div class="picks">
          <span class="input_tip">自动审核：</span>
          <i-switch size="large" v-model="isManMade" @on-change="checkManMade">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </div>
      </Card>
    </div>
    <div class="tabs_card_out toplines" v-show="!isgoNext&&!isgoNextEd&&!isgoNextUs">
      <Card :padding="0" :bordered="false" :dis-hover="true"
            style="margin-top: 20px;padding-top: 10px !important;margin-bottom: 20px;">
        <Tabs v-model="searchModal.stas" @on-click="changeTab">
          <TabPane v-for="(item,index) in tabs" :label="item.label" :name="item.name" :key="index">
            <!-- dropdown 批量操作 -->
            <!--            <div class="picks" style="margin-top: 15px !important;margin-bottom: 25px;margin-left: 5px;">-->
            <!--              <Dropdown style="margin-right: 30px;" @on-click="chooseTis">-->
            <!--                <Button type="primary">-->
            <!--                  {{bcpName}}-->
            <!--                  <Icon type="ios-arrow-down"></Icon>-->
            <!--                </Button>-->
            <!--                <DropdownMenu slot="list">-->
            <!--                  <DropdownItem name="设为推荐">设为推荐</DropdownItem>-->
            <!--                  <DropdownItem name="取消推荐">取消推荐</DropdownItem>-->
            <!--                  <DropdownItem name="设为隐藏">设为隐藏</DropdownItem>-->
            <!--                  <DropdownItem name="设为显示">设为显示</DropdownItem>-->
            <!--                  <DropdownItem name="删除">删除</DropdownItem>-->
            <!--                </DropdownMenu>-->
            <!--              </Dropdown>-->
            <!--            </div>-->
            <!--table 表格-->
            <Table v-if="cancelMod" border ref="selection" :columns="columns" :data="datas"
                   @on-selection-change="selectionChange">
            </Table>
            <div class="page_num">
              <Page :current="searchModal.pageNum" :total="page.total_num" show-total :page-size='searchModal.pageSize'
                    show-elevator
                    @on-change="onChange"/>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
    <Details v-on:modes="modes" v-model="isgoNext" :mekeId="mekeId" :tDta="tDta" :titleName="titleName"
             v-if="calling"></Details>
    <Edit v-on:modeed="modeed" v-model="isgoNextEd" :editData="editData" v-if="callingEd"></Edit>
    <Look v-model="isgoNextUs" @modal="modal" :userId.sync="userId" v-if="isgoNextUs"></Look>
    <!-- 刷僵尸粉数据弹窗 -->
    <Modal
      :title="jsTitle"
      v-model="jsmodal"
      :closable="false" :mask-closable="false">
      <Input v-model="jsmodalVal" type="number" :placeholder="jsPlaceHolder" @on-change="jsValChange"/>
      <div slot="footer">
        <Button type="text" size="large" @click="jsmodal=false">取消</Button>
        <Button :loading="jsmodalloading" type="primary" size="large" @click="jsSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {circleApi} from '@/api/index'
  import Details from './components/details'
  import Edit from './components/edit'
  import Look from '../userlist/components/look'

  export default {
    name: "index",
    components: {
      Details,
      Edit,
      Look
    },
    data() {
      return {
        clickIndex: 0,
        isManMade: false,//是否开启自动审核
        searchModal: {
          stas: '',//全部：'' ,发布中：1,已撤回：0
          pageNum: 1,
          pageSize: 10,
          sortType: null,//排序方式(1:收藏数   2：分享数  3：点赞数 4：发布时间)
          nickName: null,
          title: null,
          label: null,
          startTime: null,
          endTime: null
        },
        tagtypeList: [],
        sortypeList: [
          {
            value: '1',
            label: '按照作品收藏'
          },
          {
            value: '2',
            label: '按照作品转发'
          },
          {
            value: '3',
            label: '按照作品点赞'
          },
          {
            value: '4',
            label: '按照后台发布时间'
          }
        ],
        sortypeSelect: '',
        tabsCount: {
          t0: 0,
          t1: 0,
          t2: 0,
          t3: 0
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
                h('span', '待审核'),
                h('Badge', {
                  props: {
                    count: this.tabsCount.t3
                  }
                })
              ])
            },
            name: '3'
          },
          {
            label: (h) => {
              return h('div', [
                h('span', '发布中'),
                h('Badge', {
                  props: {
                    count: this.tabsCount.t1
                  }
                })
              ])
            },
            name: '1'
          },
          {
            label: (h) => {
              return h('div', [
                h('span', '已撤回'),
                h('Badge', {
                  props: {
                    count: this.tabsCount.t2
                  }
                })
              ])
            },
            name: '0'
          }
        ],
        bcpName: '批量操作',

        columns: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: '序号',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, ((this.searchModal.pageNum - 1) * 10) + params.index + 1)
            }
          },
          {
            title: '作者',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.isgoNextUs = true
                      this.userId = params.row.userId
                    }
                  }
                }, params.row.nickName),
              ])
            }
          },
          {
            title: '封面图片',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.cover
                  },
                  style: {
                    width: '50px',
                    height: '50px'
                  }
                })
              ])
            }
          },
          {
            title: '标题',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.title ? params.row.title : '')
            }
          },
          // {
          //   title: '内容',
          //   width: 200,
          //   align: 'center',
          //   render: (h, params) => {
          //     return h('div', {
          //       style: {
          //         display: 'inline-block',
          //         width: 170 + 'px',
          //         overflow: 'hidden',
          //         whiteSpace: 'nowrap',
          //         lineHeight: 20 + 'px',
          //         maxHeight: 80 + 'px'
          //       },
          //       domProps: {
          //         innerHTML: params.row.content ? params.row.content : '暂无内容'
          //       }
          //     })
          //   }
          // },
          {
            title: '位置',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.location ? params.row.location : '')
            }
          },
          {
            title: '标签',
            minWidth: 80,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.label ? params.row.label : '')
            }
          },
          {
            title: '发布时间',
            width: 180,
            align: 'center',
            render: (h, params) => {
              return h('div', {}, params.row.createTime ? params.row.createTime : '')
            }
          },
          {
            title: '数据',
            width: 270,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, `收藏:${params.row.collectNum}`),
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, `点赞:${params.row.zanNum}`),
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, `阅读:${params.row.readCount}`),
                h('span', {
                  style: {
                    marginRight: '10px'
                  }
                }, `评论:${params.row.pingNum}`),
                h('span', `转发:${params.row.share}`)
              ]);
            }
          },
          {
            title: '置顶',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('i-switch', { //数据库1是已处理，0是未处理
                  props: {
                    type: 'primary',
                    value: params.row.flag == 0 ? false : true,
                    disabled: params.row.stas == 1 ? false : true
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (value) => {
                      if (value) {//置顶操作
                        this.toTop(params.row.id);
                      } else {//取消置顶
                        this.cancelTop(params.row.id);
                      }
                    }
                  }
                },)
              ])
            }
          },
          {
            title: '状态',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('div', {}, params.row.stas == 1 ? '发布中' : params.row.stas == 0 ? '已撤回' : '')
            }
          },
          {
            title: '排序',
            align: 'center',
            width: 80,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    display: params.row.stickSort ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {//编辑排序操作
                      this.editSort(params.row.id, params.row.stickSort)
                    }
                  }
                }, params.row.stickSort),
                h('div', {
                  style: {
                    display: params.row.stickSort ? 'none' : 'inline-block'
                  }
                }, '未排序')
              ])
            }
          },
          {
            title: '操作',
            width: 236,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.tDta = {
                        collectNum: params.row.collectNum,
                        zanNum: params.row.zanNum,
                        readCount: params.row.readCount,
                        share: params.row.share,
                        pingNum: params.row.pingNum
                      }
                      this.clickIndex = this.clickIndex + 1
                      let dataSign = Object.assign({}, {
                        inx: this.clickIndex,
                        id: params.row.id
                      })
                      this.godetail(dataSign);
                    }
                  },
                  attrs: {
                    title: '查看'
                  }
                }, '查看'),
                h('a', {
                  style: {
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.clickIndex = this.clickIndex + 1
                      this.$nextTick(() => {
                        let drop = Object.assign({}, params.row)
                        drop.inx = this.clickIndex
                        this.goedit(drop);
                      })
                    }
                  },
                  attrs: {
                    title: '编辑'
                  }
                }, '编辑'),
                h('a', {
                  style: {
                    display: params.row.stas == 1 ? 'inline-block' : 'none',
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.rollBack(params.row.id, 0)
                    }
                  },
                  attrs: {
                    title: '撤回'
                  }
                }, '撤回'),
                h('a', {
                  style: {
                    display: params.row.stas == 3 ? 'inline-block' : 'none',
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.rollBack(params.row.id, 1)
                    }
                  },
                  attrs: {
                    title: '通过'
                  }
                }, '通过'),
                h('a', {
                  style: {
                    display: params.row.stas == 3 ? 'inline-block' : 'none',
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.rollBack(params.row.id, 0)
                    }
                  },
                  attrs: {
                    title: '驳回'
                  }
                }, '驳回'),
                h('a', {
                  style: {
                    display: params.row.stas == 0 ? 'inline-block' : 'none',
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.rollBack(params.row.id, 1)
                    }
                  },
                  attrs: {
                    title: '发布'
                  }
                }, '发布'),
                h('Dropdown', {
                    props: {trigger: "hover", transfer: true},
                    style: {display: params.row.stas == 1 ? 'inline-block' : 'none',}
                  },
                  [
                    h('DropdownItem', [
                      h('a', {
                        style: {
                          textDecoration: 'none',
                          outline: 'none'
                        }
                      }, [
                        '添加操作',
                        h('Icon',
                          {
                            props: {
                              type: "ios-arrow-forward"
                            }
                          })
                      ])
                    ]),
                    h('DropdownMenu', {slot: 'list'}, [
                      h('DropdownItem', {
                        nativeOn: {
                          click: () => {
                            this.mekedtId = params.row.id
                            this.showJsmodal(this.jsTitleArray.zan, this.jsPlaceHolderArray.zan, params.row.zanNum, 0)
                          }
                        }
                      }, '觅客圈点赞'),
                      h('DropdownItem', {
                        nativeOn: {
                          click: () => {
                            this.mekedtId = params.row.id
                            this.showJsmodal(this.jsTitleArray.collect, this.jsPlaceHolderArray.collect, params.row.collectNum, 1)
                          }
                        }
                      }, '觅客圈收藏'),
                      h('DropdownItem', {
                        nativeOn: {
                          click: () => {
                            this.mekedtId = params.row.id
                            this.showJsmodal(this.jsTitleArray.share, this.jsPlaceHolderArray.share, params.row.share, 2)
                          }
                        }
                      }, '觅客圈分享'),
                      h('DropdownItem', {
                        nativeOn: {
                          click: () => {
                            this.mekedtId = params.row.id
                            this.showJsmodal(this.jsTitleArray.read, this.jsPlaceHolderArray.read, params.row.readCount, 3)
                          }
                        }
                      }, '觅客圈阅读量'),
                      h('DropdownItem', {
                        nativeOn: {
                          click: () => {
                            this.mekedtId = params.row.id
                            this.showJsmodal(this.jsTitleArray.comment, this.jsPlaceHolderArray.comment, params.row.pingNum, 4)
                          }
                        }
                      }, '觅客圈评论量')
                    ])
                  ])
              ]);
            }
          }
        ],
        datas: [],
        total: 2,
        page: {
          total_num: 0
        },
        calling: true,
        isgoNext: false,
        titleName: '详情',
        mekeId: null,
        tDta: null,

        callingEd: true,
        isgoNextEd: false,
        editData: null,

        isgoNextUs: false,
        userId: '',

        jsTitle: '',
        jsmodal: false,
        jsmodalloading: false,
        jsmodalVal: 0,
        jsPlaceHolder: '请输入僵尸粉数量',
        jsIndex: 0,
        mekedtId: null,

        jsTitleArray: {
          zan: '觅客圈点赞',
          collect: '觅客圈收藏',
          share: '觅客圈分享',
          read: '觅客圈阅读量',
          comment: '觅客圈评论数'
        },
        jsPlaceHolderArray: {
          zan: '请输入点赞数',
          collect: '请输入收藏数',
          share: '请输入转发数',
          read: '请输入阅读量',
          comment: '请输入评论数'
        },

        cancelMod: true,
        sortData: 0,

      }
    },
    methods: {
      /**
       * 切换批量操作
       */
      chooseTis(e) {
        // this.bcpName = e;
      },
      _list() {
        let searchModal = Object.assign({}, {
          stas: this.searchModal.stas ? parseInt(this.searchModal.stas) : null,
          pageNum: this.searchModal.pageNum,
          pageSize: this.searchModal.pageSize,
          sortType: this.searchModal.sortType ? this.searchModal.sortType : null,
          nickName: this.searchModal.nickName ? this.searchModal.nickName : null,
          title: this.searchModal.title ? this.searchModal.title : null,
          label: this.searchModal.label ? this.searchModal.label : null,
          startTime: this.searchModal.startTime ? this.searchModal.startTime : null,
          endTime: this.searchModal.endTime ? this.searchModal.endTime : null
        });
        circleApi.mekeList(searchModal).then(data => {
          this.datas = data.data_list;
          this.page.total_num = data.total_num;
          this.getDataNum(data.fnum, data.snum,data.checkNum);
        })
      },
      _manMadeStatus() {
        circleApi.manMadeStatus().then(data => {
          if (data.state == 0) {
            this.isManMade = data.data == 0 ? false : true
          }
        })
      },
      /**
       * 标签列表
       */
      _label() {
        circleApi.labelList().then(data => {
          this.tagtypeList = data
        })
      },
      /**
       * 选择标签
       */
      tagChange(e) {
        this.searchModal.label = e;
      },
      /**
       *获取发布中和已撤回数量
       */
      getDataNum(fn, sn,cn) {
        this.tabsCount.t1 = fn;
        this.tabsCount.t2 = sn;
        this.tabsCount.t3 = cn;
      },

      /**
       * 选择排序方式
       */
      sortTypeChange(e) {
        this.searchModal.sortType = e;
      },
      /**
       *切换人工审核
       */
      checkManMade() {
        circleApi.checkManMadeStatus(this.isManMade ? 1 : 0).then(data => {
          // if (data.state == 0) {
          //   this.isManMade = data.data == 0 ? false : true
          // }
        })
      },
      /**
       * 选择创建时间
       */
      dateChange(formate, date) {
        this.searchModal.startTime = formate[0];
        this.searchModal.endTime = formate[1];
      },
      onChange(e) {//改变页码
        this.searchModal.pageNum = e;
        this._list();
      },
      changeTab(e) {
        this.datas = [];
        this.page.total_num = 0;
        this.searchModal.pageNum = 1;
        this._list();
      },
      search() {
        this.searchModal.pageNum = 1;
        this._list();
      },
      /**
       * 编辑置顶排序
       */
      editSort(id, sortnum) {
        let _this = this
        this.sortData = sortnum
        this.$Modal.confirm({
          render: (h) => {
            return h('Select', {
                props: {
                  value: sortnum,
                  transfer: true
                },
                on: {
                  'on-change': (e) => {
                    _this.sortData = e
                  }
                },
              },
              [
                h('Option', {
                  props: {
                    value: 1
                  }
                }, 1),
                h('Option', {
                  props: {
                    value: 2
                  }
                }, 2),
                h('Option', {
                  props: {
                    value: 3
                  }
                }, 3),
                h('Option', {
                  props: {
                    value: 4
                  }
                }, 4),
                h('Option', {
                  props: {
                    value: 5
                  }
                }, 5)
              ]
            );
          },
          onOk: () => {
            circleApi.circleMekeSort({id: id, stickSort: _this.sortData}).then(data => {
              _this.cancelMod = false
              _this.$nextTick(() => {
                _this.$Message.success('操作成功')
                _this.cancelMod = true
                _this._list()
              })
            })
          },
          onCancel: () => {
            // _this.cancelMod = false
            // _this.$nextTick(() => {
            //   _this.cancelMod = true
            // })
          }
        })
      },
      /**
       * 置顶
       */
      toTop(id) {
        let _this = this
        this.$Modal.confirm({
          render: (h) => {
            return h('Select', {
                props: {
                  value: 0,
                  transfer: true
                },
                on: {
                  'on-change': (e) => {
                    _this.sortData = e
                  }
                },
              },
              [
                h('Option', {
                  props: {
                    value: 1
                  }
                }, 1),
                h('Option', {
                  props: {
                    value: 2
                  }
                }, 2),
                h('Option', {
                  props: {
                    value: 3
                  }
                }, 3),
                h('Option', {
                  props: {
                    value: 4
                  }
                }, 4),
                h('Option', {
                  props: {
                    value: 5
                  }
                }, 5)
              ]
            );
          },
          onOk: () => {
            circleApi.circleMekeSort({id: id, stickSort: _this.sortData}).then(data => {
              _this.cancelMod = false
              _this.$nextTick(() => {
                _this.cancelMod = true
                _this.$Message.success('操作成功')
                _this._list()
              })
            })
          },
          onCancel: () => {
            _this.cancelMod = false
            _this.$nextTick(() => {
              _this._list()
              _this.cancelMod = true
            })
          }
        })
      },
      cancelTop(id) {
        let _this = this
        circleApi.cancelcircleMekeSort(id).then(data => {
          _this.cancelMod = false
          _this.$nextTick(() => {
            _this.cancelMod = true
            _this._list()
          })
        })
      },
      /**
       * 回车搜索
       * @param e
       */
      keyLogin(e) {
        if (event.keyCode == 13) {
          this.search();
        }
      },
      /**
       * 切换表格选中项
       */
      selectionChange(data) {
        console.log(data)
      },
      /**
       * 看详情
       * @param e
       */
      godetail(id) {
        this.titleName = '详情'
        this.isgoNext = true
        this.mekeId = id
      },
      /**
       * 去编辑
       * @param e
       */
      goedit(item) {
        this.isgoNextEd = true
        this.editData = item
      },
      /**
       * 状态操作
       * 0：撤回
       * @param e
       */
      rollBack(id, stas) {
        let pLs = Object.assign({}, {id: id, stas: stas})
        circleApi.backMekeInfo(pLs).then(data => {
          if (data.state == 0) {
            this.$Message.success('操作成功')
            this._list()
          }
        })
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
      modal() {
        this.isgoNextUs = false;
        this.userId = "";
      },
      /**
       * 显示僵尸粉弹窗
       */
      showJsmodal(title, placeholder, val, num) {
        this.jsTitle = title
        this.jsPlaceHolder = placeholder
        this.jsmodalVal = 0
        this.jsmodal = true
        this.jsmodalloading = false
        this.jsIndex = num
      },
      /**
       * 僵尸粉操作 提交
       */
      jsSubmit() {
        if (parseInt(this.jsmodalVal) > 50) {
          this.$Notice.error({
            title: '一次添加操作不超过50条'
          });
          this.jsmodalloading = true
          this.$nextTick(() => {
            this.jsmodalloading = false
          })
          return;
        }
        this.jsmodalloading = true
        let params = {
          id: this.mekedtId,
          num: parseInt(this.jsmodalVal)
        }
        switch (this.jsIndex) {
          case 0:
            circleApi.jsZan(params).then(data => {
              if (data.state == 0) {
                this.jsmodalloading = false
                this._list()
                this.jsmodal = false
                this.$Message.success('操作成功')
              } else {
                this.jsmodalloading = false
                this.$Message.error(data.message)
              }
            })
            break;
          case 1:
            circleApi.jsCollect(params).then(data => {
              if (data.state == 0) {
                this.jsmodalloading = false
                this._list()
                this.jsmodal = false
                this.$Message.success('操作成功')
              } else {
                this.jsmodalloading = false
                this.$Message.error(data.message)
              }
            })
            break;
          case 2:
            circleApi.jsShare(params).then(data => {
              if (data.state == 0) {
                this.jsmodalloading = false
                this._list()
                this.jsmodal = false
                this.$Message.success('操作成功')
              } else {
                this.jsmodalloading = false
                this.$Message.error(data.message)
              }
            })
            break;
          case 3:
            circleApi.jsRead(params).then(data => {
              if (data.state == 0) {
                this.jsmodalloading = false
                this._list()
                this.jsmodal = false
                this.$Message.success('操作成功')
              } else {
                this.jsmodalloading = false
                this.$Message.error(data.message)
              }
            })
            break;
          case 4:
            circleApi.jsComment(params).then(data => {
              if (data.state == 0) {
                this.jsmodalloading = false
                this._list()
                this.jsmodal = false
                this.$Message.success('操作成功')
              } else {
                this.jsmodalloading = false
                this.$Message.error(data.message)
              }
            })
            break;
        }

      },
      /**
       * 僵尸粉数据改变
       */
      jsValChange(e) {

      },
    },
    async created() {
      await this._list();
      await this._label();
      await this._manMadeStatus();
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
