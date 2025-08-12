<template>
  <div class="category-navigation">
    <div class="category-nav-container">
      <div class="category-nav-header">
        <h3 class="nav-title">Shop by Category</h3>
      </div>
      
      <div class="category-nav-wrapper" ref="categoryWrapper">
        <div class="category-nav-scroll" ref="categoryScroll" @scroll="handleScroll">
          <div class="category-nav-items" ref="categoryItems">
            <button
              v-for="category in categories"
              :key="category.id"
              :class="['category-nav-item', { active: activeCategory === category.id }]"
              @click="selectCategory(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- Navigation arrows for desktop -->
        <button 
          v-if="showLeftArrow" 
          class="nav-arrow nav-arrow-left"
          @click="scrollLeft"
        >
          &#8249;
        </button>
        <button 
          v-if="showRightArrow" 
          class="nav-arrow nav-arrow-right"
          @click="scrollRight"
        >
          &#8250;
        </button>
      </div>
      
      <!-- Mobile scroll indicators -->
      <div class="scroll-indicators" v-if="isMobile">
        <div 
          v-for="(dot, index) in scrollDots" 
          :key="index"
          :class="['scroll-dot', { active: currentScrollDot === index }]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CategoryNavigation',
  data() {
    return {
      categories: [
        { id: 'all', name: 'All', icon: '👟' },
        { id: 'men', name: 'Men', icon: '👨' },
        { id: 'women', name: 'Women', icon: '👩' },
        { id: 'kids', name: 'Kids', icon: '👶' },
        { id: 'sports', name: 'Sports', icon: '⚽' },
        { id: 'casual', name: 'Casual', icon: '👟' },
        { id: 'formal', name: 'Formal', icon: '👞' },
        { id: 'sneakers', name: 'Sneakers', icon: '👟' },
        { id: 'boots', name: 'Boots', icon: '🥾' },
        { id: 'sandals', name: 'Sandals', icon: '👡' }
      ],
      showLeftArrow: false,
      showRightArrow: true,
      isMobile: false,
      scrollDots: 3,
      currentScrollDot: 0,
      isScrolling: false
    }
  },
  computed: {
    ...mapState(['filters']),
    activeCategory() {
      return this.filters.category || 'all'
    }
  },
  mounted() {
    this.checkMobile()
    this.updateArrows()
    window.addEventListener('resize', this.handleResize)
    
    // Add touch/swipe support for mobile
    this.addTouchSupport()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    selectCategory(categoryId) {
      this.$store.dispatch('setFilters', { category: categoryId })
      this.$emit('category-selected', categoryId)
    },
    
    scrollLeft() {
      const container = this.$refs.categoryScroll
      container.scrollBy({ 
        left: -200, 
        behavior: 'smooth' 
      })
    },
    
    scrollRight() {
      const container = this.$refs.categoryScroll
      container.scrollBy({ 
        left: 200, 
        behavior: 'smooth' 
      })
    },
    
    handleScroll() {
      if (this.isScrolling) return
      
      this.updateArrows()
      
      if (this.isMobile) {
        this.updateScrollDots()
      }
    },
    
    updateArrows() {
      const container = this.$refs.categoryScroll
      if (!container) return
      
      this.showLeftArrow = container.scrollLeft > 10
      this.showRightArrow = 
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    },
    
    updateScrollDots() {
      const container = this.$refs.categoryScroll
      if (!container) return
      
      const scrollPercent = container.scrollLeft / (container.scrollWidth - container.clientWidth)
      this.currentScrollDot = Math.round(scrollPercent * (this.scrollDots - 1))
    },
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    
    handleResize() {
      this.checkMobile()
      this.updateArrows()
    },
    
    addTouchSupport() {
      const container = this.$refs.categoryScroll
      if (!container) return
      
      let startX = 0
      let scrollLeft = 0
      let isDown = false
      
      container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - container.offsetLeft
        scrollLeft = container.scrollLeft
        isDown = true
      })
      
      container.addEventListener('touchmove', (e) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.touches[0].pageX - container.offsetLeft
        const walk = (x - startX) * 2
        container.scrollLeft = scrollLeft - walk
      })
      
      container.addEventListener('touchend', () => {
        isDown = false
      })
    }
  }
}
</script>

<style scoped>
.category-navigation {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
}

.category-nav-container {
  padding: 20px;
}

.category-nav-header {
  margin-bottom: 16px;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.category-nav-wrapper {
  position: relative;
}

.category-nav-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.category-nav-scroll::-webkit-scrollbar {
  display: none;
}

.category-nav-items {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  min-width: max-content;
}

.category-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  white-space: nowrap;
  flex-shrink: 0;
}

.category-nav-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.category-nav-item.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.category-icon {
  font-size: 20px;
  line-height: 1;
}

.category-name {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 10;
}

.nav-arrow:hover {
  background: #667eea;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow-left {
  left: -12px;
}

.nav-arrow-right {
  right: -12px;
}

.scroll-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.scroll-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e1e5e9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.scroll-dot.active {
  background: #667eea;
  transform: scale(1.2);
}

/* Sticky positioning when scrolled */
.category-navigation.sticky {
  position: sticky;
  top: 70px;
  z-index: 999;
  border-radius: 0;
  margin-bottom: 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}

.category-navigation.sticky .category-nav-container {
  padding: 12px 20px;
}

.category-navigation.sticky .nav-title {
  display: none;
}

.category-navigation.sticky .category-nav-items {
  padding: 4px 0;
}

.category-navigation.sticky .category-nav-item {
  min-width: 70px;
  padding: 8px 12px;
}

.category-navigation.sticky .category-icon {
  font-size: 16px;
}

.category-navigation.sticky .category-name {
  font-size: 10px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .category-nav-container {
    padding: 16px;
  }
  
  .nav-title {
    font-size: 16px;
  }
  
  .category-nav-item {
    min-width: 70px;
    padding: 10px 12px;
  }
  
  .category-icon {
    font-size: 18px;
  }
  
  .category-name {
    font-size: 11px;
  }
  
  .nav-arrow {
    display: none;
  }
  
  .category-nav-scroll {
    scroll-snap-type: x mandatory;
  }
  
  .category-nav-item {
    scroll-snap-align: start;
  }
}

@media (max-width: 480px) {
  .category-nav-container {
    padding: 12px;
  }
  
  .category-nav-item {
    min-width: 60px;
    padding: 8px 10px;
    gap: 4px;
  }
  
  .category-icon {
    font-size: 16px;
  }
  
  .category-name {
    font-size: 10px;
  }
}
</style>
