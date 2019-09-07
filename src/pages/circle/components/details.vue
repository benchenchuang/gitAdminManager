<template>
  <div class="details detailsModal title_line_none">
    <Modal v-model="computedValue" @on-cancel="goback" :transfer="false" :mask-closable="false" footer-hide>
      <div slot="header">
        <div class="record">

        </div>
      </div>
      <div class="drick" v-if="info">
        <div class="left">
          <!--标题--->
          <div class="title_area">
            <div class="titl">{{info.title}}</div>
            <div class="descr">
              标签：<span>{{info.label}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              发布时间：<span>{{info.createTime}}</span>
            </div>
          </div>
          <!---内容--->
          <div class="content_area">
            <div class="contx" v-html="info.content?info.content:'暂无内容'">
              <!--              内容示例近日，新时代证券因四年前承接的一单并购重组项目中未尽职履行财务顾问责任，对并购标的资产业绩预测存在误导性描述，被证监会处于责令改正、警告并被罚款合计4470万元。此前，也曾有为造假IPO保荐的券商因未进行充分尽调被罚，此外，IPO企业招股书出现数据出错或两版招股书数据打架也频见诸报端。-->
            </div>
            <div class="blank"></div>
            <div class="bott" v-if="tDtas">
              <span>收藏<span class="num">{{tDtas.collectNum}}</span></span>
              <span>点赞<span class="num">{{tDtas.zanNum}}</span></span>
              <span>阅读<span class="num">{{tDtas.readCount}}</span></span>
              <span>转发<span class="num">{{tDtas.share}}</span></span>
            </div>
          </div>
          <!--评论--->
          <div class="discusstion"><span style="margin-left: 10px;">全部评论 {{tDtas.pingNum}}</span></div>
          <div class="discusstion_list">
            <div class="item" v-for="(item,index) in commentFirst" :key="index" v-if="commentFirst.length>0">
              <div class="left_it"><img
                :src="item.headIcon"/>
              </div>
              <div class="mid_it">
                <div class="k_name">{{item.nickName?item.nickName:'--'}}</div>
                <div class="k_conc">{{item.customer?`回复${item.customer}：`:''}}{{item.content}}</div>
                <div class="k_time">{{item.createTime}}
                  <Poptip
                    confirm
                    title="确定删除这条评论?"
                    @on-ok="_deleteComment(item.id,true)">
                    <a class="deles">删除</a>
                  </Poptip>
                </div>
              </div>
              <div style="clear: both"></div>
              <div class="itemSon" v-if="item.circleCommentReplyList.length>0"
                   v-for="(itemSon,indexSon) in item.circleCommentReplyList" :key="indexSon">
                <div class="left_it"><img
                  :src="itemSon.headIcon"/>
                </div>
                <div class="mid_it">
                  <div class="k_name">{{itemSon.nickName?itemSon.nickName:'--'}}</div>
                  <div class="k_conc">{{itemSon.customer?`回复${itemSon.customer}：`:''}}{{itemSon.content}}</div>
                  <div class="k_time">{{itemSon.createTime}}
                    <Poptip
                      confirm
                      title="确定删除这条评论?"
                      @on-ok="_deleteCommentWs(itemSon.id,false)">
                      <a class="deles">删除</a>
                    </Poptip>
                  </div>
                </div>
              </div>
            </div>
            <div class="discusstion_none" v-if="commentFirst.length==0">暂无评论</div>
          </div>
          <div class="page_num" v-if="commentFirst.length!=0">
            <Page :current="commentsFirParams.pageNum" :total="page.total_num" show-total
                  :page-size='commentsFirParams.pageSize'
                  show-elevator @on-change="onChange"/>
          </div>
        </div>
        <div class="right">
          <div class="img_head">轮播图片</div>
          <div class="banner_img" v-if="info.circleImgs">
            <img v-for="item in info.circleImgs" :key="item.id"
                 :src="item.imgUrl">
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {circleApi} from '@/api/index'

  export default {
    name: "detailcircle",
    data() {
      return {
        info: null,
        tDtas: null,
        commentFirst: [],
        commentsFirParams: {
          pageNum: 1,
          pageSize: 10
        },
        page: {
          total_num: 0
        },
        mekeIds: null
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      titleName: {
        type: String,
        default: false
      },
      mekeId: {
        type: Object,
        default: false
      },
      tDta: {
        type: Object,
        default: false
      }

    },
    methods: {
      goback() {
        this.computedValue = false
      },
      getDetail(id) {
        circleApi.mekeInfo({id: id}).then(data => {
          this.info = data
        })
      },
      /**
       * 第一级评论列表
       * @private
       */
      _commentFir(id) {
        this.commentsFirParams.id = id
        circleApi.mekeCommentFirst(this.commentsFirParams).then(data => {
          this.commentFirst = data.data_list
          this.page.total_num = data.total_num;
        })
      },
      onChange(e) {
        this.commentsFirParams.pageNum = e;
        this._commentFir(this.mekeIds);
      },
      /**
       * 删除评论
       *
       */
      _deleteComment(commentId, resizeNum) {
        let params = {
          id: this.mekeIds,
          commentId: commentId,
          flag: 1
        }
        circleApi.mekeCommentFirst(params).then(data => {
          this._commentFir(this.mekeIds)
          if (resizeNum) {
            this.tDtas.pingNum = this.tDtas.pingNum - 1
            this.$parent._list()
          }
        })
      },
      /**
       * 删除子评论
       */
      _deleteCommentWs(commentId, resizeNum){
        let params = {
          id: commentId,
          flag: 1
        }
        circleApi.mekeCommentSon(params).then(data => {
          this._commentFir(this.mekeIds)
          if (resizeNum) {
            this.tDtas.pingNum = this.tDtas.pingNum - 1
            this.$parent._list()
          }
        })
      },
    },
    watch: {
      mekeId(val) {
        this.mekeIds = val.id
        this.getDetail(val.id);
        this._commentFir(val.id);
      },
      tDta(val) {
        this.tDtas = val
      }
    },
    computed: {
      computedValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('modes', val)
        }
      }
    },
  }
