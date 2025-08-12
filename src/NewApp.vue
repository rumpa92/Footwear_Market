<template>
  <div id="app" class="new-app">
    <!-- Enhanced Header with all features -->
    <EnhancedHeader 
      @show-auth="showAuthModal"
      @location-search="showLocationModal"
      @voice-search="handleVoiceSearch"
    />
    
    <!-- Location Detection Modal -->
    <LocationModal
      :visible="locationModalVisible"
      @close="hideLocationModal"
      @location-selected="handleLocationSelected"
    />
    
    <!-- Promo Strip -->
    <PromoStrip 
      @promo-click="handlePromoClick"
      @all-promos-dismissed="hidePromoStrip"
    />
    
    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Hero Carousel - Seasonal Campaign Banners -->
        <HeroCarousel 
          @cta-click="handleHeroCTA"
        />
        
        <!-- Category Navigation Chips -->
        <CategoryChips 
          @category-selected="handleCategorySelected"
        />
        
        <!-- Quick Filters and Shortcuts -->
        <QuickFilters 
          @filters-changed="handleFiltersChanged"
          @show-recent="handleShowRecent"
          @open-try-on="openTryOnFeature"
          @product-selected="handleProductSelected"
        />
        
        <!-- Personalized Homepage Sections -->
        <div class="homepage-sections">
          <!-- AI-Powered Personalized Recommendations -->
          <PersonalizedSection 
            v-if="user.isLoggedIn"
            @view-product="handleViewProduct"
            @add-to-cart="handleAddToCart"
          />
          
          <!-- Curated Product Sections -->
          <CuratedSections 
            @view-all="handleViewAll"
            @quick-view="showQuickView"
            @long-press="showQuickView"
            @add-to-cart="handleAddToCart"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <FooterComponent />
    
    <!-- Floating Elements (Chatbot + Mobile Nav) -->
    <FloatingElements 
      @view-product="handleViewProduct"
      @navigate="handleNavigation"
      @show-auth="showAuthModal"
    />
    
    <!-- Modals -->
    <!-- Enhanced Authentication Modal -->
    <EnhancedAuthModal 
      :visible="authModalVisible"
      @close="hideAuthModal"
      @signin-success="handleSignInSuccess"
      @signup-success="handleSignUpSuccess"
      @social-login="handleSocialLogin"
    />
    
    <!-- Quick View Modal -->
    <QuickViewModal
      :visible="quickViewVisible"
      :product="selectedProduct"
      @close="hideQuickView"
      @add-to-cart="handleAddToCart"
      @toggle-favorite="handleToggleFavorite"
    />
    
    <!-- Enhanced Cart Sidebar -->
    <CartSidebar />
    
    <!-- Guest Browsing Prompt -->
    <GuestPrompt
      :visible="showGuestPrompt"
      @close="hideGuestPrompt"
      @signup="showAuthModal"
      @continue-guest="continueAsGuest"
    />
    
    <!-- Voice Search Overlay -->
    <VoiceSearchOverlay
      :visible="voiceSearchActive"
      @close="closeVoiceSearch"
      @voice-result="handleVoiceResult"
    />
    
    <!-- Try-On AR Feature -->
    <TryOnModal
      :visible="tryOnModalVisible"
      :product="selectedProduct"
      @close="closeTryOnModal"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// Enhanced Components
import EnhancedHeader from './components/EnhancedHeader.vue'
import HeroCarousel from './components/HeroCarousel.vue'
import PromoStrip from './components/PromoStrip.vue'
import CategoryChips from './components/CategoryChips.vue'
import QuickFilters from './components/QuickFilters.vue'
import CuratedSections from './components/CuratedSections.vue'
import FloatingElements from './components/FloatingElements.vue'
import FooterComponent from './components/FooterComponent.vue'

// Modals and Features
import EnhancedAuthModal from './components/EnhancedAuthModal.vue'
import LocationModal from './components/LocationModal.vue'
import QuickViewModal from './components/QuickViewModal.vue'
import CartSidebar from './components/CartSidebar.vue'
import GuestPrompt from './components/GuestPrompt.vue'
import VoiceSearchOverlay from './components/VoiceSearchOverlay.vue'
import TryOnModal from './components/TryOnModal.vue'
import PersonalizedSection from './components/PersonalizedSection.vue'

