<template>
  <div class="config-section">
    <h3 class="section-title">头图配置</h3>
    <div class="form-item">
      <label>头图图片 (750*1000px)</label>
      <input type="text" v-model="localConfig.headerImage" placeholder="请输入图片URL" />
    </div>
    <div class="form-item">
      <label>头图标题</label>
      <input type="text" v-model="localConfig.headerTitle" placeholder="请输入标题" />
    </div>
    <div class="form-item">
      <label>规则文案</label>
      <textarea
        v-model="localConfig.ruleContent"
        placeholder="请输入规则文案，每行一条规则"
        rows="5"
      ></textarea>
    </div>
    <div class="form-item">
      <label>奖励跳转地址</label>
      <input type="text" v-model="localConfig.rewardLink" placeholder="请输入奖励页面URL" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ActivityConfig } from '../types';

export default Vue.extend({
  name: 'HeaderConfig',
  props: {
    config: { type: Object as () => ActivityConfig, required: true },
  },
  data() {
    return {
      localConfig: { ...this.config },
    };
  },
  watch: {
    config: {
      handler(val) {
        this.localConfig = { ...val };
      },
      deep: true,
    },
    localConfig: {
      handler(val) {
        this.$emit('update', val);
      },
      deep: true,
    },
  },
});
</script>

<style scoped lang="scss">
.config-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
.section-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}
.form-item {
  margin-bottom: 16px;
  label {
    display: block;
    font-size: 14px;
    color: #555;
    margin-bottom: 6px;
  }
  input,
  textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }
  textarea {
    resize: vertical;
    font-family: inherit;
  }
}
</style>
