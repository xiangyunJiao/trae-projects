<template>
  <div class="config-section">
    <h3 class="section-title">九宫格抽奖配置</h3>
    <div class="form-item">
      <label>背景图 (750*900px)</label>
      <input type="text" v-model="localConfig.backgroundImage" placeholder="背景图URL" />
    </div>
    <div class="form-item">
      <label>格子默认背景图</label>
      <input type="text" v-model="localConfig.cellDefaultBg" placeholder="默认背景图URL" />
    </div>
    <div class="form-item">
      <label>格子选中背景图</label>
      <input type="text" v-model="localConfig.cellSelectedBg" placeholder="选中背景图URL" />
    </div>
    <div class="form-item">
      <label>抽奖按钮文案</label>
      <input type="text" v-model="localConfig.buttonText" placeholder="如：开始抽奖" />
    </div>
    <div class="form-item">
      <label>可选抽奖次数（逗号分隔）</label>
      <input
        type="text"
        :value="localConfig.drawCounts.join(',')"
        @input="onDrawCountsChange"
        placeholder="如：1,10,50"
      />
    </div>
    <div class="prizes-section">
      <h4>奖品配置（九宫格位置 0-8，位置4为抽奖按钮）</h4>
      <div class="prize-grid">
        <div
          v-for="prize in localConfig.prizes"
          :key="prize.index"
          class="prize-item"
        >
          <div class="prize-index">位置 {{ prize.index }}</div>
          <div class="prize-field">
            <label>图片</label>
            <input type="text" v-model="prize.image" placeholder="图片URL" />
          </div>
          <div class="prize-field">
            <label>名称</label>
            <input type="text" v-model="prize.name" placeholder="奖品名称" />
          </div>
          <div class="prize-field">
            <label>数量</label>
            <input type="number" v-model.number="prize.quantity" placeholder="数量" />
          </div>
          <div class="prize-field">
            <label>中奖概率(%)</label>
            <input type="number" v-model.number="prize.probability" placeholder="概率" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LotteryConfig } from '../types';

const EMPTY_PRIZES = [0, 1, 2, 3, 5, 6, 7, 8].map(idx => ({
  id: idx + 1,
  index: idx,
  image: '',
  name: '',
  quantity: 0,
  probability: 0,
}));

export default Vue.extend({
  name: 'LotteryConfig',
  props: {
    config: { type: Object as () => LotteryConfig, required: true },
  },
  data() {
    return {
      localConfig: this.mergeConfig(this.config),
    };
  },
  watch: {
    config: {
      handler(val) {
        this.localConfig = this.mergeConfig(val);
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
  methods: {
    mergeConfig(config: LotteryConfig): LotteryConfig {
      const prizes = config.prizes && config.prizes.length > 0
        ? config.prizes
        : EMPTY_PRIZES;
      return {
        ...config,
        prizes: JSON.parse(JSON.stringify(prizes)),
      };
    },
    onDrawCountsChange(e: Event) {
      const val = (e.target as HTMLInputElement).value;
      const counts = val
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n) && n > 0);
      this.localConfig.drawCounts = counts;
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
  input {
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
}
.prizes-section {
  margin-top: 20px;
  h4 {
    font-size: 15px;
    color: #333;
    margin-bottom: 15px;
  }
}
.prize-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.prize-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
}
.prize-index {
  font-size: 13px;
  color: #667eea;
  font-weight: bold;
  margin-bottom: 10px;
}
.prize-field {
  margin-bottom: 8px;
  label {
    display: block;
    font-size: 12px;
    color: #888;
    margin-bottom: 4px;
  }
  input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 13px;
    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }
}
</style>
