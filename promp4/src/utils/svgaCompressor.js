import JSZip from 'jszip'
import pako from 'pako'
import protobuf from 'protobufjs'

const svgaProto = `
syntax = "proto3";
package com.opensource.svga;

message MovieParams {
    float viewBoxWidth = 1;
    float viewBoxHeight = 2;
    int32 fps = 3;
    int32 frames = 4;
}

message SpriteEntity {
    string imageKey = 1;
    repeated FrameEntity frames = 2;
    string matteKey = 3;
}

message AudioEntity {
    string audioKey = 1;
    int32 startFrame = 2;
    int32 endFrame = 3;
    int32 startTime = 4;
    int32 totalTime = 5;
}

message Layout {
    float x = 1;
    float y = 2;
    float width = 3;
    float height = 4;
}

message Transform {
    float a = 1;
    float b = 2;
    float c = 3;
    float d = 4;
    float tx = 5;
    float ty = 6;
}

message ShapeEntity {
    enum ShapeType {
        SHAPE = 0;
        RECT = 1;
        ELLIPSE = 2;
        KEEP = 3;
    }
    message ShapeArgs {
        string d = 1;
    }
    message RectArgs {
        float x = 1;
        float y = 2;
        float width = 3;
        float height = 4;
        float cornerRadius = 5;
    }
    message EllipseArgs {
        float x = 1;
        float y = 2;
        float radiusX = 3;
        float radiusY = 4;
    }
    message ShapeStyle {
        message RGBAColor {
            float r = 1;
            float g = 2;
            float b = 3;
            float a = 4;
        }
        enum LineCap {
            LineCap_BUTT = 0;
            LineCap_ROUND = 1;
            LineCap_SQUARE = 2;
        }
        enum LineJoin {
            LineJoin_MITER = 0;
            LineJoin_ROUND = 1;
            LineJoin_BEVEL = 2;
        }
        RGBAColor fill = 1;
        RGBAColor stroke = 2;
        float strokeWidth = 3;
        LineCap lineCap = 4;
        LineJoin lineJoin = 5;
        float miterLimit = 6;
        float lineDashI = 7;
        float lineDashII = 8;
        float lineDashIII = 9;
    }
    ShapeType type = 1;
    ShapeArgs shape = 2;
    RectArgs rect = 3;
    EllipseArgs ellipse = 4;
    ShapeStyle styles = 10;
    Transform transform = 11;
}

message FrameEntity {
    float alpha = 1;
    Layout layout = 2;
    Transform transform = 3;
    string clipPath = 4;
    repeated ShapeEntity shapes = 5;
}

message MovieEntity {
    string version = 1;
    MovieParams params = 2;
    map<string, bytes> images = 3;
    repeated SpriteEntity sprites = 4;
    repeated AudioEntity audios = 5;
}
`

let root = null
let MovieEntity = null

function initProto() {
  if (root) return
  root = protobuf.parse(svgaProto).root
  MovieEntity = root.lookupType('com.opensource.svga.MovieEntity')
}

function detectFormat(buffer) {
  const uint8 = new Uint8Array(buffer)
  
  if (uint8.length >= 4 && uint8[0] === 0x50 && uint8[1] === 0x4b) {
    return 'zip'
  }
  
  if (uint8.length >= 2 && uint8[0] === 0x78) {
    return 'zlib'
  }
  
  return 'unknown'
}

