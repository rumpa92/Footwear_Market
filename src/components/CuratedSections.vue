<template>
  <div class="curated-sections">
    <div
      v-for="section in sections"
      :key="section.id"
      class="section"
      :class="{ 'loading': section.loading }"
    >
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="header-main">
            <h2 class="section-title">
              <span class="title-icon">{{ section.icon }}</span>
              {{ section.title }}
            </h2>
            <p class="section-subtitle" v-if="section.subtitle">{{ section.subtitle }}</p>
          </div>
          <div class="header-actions">
            <button 
              v-if="section.filterOptions"
              class="filter-toggle"
              @click="toggleSectionFilter(section.id)"
              :class="{ active: activeSectionFilter === section.id }"
            >
              <span>Filter</span>
              <span class="filter-icon">⚙️</span>
            </button>
            <button class="view-all-btn" @click="viewAll(section)">
              View All
              <span class="arrow">→</span>
            </button>
          </div>
        </div>
        
        <!-- Mini Filters -->
        <div 
          v-if="section.filterOptions && activeSectionFilter === section.id"
          class="section-filters"
        >
          <button
            v-for="filter in section.filterOptions"
            :key="filter.id"
            class="mini-filter"
            :class="{ active: section.activeFilter === filter.id }"
            @click="applySectionFilter(section.id, filter.id)"
          >
            {{ filter.name }}
          </button>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div class="products-container">
        <div 
          class="products-scroll"
          :ref="`scroll-${section.id}`"
          @scroll="checkScrollPosition(section.id)"
        >
          <div class="products-grid">
            <!-- Loading Skeletons -->
            <div v-if="section.loading" class="skeleton-grid">
              <div 
                v-for="n in 4" 
                :key="`skeleton-${n}`"
                class="product-skeleton"
              >
                <div class="skeleton-image"></div>
                <div class="skeleton-text">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line medium"></div>
                </div>
              </div>
            </div>
            
            <!-- Actual Products -->
            <EnhancedProductCard
              v-for="product in section.products"
              :key="`${section.id}-${product.id}`"
              :product="product"
              :section="section.id"
              @add-to-cart="handleAddToCart"
              @toggle-favorite="handleToggleFavorite"
              @quick-view="handleQuickView"
              @long-press="handleLongPress"
            />
            
            <!-- Load More Trigger -->
            <div 
              v-if="section.hasMore && !section.loading"
              class="load-more-trigger"
              ref="loadMoreTrigger"
            >
              <button @click="loadMore(section.id)" class="load-more-btn">
                Load More
                <span class="load-icon">⟳</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Scroll Navigation -->
        <button 
          v-if="section.canScrollLeft"
          class="scroll-nav left"
          @click="scrollSection(section.id, 'left')"
        >
          ‹
        </button>
        <button 
          v-if="section.canScrollRight"
          class="scroll-nav right"
          @click="scrollSection(section.id, 'right')"
        >
          ›
        </button>
      </div>
      
      <!-- Section Footer with Stats -->
      <div class="section-footer" v-if="section.stats">
        <div class="section-stats">
          <div class="stat" v-for="stat in section.stats" :key="stat.label">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import EnhancedProductCard from './EnhancedProductCard.vue'