</script>

<style scoped lang="less">
  .drick {
    width: 100%;
    display: flex;
    font-family: 微软雅黑;

    .left {
      flex: 2;
      /*background: darkred;*/
      min-height: calc(100vh - 200px);
      padding: 20px 20px 20px 0;
      border-right: 1px solid #f0f0f0;

      .title_area {
        width: calc(100% - 120px);
        height: 120px;
        border-bottom: 1px solid #f0f0f0;
        text-align: center;
        margin-left: 60px;

        .titl {
          font-size: 22px;
          color: #333333;
          font-weight: 600;
        }

        .descr {
          font-size: 16px;
          color: #666666;
          line-height: 56px;

          span {
            color: #626262;
          }
        }
      }

      .content_area {
        width: calc(100% - 120px);
        margin-left: 60px;
        min-height: 300px;
        position: relative;

        .contx {
          font-size: 15px;
          color: #666666;
          line-height: 30px;
          padding-top: 40px;
          text-indent: 2em;
        }

        .blank {
          width: 100%;
          height: 60px;
        }

        .bott {
          font-size: 16px;
          color: #333333;
          position: absolute;
          bottom: 0;
          right: -10px;

          span {
            margin-right: 15px;

            .num {
              color: #666666;
            }
          }
        }
      }

      .discusstion {
        width: calc(100% - 120px);
        margin-left: 60px;
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #f0f0f0;
        margin-top: 80px;
        font-size: 18px;
        color: #333333;
        font-weight: 500;
      }

      .discusstion_list {
        width: calc(100% - 120px);
        margin-left: 60px;

        .discusstion_none {
          width: 100%;
          height: 200px;
          line-height: 100px;
          text-align: center;
          font-size: 18px;
          color: #666666;
        }

        .item {
          width: 100%;
          border-bottom: 1px solid #f0f0f0;

          .itemSon {
            display: flex;
            width: calc(100% - 100px);
            margin-left: 100px;
            min-height: 100px;

            .left_it {
              width: 80px;
              height: 80px;
              margin: 30px 30px 30px 15px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .mid_it {
              flex: 1;

              .k_name {
                font-size: 16px;
                color: #333333;
                line-height: 40px;
                margin-top: 18px;
              }

              .k_conc {
                line-height: 24px;
                font-size: 14px;
              }

              .k_time {
                line-height: 24px;
                color: #999999;
                font-size: 13px;
                margin-top: 5px;
                margin-bottom: 10px;

                .deles {
                  margin-left: 15px;
                }
              }
            }
          }

          .left_it {
            float: left;
            width: 80px;
            height: 80px;
            margin: 30px 30px 30px 15px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .mid_it {
            float: left;
            width: calc(100% - 125px);

            .k_name {
              font-size: 16px;
              color: #333333;
              line-height: 40px;
              margin-top: 18px;
            }

            .k_conc {
              line-height: 24px;
              font-size: 14px;
            }

            .k_time {
              line-height: 24px;
              color: #999999;
              font-size: 13px;
              margin-top: 5px;
              margin-bottom: 10px;

              .deles {
                margin-left: 15px;
              }
            }
          }
        }
      }
    }

    .right {
      flex: 1;
      /*background: lightblue;*/
      margin-left: 20px;

      .img_head {
        width: 100%;
        height: 50px;
        line-height: 40px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 18px;
        color: #333333;
        font-weight: 500;
      }

      .banner_img {
        margin-top: 20px;
        img {
          width: calc(42% - 4px);
          margin-left: 4%;
          margin-right: 4%;
          margin-top: 20px;
          height: 120px;
          display: inline-block;
          /*object-fit: fill;*/
        }
      }
    }
  }

  .page_num {
    margin: 30px 0 10px;
    text-align: right;
  }
</style>