function bytesToBase64(bytes) {
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBytes(base64) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export async function parseSVGA(buffer) {
  initProto()
  
  const format = detectFormat(buffer)
  
  if (format === 'zlib') {
    return parseSVGA2x(buffer)
  } else if (format === 'zip') {
    return parseSVGA1x(buffer)
  } else {
    throw new Error('不支持的SVGA文件格式')
  }
}

async function parseSVGA2x(buffer) {
  try {
    const inflated = pako.inflate(buffer)
    const message = MovieEntity.decode(inflated)
    const object = MovieEntity.toObject(message, {
      enums: String,
      longs: String,
      bytes: Uint8Array
    })
    
    const images = {}
    if (object.images) {
      for (const [key, value] of Object.entries(object.images)) {
        if (value instanceof Uint8Array) {
          images[key] = value
        } else if (value && value.buffer) {
          images[key] = new Uint8Array(value)
        } else {
          images[key] = value
        }
      }
    }
    
    return {
      format: '2x',
      version: object.version || '2.0',
      params: {
        width: object.params?.viewBoxWidth || 0,
        height: object.params?.viewBoxHeight || 0,
        fps: object.params?.fps || 0,
        frames: object.params?.frames || 0
      },
      images: images,
      sprites: object.sprites || [],
      audios: object.audios || [],
      _rawBuffer: buffer
    }
  } catch (error) {
    console.error('解析 SVGA 2.x 失败:', error)
    throw new Error('无法解析SVGA 2.x格式文件: ' + error.message)
  }
}

async function parseSVGA1x(buffer) {
  const zip = new JSZip()
  const content = await zip.loadAsync(buffer)
  
  let jsonData = null
  let images = {}
  
  for (const filename in content.files) {
    if (content.files[filename].dir) continue
    
    const fileContent = await content.files[filename].async('arraybuffer')
    
    if (filename.endsWith('.json')) {
      try {
        const text = new TextDecoder('utf-8').decode(fileContent)
        jsonData = JSON.parse(text)
      } catch (e) {
        try {
          const inflated = pako.inflate(fileContent)
          const text = new TextDecoder('utf-8').decode(inflated)
          jsonData = JSON.parse(text)
        } catch (e2) {
          console.error('无法解析JSON文件:', filename)
        }
      }
    } else if (/\.(png|jpg|jpeg|webp)$/i.test(filename)) {
      const uint8 = new Uint8Array(fileContent)
      images[filename] = bytesToBase64(uint8)
    }
  }
  
  if (!jsonData) {
    throw new Error('无法在ZIP文件中找到JSON数据')
  }
  
  if (Object.keys(images).length === 0 && jsonData.images) {
    images = jsonData.images
  }
  
  return {
    format: '1x',
    version: '1.0',
    params: {
      width: jsonData.params?.width || 0,
      height: jsonData.params?.height || 0,
      fps: jsonData.params?.fps || 0,
      frames: jsonData.params?.frames || 0
    },
    images: images,
    sprites: jsonData.sprites || [],
    _jsonData: jsonData,
    _rawBuffer: buffer
  }
}

export function extractSVGAInfo(file, svgaData) {
  if (!svgaData) return null
  
  const params = svgaData.params || {}
  const images = svgaData.images || {}
  const sprites = svgaData.sprites || []
  
  const info = {
    filename: file.name,
    originalSize: file.size,
    format: svgaData.format || 'unknown',
    width: params.width || 0,
    height: params.height || 0,
    fps: params.fps || 0,
    frames: params.frames || 0,
    duration: params.frames && params.fps ? (params.frames / params.fps).toFixed(2) : 0,
    imageCount: Object.keys(images).length,
    spriteCount: sprites.length,
    images: []
  }
  
  for (const [key, value] of Object.entries(images)) {
    let imageSize = 0
    try {
      if (value instanceof Uint8Array) {
        imageSize = value.length
      } else if (value && value.byteLength !== undefined) {
        imageSize = value.byteLength
      } else if (typeof value === 'string') {
        const binaryString = atob(value)
        imageSize = binaryString.length
      }
    } catch (e) {
      imageSize = 0
    }
    
    info.images.push({
      key,
      size: imageSize
    })
  }
  
  return info
}

function detectMimeTypeFromBytes(bytes) {
  if (bytes.length >= 8) {
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      return 'image/png'
    }
    if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
      return 'image/jpeg'
    }
    if (bytes.length >= 12 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
      return 'image/webp'
    }
  }
  return 'image/png'
}

function bytesToDataUrl(bytes) {
  const mimeType = detectMimeTypeFromBytes(bytes)
  const base64 = bytesToBase64(bytes)
  return `data:${mimeType};base64,${base64}`
}

function hasTransparency(img, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.min(width, 64)
  canvas.height = Math.min(height, 64)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true
    }
  }
  return false
}

