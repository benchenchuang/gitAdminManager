<template>
  <div>
    <div class="top_card_out">
      <Card :padding="0" :bordered="false" :dis-hover="true">
        <div class="picks" style="margin-right: 30px">
          <Button class="org-add-staff"
                  type="primary"
                  icon="md-add" @click="addCatery">添加分类
          </Button>
        </div>
        <div class="picks" style="margin-right: 30px">
          <Input v-model="searchModel.categoryName" placeholder="请搜索分类" style="width: 240px;" @keyup.native.enter="_list"></Input>
        </div>
        <div class="picks">
          <Button type="primary" @click="_list">查询</Button>
        </div>
      </Card>
    </div>
    <Card v-show="!isgoNext" :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
      <Row>
        <Col span="6" v-for="(item,index) in datas" :key="index">
          <Row>
            <Col class="cateroyItem" span="20">
              <a :title="item.categoryName">
                <div @mouseenter="enterM(item)" @mouseleave="leaveM" style="cursor: pointer">
                  <img :id="`imgid_${item.id}`" style="width: 100%"
                       :src="item.categoryPicture">
                </div>
                <div @mouseenter="enterM(item)" @mouseleave="leaveM" v-show="showThisCover==item.id"
                     :id="`imgcover_${item.id}`" class="coverView">
                  <div class="item" :class="eyesOn?'itemOn':''" @mouseenter="eyesOn=true" @mouseleave="eyesOn=false"
                       @click="insertC(item)">
                    <img v-show="eyesOn" src="../../assets/images/eyes.png">
                    <img v-show="!eyesOn" src="../../assets/images/eyes-off.png">
                  </div>
                  <div class="item" :class="editOn?'itemOn':''" @mouseenter="editOn=true" @mouseleave="editOn=false"
                       @click="editC(item)">
                    <img v-show="editOn" src="../../assets/images/edit.png">
                    <img v-show="!editOn" src="../../assets/images/edit-off.png">
                  </div>
                  <div class="item" :class="delOn?'itemOn':''" @mouseenter="delOn=true" @mouseleave="delOn=false"
                       @click="deltC(item)">
                    <img v-show="delOn" src="../../assets/images/dels.png">
                    <img v-show="!delOn" src="../../assets/images/dels-off.png">
                  </div>
                </div>
                <div class="picname"><a class="deeps">{{item.categoryName}}</a></div>
              </a>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row v-if="datas.length==0">
        <Col span="24" style="text-align: center;padding: 10px 20px;">
          暂无数据
        </Col>
      </Row>

      <Row v-if="datas.length>0">
        <Col span="24" style="text-align: right;padding: 10px 20px;">
          <Page :total="page.totalNum" :page-size="searchModel.pageSize" :current.sync="searchModel.pageNum"
                @on-change="checkPage" show-total></Page>
        </Col>
      </Row>
    </Card>

    <Modal :title="modTitle" v-model="keepAlive" :loading="modloading"
           @on-ok="submit('formVaildate')" @on-cancel="cancleSubmit('formVaildate')">
      <Form ref="formVaildate" :model="params"
            :rules="ruleValidate" :label-width="70" label-position='right'>
        <Row>
          <Col span="17">
            <FormItem prop="categoryName"
                      label="分类名称"
                      :required=true>
              <Input type="text"
                     v-model="params.categoryName"
                     placeholder="分类名称限制20字"/>

            </FormItem>
          </Col>
          <Col span="6" offset="1" style="line-height: 36px;"></Col>
        </Row>

        <FormItem label="分类图片" prop="categoryPicture" class="circle-cover-img" v-show="params.categoryPicture">
          <Row>
            <Col span="1" style="font-size: 0.8rem;color: #405060">
              <!--              分类图片-->
            </Col>
            <Col span="21" style="font-size: 0.8rem;color: #405060">
              <div style="display: inline-block" class="poster" @mouseenter="onMouse" @mouseleave="offMouse">
                <img :src="params.categoryPicture" alt="">
                <div class="imgC" v-show="seen">
                  <div class="item" @mouseenter="eyesOnMeth" @mouseleave="eyesOffMeth"
                       @click="lookUrlMean(params.categoryPicture)">
                    <img v-show="!eyesModalOn" src="../../assets/images/eyes.png">
                    <img v-show="eyesModalOn" src="../../assets/images/eyes-on.png">
                  </div>
                  <div class="item" @mouseenter="delsOnMeth" @mouseleave="delsOffMeth" @click="delUrlMean">
                    <img v-show="!delModalOn" src="../../assets/images/dels.png">
                    <img v-show="delModalOn" src="../../assets/images/dels-on.png">
                  </div>
                </div>
              </div>
              <span style="font-size: 12px;color: #666666;position: absolute;margin-left: 10px;">图片大小限制5M</span>
              <Input v-show="false" v-model="params.categoryPicture"></Input>
            </Col>
          </Row>
        </FormItem>

        <FormItem v-show="!params.categoryPicture" label="分类图片" prop="categoryPicture" :required=true>
          <!--          <Button type="primary" @click="clickSelectCover">上传图片-->
          <!--          </Button>-->
          <UploadImg v-on:setimageurl="setimageurl"></UploadImg>
          <span style="margin-left: 15px">图片大小限制5M</span>
          <Input v-show="false" v-model="params.categoryPicture"></Input>
        </FormItem>

      </Form>
    </Modal>
    <Modal
      title="删除"
      v-model="isDel"
      :closable="false" @on-ok="delCircle">
      {{delContent}}
    </Modal>
    <Modal title="查看图片" v-model="modalCode" :footerHide="true">
      <img :src="softImgUrl" v-if="modalCode" style="width: 100%">
    </Modal>
    <ImageFactory v-on:modes="modes" v-model="isgoNext" :titleName="titleName" :cateryId="cateryId"
                  v-if="calling"></ImageFactory>
  </div>
