<template>
  <div class="comprehensive-homepage">
    
    <!-- Sticky Header -->
    <header class="sticky-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="header-container">
        
        <!-- Location Section -->
        <div class="location-section">
          <button class="location-btn" @click="showLocationModal = true">
            <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div class="location-info">
              <span class="location-text">{{ userLocation || 'Select Location' }}</span>
              <span class="delivery-info">Free delivery available</span>
            </div>
          </button>
        </div>
        
        <!-- Logo Section -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <div class="logo">
              <span class="logo-icon">👟</span>
              <span class="logo-text">SOLE HUB</span>
            </div>
          </router-link>
        </div>
        
        <!-- Search Section -->
        <div class="search-section">
          <div class="search-container" :class="{ 'search-active': isSearchActive }">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            
            <input
              ref="searchInput"
              v-model="searchQuery"
              @focus="handleSearchFocus"
              @blur="handleSearchBlur"
              @input="handleSearchInput"
              placeholder="Search shoes, brands, styles..."
              class="search-input"
            />
            
            <button 
              class="mic-btn"
              :class="{ 'mic-active': isListening }"
              @click="toggleVoiceSearch"
              title="Voice search"
            >
              <svg class="mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            
            <!-- Search Suggestions -->
            <div v-if="showSuggestions" class="search-suggestions">
              <div class="suggestions-header">
                <h4>Popular Searches</h4>
                <button @click="clearSearch" class="clear-btn">Clear</button>
              </div>
              
              <div class="suggestions-grid">
                <div class="suggestion-category">
                  <h5>Trending</h5>
                  <div
                    v-for="trend in trendingSuggestions"
                    :key="trend"
                    class="suggestion-item"
                    @click="selectSuggestion(trend)"
                  >
                    <svg class="suggestion-icon trending" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    {{ trend }}
                  </div>
                </div>
                
                <div class="suggestion-category">
                  <h5>Brands</h5>
                  <div
                    v-for="brand in brandSuggestions"
                    :key="brand"
                    class="suggestion-item"
                    @click="selectSuggestion(brand)"
                  >
                    <svg class="suggestion-icon brand" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    {{ brand }}
                  </div>
                </div>
                
                <div class="suggestion-category">
                  <h5>Categories</h5>
                  <div
                    v-for="category in categorySuggestions"
                    :key="category"
                    class="suggestion-item"
                    @click="selectSuggestion(category)"
                  >
                    <svg class="suggestion-icon category" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    {{ category }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Icons -->
        <div class="header-actions">
          <!-- Wishlist -->
          <button class="action-btn wishlist-btn" @click="openWishlist">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="action-label">Wishlist</span>
            <span v-if="wishlistCount > 0" class="badge">{{ wishlistCount }}</span>
          </button>
          
          <!-- Cart -->
          <button class="action-btn cart-btn" @click="openCart">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="action-label">Cart</span>
            <span v-if="cartCount > 0" class="badge cart-badge">{{ cartCount }}</span>
          </button>
          
          <!-- Profile -->
          <div class="profile-section">
            <button class="action-btn profile-btn" @click="toggleProfileMenu">
              <div class="profile-avatar">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                <svg v-else class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span class="action-label">{{ user.isLoggedIn ? user.name : 'Account' }}</span>
            </button>
            
            <!-- Profile Dropdown -->
            <div v-if="showProfileMenu" class="profile-dropdown">
              <div v-if="user.isLoggedIn" class="profile-header">
                <div class="profile-info">
                  <h4>{{ user.name }}</h4>
                  <p>{{ user.email }}</p>
                </div>
                <div class="profile-stats">
                  <div class="stat">
                    <span class="stat-number">{{ user.orders || 0 }}</span>
                    <span class="stat-label">Orders</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">{{ user.points || 0 }}</span>
                    <span class="stat-label">Points</span>
                  </div>
                </div>
              </div>
              
              <div class="profile-menu">
                <a v-if="user.isLoggedIn" href="#" class="menu-item">
                  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My Profile
                </a>
                <a v-if="user.isLoggedIn" href="#" class="menu-item">
                  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  My Orders
                </a>
                <a href="#" class="menu-item">
                  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Settings
                </a>
                <div class="menu-divider"></div>
                <button v-if="user.isLoggedIn" @click="logout" class="menu-item logout">
                  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
                <button v-else @click="showAuthModal = true" class="menu-item">
                  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10,17 15,12 10,7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Hero / Campaign Banners -->
    <section class="hero-banners">
      <div class="banner-slider" ref="bannerSlider">
        <div class="banner-container" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
          <div
            v-for="(banner, index) in heroBanners"
            :key="banner.id"
            class="banner-slide"
            :class="{ active: currentBanner === index }"
          >
            <div class="banner-background">
              <img :src="banner.backgroundImage" :alt="banner.title" class="banner-bg-image" />
              <div class="banner-overlay"></div>
            </div>
            
            <div class="banner-content">
              <div class="banner-text">
                <span v-if="banner.badge" class="banner-badge">{{ banner.badge }}</span>
                <h1 class="banner-title">{{ banner.title }}</h1>
                <p class="banner-subtitle">{{ banner.subtitle }}</p>
                <div class="banner-features">
                  <span
                    v-for="feature in banner.features"
                    :key="feature"
                    class="banner-feature"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>
              
              <div class="banner-actions">
                <button class="cta-primary" @click="handleBannerCTA(banner)">
                  {{ banner.ctaText }}
                  <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12,5 19,12 12,19"></polyline>
                  </svg>
                </button>
                <button v-if="banner.secondaryCTA" class="cta-secondary" @click="handleSecondaryCTA(banner)">
                  {{ banner.secondaryCTA }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Banner Navigation -->
        <div class="banner-navigation">
          <div class="banner-dots">
            <button
              v-for="(banner, index) in heroBanners"
              :key="index"
              :class="['banner-dot', { active: currentBanner === index }]"
              @click="goToBanner(index)"
            ></button>
          </div>
          
          <div class="banner-controls">
            <button class="banner-control prev" @click="previousBanner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            <button class="banner-control next" @click="nextBanner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Category Navigation Bar -->
    <section class="category-navigation" :class="{ 'nav-sticky': isCategorySticky }">
      <div class="category-container">
        <div class="category-scroll" ref="categoryScroll">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="['category-chip', { active: activeCategory === category.id }]"
            @click="selectCategory(category)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span v-if="category.count" class="category-count">{{ category.count }}</span>
          </button>
        </div>
        
        <div class="category-arrows">
          <button class="category-arrow left" @click="scrollCategories('left')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button class="category-arrow right" @click="scrollCategories('right')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
    
    <!-- Quick Shortcuts / Filters Row -->
    <section class="quick-shortcuts">
      <div class="shortcuts-container">
        <h3 class="shortcuts-title">Quick Access</h3>
        <div class="shortcuts-grid">
          <button
            v-for="shortcut in quickShortcuts"
            :key="shortcut.id"
            :class="['shortcut-chip', { active: shortcut.active }]"
            @click="handleShortcut(shortcut)"
          >
            <div class="shortcut-icon">{{ shortcut.icon }}</div>
            <span class="shortcut-label">{{ shortcut.label }}</span>
            <span v-if="shortcut.badge" class="shortcut-badge">{{ shortcut.badge }}</span>
          </button>
        </div>
      </div>
    </section>
    
    <!-- Personalized & Curated Sections -->
    <main class="main-content">
      <div class="content-container">
        
        <!-- Recommended for You -->
        <section v-if="user.isLoggedIn" class="content-section recommended-section">
          <div class="section-header">
            <div class="section-title-group">
              <h2 class="section-title">
                <span class="title-icon">🎯</span>
                Recommended for You
              </h2>
              <p class="section-subtitle">Curated based on your preferences and browsing history</p>
            </div>
            <button class="view-all-btn">
              View All
              <svg class="view-all-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </button>
          </div>
          
          <div class="products-carousel" ref="recommendedCarousel">
            <div class="products-scroll">
              <div
                v-for="product in recommendedProducts"
                :key="product.id"
                class="product-card"
                @click="viewProduct(product)"
              >
                <div class="product-image-container">
                  <img :src="product.image" :alt="product.name" class="product-image" />
                  <div class="product-badges">
                    <span v-if="product.isNew" class="badge new">NEW</span>
                    <span v-if="product.discount" class="badge sale">{{ product.discount }}% OFF</span>
                    <span v-if="product.exclusive" class="badge exclusive">EXCLUSIVE</span>
                  </div>
                  <div class="product-actions">
                    <button 
                      class="product-action wishlist"
                      :class="{ active: isInWishlist(product.id) }"
                      @click.stop="toggleWishlist(product.id)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <button class="product-action quick-view" @click.stop="quickView(product)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="product-info">
                  <div class="product-brand">{{ product.brand }}</div>
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-rating">
                    <div class="stars">
                      <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= product.rating }">⭐</span>
                    </div>
                    <span class="rating-count">({{ product.reviews }})</span>
                  </div>
                  <div class="product-price">
                    <span class="current-price">${{ product.price }}</span>
                    <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
                  </div>
                  <button class="add-to-cart-btn" @click.stop="addToCart(product)">
                    <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- New Arrivals -->
        <section class="content-section new-arrivals-section">
          <div class="section-header">
            <div class="section-title-group">
              <h2 class="section-title">
                <span class="title-icon">✨</span>
                New Arrivals
              </h2>
              <p class="section-subtitle">Fresh styles just landed</p>
            </div>
            <button class="view-all-btn">
              View All
              <svg class="view-all-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </button>
          </div>
          
          <div class="products-carousel">
            <div class="products-scroll">
              <div
                v-for="product in newArrivals"
                :key="product.id"
                class="product-card"
                @click="viewProduct(product)"
              >
                <div class="product-image-container">
                  <img :src="product.image" :alt="product.name" class="product-image" />
                  <div class="product-badges">
                    <span class="badge new">NEW</span>
                    <span v-if="product.discount" class="badge sale">{{ product.discount }}% OFF</span>
                  </div>
                  <div class="product-actions">
                    <button 
                      class="product-action wishlist"
                      :class="{ active: isInWishlist(product.id) }"
                      @click.stop="toggleWishlist(product.id)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <button class="product-action quick-view" @click.stop="quickView(product)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="product-info">
                  <div class="product-brand">{{ product.brand }}</div>
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-rating">
                    <div class="stars">
                      <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= product.rating }">⭐</span>
                    </div>
                    <span class="rating-count">({{ product.reviews }})</span>
                  </div>
                  <div class="product-price">
                    <span class="current-price">${{ product.price }}</span>
                    <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
                  </div>
                  <button class="add-to-cart-btn" @click.stop="addToCart(product)">
                    <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Trending Section -->
        <section class="content-section trending-section">
          <div class="section-header">
            <div class="section-title-group">
              <h2 class="section-title">
                <span class="title-icon">🔥</span>
                Trending Now
              </h2>
              <p class="section-subtitle">What everyone's talking about</p>
            </div>
            <button class="view-all-btn">
              View All
              <svg class="view-all-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </button>
          </div>
          
          <div class="trending-grid">
            <div
              v-for="(product, index) in trendingProducts"
              :key="product.id"
              class="trending-card"
              @click="viewProduct(product)"
            >
              <div class="trending-rank">
                <span class="rank-number">#{{ index + 1 }}</span>
                <span class="trend-indicator up">↗ +{{ product.trendGrowth }}%</span>
              </div>
              
              <div class="product-image-container">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="trending-overlay">
                  <div class="trend-stats">
                    <div class="stat">
                      <span class="stat-value">{{ product.views }}</span>
                      <span class="stat-label">Views</span>
                    </div>
                    <div class="stat">
                      <span class="stat-value">{{ product.sales }}</span>
                      <span class="stat-label">Sold</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="product-info">
                <div class="product-brand">{{ product.brand }}</div>
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-price">
                  <span class="current-price">${{ product.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Brand Spotlights -->
        <section class="content-section brand-spotlight-section">
          <div class="section-header">
            <div class="section-title-group">
              <h2 class="section-title">
                <span class="title-icon">🏆</span>
                Brand Spotlights
              </h2>
              <p class="section-subtitle">Featured collections from top brands</p>
            </div>
          </div>
          
          <div class="brand-spotlight-grid">
            <div
              v-for="brand in brandSpotlights"
              :key="brand.id"
              class="brand-spotlight-card"
              @click="viewBrand(brand)"
            >
              <div class="brand-image">
                <img :src="brand.image" :alt="brand.name" class="brand-bg" />
                <div class="brand-overlay"></div>
              </div>
              
              <div class="brand-content">
                <div class="brand-logo">
                  <img :src="brand.logo" :alt="brand.name" />
                </div>
                <h3 class="brand-name">{{ brand.name }}</h3>
                <p class="brand-description">{{ brand.description }}</p>
                <div class="brand-stats">
                  <span class="stat">{{ brand.productCount }} Products</span>
                  <span class="stat">From ${{ brand.startingPrice }}</span>
                </div>
                <button class="brand-cta">
                  Explore Collection
                  <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12,5 19,12 12,19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </main>
    
    <!-- Footer & Support -->
    <footer class="main-footer">
      <div class="footer-container">
        
        <!-- Footer Top -->
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-icon">👟</span>
              <span class="logo-text">SOLE HUB</span>
            </div>
            <p class="footer-tagline">Your ultimate destination for premium footwear</p>
            <div class="footer-social">
              <a href="#" class="social-link facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="social-link twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="social-link instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.324C5.901 8.247 7.052 7.757 8.349 7.757s2.448.49 3.324 1.297c.896.896 1.386 2.047 1.386 3.344s-.49 2.448-1.386 3.344c-.876.806-2.027 1.296-3.324 1.296zm7.198 0c-1.297 0-2.448-.49-3.324-1.297-.896-.896-1.386-2.047-1.386-3.344s.49-2.448 1.386-3.344c.876-.806 2.027-1.296 3.324-1.296s2.448.49 3.324 1.297c.896.896 1.386 2.047 1.386 3.344s-.49 2.448-1.386 3.344c-.876.806-2.027 1.296-3.324 1.296z"/>
                </svg>
              </a>
              <a href="#" class="social-link youtube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h4 class="footer-title">Help & Support</h4>
              <ul class="footer-menu">
                <li><a href="#" class="footer-link">Customer Service</a></li>
                <li><a href="#" class="footer-link">Size Guide</a></li>
                <li><a href="#" class="footer-link">Shipping Info</a></li>
                <li><a href="#" class="footer-link">Returns & Exchanges</a></li>
                <li><a href="#" class="footer-link">Track Your Order</a></li>
                <li><a href="#" class="footer-link">FAQ</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-title">Company</h4>
              <ul class="footer-menu">
                <li><a href="#" class="footer-link">About Us</a></li>
                <li><a href="#" class="footer-link">Careers</a></li>
                <li><a href="#" class="footer-link">Press</a></li>
                <li><a href="#" class="footer-link">Store Locator</a></li>
                <li><a href="#" class="footer-link">Sustainability</a></li>
                <li><a href="#" class="footer-link">Affiliate Program</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-title">Legal</h4>
              <ul class="footer-menu">
                <li><a href="#" class="footer-link">Terms of Service</a></li>
                <li><a href="#" class="footer-link">Privacy Policy</a></li>
                <li><a href="#" class="footer-link">Cookie Policy</a></li>
                <li><a href="#" class="footer-link">Accessibility</a></li>
                <li><a href="#" class="footer-link">California Privacy</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-title">Download Our App</h4>
              <p class="app-description">Get exclusive deals and early access to new arrivals</p>
              <div class="app-downloads">
                <a href="#" class="app-download">
                  <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on App Store" />
                </a>
                <a href="#" class="app-download">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="copyright">© 2024 Sole Hub. All rights reserved.</p>
            <div class="payment-methods">
              <span class="payment-label">We accept:</span>
              <div class="payment-icons">
                <img src="https://via.placeholder.com/40x24/667eea/white?text=VISA" alt="Visa" />
                <img src="https://via.placeholder.com/40x24/ff6b6b/white?text=MC" alt="Mastercard" />
                <img src="https://via.placeholder.com/40x24/4ecdc4/white?text=AMEX" alt="American Express" />
                <img src="https://via.placeholder.com/40x24/45b7d1/white?text=PP" alt="PayPal" />
                <img src="https://via.placeholder.com/40x24/96c93d/white?text=GPay" alt="Google Pay" />
                <img src="https://via.placeholder.com/40x24/007bff/white?text=APay" alt="Apple Pay" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
    
  </div>
</template>

<script>
export default {
  name: 'ComprehensiveHomepage',
  data() {
    return {
      // Header state
      isScrolled: false,
      isSearchActive: false,
      showSuggestions: false,
      searchQuery: '',
      isListening: false,
      showProfileMenu: false,
      showLocationModal: false,
      showAuthModal: false,
      
      // Banner state
      currentBanner: 0,
      bannerInterval: null,
      
      // Category state
      isCategorySticky: false,
      activeCategory: 'all',
      
      // User state
      user: {
        isLoggedIn: true,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        orders: 5,
        points: 1250
      },
      
      userLocation: 'New York, NY',
      cartCount: 3,
      wishlistCount: 7,
      
      // Search suggestions
      trendingSuggestions: [
        'Nike Air Max', 'Adidas Ultraboost', 'Jordan Retro', 'Converse Chuck Taylor',
        'Vans Old Skool', 'New Balance 990', 'Running Shoes', 'Basketball Shoes'
      ],
      brandSuggestions: [
        'Nike', 'Adidas', 'Jordan', 'Converse', 'Vans', 'New Balance', 'Puma', 'Reebok'
      ],
      categorySuggestions: [
        'Running Shoes', 'Basketball Shoes', 'Casual Sneakers', 'Dress Shoes',
        'Boots', 'Sandals', 'Athletic Shoes', 'Lifestyle Shoes'
      ],
      
      // Hero banners
      heroBanners: [
        {
          id: 1,
          title: 'Winter Collection 2024',
          subtitle: 'Stay warm and stylish with our latest winter footwear',
          badge: 'New Collection',
          ctaText: 'Shop Winter Collection',
          secondaryCTA: 'Watch Lookbook',
          backgroundImage: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=1200&h=600&fit=crop',
          features: ['Waterproof', 'Insulated', 'Non-slip sole']
        },
        {
          id: 2,
          title: 'Up to 50% Off Sale',
          subtitle: 'Limited time offer on premium footwear from top brands',
          badge: 'Sale',
          ctaText: 'Shop Sale',
          secondaryCTA: 'View All Deals',
          backgroundImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&h=600&fit=crop',
          features: ['Free shipping', 'Easy returns', 'Price guarantee']
        },
        {
          id: 3,
          title: 'Exclusive Jordan Drop',
          subtitle: 'Get the latest Jordan releases before anyone else',
          badge: 'Exclusive',
          ctaText: 'Shop Jordan',
          secondaryCTA: 'Join Waitlist',
          backgroundImage: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1200&h=600&fit=crop',
          features: ['Limited edition', 'Early access', 'Authenticated']
        }
      ],
      
      // Categories
      categories: [
        { id: 'all', name: 'All', icon: '👟', count: 2547 },
        { id: 'men', name: 'Men', icon: '👨', count: 1203 },
        { id: 'women', name: 'Women', icon: '👩', count: 987 },
        { id: 'kids', name: 'Kids', icon: '👶', count: 357 },
        { id: 'sports', name: 'Sports', icon: '⚽', count: 789 },
        { id: 'casual', name: 'Casual', icon: '👟', count: 654 },
        { id: 'formal', name: 'Formal', icon: '👞', count: 432 },
        { id: 'boots', name: 'Boots', icon: '🥾', count: 234 },
        { id: 'sandals', name: 'Sandals', icon: '👡', count: 178 }
      ],
      
      // Quick shortcuts
      quickShortcuts: [
        { id: 'size', label: 'Size Guide', icon: '📏', active: false },
        { id: 'price', label: 'Price Match', icon: '💰', active: false },
        { id: 'tryon', label: 'Try-On AR', icon: '📱', badge: 'NEW' },
        { id: 'recent', label: 'Recently Viewed', icon: '👁️', badge: '5' },
        { id: 'offers', label: 'Top Offers', icon: '🏷️', badge: '20%' },
        { id: 'outlet', label: 'Outlet', icon: '🛍️', active: false }
      ],
      
      // Products data
      recommendedProducts: [
        {
          id: 1,
          name: 'Air Max 270 React',
          brand: 'Nike',
          price: 149.99,
          originalPrice: 179.99,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          rating: 4.8,
          reviews: 247,
          isNew: false,
          discount: 17,
          exclusive: true
        },
        {
          id: 2,
          name: 'Ultraboost 23',
          brand: 'Adidas',
          price: 189.99,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
          rating: 4.9,
          reviews: 189,
          isNew: true,
          exclusive: false
        },
        {
          id: 3,
          name: 'Chuck 70 High Top',
          brand: 'Converse',
          price: 89.99,
          originalPrice: 99.99,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
          rating: 4.6,
          reviews: 156,
          isNew: false,
          discount: 10,
          exclusive: false
        },
        {
          id: 4,
          name: 'Old Skool Platform',
          brand: 'Vans',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
          rating: 4.7,
          reviews: 203,
          isNew: false,
          exclusive: false
        },
        {
          id: 5,
          name: 'Jordan 1 Retro High',
          brand: 'Jordan',
          price: 169.99,
          image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
          rating: 4.9,
          reviews: 312,
          isNew: true,
          exclusive: true
        }
      ],
      
      newArrivals: [
        {
          id: 6,
          name: 'React Infinity Run',
          brand: 'Nike',
          price: 159.99,
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
          rating: 4.8,
          reviews: 89,
          isNew: true
        },
        {
          id: 7,
          name: 'NMD_R1 V2',
          brand: 'Adidas',
          price: 139.99,
          originalPrice: 159.99,
          image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
          rating: 4.7,
          reviews: 67,
          isNew: true,
          discount: 13
        },
        {
          id: 8,
          name: 'Classic Leather',
          brand: 'Reebok',
          price: 74.99,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
          rating: 4.5,
          reviews: 134,
          isNew: true
        }
      ],
      
      trendingProducts: [
        {
          id: 9,
          name: 'Dunk Low',
          brand: 'Nike',
          price: 109.99,
          image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
          views: '12.3K',
          sales: '1.2K',
          trendGrowth: 45
        },
        {
          id: 10,
          name: 'Yeezy Boost 350',
          brand: 'Adidas',
          price: 229.99,
          image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
          views: '8.7K',
          sales: '890',
          trendGrowth: 32
        },
        {
          id: 11,
          name: 'Travis Scott Jordan 1',
          brand: 'Jordan',
          price: 1499.99,
          image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
          views: '15.2K',
          sales: '234',
          trendGrowth: 78
        },
        {
          id: 12,
          name: 'Off-White Blazer',
          brand: 'Nike',
          price: 899.99,
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
          views: '6.4K',
          sales: '156',
          trendGrowth: 23
        }
      ],
      
      brandSpotlights: [
        {
          id: 1,
          name: 'Nike',
          description: 'Just Do It - Innovative athletic footwear and apparel',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
          logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
          productCount: 847,
          startingPrice: 59.99
        },
        {
          id: 2,
          name: 'Adidas',
          description: 'Impossible is Nothing - Performance meets style',
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=400&fit=crop',
          logo: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png',
          productCount: 632,
          startingPrice: 69.99
        },
        {
          id: 3,
          name: 'Jordan',
          description: 'Fly Above - Basketball heritage and street style',
          image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=400&fit=crop',
          logo: 'https://logos-world.net/wp-content/uploads/2020/06/Jordan-Logo.png',
          productCount: 234,
          startingPrice: 109.99
        }
      ]
    }
  },
  mounted() {
    this.initializeEventListeners()
    this.startBannerAutoSlide()
  },
  beforeDestroy() {
    this.cleanupEventListeners()
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval)
    }
  },
  methods: {
    // Event listeners
    initializeEventListeners() {
      window.addEventListener('scroll', this.handleScroll)
      document.addEventListener('click', this.handleClickOutside)
    },
    
    cleanupEventListeners() {
      window.removeEventListener('scroll', this.handleScroll)
      document.removeEventListener('click', this.handleClickOutside)
    },
    
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      this.isScrolled = scrollTop > 50
      this.isCategorySticky = scrollTop > 300
    },
    
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showSuggestions = false
        this.showProfileMenu = false
      }
    },
    
    // Search functionality
    handleSearchFocus() {
      this.isSearchActive = true
      this.showSuggestions = true
    },
    
    handleSearchBlur() {
      setTimeout(() => {
        this.isSearchActive = false
        this.showSuggestions = false
      }, 200)
    },
    
    handleSearchInput() {
      // Implement real search logic here
      this.showSuggestions = true
    },
    
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion
      this.showSuggestions = false
      // Implement search action
      console.log('Search for:', suggestion)
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.showSuggestions = false
    },
    
    toggleVoiceSearch() {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'
        
        recognition.onstart = () => {
          this.isListening = true
        }
        
        recognition.onresult = (event) => {
          this.searchQuery = event.results[0][0].transcript
          this.isListening = false
        }
        
        recognition.onerror = () => {
          this.isListening = false
        }
        
        recognition.onend = () => {
          this.isListening = false
        }
        
        recognition.start()
      }
    },
    
    // Header actions
    openWishlist() {
      console.log('Open wishlist')
    },
    
    openCart() {
      console.log('Open cart')
    },
    
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
    },
    
    logout() {
      this.user.isLoggedIn = false
      this.showProfileMenu = false
      console.log('User logged out')
    },
    
    // Banner functionality
    startBannerAutoSlide() {
      this.bannerInterval = setInterval(() => {
        this.nextBanner()
      }, 5000)
    },
    
    nextBanner() {
      this.currentBanner = (this.currentBanner + 1) % this.heroBanners.length
    },
    
    previousBanner() {
      this.currentBanner = this.currentBanner === 0 ? this.heroBanners.length - 1 : this.currentBanner - 1
    },
    
    goToBanner(index) {
      this.currentBanner = index
    },
    
    handleBannerCTA(banner) {
      console.log('Banner CTA clicked:', banner.title)
    },
    
    handleSecondaryCTA(banner) {
      console.log('Secondary CTA clicked:', banner.title)
    },
    
    // Category functionality
    selectCategory(category) {
      this.activeCategory = category.id
      console.log('Selected category:', category.name)
    },
    
    scrollCategories(direction) {
      const container = this.$refs.categoryScroll
      const scrollAmount = 200
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount
      } else {
        container.scrollLeft += scrollAmount
      }
    },
    
    // Shortcut functionality
    handleShortcut(shortcut) {
      console.log('Shortcut clicked:', shortcut.label)
      // Implement specific shortcut actions
    },
    
    // Product functionality
    viewProduct(product) {
      console.log('View product:', product.name)
    },
    
    addToCart(product) {
      console.log('Add to cart:', product.name)
      this.cartCount++
    },
    
    toggleWishlist(productId) {
      console.log('Toggle wishlist for product:', productId)
      // Implementation would check current state and toggle
    },
    
    isInWishlist(productId) {
      // Mock implementation - would check actual wishlist state
      return Math.random() > 0.7
    },
    
    quickView(product) {
      console.log('Quick view:', product.name)
    },
    
    // Brand functionality
    viewBrand(brand) {
      console.log('View brand:', brand.name)
    }
  }
}
</script>

