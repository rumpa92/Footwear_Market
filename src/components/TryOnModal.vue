<template>
  <div class="try-on-modal" :class="{ open: visible }" @click="closeModal">
    <div class="modal-overlay"></div>
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>📱 AR Try-On Experience</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>
      
      <div class="modal-content">
        <div class="ar-preview">
          <div class="camera-view">
            <div class="camera-placeholder">
              <div class="camera-icon">📷</div>
              <p>Camera access required for AR try-on</p>
              <button @click="enableCamera" class="enable-camera-btn">
                Enable Camera
              </button>
            </div>
          </div>
          
          <div class="ar-controls">
            <button class="ar-btn" @click="takePhoto">📸 Capture</button>
            <button class="ar-btn" @click="sharePhoto">📤 Share</button>
            <button class="ar-btn" @click="switchCamera">🔄 Flip</button>
          </div>
        </div>
        
        <div class="product-info">
          <div class="product-preview">
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.brand }}</p>
            <span class="price">${{ product.price }}</span>
          </div>
          
          <div class="try-on-features">
            <h4>AR Features</h4>
            <ul>
              <li>✨ 3D shoe visualization</li>
              <li>📏 Size fitting guide</li>
              <li>🎨 Color variations</li>
              <li>📱 Save & share photos</li>
            </ul>
          </div>
          
          <div class="try-on-actions">
            <button class="add-to-cart-btn">Add to Cart</button>
            <button class="learn-more-btn">Learn About AR</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TryOnModal',
  props: {
    visible: Boolean,
    product: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    enableCamera() {
      console.log('Enable camera for AR')
    },
    takePhoto() {
      console.log('Take AR photo')
    },
    sharePhoto() {
      console.log('Share AR photo')
    },
    switchCamera() {
      console.log('Switch camera')
    }
  }
}
</script>

<style scoped>
.try-on-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.try-on-modal.open {
  visibility: visible;
  opacity: 1;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  min-height: 500px;
}

.ar-preview {
  background: #000;
  position: relative;
  display: flex;
  flex-direction: column;
}

.camera-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-placeholder {
  text-align: center;
  color: white;
}

.camera-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.enable-camera-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 16px;
}

.ar-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
}

.ar-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 16px;
  border-radius: 20px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.ar-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.product-info {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-preview {
  text-align: center;
}

.product-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}

.product-preview h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.product-preview p {
  color: #666;
  margin-bottom: 8px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.try-on-features h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.try-on-features ul {
  list-style: none;
  padding: 0;
}

.try-on-features li {
  padding: 6px 0;
  font-size: 14px;
  color: #666;
}

.try-on-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.learn-more-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
  }
  
  .ar-preview {
    min-height: 300px;
  }
}
</style>