export default {
  name: 'NewApp',
  components: {
    EnhancedHeader,
    HeroCarousel,
    PromoStrip,
    CategoryChips,
    QuickFilters,
    CuratedSections,
    FloatingElements,
    FooterComponent,
    EnhancedAuthModal,
    LocationModal,
    QuickViewModal,
    CartSidebar,
    GuestPrompt,
    VoiceSearchOverlay,
    TryOnModal,
    PersonalizedSection
  },
  data() {
    return {
      // Modal States
      authModalVisible: false,
      locationModalVisible: false,
      quickViewVisible: false,
      tryOnModalVisible: false,
      voiceSearchActive: false,
      showGuestPrompt: false,
      
      // Selected Items
      selectedProduct: {},
      
      // User Preferences
      userLocation: null,
      voiceSearchSupported: false,
      
      // App State
      isLoading: false,
      currentPage: 'home'
    }
  },
  computed: {
    ...mapState(['user', 'searchQuery', 'loading']),
    ...mapGetters(['cartItemCount', 'filteredProducts'])
  },
  mounted() {
    this.initializeApp()
    this.detectVoiceSupport()
    this.setupGuestBrowsingLogic()
    this.loadUserPreferences()
  },
  methods: {
    // App Initialization
    async initializeApp() {
      this.isLoading = true
      
      try {
        // Load products
        await this.$store.dispatch('loadProducts')
        
        // Auto-detect location if permissions granted
        await this.autoDetectLocation()
        
        // Load personalized recommendations if user is logged in
        if (this.user.isLoggedIn) {
          await this.loadPersonalizedContent()
        }
        
      } catch (error) {
        console.error('App initialization failed:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    // Authentication Methods
    showAuthModal() {
      this.authModalVisible = true
    },
    hideAuthModal() {
      this.authModalVisible = false
    },
    async handleSignInSuccess(userData) {
      console.log('Sign in successful:', userData)
      await this.$store.dispatch('loginUser', userData)
      this.hideAuthModal()
      await this.loadPersonalizedContent()
      this.showSuccessToast('Welcome back!')
    },
    async handleSignUpSuccess(userData) {
      console.log('Sign up successful:', userData)
      await this.$store.dispatch('loginUser', { 
        name: userData.firstName + ' ' + userData.lastName,
        email: userData.email 
      })
      this.hideAuthModal()
      this.showSuccessToast('Account created successfully!')
    },
    handleSocialLogin(provider) {
      console.log('Social login with:', provider)
      // Implement actual social login
    },
    
    // Location Detection Methods
    showLocationModal() {
      this.locationModalVisible = true
    },
    hideLocationModal() {
      this.locationModalVisible = false
    },
    async autoDetectLocation() {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false
            })
          })
          
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            city: 'Your Location', // Would use reverse geocoding
            detected: true
          }
          
          this.handleLocationSelected(location)
        } catch (error) {
          console.log('Location detection failed:', error.message)
        }
      }
    },
    handleLocationSelected(location) {
      this.userLocation = location
      console.log('Location selected:', location)
      
      // Update shipping estimates and local offers
      this.updateShippingEstimates(location)
      this.loadLocalOffers(location)
      
      this.hideLocationModal()
    },
    
    // Voice Search Methods
    detectVoiceSupport() {
      this.voiceSearchSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    },
    handleVoiceSearch() {
      if (this.voiceSearchSupported) {
        this.voiceSearchActive = true
      } else {
        this.showErrorToast('Voice search is not supported in your browser')
      }
    },
    closeVoiceSearch() {
      this.voiceSearchActive = false
    },
    handleVoiceResult(result) {
      console.log('Voice search result:', result)
      this.$store.dispatch('setSearchQuery', result)
      this.closeVoiceSearch()
    },
    
    // Guest Browsing Logic
    setupGuestBrowsingLogic() {
      // Monitor user actions that require authentication
      this.$root.$on('require-auth', (action) => {
        if (!this.user.isLoggedIn) {
          this.showGuestPrompt = true
        }
      })
    },
    hideGuestPrompt() {
      this.showGuestPrompt = false
    },
    continueAsGuest() {
      this.hideGuestPrompt()
      // Allow guest to continue with limited functionality
    },
    
    // Product Interaction Methods
    handleViewProduct(product) {
      this.selectedProduct = product
      this.currentPage = 'product'
      // Would navigate to product detail page
      console.log('View product:', product.name)
    },
    showQuickView(product) {
      this.selectedProduct = product
      this.quickViewVisible = true
    },
    hideQuickView() {
      this.quickViewVisible = false
      this.selectedProduct = {}
    },
    handleAddToCart(payload) {
      if (!this.user.isLoggedIn) {
        // Allow guest cart
        this.$store.dispatch('addToCart', payload)
        this.showSuccessToast('Added to cart!')
      } else {
        this.$store.dispatch('addToCart', payload)
        this.showSuccessToast('Added to cart!')
      }
    },
    handleToggleFavorite(productId) {
      if (!this.user.isLoggedIn) {
        this.$root.$emit('require-auth', 'wishlist')
        return
      }
      this.$store.dispatch('toggleFavorite', productId)
    },
    
    // Navigation and Filter Methods
    handleNavigation(route) {
      this.currentPage = route
      console.log('Navigate to:', route)
    },
    handleCategorySelected(category) {
      console.log('Category selected:', category)
      this.$store.dispatch('setFilters', { category: category.id })
    },
    handleFiltersChanged(filters) {
      console.log('Filters changed:', filters)
      // Apply filters to products
    },
    handleHeroCTA(cta) {
      console.log('Hero CTA clicked:', cta)
      // Handle different CTA actions
      switch (cta.action) {
        case 'category':
          this.handleCategoryNavigation(cta.target)
          break
        case 'browse':
          this.scrollToProducts()
          break
        case 'info':
          this.showInfoModal(cta.target)
          break
      }
    },
    
    // Personalized Content Methods
    async loadPersonalizedContent() {
      try {
        // Load AI-powered recommendations
        console.log('Loading personalized content for user:', this.user.name)
        // Would call ML recommendation API
      } catch (error) {
        console.error('Failed to load personalized content:', error)
      }
    },
    
    // Try-On Feature Methods
    openTryOnFeature() {
      if (this.selectedProduct.id) {
        this.tryOnModalVisible = true
      } else {
        this.showErrorToast('Please select a product to try on')
      }
    },
    closeTryOnModal() {
      this.tryOnModalVisible = false
    },
    
    // Promo and Marketing Methods
    handlePromoClick(promo) {
      console.log('Promo clicked:', promo)
      switch (promo.type) {
        case 'shipping':
          this.showShippingInfo()
          break
        case 'sale':
          this.navigateToSale()
          break
        case 'signup':
          this.showAuthModal()
          break
        case 'app':
          this.showAppDownload()
          break
      }
    },
    hidePromoStrip() {
      // Hide promo strip when all promos are dismissed
      const promoStrip = document.querySelector('.promo-strip')
      if (promoStrip) {
        promoStrip.style.display = 'none'
      }
    },
    
    // Utility Methods
    updateShippingEstimates(location) {
      // Update shipping costs and delivery times based on location
      console.log('Updating shipping estimates for:', location.city)
    },
    loadLocalOffers(location) {
      // Load location-specific offers and promotions
      console.log('Loading local offers for:', location.city)
    },
    loadUserPreferences() {
      // Load saved user preferences from localStorage
      const preferences = localStorage.getItem('userPreferences')
      if (preferences) {
        const parsed = JSON.parse(preferences)
        this.userLocation = parsed.location
      }
    },
    saveUserPreferences() {
      // Save user preferences to localStorage
      const preferences = {
        location: this.userLocation
      }
      localStorage.setItem('userPreferences', JSON.stringify(preferences))
    },
    
    // UI Helper Methods
    scrollToProducts() {
      const productsSection = document.querySelector('.curated-sections')
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' })
      }
    },
    showSuccessToast(message) {
      // Implement toast notification system
      console.log('Success:', message)
      this.createToast(message, 'success')
    },
    showErrorToast(message) {
      console.log('Error:', message)
      this.createToast(message, 'error')
    },
    createToast(message, type) {
      // Create floating toast notification
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: toastSlide 3s ease-out forwards;
      `
      
      document.body.appendChild(toast)
      
      // Add animation styles if not exists
      if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style')
        style.id = 'toast-styles'
        style.textContent = `
          @keyframes toastSlide {
            0% {
              opacity: 0;
              transform: translateX(100%);
            }
            10%, 90% {
              opacity: 1;
              transform: translateX(0);
            }
            100% {
              opacity: 0;
              transform: translateX(100%);
            }
          }
        `
        document.head.appendChild(style)
      }
      
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    },
    
    // Event Handlers
    handleViewAll(section) {
      console.log('View all:', section.title)
      // Navigate to category page
    },
    handleShowRecent(show) {
      console.log('Show recent products:', show)
      // Filter to show recently viewed products
    },
    handleProductSelected(product) {
      this.handleViewProduct(product)
    }
  },
  
  // Lifecycle cleanup
  beforeDestroy() {
    this.saveUserPreferences()
  }
}
</script>

<style scoped>
.new-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.main-content {
  flex: 1;
  padding: 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.homepage-sections {
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-bottom: 80px;
}

/* Loading States */
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 18px;
  color: #666;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .container {
    padding: 0 16px;
  }
  
  .homepage-sections {
    gap: 32px;
    margin-bottom: 60px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 12px;
  }
  
  .homepage-sections {
    gap: 24px;
    margin-bottom: 40px;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .new-app {
    background: #fff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