function compressImageBytes(bytes, quality = 'standard') {
  return new Promise((resolve) => {
    const qualitySettings = {
      standard: { 
        scale: 0.7, 
        maxDimension: 800, 
        jpegQuality: 0.6,
        pngQuality: 0.7,
        forceJpegIfNoAlpha: true
      },
      high: { 
        scale: 0.85, 
        maxDimension: 1200, 
        jpegQuality: 0.8,
        pngQuality: 0.85,
        forceJpegIfNoAlpha: true
      }
    }
    
    const settings = qualitySettings[quality] || qualitySettings.standard
    
    try {
      const img = new Image()
      const dataUrl = bytesToDataUrl(bytes)
      
      img.onload = () => {
        const originalMimeType = detectMimeTypeFromBytes(bytes)
        const isPng = originalMimeType === 'image/png'
        const hasAlpha = isPng ? hasTransparency(img, img.width, img.height) : false
        
        let targetMimeType = originalMimeType
        let compressQuality = settings.pngQuality
        
        if (isPng && settings.forceJpegIfNoAlpha && !hasAlpha) {
          targetMimeType = 'image/jpeg'
          compressQuality = settings.jpegQuality
        } else if (originalMimeType === 'image/jpeg') {
          compressQuality = settings.jpegQuality
        }
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        let { width, height } = img
        const maxDim = Math.max(width, height)
        
        if (maxDim > settings.maxDimension) {
          const scale = settings.maxDimension / maxDim
          width = Math.floor(width * scale)
          height = Math.floor(height * scale)
        }
        
        width = Math.max(1, Math.floor(width * settings.scale))
        height = Math.max(1, Math.floor(height * settings.scale))
        
        canvas.width = width
        canvas.height = height
        
        if (targetMimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)
        }
        ctx.drawImage(img, 0, 0, width, height)
        
        const compressedDataUrl = canvas.toDataURL(targetMimeType, compressQuality)
        const base64Part = compressedDataUrl.split(',')[1]
        const compressedBytes = base64ToBytes(base64Part)
        
        if (compressedBytes.length < bytes.length) {
          console.log(`[压缩] ${isPng?'PNG':originalMimeType} -> ${targetMimeType}, 尺寸: ${img.width}x${img.height} -> ${width}x${height}, 大小: ${bytes.length} -> ${compressedBytes.length} (节省 ${((1 - compressedBytes.length/bytes.length)*100).toFixed(1)}%)`)
          resolve(compressedBytes)
        } else {
          console.log(`[压缩] 压缩后更大，使用原文件: ${bytes.length} vs ${compressedBytes.length}`)
          resolve(bytes)
        }
      }
      
      img.onerror = (e) => {
        console.error('图片加载失败:', e)
        resolve(bytes)
      }
      
      img.src = dataUrl
    } catch (e) {
      console.error('压缩图片失败:', e)
      resolve(bytes)
    }
  })
}

export async function compressImages(svgaData, quality = 'standard') {
  if (!svgaData || !svgaData.images) return svgaData
  
  const result = { ...svgaData }
  const originalImages = svgaData.images
  const newImages = {}
  
  const imageKeys = Object.keys(originalImages)
  
  for (const key of imageKeys) {
    let imageBytes = null
    const value = originalImages[key]
    
    try {
      if (value instanceof Uint8Array) {
        imageBytes = value
      } else if (value && value.byteLength !== undefined) {
        imageBytes = new Uint8Array(value)
      } else if (typeof value === 'string') {
        imageBytes = base64ToBytes(value)
      }
    } catch (e) {
      console.error('转换图片失败:', key, e)
      newImages[key] = value
      continue
    }
    
    if (imageBytes && imageBytes.length > 0) {
      const compressed = await compressImageBytes(imageBytes, quality)
      
      if (svgaData.format === '2x') {
        newImages[key] = compressed
      } else {
        newImages[key] = bytesToBase64(compressed)
      }
    } else {
      newImages[key] = value
    }
  }
  
  result.images = newImages
  return result
}

export async function createSVGAFile(svgaData) {
  if (svgaData.format === '2x') {
    return createSVGA2xFile(svgaData)
  } else {
    return createSVGA1xFile(svgaData)
  }
}

async function createSVGA2xFile(svgaData) {
  initProto()
  
  try {
    const message = MovieEntity.decode(pako.inflate(svgaData._rawBuffer))
    const object = MovieEntity.toObject(message, {
      enums: String,
      longs: String,
      bytes: Uint8Array
    })
    
    object.images = {}
    for (const [key, value] of Object.entries(svgaData.images)) {
      if (value instanceof Uint8Array) {
        object.images[key] = value
      } else if (typeof value === 'string') {
        object.images[key] = base64ToBytes(value)
      } else {
        object.images[key] = new Uint8Array(value)
      }
    }
    
    const newMessage = MovieEntity.fromObject(object)
    const encoded = MovieEntity.encode(newMessage).finish()
    const deflated = pako.deflate(encoded)
    
    return new Blob([deflated], { type: 'application/octet-stream' })
  } catch (error) {
    console.error('创建 SVGA 2.x 文件失败:', error)
    throw new Error('创建SVGA文件失败: ' + error.message)
  }
}

async function createSVGA1xFile(svgaData) {
  const zip = new JSZip()
  
  const jsonData = svgaData._jsonData || {
    params: svgaData.params,
    images: svgaData.images,
    sprites: svgaData.sprites
  }
  
  if (svgaData.images) {
    jsonData.images = svgaData.images
  }
  
  const jsonStr = JSON.stringify(jsonData)
  zip.file('movie.spec', jsonStr)
  
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  })
  
  return content
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function calculateSaving(original, compressed) {
  if (original === 0) return 0
  const saving = ((original - compressed) / original * 100)
  return Math.max(0, saving).toFixed(1)
}