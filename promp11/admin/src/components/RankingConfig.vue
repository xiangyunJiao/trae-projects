<template>
  <div class="config-section">
    <h3 class="section-title">榜单配置</h3>
    <div class="form-item">
      <label>榜单类型</label>
      <select v-model="localType">
        <option value="receive">收礼榜</option>
        <option value="send">送礼榜</option>
      </select>
    </div>
    <div class="form-item">
      <label>说明</label>
      <p class="tip">
        {{ localType === 'receive'
          ? '收礼榜：只有参与活动的收礼用户才能上榜'
          : '送礼榜：只有参与活动的送礼用户才能上榜'
        }}
      </p>
      <p class="tip">榜单数据将根据运营配置从后端接口获取</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RankingConfig',
  props: {
    type: { type: String as () => 'receive' | 'send', required: true },
  },
  data() {
    return {
      localType: this.type,
    };
  },
  watch: {
    type(val) {
      this.localType = val;
    },
    localType(val) {
      this.$emit('update', val);
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
  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }
}
.tip {
  font-size: 13px;
  color: #888;
  margin-top: 8px;
  line-height: 1.6;
}
</style>
