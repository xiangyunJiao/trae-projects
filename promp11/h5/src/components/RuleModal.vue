<template>
  <div v-if="visible" class="rule-modal-mask" @click.self="$emit('close')">
    <div class="rule-modal">
      <div class="rule-title">活动规则</div>
      <div class="rule-content">
        <p v-for="(line, idx) in lines" :key="idx">{{ line }}</p>
      </div>
      <div class="rule-close" @click="$emit('close')">×</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RuleModal',
  props: {
    visible: { type: Boolean, default: false },
    content: { type: String, default: '' },
  },
  computed: {
    lines(): string[] {
      return this.content.split('\n').filter(l => l.trim());
    },
  },
});
</script>

<style scoped lang="scss">
.rule-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.rule-modal {
  position: relative;
  width: 600px;
  max-width: 90%;
  max-height: 70%;
  background: #fff;
  border-radius: 12px;
  padding: 40px 30px 30px;
  overflow-y: auto;
}
.rule-title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
.rule-content {
  p {
    line-height: 1.8;
    color: #555;
    font-size: 15px;
    margin-bottom: 8px;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
.rule-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}
</style>
