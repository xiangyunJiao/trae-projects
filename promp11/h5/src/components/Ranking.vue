<template>
  <div class="ranking-container">
    <div class="ranking-title">
      {{ type === 'receive' ? '收礼榜' : '送礼榜' }}
    </div>
    <div class="ranking-list">
      <div
        v-for="(item, idx) in list"
        :key="item.id"
        class="ranking-item"
        :class="`rank-${idx + 1}`"
      >
        <div class="rank-num">{{ idx + 1 }}</div>
        <img :src="item.avatar" class="avatar" alt="" />
        <div class="user-info">
          <div class="nickname">{{ item.nickname }}</div>
        </div>
        <div class="score">{{ item.score }}分</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RankingItem } from '../types';

export default Vue.extend({
  name: 'Ranking',
  props: {
    type: { type: String as () => 'receive' | 'send', required: true },
    list: { type: Array as () => RankingItem[], required: true },
  },
});
</script>

<style scoped lang="scss">
.ranking-container {
  padding: 20px;
}
.ranking-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20px;
}
.ranking-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.ranking-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
  &.rank-1 .rank-num {
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    color: #fff;
  }
  &.rank-2 .rank-num {
    background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
    color: #fff;
  }
  &.rank-3 .rank-num {
    background: linear-gradient(135deg, #cd7f32, #b87333);
    color: #fff;
  }
  .rank-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f0f0f0;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    margin-right: 15px;
  }
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
  }
  .user-info {
    flex: 1;
    .nickname {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
  }
  .score {
    font-size: 18px;
    color: #ff6b35;
    font-weight: bold;
  }
}
</style>
