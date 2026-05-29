const speechQueue: (() => void)[] = []
let isSpeaking = false

const letterPronunciations: Record<string, string> = {
  'A': 'A.',
  'B': 'B.',
  'C': 'C.',
  'D': 'D.',
  'E': 'E.',
  'F': 'F.',
  'G': 'G.',
  'H': 'H.',
}

function processQueue() {
  if (isSpeaking || speechQueue.length === 0) return
  isSpeaking = true
  const speakFn = speechQueue.shift()
  if (speakFn) {
    speakFn()
  }
}

export function speakEnglish(text: string): Promise<void> {
  return new Promise((resolve) => {
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.onend = () => {
        isSpeaking = false
        resolve()
        processQueue()
      }
      utterance.onerror = () => {
        isSpeaking = false
        resolve()
        processQueue()
      }
      speechSynthesis.speak(utterance)
    }
    speechQueue.push(speak)
    processQueue()
  })
}

export function speakChinese(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!text) {
      resolve()
      return
    }
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.onend = () => {
        isSpeaking = false
        resolve()
        processQueue()
      }
      utterance.onerror = () => {
        isSpeaking = false
        resolve()
        processQueue()
      }
      speechSynthesis.speak(utterance)
    }
    speechQueue.push(speak)
    processQueue()
  })
}

export async function speakWord(english: string, chinese: string) {
  await speakEnglish(english)
  if (chinese) {
    await speakChinese(chinese)
  }
}

export function speakLetter(letter: string): Promise<void> {
  return new Promise((resolve) => {
    const speak = () => {
      const upperLetter = letter.toUpperCase()
      const utterance = new SpeechSynthesisUtterance(upperLetter)
      utterance.lang = 'en-US'
      utterance.rate = 0.6
      utterance.pitch = 1.1
      utterance.volume = 1.0
      utterance.onend = () => {
        isSpeaking = false
        resolve()
        processQueue()
      }
      utterance.onerror = () => {
        isSpeaking = false
        resolve()
        processQueue()
      }
      speechSynthesis.speak(utterance)
    }
    speechQueue.push(speak)
    processQueue()
  })
}

export function stopSpeaking() {
  speechSynthesis.cancel()
  speechQueue.length = 0
  isSpeaking = false
}