<style scoped>
.comprehensive-homepage {
  width: 100%;
  min-height: 100vh;
  background: #fafafa;
}

/* Sticky Header */
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 1000;
  transition: all 0.3s ease;
  border-bottom: 1px solid #e1e5e9;
}

.sticky-header.header-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 240px auto 1fr 240px;
  align-items: center;
  gap: 20px;
  min-height: 70px;
}

/* Location Section */
.location-section .location-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.location-section .location-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.location-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.location-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.location-text {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.delivery-info {
  font-size: 11px;
  color: #28a745;
}

/* Logo Section */
.logo-link {
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800;
  color: #667eea;
}

.logo-icon {
  font-size: 24px;
}

/* Search Section */
.search-section {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-container {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 25px;
  padding: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.search-container.search-active {
  border-color: #667eea;
  background: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #666;
  margin: 0 12px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  padding: 8px 0;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.mic-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 4px;
}

.mic-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.mic-btn.mic-active {
  background: #ff4757;
  animation: pulse 1s infinite;
}

.mic-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.mic-btn.mic-active .mic-icon {
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Search Suggestions */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  margin-top: 8px;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.suggestions-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.clear-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.clear-btn:hover {
  background: #f8f9ff;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 12px 0;
}

.suggestion-category {
  padding: 0 20px;
}

.suggestion-category h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 13px;
  margin-bottom: 4px;
}

.suggestion-item:hover {
  background: #f8f9ff;
}

.suggestion-icon {
  width: 14px;
  height: 14px;
  color: #999;
}

.suggestion-icon.trending {
  color: #ff6b6b;
}

.suggestion-icon.brand {
  color: #667eea;
}

.suggestion-icon.category {
  color: #28a745;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  position: relative;
}

.action-btn:hover {
  background: #f8f9ff;
}

.action-icon {
  width: 20px;
  height: 20px;
  color: #333;
}

.action-label {
  font-size: 10px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ff4757;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
}

.cart-badge {
  background: #667eea;
}

/* Profile Section */
.profile-section {
  position: relative;
}

.profile-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  min-width: 260px;
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
}

.profile-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.profile-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
}

.profile-info p {
  margin: 0 0 12px 0;
  font-size: 14px;
  opacity: 0.9;
}

.profile-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 16px;
  font-weight: 700;
}