export default {
  name: 'CuratedSections',
  components: {
    EnhancedProductCard
  },
  data() {
    return {
      activeSectionFilter: null,
      sections: [
        {
          id: 'new-arrivals',
          title: 'New Arrivals',
          subtitle: 'Fresh styles just dropped',
          icon: '✨',
          loading: false,
          products: [],
          hasMore: true,
          canScrollLeft: false,
          canScrollRight: true,
          filterOptions: [
            { id: 'all', name: 'All' },
            { id: 'this-week', name: 'This Week' },
            { id: 'this-month', name: 'This Month' }
          ],
          activeFilter: 'all',
          stats: [
            { label: 'New This Week', value: '24' },
            { label: 'Total Items', value: '156' }
          ]
        },
        {
          id: 'trending',
          title: 'Trending Now',
          subtitle: 'What everyone\'s talking about',
          icon: '🔥',
          loading: false,
          products: [],
          hasMore: true,
          canScrollLeft: false,
          canScrollRight: true,
          filterOptions: [
            { id: 'all', name: 'All' },
            { id: 'today', name: 'Today' },
            { id: 'this-week', name: 'This Week' }
          ],
          activeFilter: 'all',
          stats: [
            { label: 'Trending Score', value: '95%' },
            { label: 'Social Mentions', value: '2.3k' }
          ]
        },
        {
          id: 'top-brands',
          title: 'Top Brands',
          subtitle: 'Premium quality from trusted names',
          icon: '👑',
          loading: false,
          products: [],
          hasMore: true,
          canScrollLeft: false,
          canScrollRight: true,
          filterOptions: [
            { id: 'all', name: 'All Brands' },
            { id: 'nike', name: 'Nike' },
            { id: 'adidas', name: 'Adidas' },
            { id: 'jordan', name: 'Jordan' }
          ],
          activeFilter: 'all'
        },
        {
          id: 'recommended',
          title: 'Recommended for You',
          subtitle: 'Personalized picks based on your preferences',
          icon: '🎯',
          loading: false,
          products: [],
          hasMore: true,
          canScrollLeft: false,
          canScrollRight: true,
          stats: [
            { label: 'Match Score', value: '92%' },
            { label: 'Based on', value: 'Your History' }
          ]
        },
        {
          id: 'sale',
          title: 'Special Offers',
          subtitle: 'Limited time deals you don\'t want to miss',
          icon: '💰',
          loading: false,
          products: [],
          hasMore: true,
          canScrollLeft: false,
          canScrollRight: true,
          filterOptions: [
            { id: 'all', name: 'All Deals' },
            { id: 'flash', name: 'Flash Sale' },
            { id: 'clearance', name: 'Clearance' }
          ],
          activeFilter: 'all',
          stats: [
            { label: 'Avg Discount', value: '35%' },
            { label: 'Items on Sale', value: '89' }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters(['onSaleProducts', 'newProducts', 'featuredProducts'])
  },
  mounted() {
    this.loadSectionData()
    this.setupIntersectionObserver()
  },
  methods: {
    async loadSectionData() {
      // Simulate loading for each section
      for (const section of this.sections) {
        section.loading = true
        await this.loadSectionProducts(section.id)
      }
    },
    async loadSectionProducts(sectionId) {
      const section = this.sections.find(s => s.id === sectionId)
      if (!section) return
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
      
      let products = []
      
      switch (sectionId) {
        case 'new-arrivals':
          products = this.newProducts.slice(0, 8)
          break
        case 'trending':
          products = this.products
            .filter(p => p.rating >= 4.5)
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, 8)
          break
        case 'top-brands':
          products = this.products
            .filter(p => ['Nike', 'Adidas', 'Jordan'].includes(p.brand))
            .slice(0, 8)
          break
        case 'recommended':
          products = this.featuredProducts.slice(0, 8)
          break
        case 'sale':
          products = this.onSaleProducts.slice(0, 8)
          break
      }
      
      // Add enhanced properties for product cards
      section.products = products.map(product => ({
        ...product,
        quickAddAvailable: Math.random() > 0.5,
        sizePreference: Math.random() > 0.7 ? '9' : null,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        lastViewed: Math.random() > 0.8
      }))
      
      section.loading = false
      this.checkScrollButtons(sectionId)
    },
    toggleSectionFilter(sectionId) {
      this.activeSectionFilter = this.activeSectionFilter === sectionId ? null : sectionId
    },
    applySectionFilter(sectionId, filterId) {
      const section = this.sections.find(s => s.id === sectionId)
      if (section) {
        section.activeFilter = filterId
        section.loading = true
        // Reload section with filter
        setTimeout(() => {
          this.loadSectionProducts(sectionId)
        }, 300)
      }
    },
    viewAll(section) {
      console.log('View all:', section.title)
      this.$emit('view-all', section)
    },
    loadMore(sectionId) {
      const section = this.sections.find(s => s.id === sectionId)
      if (section) {
        section.loading = true
        // Simulate loading more products
        setTimeout(() => {
          const newProducts = this.products.slice(section.products.length, section.products.length + 4)
          section.products.push(...newProducts)
          section.loading = false
          section.hasMore = section.products.length < 20 // Limit for demo
        }, 1000)
      }
    },
    checkScrollPosition(sectionId) {
      this.checkScrollButtons(sectionId)
    },
    checkScrollButtons(sectionId) {
      const container = this.$refs[`scroll-${sectionId}`]?.[0]
      if (container) {
        const section = this.sections.find(s => s.id === sectionId)
        if (section) {
          section.canScrollLeft = container.scrollLeft > 0
          section.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth)
        }
      }
    },
    scrollSection(sectionId, direction) {
      const container = this.$refs[`scroll-${sectionId}`]?.[0]
      if (container) {
        const scrollAmount = 300
        const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
        container.scrollBy({ left: scrollLeft, behavior: 'smooth' })
        
        setTimeout(() => {
          this.checkScrollButtons(sectionId)
        }, 300)
      }
    },
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.dataset.sectionId
            if (sectionId) {
              this.loadMore(sectionId)
            }
          }
        })
      }, options)
      
      // Observe load more triggers
      this.$nextTick(() => {
        const triggers = this.$refs.loadMoreTrigger
        if (triggers) {
          if (Array.isArray(triggers)) {
            triggers.forEach(trigger => observer.observe(trigger))
          } else {
            observer.observe(triggers)
          }
        }
      })
    },
    handleAddToCart(payload) {
      this.$store.dispatch('addToCart', payload)
      this.showToast('Added to cart!', 'success')
    },
    handleToggleFavorite(productId) {
      this.$store.dispatch('toggleFavorite', productId)
    },
    handleQuickView(product) {
      this.$emit('quick-view', product)
    },
    handleLongPress(product) {
      this.$emit('long-press', product)
    },
    showToast(message, type) {
      // Would implement toast notification
      console.log(`Toast: ${message} (${type})`)
    }
  }
}
</script>

