<template>
  <div class="qibla-container">
    <div class="header">
      <h1>斋月礼拜指南针</h1>
      <p class="subtitle">Qibla Compass</p>
    </div>

    <div class="compass-wrapper">
      <svg
        class="compass"
        :width="compassSize"
        :height="compassSize"
        viewBox="0 0 300 300"
      >
        <defs>
          <linearGradient id="fanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d4af37" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#d4af37" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e74c3c" />
            <stop offset="100%" stop-color="#c0392b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke="#2c3e50"
          stroke-width="2"
        />

        <path
          :d="fanPath"
          fill="url(#fanGradient)"
          stroke="#d4af37"
          stroke-width="1"
        />

        <circle
          cx="150"
          cy="150"
          r="100"
          fill="none"
          stroke="#34495e"
          stroke-width="1"
          stroke-dasharray="5,5"
        />

        <g class="direction-labels">
          <text x="150" y="45" text-anchor="middle" fill="#d4af37" font-size="16" font-weight="bold">北</text>
          <text x="150" y="270" text-anchor="middle" fill="#d4af37" font-size="16" font-weight="bold">南</text>
          <text x="35" y="155" text-anchor="middle" fill="#d4af37" font-size="16" font-weight="bold">西</text>
          <text x="265" y="155" text-anchor="middle" fill="#d4af37" font-size="16" font-weight="bold">东</text>

          <text x="150" y="62" text-anchor="middle" fill="#7f8c8d" font-size="10">N</text>
          <text x="150" y="255" text-anchor="middle" fill="#7f8c8d" font-size="10">S</text>
          <text x="50" y="153" text-anchor="middle" fill="#7f8c8d" font-size="10">W</text>
          <text x="250" y="153" text-anchor="middle" fill="#7f8c8d" font-size="10">E</text>
        </g>

        <g
          :transform="`rotate(${needleRotation}, 150, 150)`"
          style="transition: transform 0.1s ease-out"
        >
          <line
            x1="150"
            y1="150"
            x2="150"
            y2="55"
            stroke="url(#needleGradient)"
            stroke-width="6"
            stroke-linecap="round"
            filter="url(#glow)"
          />
          <polygon
            points="150,45 142,65 158,65"
            fill="#e74c3c"
            filter="url(#glow)"
          />
        </g>

        <circle
          cx="150"
          cy="150"
          r="12"
          fill="#d4af37"
          stroke="#1a1a2e"
          stroke-width="2"
        />
      </svg>

      <div class="qibla-info" v-if="qiblaDirection !== null">
        <div class="info-row">
          <span class="label">朝向角度</span>
          <span class="value">{{ qiblaDirection.toFixed(1) }}°</span>
        </div>
        <div class="info-row">
          <span class="label">当前指向</span>
          <span class="value">{{ currentHeading.toFixed(1) }}°</span>
        </div>
        <div class="info-row" v-if="isAligned">
          <span class="aligned-text">✓ 方向正确，可以礼拜</span>
        </div>
      </div>
    </div>

    <div class="controls">
      <button class="btn btn-primary" @click="startCompass" v-if="!isTracking">
        <span class="btn-icon">🧭</span>
        开始礼拜方向
      </button>
      <button class="btn btn-secondary" @click="stopCompass" v-else>
        <span class="btn-icon">⏹</span>
        停止
      </button>

      <button class="btn btn-ghost" @click="showDestinationModal = true">
        <span class="btn-icon">📍</span>
        {{ destination.name }}
      </button>
    </div>

    <div class="status-bar">
      <div class="status-item" :class="{ active: locationGranted }">
        <span class="status-icon">📍</span>
        <span>位置</span>
      </div>
      <div class="status-item" :class="{ active: orientationGranted }">
        <span class="status-icon">📱</span>
        <span>方向</span>
      </div>
    </div>

    <div class="location-info" v-if="userLocation">
      <span>当前位置: {{ userLocation.lat.toFixed(4) }}, {{ userLocation.lng.toFixed(4) }}</span>
    </div>

    <div class="modal-overlay" v-if="showDestinationModal" @click="showDestinationModal = false">
      <div class="modal" @click.stop>
        <h2>选择礼拜目的地</h2>
        <div class="destination-list">
          <button
            v-for="dest in destinations"
            :key="dest.id"
            class="destination-item"
            :class="{ selected: destination.id === dest.id }"
            @click="selectDestination(dest)"
          >
            <span class="dest-name">{{ dest.name }}</span>
            <span class="dest-coord">{{ dest.lat.toFixed(2) }}°, {{ dest.lng.toFixed(2) }}°</span>
          </button>
        </div>
        <div class="custom-coord">
          <h3>自定义坐标</h3>
          <div class="coord-inputs">
            <input
              type="number"
              v-model="customLat"
              placeholder="纬度 (-90 ~ 90)"
              step="0.0001"
              min="-90"
              max="90"
            />
            <input
              type="number"
              v-model="customLng"
              placeholder="经度 (-180 ~ 180)"
              step="0.0001"
              min="-180"
              max="180"
            />
          </div>
          <button class="btn btn-small" @click="setCustomDestination">
            使用自定义坐标
          </button>
        </div>
        <button class="btn btn-close" @click="showDestinationModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const compassSize = ref(280)
