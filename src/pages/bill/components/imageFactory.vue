<template>
  <div class="imageFactory detailsModal">
    <Modal v-show="!isgoUploard" v-model="computedValue" :transfer="false" :mask-closable="false" footer-hide>
      <div slot="header">
        <div class="record">
          <a title="返回海报库分类" @click="goback">{{`海报库 》${titleName}`}}</a>
        </div>
      </div>
      <div>
        <div style="margin-top: 10px">
          <Button class="org-add-staff"
                  type="primary"
                  icon="md-add" style="margin-left: 2%" @click="addPict">添加图片
          </Button>
          <Input v-model="params.pictureName" placeholder="请搜索图片"
                 style="width: 180px;margin-left: 10px" @keyup.native.enter="search"></Input>
          <Button type="primary" style="margin-left: 15px" @click="search">查询</Button>
          <Button v-if="!isDelIng&&datas.length>0" @click="delChoose" type="primary"
                  style="float: right;margin-right: 2%">批量删除
          </Button>

          <Button v-if="isDelIng&&datas.length>0" @click="delCancel" style="float: right;margin-right: 2%">取消</Button>
          <Button :disabled="!chooseImgIds.length>0" v-if="isDelIng&&datas.length>0" @click="delAction" type="error"
                  style="float: right;margin-right: 1%">
            删除
          </Button>
          <Button v-if="isDelIng&&datas.length>0" @click="checkSelectAll" type="primary"
                  style="float: right;margin-right: 1%">
            {{chooseImgIds.length==datas.length?'取消全选':'全选'}}
          </Button>
        </div>

        <Row style="margin-top: 20px" v-if="datas.length>0">
          <Col span="4" v-for="(item,index) in datas" :key="index">
            <Row>
              <Col class="cateroyItem" :class="isDelIng?'cateroyItem_s':''" span="18" offset="3">
                <a :class="isDelIng?'':'deeps'" :title="item.pictureName">
                  <div style="position: relative">
                    <img style="width: 100%"
                         :src="item.picture">
                    <div v-if="isDelIng" class="coverArea" @click="chooseDelItem(item)">
                      <div>
                        <img v-if="!chooseImgIds.includes(item.id)" src="../../../assets/images/che_box.png">
                        <img v-if="chooseImgIds.includes(item.id)" src="../../../assets/images/che_box_on.png">
                      </div>
                    </div>
                  </div>
                  <div class="picname">{{item.pictureName}}</div>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row v-if="datas.length>0">
          <Col span="24" style="text-align: right;padding: 10px 20px 0 20px;">
            <Page :total="page.total_num" :page-size="params.pageSize" :current="params.pageNum" @on-change="checkPage"
                  show-total></Page>
          </Col>
        </Row>

        <Row style="margin-top: 20px" v-if="datas.length==0">
          <Col span="24">
            <Card dis-hover :padding="50" :bordered="false" style="text-align: center">
              暂无数据
            </Card>
          </Col>
        </Row>
      </div>
    </Modal>

    <ImageUploard :cateryId="cateryId" v-on:modelcal="modelcal" v-model="isgoUploard" @on-addsuccess='addSuccess'
                  v-if="calling"></ImageUploard>
  </div>
</template>

<script>
  import {billApi} from '@/api/index'
  import ImageUploard from './imageUploard'

  export default {
    name: "imageFactory",
    components: {
      ImageUploard
    },
    data() {
      return {
        searchModel: {
          categoryName: ''
        },
        params: {
          categoryId: '',
          pictureName: '',
          pageNum: 1,
          pageSize: 12
        },
        datas: [],
        page: {
          total_num: 0
        },
        isgoUploard: false,
        calling: true,

        isDelIng: false,
        chooseImgIds: []
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
      cateryId: {
        type: String,
        default: false
      }

    },
    watch: {
      cateryId(val) {
        this.params.pageNum = 1
        this.getData(val);
      },
    },
    created() {

    },
    methods: {
      addPict() {
        this.calling = false
        this.$nextTick(() => {
          this.calling = true
          this.isgoUploard = true
        })
      },
      getData(id) {
        this.params.categoryId = id
        this.datas = []
        billApi.galleryImgList(this.params).then(data => {
          this.datas = data.data.data_list
          this.page.total_num = data.data.total_num
          if (this.datas.length == 0 && this.params.pageNum != 1) {//删除最后一页所有数据，加载前一页数据
            this.params.pageNum = this.params.pageNum - 1
            this.getData(this.cateryId)
          }
        })
      },
      checkPage(page) {
        this.params.pageNum = page
        this.chooseImgIds = []
        this.isDelIng = false
        this.getData(this.cateryId)
      },
      search() {
        this.getData(this.cateryId)
      },
      modelcal(e) {
        if (!e) {
          this.isgoUploard = e
        }
      },
      addSuccess() {
        this.getData(this.cateryId)
        this.calling = false
        this.$nextTick(() => {
          this.calling = true
          this.isgoUploard = false
        })
      },
      delChoose() {
        this.chooseImgIds = []
        this.isDelIng = true
      },
      delCancel() {
        this.isDelIng = false
      },
      chooseDelItem(item) {
        let arr = this.chooseImgIds
        if (arr.includes(item.id)) {//取消选中
          arr.splice(arr.findIndex(i => i === item.id), 1)
        } else {
          arr.push(item.id)
        }
        this.chooseImgIds = arr
        console.log(this.chooseImgIds)
      },
      checkSelectAll() {
        let arr = this.chooseImgIds
        this.chooseImgIds = []
        if (arr.length === this.datas.length) {//取消全选

        } else {//全选
          let arrI = []
          this.datas.forEach((item, index, ars) => {
            arrI.push(item.id)
            if (ars.length === (index + 1)) {
              this.chooseImgIds = arrI
            }
          })
        }
      },
      delAction() {
        if (this.chooseImgIds.length === 0) {
          this.$Notice.warning({
            title: '请选择需要删除的图片'
          })
          return
        }
        let ids = this.chooseImgIds
        billApi.delPostersGalleryImg(ids).then(data => {
          if (data.state == 0) {
            this.getData(this.cateryId)
            this.chooseImgIds = []
            this.isDelIng = false
            this.$Message.success('操作成功');
          } else {
            this.$Message.info(data.msg);
          }
        })
      },
      goback() {
        this.computedValue = false
      },
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
  .cateroyItem {
    margin-bottom: 15px;
    margin-top: 10px;
    position: relative;

    .deeps {
      cursor: default;
      text-decoration: none;
      color: #333333;
    }

    .coverView {
      position: absolute;
      z-index: 20001;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9) inset;
      left: 0;
      top: 0;
      border-radius: 4px;
      display: flex;
      cursor: pointer;

      .item {
        width: calc(100% / 3);
        height: 100%;
        text-align: center;
        position: relative;

        img {
          display: inline-block;
          width: 1.7rem;
          height: 1.7rem;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }

    img {
      border-radius: 4px;
      height: 30vh;
    }

    .coverArea {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 4px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 4px;

      div {
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        background: #ffffff;
        position: relative;
        top: 0.4rem;
        left: 0.4rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .picname {
      width: 100%;
      line-height: 30px;
      color: #333333;
      font-family: 微软雅黑;
      font-size: 0.94rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .cateroyItem_s {
    cursor: pointer;
  }

  .record {
    font-size: 16px;
    font-weight: 500;
    padding: 5px 0 5px 3px;
  }
</style>