</template>

<script>
  import { billApi} from '@/api/index'
  import ImageFactory from './components/imageFactory'
  import UploadImg from './components/uploadImg'

  export default {
    name: "index",
    components: {
      ImageFactory,
      UploadImg
    },
    data() {
      return {
        searchModel: {
          categoryName: '',
          pageNum: 1,
          pageSize: 12
        },
        datas: [],
        imgStyle: {
          width: 0,
          height: 0
        },
        showThisCover: '',
        eyesOn: false,
        editOn: false,
        delOn: false,
        delContent: '',
        isDel: false,
        keepAlive: false,
        page: {
          totalNum: 0
        },
        delMan: true,
        calling: true,
        isgoNext: false,
        /**
         * 分类添加、编辑表单参数
         */
        params: {
          categoryName: '',
          categoryPicture: ''
        },
        ruleValidate: {
          categoryName: [{required: true, message: "请输入分类名称"}, {max: 20, message: '分类名称限制20个字'}],
          categoryPicture: [{required: true, message: "请上传分类图片"}]
        },
        modloading: true,
        modTitle: '添加分类',

        eyesModalOn: false,
        delModalOn: false,
        modalCode: false,
        softImgUrl: '',
        seen: false,
        isShowCropper: false,
        delId: '',
        subType: '新增',
        editId: '',
        titleName: '',
        cateryId: ''
      }
    },
    created() {
      this._list()
    },
    methods: {
      _list() {
        billApi.galleryList(this.searchModel).then(data => {
          this.datas = data.data.data_list
          this.page.totalNum = data.data.total_num
        })
      },
      checkPage(page) {
        this.searchModel.pageNum = page
        this._list()
      },
      delCircle() {
        console.log('删除')
        billApi.delPostersGallery(this.delId).then(data => {
          if (data.state == 0) {
            this._list()
            this.$Message.success('删除成功');
          } else {
            this.$Message.info(data.msg);
          }
        })
      },

      /**
       *
       * 分类添加、编辑表单方法
       *
       */

      /**
       * 添加
       */
      addCatery() {
        this.params = {
          categoryName: '',
          categoryPicture: ''
        }
        this.modTitle = '添加分类'
        this.subType = '新增'
        this.editId = ''
        this.keepAlive = false
        this.delMan = false
        this.$nextTick(() => {
          this.delMan = true
          this.keepAlive = true
        })
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.subType == '新增') {
              this.addAction(this.params);
            } else {
              this.editAction(this.params);
            }
          } else {
            /**
             * 校验失败
             * 确定按钮的loarding效果不触发
             * @type {boolean}
             */
            this.modloading = false
            this.$nextTick(() => {
              this.modloading = true
            })
          }
        })
      },
      addAction(data) {
        billApi.addPostersGallery(data).then(res => {
          if (res.state === 0) {
            this.$Message.success('操作成功');
            this.keepAlive = false
            this.cancleSubmit('formVaildate')
            this._list()
          } else {
            this.$Message.info(res.msg);
            this.modloading = false
            this.$nextTick(() => {
              this.modloading = true
            })
          }
        })
      },
      editAction(data) {
        var data = data
        data.id = this.editId
        billApi.editPostersGallery(data).then(res => {
          if (res.state === 0) {
            this.$Message.success('操作成功');
            this.keepAlive = false
            this.cancleSubmit('formVaildate')
            this._list()
          } else {
            this.$Message.info(res.msg);
            this.modloading = false
            this.$nextTick(() => {
              this.modloading = true
            })
          }
        })
      },
      cancleSubmit(name) {
        this.$refs[name].resetFields();
      },
      onMouse() {
        this.seen = true
      },
      offMouse() {
        this.seen = false
      },
      eyesOnMeth() {
        this.eyesModalOn = true
      },
      eyesOffMeth() {
        this.eyesModalOn = false
      },
      delsOnMeth() {
        this.delModalOn = true
      },
      delsOffMeth() {
        this.delModalOn = false
      },
      delUrlMean() {
        this.params.categoryPicture = ''
      },
      setimageurl(e) {
        this.params.categoryPicture = e
      },
      lookUrlMean(url) {
        this.softImgUrl = url
        this.modalCode = true
      },
      enterM(item) {
        var idName = `imgid_${item.id}`
        var coverName = `imgcover_${item.id}`
        document.getElementById(coverName).setAttribute("style", `width:${document.getElementById(idName).offsetWidth}px;height:${document.getElementById(idName).offsetHeight}px`);
        this.showThisCover = item.id
      },
      leaveM() {
        this.showThisCover = ''
      },
      /**
       * 跳转分类下的图片列表
       */
      insertC(item) {
        this.showThisCover = ''
        this.cateryId = item.id
        this.titleName = item.categoryName
        this.isgoNext = true
      },
      /**
       * 编辑分类
       */
      editC(item) {
        this.params.categoryName = item.categoryName
        this.params.categoryPicture = item.categoryPicture
        this.showThisCover = ''
        this.modTitle = '编辑分类'
        this.subType = '编辑'
        this.editId = item.id
        this.keepAlive = false
        this.$nextTick(() => {
          this.keepAlive = true
        })
      },
      /**
       * 删除分类
       */
      deltC(item) {
        this.showThisCover = ''
        this.delId = item.id
        this.delContent = `【${item.categoryName}】删除该分类后，分类下的商品也将全部删除，是否要全部删除？`
        this.isDel = true
      },
      modes(e) {
        if (!e) {
          this.calling = false
          this.$nextTick(() => {
            this.calling = true
            this.cateryId = ''
            this.isgoNext = e
          })
        }
      },
    }
  }
