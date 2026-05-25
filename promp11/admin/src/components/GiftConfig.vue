<template>
  <div class="config-section">
    <h3 class="section-title">活动礼物配置</h3>
    <div class="form-item">
      <label>礼物区域背景图 (750*500px)</label>
      <input type="text" v-model="giftAreaBg" placeholder="请输入背景图URL" />
    </div>
    <div class="gift-list">
      <div class="gift-item" v-for="(gift, idx) in localGifts" :key="gift.id">
        <div class="gift-row">
          <label>礼物图片</label>
          <input type="text" v-model="gift.image" placeholder="图片URL" @blur="emitUpdate" />
        </div>
        <div class="gift-row">
          <label>礼物名称</label>
          <input type="text" v-model="gift.name" placeholder="名称" @blur="emitUpdate" />
        </div>
        <div class="gift-row">
          <label>对应积分</label>
          <input type="number" v-model.number="gift.score" placeholder="积分" @blur="emitUpdate" />
        </div>
        <div class="gift-row actions">
          <button class="btn-del" @click="removeGift(idx)">删除</button>
        </div>
      </div>
    </div>
    <button class="btn-add" @click="addGift">+ 添加礼物</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { GiftItem } from '../types';

export default Vue.extend({
  name: 'GiftConfig',
  props: {
    giftAreaBg: { type: String, required: true },
    gifts: { type: Array as () => GiftItem[], required: true },
  },
  data() {
    return {
      localGifts: [] as GiftItem[],
      isInternalUpdate: false,
    };
  },
  watch: {
    gifts: {
      handler(val: GiftItem[]) {
        if (this.isInternalUpdate) {
          this.isInternalUpdate = false;
          return;
        }
        this.localGifts = JSON.parse(JSON.stringify(val));
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    addGift() {
      const newId = this.localGifts.length > 0
        ? Math.max(...this.localGifts.map(g => g.id)) + 1
        : 1;
      this.localGifts.push({
        id: newId,
        image: '',
        name: '',
        score: 0,
      });
      this.emitUpdate();
    },
    removeGift(idx: number) {
      this.localGifts.splice(idx, 1);
      this.emitUpdate();
    },
    emitUpdate() {
      this.isInternalUpdate = true;
      this.$emit('update:gifts', this.localGifts.map(g => ({ ...g })));
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
.gift-list {
  margin-bottom: 15px;
}
.gift-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
}
.gift-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  label {
    width: 80px;
    font-size: 14px;
    color: #555;
    flex-shrink: 0;
  }
  input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }
  &.actions {
    justify-content: flex-end;
    label {
      display: none;
    }
  }
}
.btn-del {
  padding: 6px 16px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  &:hover {
    background: #ff7875;
  }
}
.btn-add {
  width: 100%;
  padding: 12px;
  background: #f0f0f0;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #e6e6e6;
  }
}
</style>
