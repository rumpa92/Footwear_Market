import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    products: [
      {
        id: 1,
        name: 'Nike Air Max 270',
        brand: 'Nike',
        price: 150,
        originalPrice: 180,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        category: 'sneakers',
        sizes: [7, 8, 9, 10, 11, 12],
        colors: ['Black', 'White', 'Blue'],
        rating: 4.5,
        reviews: 124,
        isNew: false,
        onSale: true
      },
      {
        id: 2,
        name: 'Adidas Ultraboost 22',
        brand: 'Adidas',
        price: 180,
        originalPrice: 180,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
        category: 'running',
        sizes: [7, 8, 9, 10, 11],
        colors: ['White', 'Black', 'Grey'],
        rating: 4.7,
        reviews: 89,
        isNew: true,
        onSale: false
      },
      {
        id: 3,
        name: 'Converse Chuck 70',
        brand: 'Converse',
        price: 85,
        originalPrice: 85,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        category: 'casual',
        sizes: [6, 7, 8, 9, 10, 11, 12],
        colors: ['Black', 'White', 'Red'],
        rating: 4.3,
        reviews: 256,
        isNew: false,
        onSale: false
      },
      {
        id: 4,
        name: 'Vans Old Skool',
        brand: 'Vans',
        price: 65,
        originalPrice: 80,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
        category: 'skate',
        sizes: [7, 8, 9, 10, 11],
        colors: ['Black', 'Navy', 'Maroon'],
        rating: 4.4,
        reviews: 178,
        isNew: false,
        onSale: true
      },
      {
        id: 5,
        name: 'Jordan 1 Retro High',
        brand: 'Jordan',
        price: 170,
        originalPrice: 170,
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
        category: 'basketball',
        sizes: [8, 9, 10, 11, 12],
        colors: ['Black/Red', 'White/Black', 'Royal Blue'],
        rating: 4.8,
        reviews: 312,
        isNew: true,
        onSale: false
      },
      {
        id: 6,
        name: 'New Balance 990v5',
        brand: 'New Balance',
        price: 185,
        originalPrice: 185,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop',
        category: 'lifestyle',
        sizes: [7, 8, 9, 10, 11],
        colors: ['Grey', 'Navy', 'Black'],
        rating: 4.6,
        reviews: 67,
        isNew: false,
        onSale: false
      }
    ],
    cart: [],
    filters: {
      category: 'all',
      brand: 'all',
      priceRange: [0, 500],
      sortBy: 'name'
    },
    user: {
      isLoggedIn: false,
      name: '',
      favorites: []
    },
    loading: false,
    searchQuery: ''
  },

  getters: {
    filteredProducts: (state) => {
      let filtered = [...state.products]

      // Search filter
      if (state.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      }

      // Category filter
      if (state.filters.category !== 'all') {
        filtered = filtered.filter(product => product.category === state.filters.category)
      }

      // Brand filter
      if (state.filters.brand !== 'all') {
        filtered = filtered.filter(product => product.brand === state.filters.brand)
      }

      // Price range filter
      filtered = filtered.filter(product =>
        product.price >= state.filters.priceRange[0] &&
        product.price <= state.filters.priceRange[1]
      )

      // Sort
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'newest':
            return b.id - a.id
          default:
            return a.name.localeCompare(b.name)
        }
      })

      return filtered
    },

    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    cartItemCount: (state) => {
      return state.cart.reduce((count, item) => count + item.quantity, 0)
    },

    featuredProducts: (state) => {
      return state.products.filter(product => product.rating >= 4.5).slice(0, 4)
    },

    onSaleProducts: (state) => {
      return state.products.filter(product => product.onSale)
    },

    newProducts: (state) => {
      return state.products.filter(product => product.isNew)
    },

    availableBrands: (state) => {
      const brands = [...new Set(state.products.map(product => product.brand))]
      return brands.sort()
    },

    availableCategories: (state) => {
      const categories = [...new Set(state.products.map(product => product.category))]
      return categories.sort()
    }
  },

  mutations: {
    ADD_TO_CART(state, { product, size, color }) {
      const existingItem = state.cart.find(item =>
        item.id === product.id && item.size === size && item.color === color
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cart.push({
          ...product,
          size,
          color,
          quantity: 1,
          cartId: Date.now()
        })
      }
    },

    REMOVE_FROM_CART(state, cartId) {
      state.cart = state.cart.filter(item => item.cartId !== cartId)
    },

    UPDATE_CART_QUANTITY(state, { cartId, quantity }) {
      const item = state.cart.find(item => item.cartId === cartId)
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter(item => item.cartId !== cartId)
        } else {
          item.quantity = quantity
        }
      }
    },

    CLEAR_CART(state) {
      state.cart = []
    },

    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },

    SET_CATEGORY_FILTER(state, category) {
      state.filters.category = category
    },

    SET_BRAND_FILTER(state, brand) {
      state.filters.brand = brand
    },

    SET_PRICE_RANGE(state, range) {
      state.filters.priceRange = range
    },

    SET_SORT_BY(state, sortBy) {
      state.filters.sortBy = sortBy
    },

    TOGGLE_FAVORITE(state, productId) {
      const index = state.user.favorites.indexOf(productId)
      if (index > -1) {
        state.user.favorites.splice(index, 1)
      } else {
        state.user.favorites.push(productId)
      }
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    LOGIN_USER(state, userData) {
      state.user.isLoggedIn = true
      state.user.name = userData.name
    },

    LOGOUT_USER(state) {
      state.user.isLoggedIn = false
      state.user.name = ''
      state.user.favorites = []
    }
  },

  actions: {
    addToCart({ commit }, payload) {
      commit('ADD_TO_CART', payload)
    },

    removeFromCart({ commit }, cartId) {
      commit('REMOVE_FROM_CART', cartId)
    },

    updateCartQuantity({ commit }, payload) {
      commit('UPDATE_CART_QUANTITY', payload)
    },

    clearCart({ commit }) {
      commit('CLEAR_CART')
    },

    setSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query)
    },

    setFilters({ commit }, filters) {
      if (filters.category !== undefined) commit('SET_CATEGORY_FILTER', filters.category)
      if (filters.brand !== undefined) commit('SET_BRAND_FILTER', filters.brand)
      if (filters.priceRange !== undefined) commit('SET_PRICE_RANGE', filters.priceRange)
      if (filters.sortBy !== undefined) commit('SET_SORT_BY', filters.sortBy)
    },

    toggleFavorite({ commit }, productId) {
      commit('TOGGLE_FAVORITE', productId)
    },

    async loadProducts({ commit }) {
      commit('SET_LOADING', true)
      // Simulate API call
      setTimeout(() => {
        commit('SET_LOADING', false)
      }, 500)
    },

    loginUser({ commit }, userData) {
      commit('LOGIN_USER', userData)
    },

    logoutUser({ commit }) {
      commit('LOGOUT_USER')
    }
  }
})

export default store
