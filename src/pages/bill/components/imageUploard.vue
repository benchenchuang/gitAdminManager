<template>
  <div class="imageUploard detailsModal">
    <Modal v-model="computedValueUs" :transfer="false" :mask-closable="false" footer-hide title="添加图片">
      <div slot="header">
        <div class="record">
          添加图片
        </div>
      </div>
      <div>
        <Spin v-if="loarding" fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
        <div style="font-size: 0.9rem;color: #666666">图片大小限制5M每张</div>
        <!--初始添加图片按钮-->
        <Row style="margin-top: 20px;margin-bottom: 10px" v-show="params.categoryPictures.length==0">
          <Col span="24">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="5120"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              :action="uploadImgUrl"
              :data="objData"
              style="display: inline-block;width:120px;border: none !important;">
              <Button class="org-add-staff"
                      type="primary"
                      icon="md-images" style="width: 118px" @click="getConfig">选择照片</Button>
            </Upload>
          </Col>
        </Row>

        <Row v-if="params.categoryPictures.length>0" style="margin-top: 20px">
          <Col span="3" v-for="(item,index) in params.categoryPictures" :key="index">
            <Row>
              <Col class="cateroyItem" span="18" offset="2">
                <div style="cursor: pointer">
                  <img style="width: 70%;margin-left: 0%"
                       :src="item.picture">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                  </div>
                </div>
                <div class="picname">{{item.pictureName}}</div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row v-if="params.categoryPictures.length>0">
          <Col span="24" style="margin-top: 40px;">
            <Button class="org-add-staff"
                    type="primary"
                    style="margin-left: 1%" @click="uploardAction">开始上传
            </Button>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="5120"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              :action="uploadImgUrl"
              :data="objData"
              style="display: inline-block;width:120px;border: none !important;">
              <Button class="org-add-staff" style="margin-left: 10%">继续添加
              </Button>
            </Upload>
            <span style="margin-left: 30px;">共{{params.categoryPictures.length}}张图片 (上传过程中请不要删除原始图片)</span>
          </Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {billApi,uploadApi} from "@/api/index"
  export default {
    name: "imageUploard",
    data() {
      return {
        loarding: false,
        configData: {},
        objData: {},
        uploadImgUrl: '',

        params: {
          categoryPictures: [],
          id: ''
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      cateryId: {
        type: String,
        default: false
      }
    },
    computed: {
      computedValueUs: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('modelcal', val)
        }
      }
    },
    methods:{
      async getConfig(){
        this.params.categoryPictures = []
        const configData = await uploadApi.getServerConfig();
        this.configData = configData;
        this.objData = {
          token: configData.token
        };
        this.uploadImgUrl = `${configData.zoneUrl}?token=${configData.token}`
      },
      async handleSuccess (res, file) {
        if(this.params.categoryPictures.length==20){
          this.$Notice.warning({
            title: '一次最多上传20张图片'
          });
          return
        }
        this.loarding = true
        let generalUrl = await uploadApi.generalUrl(this.configData, res)
        this.params.categoryPictures.push({
          picture: generalUrl,
          pictureName: file.name
        })
        this.loarding = false
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: '文件  ' + file.name + ' 大于5M了。'
        });
      },
      handleBeforeUpload () {
        const check = this.params.categoryPictures.length < 21;
        if (!check) {
          this.$Notice.warning({
            title: '一次最多上传20张图片'
          });
        }
        return check;
      },
      handleRemove(index){
        let arr = this.params.categoryPictures
        arr.forEach((item,i)=>{
          if(index == i){
            arr.splice(i,1)
            this.params.categoryPictures = arr
          }
        })
      },
      uploardAction(){
        this.params.id = this.cateryId
        billApi.addPostersGalleryImg(this.params).then(data => {
          if(data.state == 0){
            this.$emit('on-addsuccess', true)
            this.$Message.success('操作成功');
          }else{
            this.$Message.info(data.msg);
          }
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .cateroyItem {
    margin-bottom: 15px;
    margin-top: 10px;
    cursor: pointer;
    position: relative;
    .demo-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 34px;
      left: 0;
      right: 30%;
      background: rgba(0,0,0,.6);
      border-radius: 4px;
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
      height: 16vh;
    }

    .picname {
      width: 100%;
      line-height: 30px;
      color: #333333;
      font-family: 微软雅黑;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .cateroyItem:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    /*margin: 0 2px;*/
    width: 100%;
    float: left;
    text-align: center;
    position: relative;
    top: 50%;
    margin-top: -10px;
  }
  .record{
    font-size: 16px;
    font-weight: 500;
    padding: 5px 0 5px 3px;
  }
</style>
