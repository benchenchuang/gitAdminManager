<style scoped lang="less">
.record {
  font-size: 18px !important;
  font-weight: 600 !important;
  font-family: 微软雅黑 !important;
}

.picker {
  display: flex;
  justify-content: center;
}

.cateroyItem {
  margin-bottom: 15px;
  margin-top: 10px;
  cursor: pointer;
  position: relative;

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    height: 16vh;
    left: 0;
    right: 10%;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    margin-bottom: 40px;
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
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.fen-mian {
  z-index: 9;
    position: absolute;
    top: 3.6vh;
    height: 40px;
    left: -50%;
    right: 39%;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: #be0b1a;
  font-weight: 600;
  letter-spacing: 8px;
}
.cateroyItem:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  /*margin: 0 2px;*/
  //   width: 100%;
  float: left;
  text-align: center;
  position: relative;
  top: 50%;
  left: 25%;
  margin-top: -10px;
  margin-right: 20px;
}

.quill-editor {
  width: 600px;
  height: 345px;
  padding-bottom: 20px;

  .ql-container {
    min-height: 545px;
  }
}

.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;

  span {
    color: #ee2a7b;
  }
}

.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
}
</style>

<template>
  <div class="details detailsModal">
    <Modal
      v-model="computedValue"
      @on-cancel="goback"
      :transfer="false"
      :mask-closable="false"
      footer-hide
      >
      <div slot="header">
        <div class="record">帮发布</div>
      </div>
      <div class="picker">
        <Form
          ref="formValidate"
          :model="params"
          :rules="ruleValidate"
          :label-width="100"
          style="position: relative;left: -100px;margin-top: 30px;"
        >
          <FormItem label="内容标题" prop="title">
            <Input v-model="params.title" placeholder="请输入标题" style="width: 590px"></Input>
          </FormItem>
          <FormItem label="标签">
            <Select v-model="params.label" clearable @on-change="tagChange" style="width:590px;">
              <Option
                v-for="item in tagtypeList"
                :value="item.interest"
                :key="item.interest"
              >{{ item.interest }}</Option>
            </Select>
          </FormItem>
          <FormItem label="位置" prop="location">
            <Input v-model="params.location" placeholder="请输入位置信息" style="width: 590px"></Input>
          </FormItem>
          <FormItem label="轮播图片">
            <div class="fen-mian" v-if="params.imgUrls.length>0">封面图</div>
            <Row v-if="params.imgUrls.length>0" style="margin-top: -20px;width: 530px">
              <Col span="8" v-for="(item,index) in params.imgUrls" :key="index">
                <Row>
                  <Col class="cateroyItem" span="19">
                    <div style="cursor: pointer">
                      <img style="width: 90%;" :src="item.imgUrl">
                      <div class="demo-upload-list-cover" v-if="item.imgUrl">
                        <Icon type="ios-bookmark-outline" @click.native="setPic(index)" title="设为封面图"/>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(index)" title="删除"></Icon>
                      </div>
                    </div>
                    <!-- <div class="picname">{{item.pictureName}}</div> -->
                  </Col>
                </Row>
              </Col>
            </Row>

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
              style="display: inline-block;border: none !important;"
              v-if="params.imgUrls.length==0"
            >
              <Button
                class="org-add-staff"
                type="primary"
                icon="md-images"
                style="width: 118px;display: inline-block"
                @click="getConfig"
              >选择照片</Button>
              <span
                style="font-size: 0.9rem;color: #999999;display: inline-block;margin-left: 20px;"
              >图片大小限制5M每张，建议每张图片宽高一致</span>
            </Upload>

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
              style="display: inline-block;border: none !important;"
              v-if="params.imgUrls.length>0"
            >
              <Button class="org-add-staff" style="display: inline-block">继续添加</Button>
              <span style="font-size: 0.9rem;color: #999999;display: inline-block;margin-left: 20px;">图片大小限制5M每张，建议每张图片宽高一致</span>
            </Upload>
          </FormItem>

          <FormItem label="专题正文" prop="content">
            <!-- <quill-editor
              v-model="params.content"
              ref="myQuillEditor"
              :options="editorOption"
              @change="onEditorChange($event)"
            ></quill-editor>-->
            <Input v-model="params.content" type="textarea" :autosize="autosize" placeholder="请输入"/>
          </FormItem>

          <FormItem>
            <Button
              style="margin-top: 35px;"
              type="primary"
              :loading="modloading"
              size="large"
              long
              @click="handleSubmit('formValidate')"
            >提交</Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import { circleApi, uploadApi } from "@/api/index";
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline"],
  [{ size: ["small", true, "large", "huge"] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["image"] // remove formatting button
];
export default {
  data() {
    return {
      params: {
        userId: "",
        title: "",
        label: "",
        location: "",
        imgUrls: [],
        content: "",
        cover: ""
      },
      autosize: {
        minRows: 12,
        maxRows: 20
      },
      modloading: false,
      imgUrls: [],
      ruleValidate: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 30, message: "标题名称限制30个字" }
        ],
        content: [
          { required: true, message: "请填入内容", trigger: "blur" },
          { max: 2000, message: "内容限制2000个字" }
        ]
      },
      tagtypeList: [],
      loarding: false,
      configData: {},
      objData: {},
      uploadImgUrl: "",

      uploadRichTextImg: "", //上传图片地址接口
      uploadList: [], //富文本编辑器的图文列表
      editorOption: {
        //富文本编辑器的工具栏
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                // 对图片进行改造，默认是通过base64 ,现通过iview 去传。
                if (value) {
                  document.querySelector("#iviewUp input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        },
        imageResize: {}, //自定义拉伸
        placeholder: "请输入专题正文"
      },
      contentTxt: "" //富文本编辑器里的前面100个文字
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: false
    }
  },
  created() {
    this._label();
    this.getConfigAlf();
  },
  methods: {
    goback() {
      this.computedValue = false;
    },
    /**
     * 标签列表
     */
    _label() {
      circleApi.labelList().then(data => {
        this.tagtypeList = data;
      });
    },
    /**
     * 选择标签
     */
    tagChange(e) {
      this.params.label = e;
    },
    async handleSuccess(res, file) {
      if (this.params.imgUrls.length == 20) {
        this.$Notice.warning({
          title: "一次最多上传20张图片"
        });
        return;
      }
      this.loarding = true;
      let generalUrl = await uploadApi.generalUrl(this.configData, res);
      this.params.imgUrls.push({
        imgUrl: generalUrl,
        pictureName: file.name
      });
      this.imgUrls.push(generalUrl);
      this.loarding = false;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "文件  " + file.name + " 大于5M了。"
      });
    },
    handleBeforeUpload() {
      const check = this.params.imgUrls.length < 21;
      if (!check) {
        this.$Notice.warning({
          title: "一次最多上传20张图片"
        });
      }
      return check;
    },
    async getConfig() {
      this.params.imgUrls = [];
      this.imgUrls = [];
      const configData = await uploadApi.getServerConfig();
      this.configData = configData;
      this.objData = {
        token: configData.token
      };
      this.uploadImgUrl = `${configData.zoneUrl}?token=${configData.token}`;
    },
    async getConfigAlf() {
      const configData = await uploadApi.getServerConfig();
      this.configData = configData;
      this.objData = {
        token: configData.token
      };
      this.uploadImgUrl = `${configData.zoneUrl}?token=${configData.token}`;
    },
    handleRemove(index) {
      let arr = this.params.imgUrls;
      let arr1 = this.imgUrls;
      arr.forEach((item, i) => {
        if (index == i) {
          arr.splice(i, 1);
          this.params.imgUrls = arr;
        }
      });
      arr1.forEach((item, i) => {
        if (index == i) {
          arr1.splice(i, 1);
          this.imgUrls = arr1;
        }
      });
    },
    setPic(index) {
      let arr = this.params.imgUrls;
      let arr1 = this.imgUrls;
      arr.forEach((item, i) => {
        if (index == i) {
          arr.splice(i, 1);
          arr.unshift(item);
          this.params.imgUrls = arr;
          this.params.cover = item;
        }
      });
      arr1.forEach((item, i) => {
        if (index == i) {
          arr1.splice(i, 1);
          arr1.unshift(item);
          this.imgUrls = arr1;
          this.params.cover = item;
        }
      });
    },
    onEditorChange(e) {
      let _this = this;
      _this.params.content = e.html; //标签以<p></p> 形式渲染 （重点）
      _this.contentTxt = e.text.substr(0, 100);
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modloading = true
          let paramsCircle = Object.assign({}, this.params);
          delete paramsCircle.inx;
          delete paramsCircle._index;
          delete paramsCircle._rowKey;
          delete paramsCircle.imgUrls;
          paramsCircle.imgUrls = this.imgUrls;
          if (this.imgUrls.length == 0) {
            this.$Message.error("请至少上传一张照片");
            return;
          }
          if (this.params.cover == "") {
            paramsCircle.cover = paramsCircle.imgUrls[0];
          }
          circleApi.circle(paramsCircle).then(res => {
            if (res.state == 0) {
              this.modloading = false
              this.goback();
              this.$Message.success("发布成功");
            }else{
              this.modloading = false
              this.$Message.error(res.message);
            }
          });
        } else {
          this.modloading = false
          this.$Message.error("请补全信息");
          // this.$nextTick(() => {
          //     this.modloading = true
          //   })
        }
      });
    }
  },
  computed: {
    computedValue: {
      get() {
        this.params.userId = this.userId;
        return this.value;
      },
      set(val) {
        this.$emit("modeed", val);
      }
    }
  }
};
</script>

