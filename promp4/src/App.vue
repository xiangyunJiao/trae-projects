<template>
  <div class="container">
    <header>
      <h1>🎬 SVGA压缩平台</h1>
      <p>上传SVGA文件，查看信息并压缩为两种不同质量版本</p>
    </header>
    
    <div class="main-content">
      <div class="card">
        <h2 class="card-title">文件上传与预览</h2>
        
        <div 
          class="upload-area" 
          :class="{ dragover: isDragover }"
          @click="triggerFileInput"
          @dragover.prevent="isDragover = true"
          @dragleave.prevent="isDragover = false"
          @drop.prevent="handleDrop"
        >
          <div class="upload-icon">📁</div>
          <div class="upload-text">点击或拖拽上传SVGA文件</div>
          <div class="upload-hint">支持 .svga 格式文件</div>
        </div>
        
        <div style="margin-top: 16px; text-align: center;">
          <button class="button button-secondary" @click="loadTestFile" style="font-size: 0.9rem;">
            🧪 加载测试文件 (second.svga)
          </button>
        </div>
        <input 
          type="file" 
          ref="fileInput" 
          class="file-input" 
          accept=".svga"
          @change="handleFileSelect"
        >
        
        <div v-if="selectedFile" class="preview-area">
          <canvas ref="svgaCanvas" class="svga-player"></canvas>
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div v-if="selectedFile && !isCompressing" class="button-group">
          <button class="button" @click="startCompression" :disabled="isCompressing">
            🚀 开始压缩
          </button>
          <button class="button button-secondary" @click="resetAll">
            🔄 重新选择
          </button>
        </div>
        
        <div v-if="isCompressing" class="loading">
          <div class="loading-spinner"></div>
          <div>正在压缩中，请稍候...</div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="card-title">文件信息</h2>
        
        <div v-if="fileInfo">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">文件名</div>
              <div class="info-value">{{ fileInfo.filename }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">原始大小</div>
              <div class="info-value">{{ formatSize(fileInfo.originalSize) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">尺寸</div>
              <div class="info-value">{{ fileInfo.width }} × {{ fileInfo.height }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">帧率 (FPS)</div>
              <div class="info-value">{{ fileInfo.fps }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">总帧数</div>
              <div class="info-value">{{ fileInfo.frames }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">时长</div>
              <div class="info-value">{{ fileInfo.duration }} 秒</div>
            </div>
            <div class="info-item">
              <div class="info-label">图片数量</div>
              <div class="info-value">{{ fileInfo.imageCount }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">精灵数量</div>
              <div class="info-value">{{ fileInfo.spriteCount }}</div>
            </div>
          </div>
          
          <div v-if="fileInfo.images.length > 0" style="margin-top: 20px;">
            <h3 style="margin-bottom: 12px; font-size: 1rem; color: #333;">内置图片列表</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <div 
                v-for="(img, index) in fileInfo.images" 
                :key="index"
                style="background: #f8f9fa; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;"
              >
                <strong>{{ img.key }}</strong> - {{ formatSize(img.size) }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="text-align: center; padding: 60px; color: #999;">
            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
            <div>请先上传SVGA文件查看详细信息</div>
          </div>
        </div>
      </div>
      
      <div class="card" style="grid-column: 1 / -1;">
        <h2 class="card-title">压缩结果</h2>
        
        <div v-if="compressionResults">
          <div class="compression-result">
            <div class="compression-card">
              <div class="compression-header">
                <span class="compression-name">📦 标准压缩</span>
                <span class="compression-badge standard">体积更小</span>
              </div>
              <div class="compression-info">
                <span class="compression-info-label">压缩后大小</span>
                <span class="compression-info-value">{{ formatSize(compressionResults.standard.size) }}</span>
              </div>
              <div class="compression-info">
                <span class="compression-info-label">压缩比</span>
                <span class="compression-info-value saving-percent">节省 {{ compressionResults.standard.saving }}%</span>
              </div>
              <button 
                class="button button-success" 
                style="width: 100%; margin-top: 16px;"
                @click="downloadFile('standard')"
              >
                ⬇️ 下载标准压缩版本
              </button>
            </div>
            
            <div class="compression-card">
              <div class="compression-header">
                <span class="compression-name">💎 高质量压缩</span>
                <span class="compression-badge high">质量更佳</span>
              </div>
              <div class="compression-info">
                <span class="compression-info-label">压缩后大小</span>
                <span class="compression-info-value">{{ formatSize(compressionResults.high.size) }}</span>
              </div>
              <div class="compression-info">
                <span class="compression-info-label">压缩比</span>
                <span class="compression-info-value saving-percent">节省 {{ compressionResults.high.saving }}%</span>
              </div>
              <button 
                class="button button-success" 
                style="width: 100%; margin-top: 16px;"
                @click="downloadFile('high')"
              >
                ⬇️ 下载高质量版本
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="text-align: center; padding: 60px; color: #999;">
            <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
            <div>压缩结果将在这里显示</div>
            <div style="margin-top: 8px; font-size: 0.9rem;">上传文件后点击"开始压缩"按钮</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { Parser, Player } from 'svga.lite'
import { 
  parseSVGA, 
  extractSVGAInfo, 
  compressImages, 
  createSVGAFile,
  formatFileSize,
  calculateSaving
} from './utils/svgaCompressor.js'

const fileInput = ref(null)
const svgaCanvas = ref(null)
const isDragover = ref(false)
const selectedFile = ref(null)
const fileInfo = ref(null)
const svgaData = ref(null)
const isCompressing = ref(false)
const compressionResults = ref(null)
const errorMessage = ref('')
let player = null
let videoItem = null

const loadTestFile = async () => {
  try {
    errorMessage.value = ''
    const response = await fetch('/second.svga')
    const arrayBuffer = await response.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
    const file = new File([blob], 'second.svga', { type: 'application/octet-stream' })
    await processFile(file)
  } catch (error) {
    console.error('加载测试文件失败:', error)
    errorMessage.value = '加载测试文件失败：' + error.message
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleDrop = (e) => {
  isDragover.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const processFile = async (file) => {
  if (!file.name.toLowerCase().endsWith('.svga')) {
    errorMessage.value = '请上传SVGA格式的文件'
    return
  }
  
  errorMessage.value = ''
  selectedFile.value = file
  compressionResults.value = null
  
  try {
    const buffer = await file.arrayBuffer()
    
    svgaData.value = await parseSVGA(buffer)
    
    if (!svgaData.value) {
      throw new Error('无法解析SVGA文件格式')
    }
    
    fileInfo.value = extractSVGAInfo(file, svgaData.value)
    
    await playPreview(buffer)
    
  } catch (error) {
    console.error('处理文件失败:', error)
    errorMessage.value = '处理文件时出错：' + error.message
  }
}

const playPreview = async (buffer) => {
  try {
    if (player) {
      player.destroy()
      player = null
    }
    
    const parser = new Parser()
    videoItem = await parser.do(buffer)
    
    if (svgaCanvas.value) {
      player = new Player(svgaCanvas.value)
      player.set({ loop: 0 })
      await player.mount(videoItem)
      player.start()
    }
  } catch (error) {
    console.error('播放预览失败:', error)
  }
}

const startCompression = async () => {
  if (!svgaData.value || !selectedFile.value) return
  
  isCompressing.value = true
  compressionResults.value = null
  
  try {
    console.log('[压缩开始] 原始文件大小:', selectedFile.value.size, 'bytes')
    console.log('[压缩开始] 图片数量:', Object.keys(svgaData.value.images || {}).length)
    console.log('[压缩开始] 格式:', svgaData.value.format)
    
    const [standardData, highData] = await Promise.all([
      compressImages(svgaData.value, 'standard'),
      compressImages(svgaData.value, 'high')
    ])
    
    console.log('[压缩完成] 开始生成文件...')
    
    const [standardBlob, highBlob] = await Promise.all([
      createSVGAFile(standardData),
      createSVGAFile(highData)
    ])
    
    const originalSize = selectedFile.value.size
    
    console.log('[压缩结果] 标准压缩:', originalSize, '->', standardBlob.size, 'bytes (节省', calculateSaving(originalSize, standardBlob.size), '%)')
    console.log('[压缩结果] 高质量压缩:', originalSize, '->', highBlob.size, 'bytes (节省', calculateSaving(originalSize, highBlob.size), '%)')
    
    compressionResults.value = {
      standard: {
        blob: standardBlob,
        size: standardBlob.size,
        saving: calculateSaving(originalSize, standardBlob.size),
        filename: getCompressedFilename(selectedFile.value.name, 'standard')
      },
      high: {
        blob: highBlob,
        size: highBlob.size,
        saving: calculateSaving(originalSize, highBlob.size),
        filename: getCompressedFilename(selectedFile.value.name, 'high')
      }
    }
    
  } catch (error) {
    console.error('压缩失败:', error)
    errorMessage.value = '压缩失败：' + error.message
  } finally {
    isCompressing.value = false
  }
}

const getCompressedFilename = (originalName, quality) => {
  const suffix = quality === 'standard' ? '_standard' : '_high'
  return originalName.replace('.svga', `${suffix}.svga`).replace('.SVGA', `${suffix}.SVGA`)
}

const downloadFile = (quality) => {
  if (!compressionResults.value || !compressionResults.value[quality]) return
  
  const result = compressionResults.value[quality]
  const url = URL.createObjectURL(result.blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const resetAll = () => {
  if (player) {
    player.destroy()
    player = null
  }
  selectedFile.value = null
  fileInfo.value = null
  svgaData.value = null
  compressionResults.value = null
  errorMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatSize = (bytes) => {
  return formatFileSize(bytes)
}

onUnmounted(() => {
  if (player) {
    player.destroy()
  }
})
</script>
