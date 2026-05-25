<template>
  <div class="lottery-container">
    <div class="lottery-bg" :style="{ backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : '' }">
      <div class="lottery-grid">
        <div
          v-for="pos in 9"
          :key="pos - 1"
          :class="['lottery-cell', `pos-${pos - 1}`, { selected: currentHighlight === pos - 1 && pos - 1 !== 4 }]"
          :style="cellStyle(pos - 1)"
        >
          <img v-if="pos - 1 !== 4" :src="getPrize(pos - 1).image" class="prize-img" alt="" />
          <div v-if="pos - 1 === 4" class="draw-btn" @click="handleDraw">
            <span>{{ config.buttonText }}</span>
          </div>
          <div v-if="pos - 1 !== 4" class="prize-name">{{ getPrize(pos - 1).name }}</div>
        </div>
      </div>
    </div>
    <div class="draw-count-select">
      <span
        v-for="count in config.drawCounts"
        :key="count"
        class="count-option"
        :class="{ active: selectedCount === count, disabled: isDrawing }"
        @click="!isDrawing && (selectedCount = count)"
      >
        {{ count }}抽
      </span>
    </div>
    <LotteryResultModal
      :visible="showResult"
      :winPrizes="winPrizes"
      @close="showResult = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LotteryConfig, LotteryPrize, WinPrize, DrawResult } from '../types';
import { drawLottery } from '../api';
import LotteryResultModal from './LotteryResultModal.vue';

const ROTATE_ORDER = [0, 1, 2, 3, 8, 5, 6, 7];

export default Vue.extend({
  name: 'Lottery',
  components: { LotteryResultModal },
  props: {
    config: { type: Object as () => LotteryConfig, required: true },
  },
  data() {
    return {
      currentHighlight: -1,
      isDrawing: false,
      selectedCount: 1,
      showResult: false,
      winPrizes: [] as WinPrize[],
      rotateOrder: ROTATE_ORDER,
    };
  },
  computed: {
    prizeMap(): Map<number, LotteryPrize> {
      const map = new Map<number, LotteryPrize>();
      this.config.prizes.forEach(p => map.set(p.index, p));
      return map;
    },
  },
  methods: {
    getPrize(index: number): LotteryPrize {
      return this.prizeMap.get(index) || this.config.prizes[0];
    },
    cellStyle(cell: number): Record<string, string> {
      if (cell === 4) {
        return { background: 'transparent' };
      }
      const bg = this.currentHighlight === cell
        ? this.config.cellSelectedBg
        : this.config.cellDefaultBg;
      return {
        backgroundImage: bg ? `url(${bg})` : '',
        backgroundSize: '100% 100%',
      };
    },
    async handleDraw() {
      if (this.isDrawing) return;
      this.isDrawing = true;
      this.winPrizes = [];

      try {
        const results = await drawLottery(this.selectedCount);
        await this.runAnimation(results);
        this.aggregateResults(results);
        this.showResult = true;
      } catch (e) {
        console.error('抽奖失败', e);
      } finally {
        this.isDrawing = false;
        this.currentHighlight = -1;
      }
    },
    runAnimation(results: DrawResult[]): Promise<void> {
      return new Promise(resolve => {
        const winPrize = results.reduce((best, r) => {
          if (!best) return r;
          return r.prize.probability < best.prize.probability ? r : best;
        }, null as DrawResult | null);
        const finalIndex = winPrize ? winPrize.index : results[0].index;
        const targetStep = this.rotateOrder.indexOf(finalIndex);

        const loops = 3;
        const totalSteps = loops * this.rotateOrder.length + targetStep;
        let step = 0;
        let speed = 60;

        const animate = () => {
          const idx = step % this.rotateOrder.length;
          this.currentHighlight = this.rotateOrder[idx];
          step++;

          if (step >= totalSteps) {
            this.currentHighlight = finalIndex;
            setTimeout(resolve, 400);
            return;
          }

          if (step > totalSteps - 8) {
            speed += 40;
          }
          setTimeout(animate, speed);
        };
        animate();
      });
    },
    aggregateResults(results: DrawResult[]) {
      const map = new Map<number, WinPrize>();
      results.forEach(r => {
        const existing = map.get(r.prize.id);
        if (existing) {
          existing.count++;
        } else {
          map.set(r.prize.id, { prize: r.prize, count: 1 });
        }
      });
      this.winPrizes = Array.from(map.values());
    },
  },
});
</script>

<style scoped lang="scss">
.lottery-container {
  padding: 20px;
}
.lottery-bg {
  width: 100%;
  height: 450px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 30px;
  border-radius: 12px;
}
.lottery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  height: 100%;
}
.lottery-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  &.pos-0 { grid-column: 1; grid-row: 1; }
  &.pos-1 { grid-column: 2; grid-row: 1; }
  &.pos-2 { grid-column: 3; grid-row: 1; }
  &.pos-3 { grid-column: 3; grid-row: 2; }
  &.pos-4 { grid-column: 2; grid-row: 2; }
  &.pos-5 { grid-column: 3; grid-row: 3; }
  &.pos-6 { grid-column: 2; grid-row: 3; }
  &.pos-7 { grid-column: 1; grid-row: 3; }
  &.pos-8 { grid-column: 1; grid-row: 2; }

  &.selected {
    transform: scale(1.08);
    box-shadow: 0 0 20px rgba(255, 200, 0, 0.9);
    z-index: 10;
  }
  .prize-img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
  .prize-name {
    font-size: 12px;
    color: #fff;
    margin-top: 4px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
}
.draw-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-size: 18px;
  font-weight: bold;

  &:active {
    transform: scale(0.95);
  }
}
.draw-count-select {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;

  .count-option {
    padding: 8px 20px;
    border: 2px solid #667eea;
    border-radius: 20px;
    font-size: 14px;
    color: #667eea;
    cursor: pointer;
    transition: all 0.3s;

    &.active {
      background: #667eea;
      color: #fff;
    }
    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
</style>
