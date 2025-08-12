<template>
  <div class="gender-age-filters">
    <div class="filter-section">
      <h4 class="filter-title">Quick Filters</h4>
      <div class="filter-chips">
        <button
          v-for="filter in quickFilters"
          :key="filter.id"
          :class="['filter-chip', { active: activeFilters.includes(filter.id) }]"
          @click="toggleFilter(filter.id)"
        >
          <span class="chip-icon">{{ filter.icon }}</span>
          <span class="chip-label">{{ filter.label }}</span>
          <span v-if="filter.count" class="chip-count">({{ filter.count }})</span>
        </button>
      </div>
    </div>
    
    <!-- Advanced Gender Filters -->
    <div class="advanced-filters" v-if="showAdvanced">
      <div class="filter-group">
        <h5 class="group-title">Gender</h5>
        <div class="filter-options">
          <label
            v-for="gender in genderOptions"
            :key="gender.id"
            :class="['filter-option', { checked: selectedGenders.includes(gender.id) }]"
          >
            <input
              type="checkbox"
              :value="gender.id"
              v-model="selectedGenders"
              @change="updateFilters"
            />
            <span class="option-icon">{{ gender.icon }}</span>
            <span class="option-label">{{ gender.label }}</span>
            <span class="option-count">({{ gender.count }})</span>
          </label>
        </div>
      </div>
      
      <div class="filter-group">
        <h5 class="group-title">Age Group</h5>
        <div class="filter-options">
          <label
            v-for="age in ageOptions"
            :key="age.id"
            :class="['filter-option', { checked: selectedAges.includes(age.id) }]"
          >
            <input
              type="checkbox"
              :value="age.id"
              v-model="selectedAges"
              @change="updateFilters"
            />
            <span class="option-icon">{{ age.icon }}</span>
            <span class="option-label">{{ age.label }}</span>
            <span class="option-count">({{ age.count }})</span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- Toggle Advanced Filters -->
    <button 
      class="toggle-advanced"
      @click="showAdvanced = !showAdvanced"
    >
      {{ showAdvanced ? 'Hide' : 'More' }} Filters
      <span class="toggle-icon">{{ showAdvanced ? '▲' : '▼' }}</span>
    </button>
    
    <!-- Active Filters Summary -->
    <div v-if="activeFilters.length > 0" class="active-filters">
      <div class="active-chips">
        <span
          v-for="filterId in activeFilters"
          :key="filterId"
          class="active-chip"
        >
          {{ getFilterLabel(filterId) }}
          <button 
            class="remove-chip"
            @click="removeFilter(filterId)"
          >
            ×
          </button>
        </span>
      </div>
      <button class="clear-all" @click="clearAllFilters">
        Clear All
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'GenderAgeFilters',
  data() {
    return {
      showAdvanced: false,
      selectedGenders: [],
      selectedAges: [],
      quickFilters: [
        { id: 'men', label: "Men's", icon: '👨', count: 0 },
        { id: 'women', label: "Women's", icon: '👩', count: 0 },
        { id: 'kids', label: "Kids'", icon: '👶', count: 0 },
        { id: 'unisex', label: 'Unisex', icon: '👥', count: 0 }
      ],
      genderOptions: [
        { id: 'men', label: "Men's Footwear", icon: '👨', count: 0 },
        { id: 'women', label: "Women's Footwear", icon: '👩', count: 0 },
        { id: 'boys', label: "Boys' Shoes", icon: '👦', count: 0 },
        { id: 'girls', label: "Girls' Shoes", icon: '👧', count: 0 },
        { id: 'unisex', label: 'Unisex Styles', icon: '👥', count: 0 }
      ],
      ageOptions: [
        { id: 'toddler', label: 'Toddler (1-3)', icon: '🍼', count: 0 },
        { id: 'kids', label: 'Kids (4-12)', icon: '👶', count: 0 },
        { id: 'teen', label: 'Teen (13-17)', icon: '🧒', count: 0 },
        { id: 'adult', label: 'Adult (18+)', icon: '👤', count: 0 },
        { id: 'senior', label: 'Senior (65+)', icon: '👴', count: 0 }
      ]
    }
  },
  computed: {
    ...mapState(['filters', 'products']),
    ...mapGetters(['filteredProducts']),
    
    activeFilters() {
      const active = []
      if (this.selectedGenders.length > 0) {
        active.push(...this.selectedGenders)
      }
      if (this.selectedAges.length > 0) {
        active.push(...this.selectedAges)
      }
      return active
    }
  },
  watch: {
    products: {
      handler() {
        this.updateCounts()
      },
      immediate: true
    }
  },
  methods: {
    toggleFilter(filterId) {
      if (this.activeFilters.includes(filterId)) {
        this.removeFilter(filterId)
      } else {
        // Add filter based on type
        if (['men', 'women', 'boys', 'girls', 'unisex'].includes(filterId)) {
          if (!this.selectedGenders.includes(filterId)) {
            this.selectedGenders.push(filterId)
          }
        } else if (['toddler', 'kids', 'teen', 'adult', 'senior'].includes(filterId)) {
          if (!this.selectedAges.includes(filterId)) {
            this.selectedAges.push(filterId)
          }
        } else {
          // Handle quick filters
          if (filterId === 'men' && !this.selectedGenders.includes('men')) {
            this.selectedGenders.push('men')
          } else if (filterId === 'women' && !this.selectedGenders.includes('women')) {
            this.selectedGenders.push('women')
          } else if (filterId === 'kids' && !this.selectedAges.includes('kids')) {
            this.selectedAges.push('kids')
          } else if (filterId === 'unisex' && !this.selectedGenders.includes('unisex')) {
            this.selectedGenders.push('unisex')
          }
        }
        this.updateFilters()
      }
    },
    
    removeFilter(filterId) {
      this.selectedGenders = this.selectedGenders.filter(id => id !== filterId)
      this.selectedAges = this.selectedAges.filter(id => id !== filterId)
      this.updateFilters()
    },
    
    clearAllFilters() {
      this.selectedGenders = []
      this.selectedAges = []
      this.updateFilters()
    },
    
    updateFilters() {
      // Emit the current filter state to parent component or store
      this.$emit('filters-changed', {
        genders: this.selectedGenders,
        ages: this.selectedAges
      })
      
      // Update Vuex store with combined filter criteria
      const genderFilter = this.selectedGenders.length > 0 ? this.selectedGenders : null
      const ageFilter = this.selectedAges.length > 0 ? this.selectedAges : null
      
      this.$store.dispatch('setFilters', {
        gender: genderFilter,
        age: ageFilter
      })
    },
    
    getFilterLabel(filterId) {
      const allOptions = [...this.quickFilters, ...this.genderOptions, ...this.ageOptions]
      const option = allOptions.find(opt => opt.id === filterId)
      return option ? option.label : filterId
    },
    
    updateCounts() {
      // Update counts based on current products
      // This would typically come from an API or computed from products
      const counts = this.calculateFilterCounts()
      
      // Update quick filters counts
      this.quickFilters.forEach(filter => {
        filter.count = counts[filter.id] || 0
      })
      
      // Update gender options counts
      this.genderOptions.forEach(option => {
        option.count = counts[option.id] || 0
      })
      
      // Update age options counts
      this.ageOptions.forEach(option => {
        option.count = counts[option.id] || 0
      })
    },
    
    calculateFilterCounts() {
      // Mock implementation - in real app, this would analyze products
      // and count matches for each filter
      return {
        men: 45,
        women: 38,
        kids: 22,
        boys: 12,
        girls: 10,
        unisex: 15,
        toddler: 8,
        teen: 14,
        adult: 83,
        senior: 5
      }
    }
  }
}
</script>

