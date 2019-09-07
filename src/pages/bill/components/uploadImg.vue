<template>
  <Upload
    ref="upload"
    :show-upload-list="false"
    :data="qiNiuData"
    :max-size="5120"
    :on-error="onError"
    :on-exceeded-size="onExceeded"
    :on-success="handleSuccess"
    :action="uploadUrl"
    accept=".png,.jpg,.jpeg,.gif"
    style="display: inline-block;width:90px;"
  >
    <Button type="primary">上传图片
    </Button>
  </Upload>
</template>

<script>
  import {uploadApi} from "@/api/index"
  export default {
    name: "uploadImg",
    mounted() {
      this.getQiNiuToken();
    },
    data() {
      return {
        qiNiuData: {},
        uploadUrl: "",
        configData: {}
      }
    },
    methods: {
      //获取七牛Token
      async getQiNiuToken() {
        const configData = await uploadApi.getServerConfig();
        console.log(configData)
        this.configData = configData;
        this.qiNiuData = {
          token: configData.token
        };
        this.uploadUrl = `${configData.zoneUrl}?token=${configData.token}`;
      },
      onExceeded(e) {
        this.$Message.error("请上传小于2MB图片！");
      },
      onError() {
        this.$Message.error("图片上传失败,请重新上传！");
      },
      handleSuccess(res, file) {
        this.$Message.success("上传成功！");
        let generalUrl = uploadApi.generalUrl(this.configData, res);
        this.$emit('setimageurl', generalUrl)
        setTimeout(() => {
          this.$Message.destroy();
        }, 1000);
      },
    },
  }
</script>

<style scoped>
  .poster img {
    width: 80px;
  }
</style>
