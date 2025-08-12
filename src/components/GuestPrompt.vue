<template>
  <div class="guest-prompt" :class="{ visible }" @click="closePrompt">
    <div class="prompt-container" @click.stop>
      <div class="prompt-content">
        <div class="prompt-icon">🔑</div>
        <h3>Sign in for the best experience</h3>
        <p>Create an account or sign in to save favorites, track orders, and get personalized recommendations.</p>
        
        <div class="prompt-actions">
          <button @click="signup" class="primary-btn">Create Account</button>
          <button @click="signin" class="secondary-btn">Sign In</button>
          <button @click="continueGuest" class="guest-btn">Continue as Guest</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuestPrompt',
  props: {
    visible: Boolean
  },
  methods: {
    closePrompt() {
      this.$emit('close')
    },
    signup() {
      this.$emit('signup')
      this.closePrompt()
    },
    signin() {
      this.$emit('signup') // Same modal handles both
      this.closePrompt()
    },
    continueGuest() {
      this.$emit('continue-guest')
      this.closePrompt()
    }
  }
}
</script>

<style scoped>
.guest-prompt {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1500;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.guest-prompt.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.prompt-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 24px;
  max-width: 320px;
  border: 1px solid #e9ecef;
}

.prompt-icon {
  font-size: 32px;
  text-align: center;
  margin-bottom: 16px;
}

.prompt-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.prompt-content p {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}

.prompt-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary-btn, .secondary-btn, .guest-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.secondary-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.guest-btn {
  background: none;
  color: #999;
  border: none;
  font-size: 12px;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.secondary-btn:hover {
  background: #667eea;
  color: white;
}

.guest-btn:hover {
  color: #666;
  text-decoration: underline;
}
</style>
