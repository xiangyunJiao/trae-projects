<template>
  <div class="gift-area" :style="{ backgroundImage: bgImage ? `url(${bgImage})` : '' }">
    <div class="gift-scroll-wrapper" ref="wrapper">
      <div class="gift-scroll-track" ref="track">
        <div
          class="gift-item"
          v-for="gift in gifts"
          :key="'a-' + gift.id"
        >
          <img :src="gift.image" class="gift-img" alt="" />
          <div class="gift-name">{{ gift.name }}</div>
          <div class="gift-score">{{ gift.score }}积分</div>
        </div>
        <div
          class="gift-item"
          v-for="gift in gifts"
          :key="'b-' + gift.id"
        >
          <img :src="gift.image" class="gift-img" alt="" />
          <div class="gift-name">{{ gift.name }}</div>
          <div class="gift-score">{{ gift.score }}积分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { GiftItem } from '../types';

export default Vue.extend({
  name: 'GiftArea',
  props: {
    bgImage: { type: String, required: true },
    gifts: { type: Array as () => GiftItem[], required: true },
  },
  data() {
    return {
      offset: 0,
      rafId: 0,
      singleWidth: 0,
      running: false,
    };
  },
  mounted() {
    this.$nextTick(() => this.init());
  },
  beforeDestroy() {
    this.stop();
  },
  watch: {
    gifts() {
      this.$nextTick(() => {
        this.stop();
        this.init();
      });
    },
  },
  methods: {
    init() {
      const wrapper = this.$refs.wrapper as HTMLElement;
      const track = this.$refs.track as HTMLElement;
      if (!wrapper || !track) return;

      this.singleWidth = track.offsetWidth / 2;
      const wrapperWidth = wrapper.offsetWidth;

      if (this.singleWidth > wrapperWidth && this.gifts.length > 0) {
        this.running = true;
        this.start();
      }
    },
    start() {
      const loop = () => {
        if (!this.running) return;
        this.offset += 0.5;
        if (this.offset >= this.singleWidth) {
          this.offset = 0;
        }
        const track = this.$refs.track as HTMLElement;
        if (track) {
          track.style.transform = `translateX(-${this.offset}px)`;
        }
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    },
    stop() {
      this.running = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
    },
  },
});
</script>

<style scoped lang="scss">
.gift-area {
  width: 100%;
  min-height: 180px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px 0;
  overflow: hidden;

  .gift-scroll-wrapper {
    width: 100%;
    overflow: hidden;
    padding: 10px 0;
  }
  .gift-scroll-track {
    display: inline-flex;
    gap: 12px;
    padding: 0 20px;
    will-change: transform;
    white-space: nowrap;
  }
  .gift-item {
    flex-shrink: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 85px;
    text-align: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 10px 5px;

    .gift-img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }
    .gift-name {
      font-size: 12px;
      color: #fff;
      margin-top: 4px;
      max-width: 75px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .gift-score {
      font-size: 11px;
      color: #ffcc00;
      margin-top: 2px;
    }
  }
}
</style>