<style scoped>
.gender-age-filters {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.filter-chip:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.filter-chip.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.chip-icon {
  font-size: 16px;
}

.chip-label {
  font-weight: 600;
}

.chip-count {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 500;
}

.advanced-filters {
  border-top: 1px solid #e1e5e9;
  padding-top: 16px;
  margin-top: 16px;
  animation: slideDown 0.3s ease-out;
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

.filter-group {
  margin-bottom: 20px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.filter-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.filter-option.checked {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.filter-option input {
  display: none;
}

.option-icon {
  font-size: 14px;
}

.option-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
}

.option-count {
  font-size: 12px;
  opacity: 0.8;
}

.toggle-advanced {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  margin-top: 16px;
}

.toggle-advanced:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.toggle-icon {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.active-filters {
  border-top: 1px solid #e1e5e9;
  padding-top: 16px;
  margin-top: 16px;
}

.active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.active-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.remove-chip {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.remove-chip:hover {
  background: rgba(255, 255, 255, 0.2);
}

.clear-all {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 6px 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.clear-all:hover {
  background: #dc3545;
  color: white;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .gender-age-filters {
    padding: 16px;
  }
  
  .filter-chips {
    gap: 6px;
  }
  
  .filter-chip {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .chip-icon {
    font-size: 14px;
  }
  
  .filter-options {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .filter-option {
    padding: 6px 10px;
  }
  
  .option-label {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .filter-chips {
    gap: 4px;
  }
  
  .filter-chip {
    padding: 4px 10px;
    font-size: 12px;
  }
  
  .chip-count {
    display: none;
  }
  
  .option-count {
    display: none;
  }
}
</style>
