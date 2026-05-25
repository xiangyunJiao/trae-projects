<template>
  <div class="header-image">
    <img :src="headerImage" class="header-bg" alt="" />
    <div class="header-title">{{ headerTitle }}</div>
    <div class="header-buttons">
      <div class="btn-rule" @click="showRule = true">规则</div>
      <div class="btn-reward" @click="goReward">奖励</div>
    </div>
    <RuleModal :visible="showRule" :content="ruleContent" @close="showRule = false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RuleModal from './RuleModal.vue';

export default Vue.extend({
  name: 'HeaderImage',
  components: { RuleModal },
  props: {
    headerImage: { type: String, required: true },
    headerTitle: { type: String, required: true },
    ruleContent: { type: String, required: true },
    rewardLink: { type: String, required: true },
  },
  data() {
    return { showRule: false };
  },
  methods: {
    goReward() {
      window.location.href = this.rewardLink;
    },
  },
});
</script>

<style scoped lang="scss">
.header-image {
  position: relative;
  width: 100%;
  height: 500px;

  .header-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .header-title {
    position: absolute;
    top: 180px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  .header-buttons {
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    gap: 12px;
    .btn-rule,
    .btn-reward {
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
