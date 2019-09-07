<template>
  <div>
    <Card :padding="22" :bordered="false" :dis-hover="true">
      <div>佣金比例</div>
    </Card>
    <Card :padding="22" :bordered="false" :dis-hover="true" style="margin-top: 20px;">
      <Form :model="params" :rules="rules" ref="form">
        <FormItem label="手续费率:" prop="commissionPresent">
          <Input v-model="params.commissionPresent" :maxlength="8" style="width: 100px;">
            <span slot="append">%</span>
          </Input>
        </FormItem>
        <FormItem label="一级比例:" prop="firstPresent">
          <Input v-model="params.firstPresent" :maxlength="8" style="width: 100px;">
            <span slot="append">%</span>
          </Input>
        </FormItem>
        <FormItem label="二级比例:" prop="secondPresent">
          <Input v-model="params.secondPresent" :maxlength="8" style="width: 100px;">
            <span slot="append">%</span>
          </Input>
        </FormItem>
        <FormItem class="text-c">
          <Button type="primary" @click="submit">确定</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import { settingApi } from "@/api/index";
export default {
  data() {
    var doubleValidator = function(rule, value, callback) {
      let errors = [];
      if (value && !/^\d+(\.\d+)?$/.test(value)) {
        errors.push(rule.message || "请输入正确的数值");
      }
      callback(errors);
    };
    var maxValidator = function(rule, value, callback) {
      let errors = [];
      if (value) {
        let valNumber = +value;
        if (isNaN(valNumber)) {
          errors.push(rule.message || "请输入正确的数值");
        } else if (valNumber > rule.max) {
          errors.push(rule.message || `最大值不能超过${rule.max}`);
        }
      }
      callback(errors);
    };
    var minValidator = function(rule, value, callback) {
      let errors = [];
      if (value) {
        let valNumber = +value;
        if (isNaN(valNumber)) {
          errors.push(rule.message || "请输入正确的数值");
        } else if (valNumber < rule.min) {
          errors.push(rule.message || `最小值不能小于${rule.min}`);
        }
      }
      callback(errors);
    };
    return {
      params: {
        firstPresent: 0,
        secondPresent: 0,
        commissionPresent: 0,
        id:""
      },
      rules: {
        firstPresent: [
          { required: true, message: "请填写一级比例" },
          { validator: doubleValidator },
          { validator: maxValidator, max: 100 },
          { validator: minValidator, min: 0 }
        ],
        secondPresent: [
          { required: true, message: "请填写二级比例" },
          { validator: doubleValidator },
          { validator: maxValidator, max: 100 },
          { validator: minValidator, min: 0 }
        ],
        commissionPresent: [
          { required: true, message: "请填写手续费" },
          { validator: doubleValidator },
          { validator: maxValidator, max: 100 },
          { validator: minValidator, min: 0 }
        ]
      }
    };
  },
  created() {
    this.get();
  },
  methods: {
    get() {
      settingApi.queryDistributionCfg().then(res => {
        this.params= Object.assign({}, this.params, res.data)
      });
    },
    submit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          let params = Object.assign({}, this.params)
          settingApi.saveDistributionCfg(params).then(data => {
            this.$Message.success('更新成功')
          });
        }
      });
    }
  }
};
</script>