.stat-label {
  font-size: 11px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-menu {
  padding: 12px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.menu-item:hover {
  background: #f8f9ff;
}

.menu-icon {
  width: 16px;
  height: 16px;
  color: #666;
}

.menu-divider {
  height: 1px;
  background: #e1e5e9;
  margin: 8px 0;
}

.menu-item.logout {
  color: #dc3545;
}

.menu-item.logout .menu-icon {
  color: #dc3545;
}

/* Hero Banners */
.hero-banners {
  margin-top: 70px;
  position: relative;
  height: 500px;
  overflow: hidden;
}

.banner-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-container {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.banner-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.banner-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(102, 126, 234, 0.3) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 40px;
  width: 100%;
}

.banner-text {
  color: white;
}

.banner-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.banner-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.banner-subtitle {
  font-size: 20px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.4;
}

.banner-features {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.banner-feature {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.banner-feature::before {
  content: '✓';
  color: #28a745;
  font-weight: bold;
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cta-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-content: center;
  min-width: 200px;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.cta-icon {
  width: 18px;
  height: 18px;
}

.cta-secondary {
  padding: 12px 24px;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  background: white;
  color: #667eea;
}

/* Banner Navigation */
.banner-navigation {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 3;
}

.banner-dots {
  display: flex;
  gap: 8px;
}

.banner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-dot.active {
  background: white;
  transform: scale(1.5);
}

.banner-controls {
  display: flex;
  gap: 8px;
}

.banner-control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.banner-control:hover {
  background: rgba(255, 255, 255, 0.3);
}

.banner-control svg {
  width: 16px;
  height: 16px;
  color: white;
}

/* Category Navigation */
.category-navigation {
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 16px 0;
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;
}

.category-navigation.nav-sticky {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.category-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

.category-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  padding: 8px 0;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.category-chip:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.category-chip.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.category-icon {
  font-size: 16px;
}

.category-name {
  font-weight: 600;
}

.category-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.category-chip.active .category-count {
  background: rgba(255, 255, 255, 0.3);
}

.category-arrows {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  left: -16px;
  right: -16px;
  pointer-events: none;
}

.category-arrow {
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  pointer-events: all;
}

.category-arrow:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.category-arrow svg {
  width: 14px;
  height: 14px;
  color: #667eea;
}

/* Quick Shortcuts */
.quick-shortcuts {
  background: white;
  padding: 20px 0;
  border-bottom: 1px solid #e1e5e9;
}

.shortcuts-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.shortcuts-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.shortcut-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.shortcut-chip:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.shortcut-chip.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.shortcut-icon {
  font-size: 24px;
}

.shortcut-label {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}

.shortcut-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4757;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
}

/* Main Content */
.main-content {
  padding: 40px 0;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title-group {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 800;
  color: #333;
  margin: 0 0 8px 0;
}

.title-icon {
  font-size: 36px;
}

.section-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.view-all-icon {
  width: 16px;
  height: 16px;
}

/* Products Carousel */
.products-carousel {
  position: relative;
}

.products-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  padding: 8px 0 20px 0;
}

.products-scroll::-webkit-scrollbar {
  display: none;
}

/* Product Card */
.product-card {
  min-width: 280px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 5;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
}

.badge.new {
  background: #4facfe;
}

.badge.sale {
  background: #fa709a;
}

.badge.exclusive {
  background: #ffd700;
  color: #333;
}

.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.product-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.product-action:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.product-action.active {
  background: #ff4757;
  color: white;
}

.product-action svg {
  width: 14px;
  height: 14px;
}

.product-info {
  padding: 20px;
}

.product-brand {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.product-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  filter: grayscale(1);
  opacity: 0.3;
}

.star.filled {
  filter: grayscale(0);
  opacity: 1;
}

.rating-count {
  font-size: 12px;
  color: #666;
}

.product-price {
  margin-bottom: 16px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.cart-icon {
  width: 16px;
  height: 16px;
}

/* Trending Grid */
.trending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.trending-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
  position: relative;
}

.trending-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.trending-rank {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 5;
}

.rank-number {
  font-weight: 700;
  font-size: 14px;
}

.trend-indicator.up {
  color: #28a745;
  font-size: 12px;
  font-weight: 600;
}

.trending-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  z-index: 4;
}

.trending-card:hover .trending-overlay {
  opacity: 1;
}

.trend-stats {
  display: flex;
  gap: 20px;
  color: white;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-weight: 700;
  font-size: 16px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

/* Brand Spotlight */
.brand-spotlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.brand-spotlight-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
  position: relative;
  height: 300px;
}

.brand-spotlight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.brand-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.brand-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(102, 126, 234, 0.4) 100%);
}

.brand-content {
  position: relative;
  z-index: 2;
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
}

.brand-logo {
  margin-bottom: 16px;
}

.brand-logo img {
  height: 40px;
  width: auto;
  filter: brightness(0) invert(1);
}

.brand-name {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.brand-description {
  font-size: 14px;
  margin: 0 0 16px 0;
  opacity: 0.9;
  line-height: 1.4;
}

.brand-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 12px;
  opacity: 0.8;
}

.brand-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.brand-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
}

/* Footer */
.main-footer {
  background: #1a1a1a;
  color: white;
  padding: 60px 0 20px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 800;
  color: white;
}

.footer-tagline {
  font-size: 16px;
  color: #ccc;
  margin: 0;
  line-height: 1.5;
}

.footer-social {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
  color: #ccc;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.social-link svg {
  width: 18px;
  height: 18px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #667eea;
}

.app-description {
  font-size: 14px;
  color: #ccc;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.app-downloads {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-download img {
  height: 40px;
  width: auto;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 20px;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 14px;
  color: #ccc;
  margin: 0;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-label {
  font-size: 14px;
  color: #ccc;
}

.payment-icons {
  display: flex;
  gap: 8px;
}

.payment-icons img {
  height: 24px;
  width: auto;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-container {
    grid-template-columns: 1fr auto 1fr;
    gap: 16px;
  }
  
  .location-section,
  .header-actions {
    display: none;
  }
  
  .banner-title {
    font-size: 36px;
  }
  
  .banner-content {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
  
  .footer-top {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .header-container {
    grid-template-columns: 1fr;
    min-height: 60px;
    padding: 0 16px;
  }
  
  .search-section {
    order: 2;
    margin-top: 12px;
  }
  
  .hero-banners {
    height: 400px;
    margin-top: 120px;
  }
  
  .banner-title {
    font-size: 28px;
  }
  
  .banner-subtitle {
    font-size: 16px;
  }
  
  .category-navigation {
    padding: 12px 0;
  }
  
  .category-arrows {
    display: none;
  }
  
  .shortcuts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .products-scroll {
    gap: 16px;
  }
  
  .product-card {
    min-width: 240px;
  }
  
  .trending-grid,
  .brand-spotlight-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-banners {
    height: 300px;
  }
  
  .banner-title {
    font-size: 22px;
  }
  
  .banner-content {
    padding: 0 16px;
  }
  
  .shortcuts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .product-card {
    min-width: 200px;
  }
  
  .app-downloads {
    align-items: center;
  }
}
</style>
