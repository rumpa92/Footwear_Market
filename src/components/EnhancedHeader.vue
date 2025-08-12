<template>
  <header class="enhanced-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" @click="goHome">
          <span class="logo-icon">👟</span>
          <span class="brand-name">Sole Hub</span>
        </div>
        
        <!-- Enhanced Search Bar -->
        <div class="search-section">
          <div class="search-wrapper" :class="{ focused: searchFocused, 'has-suggestions': showSuggestions }">
            <div class="search-input-container">
              <span class="search-icon">🔍</span>
              <input
                ref="searchInput"
                type="text"
                :value="searchQuery"
                @input="handleSearchInput"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
                placeholder="Search shoes, brands, styles..."
                class="search-input"
              >
              <button 
                class="voice-btn"
                @click="startVoiceSearch"
                :class="{ recording: isRecording }"
                title="Voice Search"
              >
                🎤
              </button>
              <button 
                v-if="searchQuery"
                class="clear-btn"
                @click="clearSearch"
              >
                ✕
              </button>
            </div>
            
            <!-- Search Suggestions -->
            <div v-if="showSuggestions" class="search-suggestions">
              <div class="suggestions-header">
                <span class="suggestions-title">Popular Searches</span>
              </div>
              <div class="suggestions-list">
                <button
                  v-for="suggestion in searchSuggestions"
                  :key="suggestion.id"
                  @click="selectSuggestion(suggestion)"
                  class="suggestion-item"
                >
                  <span class="suggestion-icon">{{ suggestion.icon }}</span>
                  <div class="suggestion-content">
                    <span class="suggestion-text">{{ suggestion.text }}</span>
                    <span class="suggestion-category">{{ suggestion.category }}</span>
                  </div>
                  <span class="suggestion-trend" v-if="suggestion.trending">🔥</span>
                </button>
              </div>
              <div class="recent-searches" v-if="recentSearches.length">
                <div class="recent-header">Recent Searches</div>
                <div class="recent-list">
                  <button
                    v-for="recent in recentSearches"
                    :key="recent"
                    @click="selectRecentSearch(recent)"
                    class="recent-item"
                  >
                    <span class="recent-icon">🕒</span>
                    <span class="recent-text">{{ recent }}</span>
                    <button @click.stop="removeRecentSearch(recent)" class="remove-recent">✕</button>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Icons -->
        <div class="header-actions">
          <!-- Wishlist -->
          <button class="action-btn wishlist-btn" @click="showWishlist" title="Wishlist">
            <span class="action-icon">❤️</span>
            <span v-if="wishlistCount > 0" class="badge-count wishlist-badge">{{ wishlistCount }}</span>
            <span class="action-label">Wishlist</span>
          </button>
          
          <!-- Cart -->
          <button class="action-btn cart-btn" @click="toggleCart" title="Shopping Cart">
            <span class="action-icon">🛒</span>
            <span v-if="cartItemCount > 0" class="badge-count cart-badge">{{ cartItemCount }}</span>
            <span class="action-label">Cart</span>
          </button>
          
          <!-- Profile/Auth -->
          <button class="action-btn profile-btn" @click="showProfile" title="Account">
            <span class="action-icon">{{ user.isLoggedIn ? '👤' : '🔑' }}</span>
            <span class="action-label">{{ user.isLoggedIn ? 'Account' : 'Sign In' }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Search Overlay -->
    <div v-if="mobileSearchOpen" class="mobile-search-overlay" @click="closeMobileSearch">
      <div class="mobile-search-content" @click.stop>
        <div class="mobile-search-header">
          <button @click="closeMobileSearch" class="mobile-back-btn">←</button>
          <input
            ref="mobileSearchInput"
            type="text"
            :value="searchQuery"
            @input="handleSearchInput"
            placeholder="Search for shoes..."
            class="mobile-search-input"
          >
          <button class="mobile-voice-btn" @click="startVoiceSearch">🎤</button>
        </div>
        <div class="mobile-suggestions">
          <!-- Same suggestions as desktop -->
          <div v-for="suggestion in searchSuggestions" :key="suggestion.id" class="mobile-suggestion">
            <span class="suggestion-icon">{{ suggestion.icon }}</span>
            <span class="suggestion-text">{{ suggestion.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'EnhancedHeader',
  data() {
    return {
      searchFocused: false,
      showSuggestions: false,
      mobileSearchOpen: false,
      isRecording: false,
      recentSearches: ['Nike Air Max', 'Adidas Ultraboost', 'Running shoes'],
      searchSuggestions: [
        { id: 1, text: 'Nike Air Max 270', category: 'Sneakers', icon: '👟', trending: true },
        { id: 2, text: 'Adidas Ultraboost', category: 'Running', icon: '🏃', trending: false },
        { id: 3, text: 'Jordan 1 Retro', category: 'Basketball', icon: '🏀', trending: true },
        { id: 4, text: 'Converse Chuck Taylor', category: 'Casual', icon: '👕', trending: false },
        { id: 5, text: 'Vans Old Skool', category: 'Skateboard', icon: '🛹', trending: false },
        { id: 6, text: 'New Balance 990', category: 'Lifestyle', icon: '✨', trending: false }
      ]
    }
  },
  computed: {
    ...mapState(['searchQuery', 'user']),
    ...mapGetters(['cartItemCount']),
    wishlistCount() {
      return this.user.favorites.length
    }
  },
  methods: {
    goHome() {
      // Navigate to home
      console.log('Navigate to home')
    },
    handleSearchInput(event) {
      const query = event.target.value
      this.$store.dispatch('setSearchQuery', query)
      this.showSuggestions = query.length > 0 || this.searchFocused
    },
    onSearchFocus() {
      this.searchFocused = true
      this.showSuggestions = true
    },
    onSearchBlur() {
      // Delay to allow clicking on suggestions
      setTimeout(() => {
        this.searchFocused = false
        this.showSuggestions = false
      }, 200)
    },
    selectSuggestion(suggestion) {
      this.$store.dispatch('setSearchQuery', suggestion.text)
      this.showSuggestions = false
      this.addToRecentSearches(suggestion.text)
    },
    selectRecentSearch(search) {
      this.$store.dispatch('setSearchQuery', search)
      this.showSuggestions = false
    },
    removeRecentSearch(search) {
      this.recentSearches = this.recentSearches.filter(item => item !== search)
    },
    addToRecentSearches(search) {
      if (!this.recentSearches.includes(search)) {
        this.recentSearches.unshift(search)
        if (this.recentSearches.length > 5) {
          this.recentSearches.pop()
        }
      }
    },
    clearSearch() {
      this.$store.dispatch('setSearchQuery', '')
    },
    startVoiceSearch() {
      this.isRecording = true
      // Simulate voice recording
      setTimeout(() => {
        this.isRecording = false
        // Simulate voice result
        this.$store.dispatch('setSearchQuery', 'Nike running shoes')
      }, 2000)
    },
    showWishlist() {
      console.log('Show wishlist')
      // Would open wishlist modal or navigate to wishlist page
    },
    toggleCart() {
      const cartSidebar = document.querySelector('.cart-sidebar')
      if (cartSidebar) {
        cartSidebar.classList.toggle('open')
      }
    },
    showProfile() {
      if (this.user.isLoggedIn) {
        console.log('Show user profile')
        // Would show profile menu
      } else {
        this.$emit('show-auth')
      }
    },
    openMobileSearch() {
      this.mobileSearchOpen = true
      this.$nextTick(() => {
        this.$refs.mobileSearchInput?.focus()
      })
    },
    closeMobileSearch() {
      this.mobileSearchOpen = false
    }
  }
}
</script>

<style scoped>
.enhanced-header {
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.brand-name {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-section {
  flex: 1;
  max-width: 600px;
  position: relative;
}

.search-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.search-wrapper.focused {
  transform: translateY(-2px);
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-wrapper.focused .search-input-container {
  background: white;
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.search-icon {
  padding: 0 16px;
  font-size: 16px;
  color: #6c757d;
}

.search-input {
  flex: 1;
  padding: 16px 8px;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.voice-btn {
  padding: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
  transition: all 0.2s ease;
  margin-right: 4px;
}

.voice-btn:hover {
  background: #f0f0f0;
}

.voice-btn.recording {
  background: #ff6b6b;
  color: white;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.clear-btn {
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 16px;
  border-radius: 50%;
  margin-right: 8px;
}

.clear-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestions-header {
  padding: 16px 20px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.suggestions-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestions-list {
  padding: 8px 0;
}

.suggestion-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  gap: 12px;
}

.suggestion-item:hover {
  background: #f8f9fa;
}

.suggestion-icon {
  font-size: 16px;
}

.suggestion-content {
  flex: 1;
  text-align: left;
}

.suggestion-text {
  display: block;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.suggestion-category {
  display: block;
  font-size: 12px;
  color: #999;
}

.suggestion-trend {
  font-size: 14px;
}

.recent-searches {
  border-top: 1px solid #f0f0f0;
  padding: 8px 0;
}

.recent-header {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recent-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 20px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  gap: 12px;
}

.recent-item:hover {
  background: #f8f9fa;
}

.recent-icon {
  font-size: 14px;
  color: #999;
}

.recent-text {
  flex: 1;
  text-align: left;
  font-size: 14px;
  color: #666;
}

.remove-recent {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  font-size: 12px;
}

.remove-recent:hover {
  background: #f0f0f0;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
  min-width: 60px;
}

.action-btn:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 20px;
  position: relative;
}

.action-label {
  font-size: 11px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 0.3s ease;
}

.wishlist-badge {
  background: #ff6b6b;
}

.cart-badge {
  background: #667eea;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Mobile Search Overlay */
.mobile-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: none;
}

.mobile-search-content {
  background: white;
  height: 100%;
  padding: 20px;
}

.mobile-search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.mobile-back-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

.mobile-search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
}

.mobile-voice-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
}

.mobile-suggestion {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    gap: 16px;
  }
  
  .search-section {
    max-width: 400px;
  }
  
  .action-label {
    display: none;
  }
  
  .action-btn {
    min-width: 44px;
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .header-content {
    gap: 12px;
  }
  
  .brand-name {
    display: none;
  }
  
  .logo-icon {
    font-size: 28px;
  }
  
  .search-input-container {
    border-radius: 12px;
  }
  
  .search-input {
    font-size: 14px;
    padding: 12px 8px;
  }
  
  .action-icon {
    font-size: 18px;
  }
  
  .mobile-search-overlay {
    display: flex;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 12px 0;
  }
  
  .search-section {
    display: none; /* Will show mobile search overlay instead */
  }
  
  .header-actions {
    gap: 4px;
  }
  
  .action-btn {
    padding: 6px;
    min-width: 40px;
  }
}
</style>
