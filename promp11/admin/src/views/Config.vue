<template>
  <div class="config-page">
    <div class="page-header">
      <h2>运营活动配置</h2>
      <button class="btn-save" @click="handleSave" :disabled="saving">
        {{ saving ? '保存中...' : '保存配置' }}
      </button>
    </div>
    <div class="config-content">
      <HeaderConfig
        :config="config"
        @update="onHeaderUpdate"
      />
      <GiftConfig
        :giftAreaBg.sync="config.giftAreaBg"
        :gifts.sync="config.gifts"
      />
      <GameConfig
        :gameCombination.sync="config.gameCombination"
        :lotteryButtonName.sync="config.lotteryButtonName"
        :rankingButtonName.sync="config.rankingButtonName"
      />
      <LotteryConfig
        v-if="showLottery"
        :config="config.lotteryConfig"
        @update="onLotteryUpdate"
      />
      <RankingConfig
        v-if="showRanking"
        :type="config.rankingConfig.type"
        @update="onRankingUpdate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderConfig from '../components/HeaderConfig.vue';
import GiftConfig from '../components/GiftConfig.vue';
import GameConfig from '../components/GameConfig.vue';
import LotteryConfig from '../components/LotteryConfig.vue';
import RankingConfig from '../components/RankingConfig.vue';
import { getActivityConfig, saveActivityConfig } from '../api';
import { ActivityConfig } from '../types';

export default Vue.extend({
  name: 'ConfigPage',
  components: {
    HeaderConfig,
    GiftConfig,
    GameConfig,
    LotteryConfig,
    RankingConfig,
  },
  data() {
    return {
      config: null as ActivityConfig | null,
      saving: false,
    };
  },
  computed: {
    showLottery(): boolean {
      if (!this.config) return false;
      return this.config.gameCombination === 'lottery' || this.config.gameCombination === 'both';
    },
    showRanking(): boolean {
      if (!this.config) return false;
      return this.config.gameCombination === 'ranking' || this.config.gameCombination === 'both';
    },
  },
  async mounted() {
    try {
      this.config = await getActivityConfig();
    } catch (e) {
      console.error('获取配置失败', e);
    }
  },
  methods: {
    onHeaderUpdate(val: Partial<ActivityConfig>) {
      if (this.config) {
        Object.assign(this.config, val);
      }
    },
    onLotteryUpdate(val: ActivityConfig['lotteryConfig']) {
      if (this.config) {
        this.config.lotteryConfig = val;
      }
    },
    onRankingUpdate(val: 'receive' | 'send') {
      if (this.config) {
        this.config.rankingConfig.type = val;
      }
    },
    async handleSave() {
      if (!this.config) return;
      this.saving = true;
      try {
        const success = await saveActivityConfig(this.config);
        if (success) {
          alert('保存成功！');
        } else {
          alert('保存失败，请重试');
        }
      } catch (e) {
        console.error('保存失败', e);
        alert('保存失败，请重试');
      } finally {
        this.saving = false;
      }
    },
  },
});
</script>

<style scoped lang="scss">
.config-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  h2 {
    font-size: 22px;
    color: #333;
    margin: 0;
  }
}
.btn-save {
  padding: 10px 30px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #5568d3;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
.config-content {
  padding: 20px 30px;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