<style scoped>
.curated-sections {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section {
  position: relative;
}

.section.loading {
  pointer-events: none;
}

/* Section Header */
.section-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-main {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.title-icon {
  font-size: 32px;
}

.section-subtitle {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.filter-toggle:hover {
  border-color: #667eea;
  background: #f0f2ff;
}

.filter-toggle.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.arrow {
  transition: transform 0.2s ease;
}

.view-all-btn:hover .arrow {
  transform: translateX(3px);
}

.section-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.mini-filter {
  padding: 6px 16px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.mini-filter:hover {
  border-color: #667eea;
  color: #667eea;
}

.mini-filter.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Products Container */
.products-container {
  position: relative;
}

.products-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.products-scroll::-webkit-scrollbar {
  display: none;
}

.products-grid {
  display: flex;
  gap: 20px;
  padding: 8px 0;
  min-width: max-content;
}

.skeleton-grid {
  display: flex;
  gap: 20px;
}

.product-skeleton {
  width: 280px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  margin-bottom: 16px;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-line.medium {
  width: 80%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.load-more-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  flex-shrink: 0;
}

.load-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: #f8f9fa;
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #666;
}

.load-more-btn:hover {
  background: #e9ecef;
  border-color: #667eea;
  color: #667eea;
}

.load-icon {
  font-size: 16px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.scroll-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.scroll-nav:hover {
  border-color: #667eea;
  background: #f0f2ff;
  transform: translateY(-50%) scale(1.05);
}

.scroll-nav.left {
  left: -24px;
}

.scroll-nav.right {
  right: -24px;
}

/* Section Footer */
.section-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.section-stats {
  display: flex;
  gap: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .curated-sections {
    gap: 40px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .title-icon {
    font-size: 28px;
  }
  
  .products-grid {
    gap: 16px;
  }
  
  .scroll-nav {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .curated-sections {
    gap: 32px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .section-subtitle {
    font-size: 14px;
  }
  
  .view-all-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .scroll-nav {
    display: none; /* Hide on mobile */
  }
  
  .section-stats {
    justify-content: center;
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    gap: 12px;
    padding: 4px 0;
  }
  
  .product-skeleton {
    width: 240px;
  }
  
  .section-filters {
    gap: 6px;
  }
  
  .mini-filter {
    padding: 4px 12px;
    font-size: 11px;
  }
  
  .load-more-trigger {
    width: 160px;
  }
  
  .load-more-btn {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
