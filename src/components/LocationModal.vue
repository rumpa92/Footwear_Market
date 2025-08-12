<template>
  <div class="location-modal" :class="{ open: isVisible }" @click="closeModal">
    <div class="modal-overlay"></div>
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>📍 Set Your Location</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>
      
      <div class="modal-content">
        <!-- Auto-detect option -->
        <div class="location-option auto-detect" @click="autoDetectLocation">
          <div class="option-icon">🎯</div>
          <div class="option-content">
            <h3>Auto-detect Location</h3>
            <p>Use your current location for accurate shipping estimates</p>
          </div>
          <div class="option-action">
            <span v-if="detecting" class="loading-spinner"></span>
            <span v-else class="action-arrow">→</span>
          </div>
        </div>
        
        <!-- Manual search -->
        <div class="search-section">
          <div class="search-header">
            <h3>Or search manually</h3>
          </div>
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              type="text"
              placeholder="Enter city, state, or ZIP code"
              class="search-input"
            >
            <button class="search-btn" @click="searchLocation">🔍</button>
          </div>
          
          <!-- Search results -->
          <div v-if="searchResults.length" class="search-results">
            <div
              v-for="result in searchResults"
              :key="result.id"
              class="search-result"
              @click="selectLocation(result)"
            >
              <div class="result-icon">📍</div>
              <div class="result-content">
                <h4>{{ result.name }}</h4>
                <p>{{ result.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent locations -->
        <div v-if="recentLocations.length" class="recent-section">
          <h3>Recent Locations</h3>
          <div class="recent-locations">
            <button
              v-for="location in recentLocations"
              :key="location.id"
              class="recent-location"
              @click="selectLocation(location)"
            >
              <span class="recent-icon">🕒</span>
              <span class="recent-name">{{ location.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- Benefits info -->
        <div class="benefits-section">
          <h3>Why set your location?</h3>
          <div class="benefits-list">
            <div class="benefit">
              <span class="benefit-icon">🚚</span>
              <span class="benefit-text">Accurate shipping estimates</span>
            </div>
            <div class="benefit">
              <span class="benefit-icon">🏷️</span>
              <span class="benefit-text">Local offers and deals</span>
            </div>
            <div class="benefit">
              <span class="benefit-icon">🏪</span>
              <span class="benefit-text">Find nearby stores</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocationModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchQuery: '',
      detecting: false,
      searchResults: [],
      recentLocations: [
        { id: 1, name: 'New York, NY', description: 'New York, United States' },
        { id: 2, name: 'Los Angeles, CA', description: 'California, United States' },
        { id: 3, name: 'Chicago, IL', description: 'Illinois, United States' }
      ]
    }
  },
  computed: {
    isVisible() {
      return this.visible
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    async autoDetectLocation() {
      this.detecting = true
      
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false
          })
        })
        
        // Simulate reverse geocoding
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: 'Your Current Location',
          description: 'Auto-detected location',
          detected: true
        }
        
        this.selectLocation(location)
        
      } catch (error) {
        console.error('Geolocation failed:', error)
        alert('Could not detect your location. Please try searching manually.')
      } finally {
        this.detecting = false
      }
    },
    handleSearchInput() {
      if (this.searchQuery.length > 2) {
        this.searchLocation()
      } else {
        this.searchResults = []
      }
    },
    async searchLocation() {
      if (!this.searchQuery.trim()) return
      
      // Simulate location search API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock search results
      this.searchResults = [
        {
          id: 1,
          name: this.searchQuery,
          description: 'Exact match',
          lat: 40.7128,
          lng: -74.0060
        },
        {
          id: 2,
          name: `${this.searchQuery}, State`,
          description: 'State-level match',
          lat: 40.7128,
          lng: -74.0060
        },
        {
          id: 3,
          name: `${this.searchQuery} County`,
          description: 'County-level match',
          lat: 40.7128,
          lng: -74.0060
        }
      ]
    },
    selectLocation(location) {
      // Add to recent locations if not already there
      if (!this.recentLocations.find(loc => loc.name === location.name)) {
        this.recentLocations.unshift(location)
        if (this.recentLocations.length > 5) {
          this.recentLocations.pop()
        }
      }
      
      this.$emit('location-selected', location)
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.location-modal {
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

.location-modal.open {
  visibility: visible;
  opacity: 1;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.location-modal.open .modal-container {
  transform: scale(1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-content {
  padding: 32px;
  max-height: 60vh;
  overflow-y: auto;
}

.location-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.location-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.option-icon {
  font-size: 32px;
  width: 48px;
  text-align: center;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.option-content p {
  font-size: 14px;
  color: #666;
}

.option-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.action-arrow {
  font-size: 18px;
  color: #667eea;
  font-weight: bold;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.search-section {
  margin-bottom: 32px;
}

.search-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.search-input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.search-btn {
  width: 48px;
  height: 48px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background: #5a67d8;
  transform: scale(1.05);
}

.search-results {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.search-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.search-result:last-child {
  border-bottom: none;
}

.search-result:hover {
  background: #f8f9fa;
}

.result-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.result-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.result-content p {
  font-size: 14px;
  color: #666;
}

.recent-section {
  margin-bottom: 32px;
}

.recent-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.recent-locations {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recent-location {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.recent-location:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.recent-icon {
  font-size: 12px;
}

.benefits-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
}

.benefit-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.benefit-text {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .modal-content {
    padding: 24px;
  }
  
  .location-option {
    padding: 16px;
  }
  
  .option-icon {
    font-size: 28px;
    width: 40px;
  }
}
</style>