</script>

<style scoped lang="less">
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

  .cateroyItem {
    margin-bottom: 15px;
    margin-top: 10px;
    cursor: pointer;
    position: relative;

    .deeps {
      cursor: default;
      text-decoration: none;
      color: #333333;
    }

    .coverView {
      position: absolute;
      z-index: 20001;
      background: rgba(255, 255, 255, 0);
      left: 0;
      top: 0;
      border-radius: 4px;
      display: flex;

      .item {
        width: calc(100% / 3);
        height: 100%;
        text-align: center;
        position: relative;
        background: rgba(0, 0, 0, 0.8);

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

      .itemOn {
        background: rgba(2, 193, 222, 0.56) !important;
        box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2) inset;
      }
    }

    img {
      border-radius: 4px;
      height: 18vh;
    }

    .picname {
      width: 100%;
      line-height: 30px;
      color: #333333;
      font-family: 微软雅黑;
      font-size: 0.94rem;
    }
  }
  .poster {
    position: relative;
    z-index: 1;
    width: 6rem;
  }
  .poster img{
    width: 6rem;
    height: 6rem;
  }

  .imgC {
    width: 6rem;
    height: 6rem;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9) inset;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10000;
    cursor: pointer;
    display: flex;

    .item {
      flex: 1;
      height: 6rem;
      /*text-align: center;*/
      position: relative;

      img {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
</style>
