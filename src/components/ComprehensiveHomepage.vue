<template>
  <div class="comprehensive-homepage">
    
    <!-- Enhanced Sticky Header -->
    <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="header-container">
        
        <!-- Logo & Brand Recognition -->
        <div class="brand-section">
          <div class="main-logo">
            <span class="logo-icon">👟</span>
            <span class="brand-name">SOLE HUB</span>
            <span class="brand-tagline">Premium Footwear</span>
          </div>
        </div>
        
        <!-- Enhanced Search with Auto-Suggestions & Voice -->
        <div class="search-section">
          <div class="search-container" :class="{ 'search-focused': isSearchActive }">
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
              placeholder="Search for sneakers, brands, or styles..."
              class="search-input"
            />
            
            <!-- Voice Shopping Mic Icon -->
            <button 
              class="voice-search-btn"
              :class="{ 'listening': isListening }"
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
            
            <!-- Auto-Suggestions Dropdown -->
            <div v-if="showSuggestions" class="search-suggestions">
              <div class="suggestions-header">
                <h4>Popular Searches</h4>
                <button @click="clearSearch" class="clear-search-btn">Clear</button>
              </div>
              
              <div class="suggestions-grid">
                <div class="suggestion-category">
                  <h5>🔥 Trending</h5>
                  <div
                    v-for="trend in trendingSuggestions"
                    :key="trend"
                    class="suggestion-item"
                    @click="selectSuggestion(trend)"
                  >
                    {{ trend }}
                  </div>
                </div>
                
                <div class="suggestion-category">
                  <h5>🏷️ Brands</h5>
                  <div
                    v-for="brand in brandSuggestions"
                    :key="brand"
                    class="suggestion-item"
                    @click="selectSuggestion(brand)"
                  >
                    {{ brand }}
                  </div>
                </div>
                
                <div class="suggestion-category">
                  <h5>👟 Categories</h5>
                  <div
                    v-for="category in categorySuggestions"
                    :key="category"
                    class="suggestion-item"
                    @click="selectSuggestion(category)"
                  >
                    {{ category }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cart & Wishlist Icons - Persistent Access -->
        <div class="header-actions">
          <button class="action-btn wishlist-btn" @click="openWishlist">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="action-label">Wishlist</span>
            <span v-if="wishlistCount > 0" class="action-badge">{{ wishlistCount }}</span>
          </button>
          
          <button class="action-btn cart-btn" @click="openCart">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="action-label">Cart</span>
            <span v-if="cartCount > 0" class="action-badge cart-badge">{{ cartCount }}</span>
          </button>
          
          <!-- User Profile -->
          <div class="profile-section">
            <button class="action-btn profile-btn" @click="toggleProfileMenu">
              <div class="profile-avatar">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                <svg v-else class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span class="action-label">{{ user.isLoggedIn ? user.name.split(' ')[0] : 'Account' }}</span>
            </button>
            
            <!-- Profile Dropdown -->
            <div v-if="showProfileMenu" class="profile-dropdown">
              <div v-if="user.isLoggedIn" class="profile-header">
                <div class="profile-info">
                  <h4>{{ user.name }}</h4>
                  <p>{{ user.email }}</p>
                </div>
              </div>
              
              <div class="profile-menu">
                <a v-if="user.isLoggedIn" href="#" class="menu-item">My Profile</a>
                <a v-if="user.isLoggedIn" href="#" class="menu-item">My Orders</a>
                <a href="#" class="menu-item">Settings</a>
                <div class="menu-divider"></div>
                <button v-if="user.isLoggedIn" @click="logout" class="menu-item logout">Sign Out</button>
                <button v-else @click="openAuthModal" class="menu-item">Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Hero / Banner Section - Seasonal Campaign Banners -->
    <section class="hero-banners">
      <div class="banner-slider">
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
                <span class="banner-badge">{{ banner.badge }}</span>
                <h1 class="banner-title">{{ banner.title }}</h1>
                <p class="banner-subtitle">{{ banner.subtitle }}</p>
                <div class="banner-features">
                  <span
                    v-for="feature in banner.features"
                    :key="feature"
                    class="feature-tag"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>
              
              <div class="banner-actions">
                <button class="cta-primary" @click="handleBannerCTA(banner)">
                  {{ banner.ctaText }}
                  <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
    
    <!-- Quick Category Tiles - Horizontal Layout -->
    <section class="quick-categories">
      <div class="categories-container">
        <h3 class="section-title">Shop by Category</h3>
        <div class="category-grid">
          <button
            v-for="category in quickCategories"
            :key="category.id"
            :class="['category-tile', { active: activeCategory === category.id }]"
            @click="selectCategory(category)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }}+ items</span>
          </button>
        </div>
      </div>
    </section>
    
    <!-- Gender & Age Filter Shortcuts -->
    <section class="filter-shortcuts">
      <div class="shortcuts-container">
        <h4 class="shortcuts-title">Quick Filters</h4>
        <div class="filter-chips">
          <button
            v-for="filter in quickFilters"
            :key="filter.id"
            :class="['filter-chip', { active: filter.active }]"
            @click="toggleFilter(filter)"
          >
            <span class="filter-icon">{{ filter.icon }}</span>
            <span class="filter-label">{{ filter.label }}</span>
            <span v-if="filter.badge" class="filter-badge">{{ filter.badge }}</span>
          </button>
        </div>
      </div>
    </section>
    
    <!-- Main Content Sections -->
    <main class="main-content">
      <div class="content-container">
        
        <!-- AI Smart Recommendations Section -->
        <section v-if="user.isLoggedIn" class="recommendations-section">
          <div class="section-header">
            <div class="section-title-group">
              <h2 class="section-title">
                <span class="title-icon">🎯</span>
                Because You Liked...
              </h2>
              <p class="section-subtitle">Your Perfect Picks - AI-powered recommendations</p>
            </div>
            <button class="view-all-btn">View All</button>
          </div>
          
          <div class="recommendations-tabs">
            <button 
              v-for="tab in recommendationTabs" 
              :key="tab.id"
              :class="['rec-tab', { active: activeRecTab === tab.id }]"
              @click="activeRecTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
          
          <div class="products-carousel">
            <div class="products-scroll">
              <div
                v-for="product in getRecommendationProducts()"
                :key="product.id"
                class="product-card enhanced"
                @click="viewProduct(product)"
              >
                <div class="product-image-container">
                  <img :src="product.image" :alt="product.name" class="product-image" />
                  <div class="product-badges">
                    <span v-if="product.isNew" class="badge new">NEW</span>
                    <span v-if="product.discount" class="badge sale">{{ product.discount }}% OFF</span>
                    <span v-if="product.exclusive" class="badge exclusive">EXCLUSIVE</span>
                    <span v-if="product.aiMatch" class="badge ai-match">AI MATCH</span>
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
                  <div class="product-colors">
                    <span v-for="color in product.colors" :key="color" class="color-dot" :style="{ backgroundColor: color }"></span>
                  </div>
                  <div class="product-size-preview">
                    <span class="size-label">Available sizes:</span>
                    <span class="size-range">{{ product.sizeRange }}</span>
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
        
        <!-- Recently Viewed -->
        <section v-if="recentlyViewed.length > 0" class="recently-viewed-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">👁️</span>
              Recently Viewed
            </h2>
            <button class="clear-history-btn" @click="clearRecentlyViewed">Clear History</button>
          </div>
          
          <div class="products-carousel compact">
            <div class="products-scroll">
              <div
                v-for="product in recentlyViewed"
                :key="product.id"
                class="product-card compact"
                @click="viewProduct(product)"
              >
                <div class="product-image-container">
                  <img :src="product.image" :alt="product.name" class="product-image" />
                </div>
                <div class="product-info">
                  <div class="product-brand">{{ product.brand }}</div>
                  <h4 class="product-name">{{ product.name }}</h4>
                  <div class="product-price">
                    <span class="current-price">${{ product.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- New Arrivals & Best Sellers Section -->
        <section class="arrivals-bestsellers-section">
          <div class="section-tabs">
            <button 
              v-for="tab in arrivalsTabs" 
              :key="tab.id"
              :class="['section-tab', { active: activeArrivalsTab === tab.id }]"
              @click="activeArrivalsTab = tab.id"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-name">{{ tab.name }}</span>
              <span class="tab-count">{{ tab.count }}</span>
            </button>
          </div>
          
          <div class="products-grid enhanced">
            <div
              v-for="product in getArrivalsProducts()"
              :key="product.id"
              class="product-card enhanced"
              @click="viewProduct(product)"
            >
              <div class="product-image-container">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="product-badges">
                  <span v-if="product.isNew" class="badge new">NEW</span>
                  <span v-if="product.isBestseller" class="badge bestseller">BESTSELLER</span>
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
                <div class="product-colors">
                  <span v-for="color in product.colors" :key="color" class="color-dot" :style="{ backgroundColor: color }"></span>
                </div>
                <div class="product-price">
                  <span class="current-price">${{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
                </div>
                <button class="add-to-cart-btn" @click.stop="addToCart(product)">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Deals & Limited-Time Offers -->
        <section class="deals-section">
          <div class="section-header special">
            <div class="section-title-group">
              <h2 class="section-title deals">
                <span class="title-icon">🔥</span>
                Flash Deals & Limited Offers
              </h2>
              <p class="section-subtitle">Limited time offers - Don't miss out!</p>
            </div>
            <div class="deals-timer">
              <span class="timer-label">Ends in</span>
              <div class="countdown-timer">
                <div class="time-unit">
                  <span class="time-value">{{ String(countdown.hours).padStart(2, '0') }}</span>
                </div>
                <span class="time-separator">:</span>
                <div class="time-unit">
                  <span class="time-value">{{ String(countdown.minutes).padStart(2, '0') }}</span>
                </div>
                <span class="time-separator">:</span>
                <div class="time-unit">
                  <span class="time-value">{{ String(countdown.seconds).padStart(2, '0') }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="deals-grid">
            <div class="deal-highlight">
              <div class="deal-banner">
                <h3>Under ₹999</h3>
                <p>Handpicked styles under budget</p>
                <button class="deal-cta">Shop Deals</button>
              </div>
            </div>

            <div class="deal-highlight">
              <div class="deal-banner sale">
                <h3>Flat 50% Off</h3>
                <p>Premium brands at unbeatable prices</p>
                <button class="deal-cta">Shop Deals</button>
              </div>
            </div>

            <div class="deal-highlight">
              <div class="deal-banner exclusive">
                <h3>Flash Sale</h3>
                <p>Limited time mega savings</p>
                <button class="deal-cta">Shop Deals</button>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Interactive Feature Promo - AR Try-On -->
        <section class="interactive-features">
          <div class="feature-promos">
            <div class="feature-promo ar-tryson">
              <div class="feature-content">
                <div class="feature-icon">📱</div>
                <h3>Try Before You Buy</h3>
                <p>Use AR to see how it looks on your feet</p>
                <span class="feature-badge">AR Technology</span>
                <button class="feature-cta">Launch AR</button>
              </div>
              <div class="feature-visual">
                <div class="ar-demo">
                  <div class="phone-mockup">
                    <div class="phone-screen">
                      <div class="ar-overlay">AR VIEW</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="feature-promo pickup-option">
              <div class="feature-content">
                <div class="feature-icon">🏪</div>
                <h3>Order Online, Pick Up In-Store</h3>
                <p>Fast & Free pickup from stores near you</p>
                <span class="feature-badge">Free & Fast</span>
                <button class="feature-cta">Check Nearby Stores</button>
              </div>
              <div class="feature-visual">
                <div class="store-locator">
                  <div class="map-mockup">
                    <div class="store-pins">
                      <div class="store-pin">📍</div>
                      <div class="store-pin">📍</div>
                      <div class="store-pin">📍</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Brand Spotlight - Top Brands Carousel -->
        <section class="brand-spotlight-section">
          <div class="section-header">
            <div class="section-title-group">
              <h2 class="section-title">
                <span class="title-icon">🏆</span>
                Brand Spotlight
              </h2>
              <p class="section-subtitle">Explore collections from world's top footwear brands</p>
            </div>
          </div>
          
          <div class="brands-carousel">
            <div class="brands-scroll">
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
                    <span class="stat">{{ brand.productCount }}+ Products</span>
                    <span class="stat">From ${{ brand.startingPrice }}</span>
                  </div>
                  <button class="brand-cta">
                    Explore {{ brand.name }}
                    <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12,5 19,12 12,19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Customer Trust Elements -->
        <section class="trust-elements">
          <div class="trust-container">
            <h2 class="section-title">
              <span class="title-icon">⭐</span>
              What Our Customers Say
            </h2>
            
            <div class="trust-grid">
              <!-- Customer Reviews Snippet -->
              <div class="trust-block reviews">
                <div class="reviews-header">
                  <h3>Customer Reviews</h3>
                  <div class="overall-rating">
                    <div class="rating-stars">
                      <span class="star filled">⭐</span>
                      <span class="star filled">⭐</span>
                      <span class="star filled">⭐</span>
                      <span class="star filled">⭐</span>
                      <span class="star filled">⭐</span>
                    </div>
                    <span class="rating-value">4.8/5</span>
                    <span class="review-count">(12,847 reviews)</span>
                  </div>
                </div>
                
                <div class="review-highlights">
                  <div v-for="review in customerReviews" :key="review.id" class="review-card">
                    <div class="review-header">
                      <img :src="review.avatar" :alt="review.name" class="reviewer-avatar" />
                      <div class="reviewer-info">
                        <h4 class="reviewer-name">{{ review.name }}</h4>
                        <div class="review-rating">
                          <span v-for="star in review.rating" :key="star" class="star filled">⭐</span>
                        </div>
                      </div>
                    </div>
                    <p class="review-text">"{{ review.text }}"</p>
                    <div class="review-product">
                      <img :src="review.productImage" :alt="review.productName" class="review-product-img" />
                      <span class="review-product-name">{{ review.productName }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Trust Badges -->
              <div class="trust-block guarantees">
                <div class="trust-badges-row">
                  <div class="trust-badge">
                    <div class="trust-icon">↩️</div>
                    <h4>Free Returns</h4>
                  </div>
                  <div class="trust-badge">
                    <div class="trust-icon">🔒</div>
                    <h4>Secure Payments</h4>
                  </div>
                  <div class="trust-badge">
                    <div class="trust-icon">🚚</div>
                    <h4>Fast Delivery</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </main>
    
    <!-- Enhanced Footer -->
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
            
            <!-- Newsletter Signup -->
            <div class="newsletter-signup">
              <h4>Stay Updated</h4>
              <div class="newsletter-form">
                <input type="email" placeholder="Enter your email" class="newsletter-input" />
                <button class="newsletter-btn">Subscribe</button>
              </div>
              <p class="newsletter-note">Get exclusive deals and new arrivals first</p>
            </div>
            
            <!-- Social Media Links -->
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
                <li><a href="#" class="footer-link">FAQ</a></li>
                <li><a href="#" class="footer-link">Help Center</a></li>
                <li><a href="#" class="footer-link">Size Guide</a></li>
                <li><a href="#" class="footer-link">Shipping Info</a></li>
                <li><a href="#" class="footer-link">Returns & Exchanges</a></li>
                <li><a href="#" class="footer-link">Contact Us</a></li>
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
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-title">Legal</h4>
              <ul class="footer-menu">
                <li><a href="#" class="footer-link">Terms of Service</a></li>
                <li><a href="#" class="footer-link">Privacy Policy</a></li>
                <li><a href="#" class="footer-link">Cookie Policy</a></li>
                <li><a href="#" class="footer-link">Accessibility</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4 class="footer-title">Download Our App</h4>
              <p class="app-description">Get exclusive deals and early access</p>
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
    
    <!-- Floating Live Chat Button -->
    <div class="floating-support">
      <button class="support-chatbot" @click="openChatbot">
        <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="support-text">Need help? Chat now.</span>
        <div class="support-badge">Live</div>
      </button>
    </div>

    <!-- Premium Authentication Modal -->
    <PremiumAuthModal
      :visible="showAuthModal"
      @close="hideAuthModal"
      @signin-success="handleSignInSuccess"
      @signup-success="handleSignUpSuccess"
      @social-login="handleSocialLogin"
    />

    <!-- Voice Shopping Modal -->
    <div v-if="showVoiceModal" class="modal-overlay" @click="closeVoiceModal">
      <div class="modal-content voice-modal" @click.stop>
        <div class="voice-modal-content">
          <div class="voice-animation">
            <div class="voice-circle" :class="{ 'listening': isListening }"></div>
            <div class="voice-waves">
              <div class="wave"></div>
              <div class="wave"></div>
              <div class="wave"></div>
            </div>
          </div>
          <h3>Speak now to find your perfect pair…</h3>
          <p v-if="!isListening" class="voice-instruction">Click the microphone to start</p>
          <p v-else class="voice-instruction listening">Listening...</p>
          <button v-if="!isListening" @click="startVoiceSearch" class="voice-start-btn">
            <svg class="mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
          <button @click="closeVoiceModal" class="voice-close-btn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Cart Overlay -->
    <div v-if="showCartOverlay" class="modal-overlay" @click="closeCartOverlay">
      <div class="modal-content cart-overlay" @click.stop>
        <div class="cart-header">
          <h3>Shopping Cart ({{ cartCount }})</h3>
          <button @click="closeCartOverlay" class="close-btn">✕</button>
        </div>
        <div class="cart-content">
          <div v-if="cartCount === 0" class="empty-cart">
            <div class="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <button @click="closeCartOverlay" class="continue-shopping-btn">Continue Shopping</button>
          </div>
          <div v-else class="cart-items">
            <div v-for="item in cartItems" :key="item.cartId" class="cart-item">
              <img :src="item.image" :alt="item.name" class="cart-item-image" />
              <div class="cart-item-info">
                <h4>{{ item.name }}</h4>
                <p class="cart-item-brand">{{ item.brand }}</p>
                <div class="cart-item-variants" v-if="item.color || item.size">
                  <span v-if="item.color" class="variant">{{ item.color }}</span>
                  <span v-if="item.size" class="variant">Size {{ item.size }}</span>
                </div>
                <p class="cart-item-price">${{ item.price.toFixed(2) }}</p>
              </div>
              <div class="cart-item-quantity">
                <button @click="updateQuantity(item.cartId, -1)" class="qty-btn">−</button>
                <span class="qty">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.cartId, 1)" class="qty-btn">+</button>
              </div>
              <button @click="removeFromCart(item.cartId)" class="remove-item-btn">×</button>
            </div>
            <div class="cart-footer">
              <div class="cart-total">
                <strong>Total: ${{ cartTotal }}</strong>
              </div>
              <button class="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wishlist Overlay -->
    <div v-if="showWishlistOverlay" class="modal-overlay" @click="closeWishlistOverlay">
      <div class="modal-content wishlist-overlay" @click.stop>
        <div class="wishlist-header">
          <h3>Wishlist ({{ wishlistCount }})</h3>
          <button @click="closeWishlistOverlay" class="close-btn">✕</button>
        </div>
        <div class="wishlist-content">
          <div v-if="wishlistCount === 0" class="empty-wishlist">
            <div class="empty-icon">❤️</div>
            <p>Your wishlist is empty</p>
            <button @click="closeWishlistOverlay" class="continue-shopping-btn">Start Shopping</button>
          </div>
          <div v-else class="wishlist-items">
            <div v-for="item in wishlistItems" :key="item.id" class="wishlist-item">
              <img :src="item.image" :alt="item.name" class="wishlist-item-image" />
              <div class="wishlist-item-info">
                <h4>{{ item.name }}</h4>
                <p class="wishlist-item-brand">{{ item.brand }}</p>
                <p class="wishlist-item-price">${{ item.price }}</p>
                <button @click="moveToCart(item)" class="move-to-cart-btn">Add to Cart</button>
              </div>
              <button @click="removeFromWishlist(item.id)" class="remove-wishlist-btn">✕</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PremiumAuthModal from './PremiumAuthModal.vue'

export default {
  name: 'ComprehensiveHomepage',
  components: {
    PremiumAuthModal
  },
  data() {
    return {
      // Header state
      isScrolled: false,
      isSearchActive: false,
      showSuggestions: false,
      searchQuery: '',
      isListening: false,
      showProfileMenu: false,
      showVoiceModal: false,
      showCartOverlay: false,
      showWishlistOverlay: false,
      showAuthModal: false,

      // Banner state
      currentBanner: 0,
      bannerInterval: null,
      
      // Category state
      activeCategory: 'all',
      
      // Recommendations state
      activeRecTab: 'just-for-you',
      activeArrivalsTab: 'new-arrivals',
      
      // User state
      user: {
        isLoggedIn: true,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null
      },
      
      wishlistCount: 7,

      // Cart items managed by Vuex store

      // Wishlist items
      wishlistItems: [
        {
          id: 3,
          name: 'Chuck 70 High Top',
          brand: 'Converse',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop'
        },
        {
          id: 4,
          name: 'Old Skool Platform',
          brand: 'Vans',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=100&h=100&fit=crop'
        }
      ],
      
      // Countdown timer state
      countdown: {
        hours: 23,
        minutes: 45,
        seconds: 30
      },
      
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
          title: 'Sneaker Drops',
          subtitle: 'Get the latest releases before they sell out',
          badge: 'New Drop',
          ctaText: 'Shop Now',
          secondaryCTA: 'Explore Collection',
          backgroundImage: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=1200&h=600&fit=crop',
          features: ['Limited Edition', 'Exclusive Release', 'Premium Quality']
        },
        {
          id: 2,
          title: 'Holiday Sales',
          subtitle: 'Massive savings on your favorite brands this season',
          badge: 'Holiday Sale',
          ctaText: 'Shop Now',
          secondaryCTA: 'Explore Collection',
          backgroundImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&h=600&fit=crop',
          features: ['Up to 70% Off', 'Free Shipping', 'Extended Returns']
        },
        {
          id: 3,
          title: 'Back-to-School Deals',
          subtitle: 'Fresh styles for the new school year',
          badge: 'Back to School',
          ctaText: 'Shop Now',
          secondaryCTA: 'Explore Collection',
          backgroundImage: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1200&h=600&fit=crop',
          features: ['Student Discounts', 'Durable Styles', 'Comfort First']
        }
      ],
      
      // Quick categories
      quickCategories: [
        { id: 'men', name: 'Men', icon: '👨', count: 1203 },
        { id: 'women', name: 'Women', icon: '👩', count: 987 },
        { id: 'kids', name: 'Kids', icon: '👶', count: 357 },
        { id: 'sports', name: 'Sports', icon: '⚽', count: 789 },
        { id: 'casual', name: 'Casual', icon: '👟', count: 654 },
        { id: 'formal', name: 'Formal', icon: '👞', count: 432 }
      ],
      
      // Quick filters
      quickFilters: [
        { id: 'price', label: 'Under ₹999', icon: '💰', active: false },
        { id: 'size', label: 'Size Guide', icon: '📏', active: false },
        { id: 'new', label: 'New Arrivals', icon: '✨', badge: 'NEW', active: false },
        { id: 'sale', label: 'On Sale', icon: '🏷️', badge: '50%', active: false },
        { id: 'premium', label: 'Premium Brands', icon: '👑', active: false }
      ],
      
      // Recommendation tabs
      recommendationTabs: [
        { id: 'just-for-you', name: 'Just for You' },
        { id: 'complete-look', name: 'Complete the Look' },
        { id: 'similar-styles', name: 'Similar Styles' }
      ],
      
      // Arrivals tabs
      arrivalsTabs: [
        { id: 'new-arrivals', name: 'Fresh Arrivals', icon: '✨', count: 127 },
        { id: 'best-sellers', name: 'Best Sellers', icon: '🔥', count: 89 },
        { id: 'trending', name: 'Trending', icon: '📈', count: 156 }
      ],
      
      // Sample products data
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
          exclusive: true,
          aiMatch: true,
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
          sizeRange: '6-12'
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
          exclusive: false,
          aiMatch: true,
          colors: ['#333', '#fff', '#667eea'],
          sizeRange: '5-13'
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
          exclusive: false,
          colors: ['#000', '#fff', '#ff6b6b'],
          sizeRange: '4-14'
        }
      ],
      
      newArrivals: [
        {
          id: 4,
          name: 'React Infinity Run',
          brand: 'Nike',
          price: 159.99,
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
          rating: 4.8,
          reviews: 89,
          isNew: true,
          colors: ['#45b7d1', '#fff', '#333']
        },
        {
          id: 5,
          name: 'NMD_R1 V2',
          brand: 'Adidas',
          price: 139.99,
          originalPrice: 159.99,
          image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
          rating: 4.7,
          reviews: 67,
          isNew: true,
          discount: 13,
          colors: ['#4ecdc4', '#333', '#fff']
        }
      ],
      
      bestSellers: [
        {
          id: 6,
          name: 'Jordan 1 Retro High',
          brand: 'Jordan',
          price: 169.99,
          image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
          rating: 4.9,
          reviews: 312,
          isBestseller: true,
          colors: ['#ff6b6b', '#333', '#fff']
        }
      ],
      
      recentlyViewed: [
        {
          id: 7,
          name: 'Classic Leather',
          brand: 'Reebok',
          price: 74.99,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
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
      ],
      
      customerReviews: [
        {
          id: 1,
          name: 'Sarah Johnson',
          rating: 5,
          text: 'Amazing quality and super comfortable! The delivery was fast too.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=50&h=50&fit=crop&crop=face',
          productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop',
          productName: 'Nike Air Max 270'
        },
        {
          id: 2,
          name: 'Mike Chen',
          rating: 5,
          text: 'Perfect fit and style! Exactly what I was looking for.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          productImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=60&h=60&fit=crop',
          productName: 'Adidas Ultraboost'
        }
      ]
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartItemCount', 'cartTotal']),

    cartCount() {
      return this.cartItemCount
    },

    cartItems() {
      return this.cart
    }
  },
  mounted() {
    this.initializeEventListeners()
    this.startBannerAutoSlide()
    this.startCountdownTimer()
  },
  beforeDestroy() {
    this.cleanupEventListeners()
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval)
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
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
      this.showSuggestions = true
    },
    
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion
      this.showSuggestions = false
      console.log('Search for:', suggestion)
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.showSuggestions = false
    },
    
    toggleVoiceSearch() {
      this.showVoiceModal = true
    },

    startVoiceSearch() {
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
          this.showVoiceModal = false
          this.showSuggestions = false
          console.log('Voice search result:', this.searchQuery)
        }

        recognition.onerror = () => {
          this.isListening = false
          this.showVoiceModal = false
        }

        recognition.onend = () => {
          this.isListening = false
        }

        recognition.start()
      } else {
        alert('Voice search not supported in this browser')
        this.showVoiceModal = false
      }
    },

    closeVoiceModal() {
      this.showVoiceModal = false
      this.isListening = false
    },
    
    // Header actions
    openWishlist() {
      this.showWishlistOverlay = true
    },

    openCart() {
      this.showCartOverlay = true
    },

    closeCartOverlay() {
      this.showCartOverlay = false
    },

    closeWishlistOverlay() {
      this.showWishlistOverlay = false
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
      }, 5000) // Auto-slide every 5 seconds as requested
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
    
    // Filter functionality
    toggleFilter(filter) {
      filter.active = !filter.active
      console.log('Toggled filter:', filter.label)
    },
    
    // Product functionality
    viewProduct(product) {
      console.log('View product:', product.name)
      
      // Add to recently viewed if not already there
      if (!this.recentlyViewed.find(p => p.id === product.id)) {
        this.recentlyViewed.unshift({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image
        })
        
        // Keep only last 10 viewed items
        if (this.recentlyViewed.length > 10) {
          this.recentlyViewed = this.recentlyViewed.slice(0, 10)
        }
      }
    },
    
    addToCart(product) {
      // Check if product has variants that need selection
      const hasVariants = product.colors && product.colors.length > 1 || product.sizeRange

      if (hasVariants && !product.selectedColor && !product.selectedSize) {
        // For products with variants, use default selections or show variant modal
        const defaultColor = product.colors ? product.colors[0] : null
        const defaultSize = this.getDefaultSize(product)

        this.$store.dispatch('addToCart', {
          product: product,
          color: defaultColor,
          size: defaultSize
        })
      } else {
        // For simple products or products with selections already made
        this.$store.dispatch('addToCart', {
          product: product,
          color: product.selectedColor || (product.colors && product.colors[0]) || null,
          size: product.selectedSize || this.getDefaultSize(product)
        })
      }

      // Show success notification
      this.showAddToCartNotification(product)

      console.log('Added to cart:', product.name)
    },

    getDefaultSize(product) {
      if (product.sizeRange) {
        // Extract middle size from range like "6-12"
        const [min, max] = product.sizeRange.split('-').map(Number)
        return Math.ceil((min + max) / 2)
      }
      if (product.sizes && product.sizes.length > 0) {
        // Get middle size from available sizes
        return product.sizes[Math.floor(product.sizes.length / 2)]
      }
      return 9 // Default size
    },

    showAddToCartNotification(product) {
      // Create and show a temporary notification
      const notification = document.createElement('div')
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 14px;
          animation: slideInRight 0.3s ease-out;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          <div>
            <div style="font-weight: 700;">${product.name}</div>
            <div style="opacity: 0.9; font-size: 12px;">Added to cart successfully!</div>
          </div>
        </div>
      `

      // Add CSS animation
      const style = document.createElement('style')
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)

      document.body.appendChild(notification)

      // Remove notification after 3 seconds with slide out animation
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in'
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
          if (document.head.contains(style)) {
            document.head.removeChild(style)
          }
        }, 300)
      }, 3000)
    },
    
    toggleWishlist(productId) {
      console.log('Toggle wishlist for product:', productId)
    },
    
    isInWishlist(productId) {
      return Math.random() > 0.7
    },
    
    quickView(product) {
      console.log('Quick view:', product.name)
    },
    
    clearRecentlyViewed() {
      this.recentlyViewed = []
    },
    
    // Brand functionality
    viewBrand(brand) {
      console.log('View brand:', brand.name)
    },
    
    // Tab functionality
    getRecommendationProducts() {
      return this.recommendedProducts
    },
    
    getArrivalsProducts() {
      switch (this.activeArrivalsTab) {
        case 'new-arrivals':
          return this.newArrivals
        case 'best-sellers':
          return this.bestSellers
        case 'trending':
          return this.recommendedProducts.slice(0, 2)
        default:
          return this.newArrivals
      }
    },
    
    // Timer functionality
    startCountdownTimer() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown.seconds > 0) {
          this.countdown.seconds--
        } else if (this.countdown.minutes > 0) {
          this.countdown.minutes--
          this.countdown.seconds = 59
        } else if (this.countdown.hours > 0) {
          this.countdown.hours--
          this.countdown.minutes = 59
          this.countdown.seconds = 59
        } else {
          // Reset timer when it reaches 0
          this.countdown = { hours: 23, minutes: 59, seconds: 59 }
        }
      }, 1000)
    },
    
    // Support functionality
    openChatbot() {
      console.log('Open support chatbot')
    },

    // Cart functionality
    updateQuantity(cartId, change) {
      const item = this.cartItems.find(item => item.cartId === cartId)
      if (item) {
        const newQuantity = item.quantity + change
        this.$store.dispatch('updateCartQuantity', { cartId, quantity: newQuantity })
      }
    },

    moveToCart(item) {
      // Add item to cart using Vuex
      this.$store.dispatch('addToCart', {
        product: item,
        color: item.colors ? item.colors[0] : null,
        size: this.getDefaultSize(item)
      })

      // Remove from wishlist
      this.removeFromWishlist(item.id)

      // Show notification
      this.showAddToCartNotification(item)
    },

    removeFromWishlist(itemId) {
      this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId)
      this.wishlistCount--
    },

    removeFromCart(cartId) {
      this.$store.dispatch('removeFromCart', cartId)
    },

    // Authentication methods
    openAuthModal() {
      this.showAuthModal = true
    },

    hideAuthModal() {
      this.showAuthModal = false
    },

    handleSignInSuccess(userData) {
      console.log('Sign in successful:', userData)
      this.user = {
        isLoggedIn: true,
        name: userData.name,
        email: userData.email,
        avatar: null
      }
      this.showProfileMenu = false
    },

    handleSignUpSuccess(userData) {
      console.log('Sign up successful:', userData)
      this.user = {
        isLoggedIn: true,
        name: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        avatar: null
      }
      this.showProfileMenu = false
    },

    handleSocialLogin(provider) {
      console.log('Social login with:', provider)
      // Would integrate with actual social auth
    }
  },

  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
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

/* Enhanced Header */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 1000;
  transition: all 0.3s ease;
  border-bottom: 1px solid #e1e5e9;
}

.main-header.header-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  align-items: center;
  gap: 30px;
  min-height: 80px;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
}

.main-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-icon {
  font-size: 28px;
  margin-bottom: 2px;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.brand-tagline {
  font-size: 10px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Enhanced Search Section */
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
  border-radius: 30px;
  padding: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.search-container.search-focused {
  border-color: #667eea;
  background: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #666;
  margin: 0 15px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  padding: 12px 0;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.voice-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 6px;
}

.voice-search-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.voice-search-btn.listening {
  background: #ff4757;
  animation: pulse 1s infinite;
}

.mic-icon {
  width: 18px;
  height: 18px;
  color: #667eea;
}

.voice-search-btn.listening .mic-icon {
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

.clear-search-btn {
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

.clear-search-btn:hover {
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
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 13px;
  margin-bottom: 4px;
  color: #333;
}

.suggestion-item:hover {
  background: #f8f9ff;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 10px;
  position: relative;
}

.action-btn:hover {
  background: #f8f9ff;
}

.action-icon {
  width: 22px;
  height: 22px;
  color: #333;
}

.action-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
}

.action-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
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

.profile-avatar img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  margin-top: 8px;
  overflow: hidden;
  border: 1px solid #e1e5e9;
}

.profile-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.profile-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.profile-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.profile-menu {
  padding: 8px 0;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-divider {
  margin: 8px 0;
  border: none;
  border-top: 1px solid #e1e5e9;
}

.menu-item.logout {
  color: #dc3545;
  font-weight: 600;
}

.menu-item.logout:hover {
  background: #ffe6e6;
}

/* Hero Banners */
.hero-banners {
  margin-top: 80px;
  position: relative;
  height: 600px;
  overflow: hidden;
}

.banner-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-container {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.6s ease-in-out;
}

.banner-slide {
  width: 33.333%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.banner-text {
  flex: 1;
  max-width: 600px;
}

.banner-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.banner-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.1;
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

.feature-tag {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.banner-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.cta-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #667eea;
  border: none;
  padding: 16px 32px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.cta-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 14px 28px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  background: white;
  color: #667eea;
}

.cta-arrow {
  width: 18px;
  height: 18px;
}

/* Banner Navigation */
.banner-navigation {
  position: absolute;
  bottom: 30px;
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
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-dot.active {
  background: white;
  transform: scale(1.2);
}

.banner-controls {
  display: flex;
  gap: 8px;
}

.banner-control {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.banner-control:hover {
  background: rgba(255, 255, 255, 0.3);
}

.banner-control svg {
  width: 18px;
  height: 18px;
}

/* Quick Categories */
.quick-categories {
  padding: 60px 0;
  background: white;
}

.categories-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 40px;
  text-align: center;
  color: #333;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.category-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 20px;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.category-tile:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.category-tile.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.category-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.category-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.category-count {
  font-size: 14px;
  color: #666;
}

.category-tile.active .category-count {
  color: rgba(255, 255, 255, 0.8);
}

/* Filter Shortcuts */
.filter-shortcuts {
  padding: 40px 0;
  background: #f8f9fa;
}

.shortcuts-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.shortcuts-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.filter-chips {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  position: relative;
}

.filter-chip:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.filter-chip.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.filter-icon {
  font-size: 16px;
}

.filter-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
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

/* Content Sections */
.recommendations-section,
.recently-viewed-section,
.arrivals-bestsellers-section,
.deals-section,
.interactive-features,
.brand-spotlight-section,
.trust-elements {
  margin-bottom: 80px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.section-title-group {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #333;
}

.title-icon {
  font-size: 24px;
}

.section-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #667eea;
  color: white;
}

/* Recommendation Tabs */
.recommendations-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f0f0;
}

.rec-tab {
  padding: 12px 0;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.rec-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

/* Products Carousel */
.products-carousel {
  overflow: hidden;
}

.products-scroll {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.products-scroll::-webkit-scrollbar {
  display: none;
}

/* Enhanced Product Cards */
.product-card {
  min-width: 280px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-card.enhanced {
  min-width: 320px;
}

.product-card.compact {
  min-width: 200px;
}

.product-image-container {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.product-card.compact .product-image-container {
  height: 160px;
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
}

.badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.new {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.badge.sale {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.badge.exclusive {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge.bestseller {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  color: white;
}

.badge.ai-match {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.product-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-action:hover {
  background: white;
  transform: scale(1.1);
}

.product-action svg {
  width: 16px;
  height: 16px;
  color: #333;
}

.product-action.active svg {
  color: #ff4757;
  fill: #ff4757;
}

.product-info {
  padding: 20px;
}

.product-card.compact .product-info {
  padding: 16px;
}

.product-brand {
  font-size: 12px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.3;
}

.product-card.compact .product-name {
  font-size: 14px;
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
  color: #ddd;
}

.star.filled {
  color: #ffd700;
}

.rating-count {
  font-size: 12px;
  color: #666;
}

.product-colors {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #e1e5e9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-dot:hover {
  transform: scale(1.2);
}

.product-size-preview {
  margin-bottom: 12px;
}

.size-label {
  font-size: 11px;
  color: #666;
  font-weight: 600;
}

.size-range {
  font-size: 12px;
  color: #333;
  font-weight: 600;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 20px;
  font-weight: 800;
  color: #333;
}

.product-card.compact .current-price {
  font-size: 16px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.cart-icon {
  width: 16px;
  height: 16px;
}

/* Recently Viewed */
.clear-history-btn {
  background: none;
  border: 1px solid #e1e5e9;
  color: #666;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-history-btn:hover {
  border-color: #ff4757;
  color: #ff4757;
}

/* Arrivals & Bestsellers Tabs */
.section-tabs {
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  border-bottom: 2px solid #f0f0f0;
}

.section-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.section-tab.active {
  border-bottom-color: #667eea;
}

.tab-icon {
  font-size: 20px;
}

.tab-name {
  font-size: 18px;
  font-weight: 700;
  color: #666;
}

.section-tab.active .tab-name {
  color: #667eea;
}

.tab-count {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.section-tab.active .tab-count {
  background: #667eea;
  color: white;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.products-grid.enhanced {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

/* Deals Section */
.deals-section .section-header.special {
  align-items: center;
}

.section-title.deals {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.deals-timer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timer-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.countdown-timer {
  display: flex;
  gap: 12px;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ff4757;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 50px;
}

.time-value {
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
}

.time-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.deals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.deal-highlight {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.deal-highlight:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.deal-banner {
  padding: 40px 32px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.deal-banner.sale {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.deal-banner.exclusive {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.deal-banner h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
}

.deal-banner p {
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.deal-cta {
  background: white;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.deal-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Interactive Features */
.feature-promos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
}

.feature-promo {
  background: white;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-promo:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.feature-content {
  flex: 1;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-promo h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #333;
}

.feature-promo p {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.feature-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.feature-cta {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.feature-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.feature-visual {
  flex: 0 0 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ar-demo,
.store-locator {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-mockup {
  width: 120px;
  height: 200px;
  background: #333;
  border-radius: 20px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.map-mockup {
  width: 160px;
  height: 120px;
  background: #f0f0f0;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-pins {
  display: flex;
  gap: 20px;
}

.store-pin {
  font-size: 24px;
  animation: bounce 2s infinite;
}

.store-pin:nth-child(2) {
  animation-delay: 0.5s;
}

.store-pin:nth-child(3) {
  animation-delay: 1s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Brand Spotlight */
.brands-carousel {
  overflow: hidden;
}

.brands-scroll {
  display: flex;
  gap: 32px;
  overflow-x: auto;
  padding-bottom: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.brands-scroll::-webkit-scrollbar {
  display: none;
}

.brand-spotlight-card {
  min-width: 350px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.brand-spotlight-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.brand-image {
  position: relative;
  height: 200px;
  overflow: hidden;
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
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.brand-content {
  padding: 32px;
  text-align: center;
}

.brand-logo {
  margin-bottom: 16px;
}

.brand-logo img {
  height: 40px;
  object-fit: contain;
}

.brand-name {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #333;
}

.brand-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.brand-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.stat {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.brand-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.brand-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

/* Trust Elements */
.trust-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.trust-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  margin-top: 40px;
}

.trust-block h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 24px;
  color: #333;
}

/* Customer Reviews */
.reviews-header {
  margin-bottom: 32px;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-value {
  font-size: 18px;
  font-weight: 800;
  color: #333;
}

.review-count {
  font-size: 14px;
  color: #666;
}

.review-highlights {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  font-style: italic;
}

.review-product {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-product-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
}

.review-product-name {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

/* Trust Badges */
.trust-badges {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.trust-badge {
  text-align: center;
  padding: 24px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.trust-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.trust-badge h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.trust-badge p {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* Enhanced Footer */
.main-footer {
  background: #1a1a1a;
  color: white;
  margin-top: 80px;
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
  padding: 60px 0 40px;
  border-bottom: 1px solid #333;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 800;
}

.footer-tagline {
  font-size: 16px;
  color: #ccc;
  line-height: 1.5;
}

/* Newsletter */
.newsletter-signup h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #2a2a2a;
  color: white;
  font-size: 14px;
}

.newsletter-input::placeholder {
  color: #999;
}

.newsletter-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.newsletter-btn:hover {
  transform: translateY(-1px);
}

.newsletter-note {
  font-size: 12px;
  color: #999;
}

/* Social Media */
.footer-social {
  display: flex;
  gap: 16px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #667eea;
  transform: translateY(-2px);
}

.social-link svg {
  width: 18px;
  height: 18px;
}

/* Footer Links */
.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-menu li {
  margin-bottom: 8px;
}

.footer-link {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white;
}

.app-description {
  font-size: 14px;
  color: #ccc;
  margin-bottom: 16px;
  line-height: 1.4;
}

.app-downloads {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-download img {
  height: 40px;
  object-fit: contain;
}

/* Footer Bottom */
.footer-bottom {
  padding: 24px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 14px;
  color: #999;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 16px;
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
  border-radius: 4px;
}

/* Floating Support */
.floating-support {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.support-chatbot {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.support-chatbot:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.4);
}

.chat-icon {
  width: 20px;
  height: 20px;
}

.support-text {
  font-size: 14px;
}

.support-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #28a745;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  animation: pulse 2s infinite;
}

/* Voice Modal */
.voice-modal {
  max-width: 400px;
  text-align: center;
}

.voice-modal-content {
  padding: 40px 30px;
}

.voice-animation {
  position: relative;
  margin-bottom: 30px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.voice-circle.listening {
  animation: voicePulse 1.5s ease-in-out infinite;
}

@keyframes voicePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
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
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  animation: voiceWave 2s ease-out infinite;
}

.wave:nth-child(2) {
  animation-delay: 0.5s;
}

.wave:nth-child(3) {
  animation-delay: 1s;
}

@keyframes voiceWave {
  0% {
    width: 80px;
    height: 80px;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

.voice-modal h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

.voice-instruction {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.voice-instruction.listening {
  color: #667eea;
  font-weight: 600;
}

.voice-start-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.3s ease;
}

.voice-start-btn:hover {
  transform: scale(1.1);
}

.voice-start-btn .mic-icon {
  width: 24px;
  height: 24px;
}

.voice-close-btn {
  background: none;
  border: 1px solid #e1e5e9;
  color: #666;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.voice-close-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Cart & Wishlist Overlays */
.cart-overlay,
.wishlist-overlay {
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cart-header,
.wishlist-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.cart-header h3,
.wishlist-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f0f0f0;
}

.cart-content,
.wishlist-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.empty-cart,
.empty-wishlist {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-cart p,
.empty-wishlist p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.continue-shopping-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-shopping-btn:hover {
  transform: translateY(-1px);
}

.cart-items,
.wishlist-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item,
.wishlist-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  position: relative;
}

.cart-item-image,
.wishlist-item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.cart-item-info,
.wishlist-item-info {
  flex: 1;
}

.cart-item-info h4,
.wishlist-item-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.cart-item-brand,
.wishlist-item-brand {
  font-size: 12px;
  color: #666;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  font-weight: 600;
}

.cart-item-variants {
  display: flex;
  gap: 8px;
  margin: 4px 0;
}

.variant {
  background: #f0f0f0;
  color: #666;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.cart-item-price,
.wishlist-item-price {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e1e5e9;
  border: none;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: #667eea;
  color: white;
}

.qty {
  font-size: 16px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.move-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.move-to-cart-btn:hover {
  transform: translateY(-1px);
}

.remove-wishlist-btn {
  background: #ff4757;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.remove-wishlist-btn:hover {
  background: #ff3742;
}

.remove-item-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4757;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.remove-item-btn:hover {
  background: #ff3742;
  transform: scale(1.1);
}

.cart-footer {
  border-top: 1px solid #e1e5e9;
  padding-top: 16px;
  margin-top: 16px;
}

.cart-total {
  text-align: center;
  margin-bottom: 16px;
  font-size: 18px;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkout-btn:hover {
  transform: translateY(-1px);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

/* Updated Timer Styles */
.countdown-timer {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ff4757;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
}

.time-unit {
  font-size: 18px;
  min-width: 30px;
  text-align: center;
}

.time-separator {
  font-size: 18px;
  font-weight: 700;
}

/* Trust Badges Row */
.trust-badges-row {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-top: 20px;
}

.trust-badges-row .trust-badge {
  flex: 1;
  text-align: center;
  padding: 20px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.trust-badges-row .trust-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.trust-badges-row .trust-badge h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-container {
    grid-template-columns: 240px 1fr 240px;
    gap: 20px;
  }
  
  .trust-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-top {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .header-container {
    grid-template-columns: 1fr;
    gap: 16px;
    min-height: auto;
    padding: 16px 20px;
  }
  
  .search-section {
    order: 2;
  }
  
  .header-actions {
    order: 1;
    justify-content: space-between;
  }
  
  .banner-title {
    font-size: 32px;
  }
  
  .banner-subtitle {
    font-size: 16px;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .feature-promos {
    grid-template-columns: 1fr;
  }
  
  .feature-promo {
    flex-direction: column;
    text-align: center;
  }
  
  .deals-grid {
    grid-template-columns: 1fr;
  }
  
  .trust-badges {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .products-grid,
  .products-grid.enhanced {
    grid-template-columns: 1fr;
  }

  .product-card,
  .product-card.enhanced {
    min-width: 100%;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .floating-support {
    bottom: 20px;
    right: 20px;
  }

  .support-chatbot {
    padding: 12px 16px;
  }

  .support-text {
    display: none;
  }

  .voice-modal {
    max-width: 90vw;
    margin: 20px;
  }

  .cart-overlay,
  .wishlist-overlay {
    max-width: 90vw;
    margin: 20px;
  }

  .trust-badges-row {
    flex-direction: column;
    gap: 12px;
  }

  .countdown-timer {
    font-size: 14px;
  }

  .time-unit {
    font-size: 16px;
    min-width: 25px;
  }
}
</style>
