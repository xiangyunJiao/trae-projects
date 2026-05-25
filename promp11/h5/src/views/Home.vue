<template>
  <div class="home">
    <HeaderImage
      :headerImage="config.headerImage"
      :headerTitle="config.headerTitle"
      :ruleContent="config.ruleContent"
      :rewardLink="config.rewardLink"
    />
    <GiftArea
      :bgImage="config.giftAreaBg"
      :gifts="config.gifts"
    />
    <GameButtons
      :gameCombination="config.gameCombination"
      :lotteryButtonName="config.lotteryButtonName"
      :rankingButtonName="config.rankingButtonName"
      :currentTab="currentTab"
      @switch="handleSwitch"
    />
    <Lottery
      v-if="currentTab === 'lottery' && showLottery"
      :config="config.lotteryConfig"
    />
    <Ranking
      v-if="currentTab === 'ranking' && showRanking"
      :type="config.rankingConfig.type"
      :list="config.rankingConfig.list"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderImage from '../components/HeaderImage.vue';
import GiftArea from '../components/GiftArea.vue';
import GameButtons from '../components/GameButtons.vue';
import Lottery from '../components/Lottery.vue';
import Ranking from '../components/Ranking.vue';
import { getActivityConfig } from '../api';
import { ActivityConfig } from '../types';

export default Vue.extend({
  name: 'Home',
  components: { HeaderImage, GiftArea, GameButtons, Lottery, Ranking },
  data() {
    return {
      config: null as ActivityConfig | null,
      currentTab: 'lottery',
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
      if (!this.showLottery && this.showRanking) {
        this.currentTab = 'ranking';
      }
    } catch (e) {
      console.error('获取配置失败', e);
    }
  },
  methods: {
    handleSwitch(tab: string) {
      this.currentTab = tab;
    },
  },
});
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a0a2e 0%, #16213e 100%);
}
</style>
