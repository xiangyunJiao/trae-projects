<template>
  <div class="config-section">
    <h3 class="section-title">玩法配置</h3>
    <div class="form-item">
      <label>玩法组合</label>
      <select v-model="localCombination">
        <option value="lottery">仅抽奖</option>
        <option value="ranking">仅榜单</option>
        <option value="both">抽奖 + 榜单</option>
      </select>
    </div>
    <div class="form-item" v-if="showLottery">
      <label>抽奖按钮名称</label>
      <input type="text" v-model="localLotteryBtn" placeholder="如：万圣节抽奖" />
    </div>
    <div class="form-item" v-if="showRanking">
      <label>榜单按钮名称</label>
      <input type="text" v-model="localRankingBtn" placeholder="如：榜单" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'GameConfig',
  props: {
    gameCombination: {
      type: String as () => 'lottery' | 'ranking' | 'both',
      required: true,
    },
    lotteryButtonName: { type: String, required: true },
    rankingButtonName: { type: String, required: true },
  },
  data() {
    return {
      localCombination: this.gameCombination,
      localLotteryBtn: this.lotteryButtonName,
      localRankingBtn: this.rankingButtonName,
    };
  },
  computed: {
    showLottery(): boolean {
      return this.localCombination === 'lottery' || this.localCombination === 'both';
    },
    showRanking(): boolean {
      return this.localCombination === 'ranking' || this.localCombination === 'both';
    },
  },
  watch: {
    localCombination(val) {
      this.$emit('update:gameCombination', val);
    },
    localLotteryBtn(val) {
      this.$emit('update:lotteryButtonName', val);
    },
    localRankingBtn(val) {
      this.$emit('update:rankingButtonName', val);
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
  select,
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
  select {
    cursor: pointer;
  }
}
</style>
