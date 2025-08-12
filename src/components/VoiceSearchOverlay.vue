<template>
  <div class="voice-overlay" :class="{ active: visible }">
    <div class="voice-container">
      <div class="voice-animation">
        <div class="voice-circle" :class="{ listening: isListening, processing: isProcessing }">
          <div class="voice-icon">🎤</div>
        </div>
        <div class="voice-waves">
          <div class="wave" v-for="n in 3" :key="n"></div>
        </div>
      </div>
      
      <div class="voice-content">
        <h2 v-if="!isListening && !isProcessing">Tap to start voice search</h2>
        <h2 v-else-if="isListening">Listening...</h2>
        <h2 v-else-if="isProcessing">Processing...</h2>
        
        <p v-if="!isListening && !isProcessing">Try saying "Find Nike Air Max" or "Show me running shoes"</p>
        <p v-else-if="isListening">{{ transcript || 'Say something...' }}</p>
        <p v-else-if="isProcessing">Understanding your request...</p>
      </div>
      
      <div class="voice-actions">
        <button v-if="!isListening" @click="startListening" class="voice-btn start">
          Start Listening
        </button>
        <button v-else @click="stopListening" class="voice-btn stop">
          Stop
        </button>
        <button @click="closeVoice" class="voice-btn cancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoiceSearchOverlay',
  props: {
    visible: Boolean
  },
  data() {
    return {
      isListening: false,
      isProcessing: false,
      transcript: '',
      recognition: null
    }
  },
  mounted() {
    this.initSpeechRecognition()
  },
  methods: {
    initSpeechRecognition() {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        
        this.recognition.continuous = false
        this.recognition.interimResults = true
        this.recognition.lang = 'en-US'
        
        this.recognition.onresult = (event) => {
          const result = event.results[event.results.length - 1]
          this.transcript = result[0].transcript
          
          if (result.isFinal) {
            this.processVoiceResult(this.transcript)
          }
        }
        
        this.recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          this.stopListening()
        }
        
        this.recognition.onend = () => {
          this.isListening = false
        }
      }
    },
    startListening() {
      if (this.recognition) {
        this.isListening = true
        this.transcript = ''
        this.recognition.start()
      }
    },
    stopListening() {
      if (this.recognition) {
        this.recognition.stop()
        this.isListening = false
      }
    },
    async processVoiceResult(text) {
      this.isProcessing = true
      this.isListening = false
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      this.isProcessing = false
      this.$emit('voice-result', text)
    },
    closeVoice() {
      this.stopListening()
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.voice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.voice-overlay.active {
  opacity: 1;
  visibility: visible;
}

.voice-container {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 40px;
}

.voice-animation {
  position: relative;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.voice-circle.listening {
  animation: pulse 2s infinite;
  box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
}

.voice-circle.processing {
  animation: spin 2s linear infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.voice-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: wave 2s ease-out infinite;
}

.wave:nth-child(2) {
  animation-delay: 0.5s;
}

.wave:nth-child(3) {
  animation-delay: 1s;
}

@keyframes wave {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.voice-content h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
}

.voice-content p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.5;
}

.voice-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.voice-btn {
  padding: 12px 24px;
  border: 2px solid white;
  background: transparent;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.voice-btn:hover {
  background: white;
  color: #333;
}

.voice-btn.start {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.voice-btn.stop {
  background: #ff6b6b;
  border-color: transparent;
}
</style>
