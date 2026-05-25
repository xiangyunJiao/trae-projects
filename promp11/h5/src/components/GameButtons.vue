<template>
  <div class="game-buttons">
    <div
      v-if="showLottery"
      class="game-btn lottery-btn"
      :class="{ active: currentTab === 'lottery' }"
      @click="$emit('switch', 'lottery')"
    >
      {{ lotteryButtonName }}
    </div>
    <div
      v-if="showRanking"
      class="game-btn ranking-btn"
      :class="{ active: currentTab === 'ranking' }"
      @click="$emit('switch', 'ranking')"
    >
      {{ rankingButtonName }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'GameButtons',
  props: {
    gameCombination: {
      type: String as () => 'lottery' | 'ranking' | 'both',
      required: true,
    },
    lotteryButtonName: { type: String, required: true },
    rankingButtonName: { type: String, required: true },
    currentTab: { type: String, default: 'lottery' },
  },
  computed: {
    showLottery(): boolean {
      return this.gameCombination === 'lottery' || this.gameCombination === 'both';
    },
    showRanking(): boolean {
      return this.gameCombination === 'ranking' || this.gameCombination === 'both';
    },
  },
});
</script>

<style scoped lang="scss">
.game-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px 0;

  .game-btn {
    padding: 12px 40px;
    border-radius: 30px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;

    &.lottery-btn {
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      color: #fff;
      border-color: #ff6b35;
    }
    &.ranking-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      border-color: #667eea;
    }
    &.active {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
