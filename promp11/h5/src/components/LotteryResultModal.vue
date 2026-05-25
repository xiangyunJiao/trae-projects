<template>
  <div v-if="visible" class="result-modal-mask" @click.self="$emit('close')">
    <div class="result-modal">
      <div class="result-title">恭喜获得</div>
      <div class="prize-list">
        <div
          v-for="item in winPrizes"
          :key="item.prize.id"
          class="prize-item"
        >
          <img :src="item.prize.image" class="prize-img" alt="" />
          <div class="prize-info">
            <div class="prize-name">{{ item.prize.name }}</div>
            <div class="prize-count" v-if="item.count > 1">×{{ item.count }}</div>
          </div>
        </div>
      </div>
      <div class="result-btn" @click="$emit('close')">确定</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { WinPrize } from '../types';

export default Vue.extend({
  name: 'LotteryResultModal',
  props: {
    visible: { type: Boolean, default: false },
    winPrizes: { type: Array as () => WinPrize[], default: () => [] },
  },
});
</script>

<style scoped lang="scss">
.result-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.result-modal {
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  background: linear-gradient(180deg, #fff8e1 0%, #fff 100%);
  border-radius: 16px;
  padding: 30px;
  overflow-y: auto;
}
.result-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #ff6b35;
  margin-bottom: 20px;
}
.prize-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}
.prize-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  padding: 12px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 10px;

  .prize-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
  .prize-info {
    text-align: center;
    margin-top: 6px;
  }
  .prize-name {
    font-size: 13px;
    color: #333;
    font-weight: 500;
  }
  .prize-count {
    font-size: 16px;
    color: #ff6b35;
    font-weight: bold;
    margin-top: 4px;
  }
}
.result-btn {
  width: 200px;
  margin: 0 auto;
  padding: 12px 0;
  text-align: center;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: #fff;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}
</style>