const isTracking = ref(false)
const locationGranted = ref(false)
const orientationGranted = ref(false)
const showDestinationModal = ref(false)

const userLocation = ref(null)
const currentHeading = ref(0)
const qiblaDirection = ref(null)

const destinations = [
  { id: 'mecca', name: '麦加 (Mecca)', lat: 21.4225, lng: 39.8262 },
  { id: 'medina', name: '麦地那 (Medina)', lat: 24.4672, lng: 39.6111 },
  { id: 'jerusalem', name: '耶路撒冷 (Jerusalem)', lat: 31.7767, lng: 35.2345 }
]

const destination = ref({ ...destinations[0] })
const customLat = ref('')
const customLng = ref('')

let orientationHandler = null
let watchId = null

const fanPath = computed(() => {
  const cx = 150, cy = 150
  const r = 130
  const halfAngle = 30
  const startAngle = 270 - halfAngle
  const endAngle = 270 + halfAngle

  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180

  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`
})

const needleRotation = computed(() => {
  if (qiblaDirection.value === null) return 0

  let rotation = qiblaDirection.value - currentHeading.value

  while (rotation > 180) rotation -= 360
  while (rotation < -180) rotation += 360

  return rotation
})

const isAligned = computed(() => {
  if (qiblaDirection.value === null) return false
  const diff = Math.abs(needleRotation.value)
  return diff < 5
})

function selectDestination(dest) {
  destination.value = { ...dest }
  customLat.value = ''
  customLng.value = ''
}

function setCustomDestination() {
  const lat = parseFloat(customLat.value)
  const lng = parseFloat(customLng.value)

  if (isNaN(lat) || isNaN(lng)) {
    alert('请输入有效的坐标')
    return
  }

  if (lat < -90 || lat > 90) {
    alert('纬度必须在 -90 到 90 之间')
    return
  }

  if (lng < -180 || lng > 180) {
    alert('经度必须在 -180 到 180 之间')
    return
  }

  destination.value = { id: 'custom', name: `自定义 (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`, lat, lng }
}

function calculateQibla(lat1, lng1, lat2, lng2) {
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaLng = ((lng2 - lng1) * Math.PI) / 180

  const y = Math.sin(deltaLng)
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLng)

  let bearing = (Math.atan2(y, x) * 180) / Math.PI
  bearing = (bearing + 360) % 360

  return bearing
}

function handleOrientation(event) {
  let heading = 0

  if (event.webkitCompassHeading) {
    heading = event.webkitCompassHeading
  } else if (event.alpha !== null) {
    heading = 360 - event.alpha
  }

  currentHeading.value = heading
}

async function startCompass() {
  try {
    const isHttps = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'

    if (!isHttps) {
      alert('定位功能需要HTTPS环境访问\\n\\n请在电脑终端执行以下命令创建HTTPS隧道：\\n\\n  npm run tunnel\\n\\n或直接执行：\\n  npx cloudflared tunnel --url http://localhost:5177\\n\\n然后使用生成的HTTPS地址在手机访问\\n\\n当前协议: ' + location.protocol)
    }

    if (!('geolocation' in navigator)) {
      alert('您的设备不支持地理定位')
      return
    }

    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = DeviceOrientationEvent.requestPermission()
      if (permission instanceof Promise) {
        const result = await permission
        if (result !== 'granted') {
          alert('需要方向传感器权限才能使用指南针\\n\\n请在浏览器设置中允许访问运动传感器')
          return
        }
      }
      orientationGranted.value = true
      window.addEventListener('deviceorientation', handleOrientation, true)
    } else if ('DeviceOrientationEvent' in window) {
      orientationGranted.value = true
      window.addEventListener('deviceorientation', handleOrientation, true)
    } else {
      alert('您的设备不支持方向传感器\\n\\n无法使用指南针功能')
      return
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, (error) => {
        let errorMsg = '无法获取位置'
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '用户拒绝了定位请求\\n\\n请在浏览器设置中允许位置权限'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = '位置信息不可用\\n\\n请检查设备GPS是否开启'
            break
          case error.TIMEOUT:
            errorMsg = '获取位置超时\\n\\n请检查网络连接后重试'
            break
        }
        reject(new Error(errorMsg))
      }, {
        enableHighAccuracy: true,
        timeout: 10000
      })
    })

    userLocation.value = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    locationGranted.value = true

    qiblaDirection.value = calculateQibla(
      userLocation.value.lat,
      userLocation.value.lng,
      destination.value.lat,
      destination.value.lng
    )

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        userLocation.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
        qiblaDirection.value = calculateQibla(
          userLocation.value.lat,
          userLocation.value.lng,
          destination.value.lat,
          destination.value.lng
        )
      },
      (error) => {
        console.warn('位置更新失败:', error)
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    )

    isTracking.value = true
  } catch (error) {
    console.error('启动失败:', error)
    alert('启动失败:\\n' + error.message)
  }
}

function stopCompass() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
  window.removeEventListener('deviceorientation', handleOrientation, true)
  isTracking.value = false
  locationGranted.value = false
  orientationGranted.value = false
  qiblaDirection.value = null
  userLocation.value = null
  currentHeading.value = 0
}

function resizeHandler() {
  const minSize = Math.min(window.innerWidth, window.innerHeight)
  compassSize.value = Math.max(240, Math.min(320, minSize - 80))
}

onMounted(() => {
  resizeHandler()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  stopCompass()
  window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.qibla-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-top: calc(env(safe-area-inset-top, 20px) + 20px);
  padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 20px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #d4af37, #f4e5a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 4px;
}

.compass-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.compass {
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
}

.qibla-info {
  background: rgba(44, 62, 80, 0.6);
  border: 1px solid #34495e;
  border-radius: 12px;
  padding: 15px 20px;
  min-width: 200px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.label {
  color: #95a5a6;
  font-size: 14px;
}

.value {
  color: #d4af37;
  font-size: 18px;
  font-weight: 600;
}

.aligned-text {
  color: #2ecc71;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  width: 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f4e5a1);
  color: #1a1a2e;
}

.btn-secondary {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.btn-ghost {
  background: rgba(44, 62, 80, 0.8);
  color: #d4af37;
  border: 1px solid #d4af37;
}

.btn-icon {
  font-size: 20px;
}

.btn-small {
  padding: 10px 16px;
  font-size: 14px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-close {
  margin-top: 15px;
  width: 100%;
  background: rgba(44, 62, 80, 0.8);
  color: #95a5a6;
  border: 1px solid #34495e;
}

.status-bar {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(44, 62, 80, 0.5);
  border-radius: 20px;
  font-size: 12px;
  color: #7f8c8d;
}

.status-item.active {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-icon {
  font-size: 14px;
}

.location-info {
  margin-top: 10px;
  font-size: 11px;
  color: #7f8c8d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #1a1a2e;
  border: 1px solid #2c3e50;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h2 {
  font-size: 20px;
  color: #d4af37;
  margin-bottom: 20px;
  text-align: center;
}

.destination-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.destination-item {
  display: flex;
  flex-direction: column;
  padding: 14px;
  background: rgba(44, 62, 80, 0.5);
  border: 1px solid #34495e;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.destination-item:active {
  transform: scale(0.98);
}

.destination-item.selected {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
}

.dest-name {
  color: #e8e8e8;
  font-size: 15px;
  font-weight: 500;
}

.dest-coord {
  color: #7f8c8d;
  font-size: 12px;
  margin-top: 4px;
}

.custom-coord {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #2c3e50;
}

.custom-coord h3 {
  font-size: 14px;
  color: #95a5a6;
  margin-bottom: 12px;
}

.coord-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.coord-inputs input {
  padding: 12px 14px;
  background: rgba(44, 62, 80, 0.5);
  border: 1px solid #34495e;
  border-radius: 8px;
  color: #e8e8e8;
  font-size: 14px;
  outline: none;
}

.coord-inputs input:focus {
  border-color: #d4af37;
}

.coord-inputs input::placeholder {
  color: #7f8c8d;
}
</style>
