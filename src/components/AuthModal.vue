<template>
  <div class="auth-modal" :class="{ open: isVisible }" @click="closeModal">
    <div class="auth-overlay"></div>
    <div class="auth-container" @click.stop>
      <!-- Brand Header -->
      <div class="auth-header">
        <div class="brand-logo">
          <span class="logo-icon">👟</span>
          <span class="brand-name">Sole Hub</span>
        </div>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Tab Navigation -->
      <div class="auth-tabs">
        <button 
          :class="{ active: activeTab === 'signin' }"
          @click="setActiveTab('signin')"
          class="tab-btn"
        >
          Sign In
        </button>
        <button 
          :class="{ active: activeTab === 'signup' }"
          @click="setActiveTab('signup')"
          class="tab-btn"
        >
          Sign Up
        </button>
        <div class="tab-indicator" :class="{ 'move-right': activeTab === 'signup' }"></div>
      </div>

      <!-- Auth Forms -->
      <div class="auth-content">
        <!-- Sign In Form -->
        <form v-show="activeTab === 'signin'" @submit.prevent="handleSignIn" class="auth-form signin-form">
          <h2 class="form-title">Welcome Back</h2>
          <p class="form-subtitle">Sign in to your account</p>

          <div class="form-group">
            <label for="signin-email">Email or Phone</label>
            <div class="input-wrapper">
              <input
                id="signin-email"
                v-model="signinForm.email"
                type="text"
                placeholder="Enter your email or phone"
                class="form-input"
                required
              >
              <span class="input-icon">📧</span>
            </div>
          </div>

          <div class="form-group">
            <label for="signin-password">Password</label>
            <div class="input-wrapper">
              <input
                id="signin-password"
                v-model="signinForm.password"
                :type="showSigninPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="form-input"
                required
              >
              <button 
                type="button"
                @click="toggleSigninPassword"
                class="password-toggle"
              >
                {{ showSigninPassword ? '👁️' : '🙈' }}
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="signinForm.remember">
              <span class="checkmark"></span>
              Remember me
            </label>
            <button type="button" @click="showForgotPassword" class="forgot-link">
              Forgot Password?
            </button>
          </div>

          <button type="submit" class="primary-btn" :disabled="signinLoading">
            <span v-if="signinLoading" class="loading-spinner"></span>
            {{ signinLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Sign Up Form -->
        <form v-show="activeTab === 'signup'" @submit.prevent="handleSignUp" class="auth-form signup-form">
          <h2 class="form-title">Create Account</h2>
          <p class="form-subtitle">Join our premium footwear community</p>

          <div class="form-row">
            <div class="form-group half">
              <label for="signup-firstname">First Name</label>
              <div class="input-wrapper">
                <input
                  id="signup-firstname"
                  v-model="signupForm.firstName"
                  type="text"
                  placeholder="First name"
                  class="form-input"
                  required
                >
                <span class="input-icon">👤</span>
              </div>
            </div>
            <div class="form-group half">
              <label for="signup-lastname">Last Name</label>
              <div class="input-wrapper">
                <input
                  id="signup-lastname"
                  v-model="signupForm.lastName"
                  type="text"
                  placeholder="Last name"
                  class="form-input"
                  required
                >
                <span class="input-icon">👤</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="signup-email">Email Address</label>
            <div class="input-wrapper">
              <input
                id="signup-email"
                v-model="signupForm.email"
                type="email"
                placeholder="Enter your email"
                class="form-input"
                required
              >
              <span class="input-icon">📧</span>
            </div>
          </div>

          <div class="form-group">
            <label for="signup-password">Password</label>
            <div class="input-wrapper">
              <input
                id="signup-password"
                v-model="signupForm.password"
                :type="showSignupPassword ? 'text' : 'password'"
                placeholder="Create a password"
                class="form-input"
                required
                minlength="8"
              >
              <button 
                type="button"
                @click="toggleSignupPassword"
                class="password-toggle"
              >
                {{ showSignupPassword ? '👁️' : '🙈' }}
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :class="passwordStrength"></div>
              </div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="signup-confirm">Confirm Password</label>
            <div class="input-wrapper">
              <input
                id="signup-confirm"
                v-model="signupForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                class="form-input"
                required
              >
              <button 
                type="button"
                @click="toggleConfirmPassword"
                class="password-toggle"
              >
                {{ showConfirmPassword ? '👁️' : '🙈' }}
              </button>
            </div>
            <div v-if="signupForm.confirmPassword && !passwordsMatch" class="error-message">
              Passwords do not match
            </div>
          </div>

          <div class="form-options">
            <label class="terms-checkbox">
              <input type="checkbox" v-model="signupForm.agreeTerms" required>
              <span class="checkmark"></span>
              I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" class="primary-btn" :disabled="signupLoading || !passwordsMatch || !signupForm.agreeTerms">
            <span v-if="signupLoading" class="loading-spinner"></span>
            {{ signupLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Social Login -->
        <div class="social-login">
          <div class="divider">
            <span>or continue with</span>
          </div>
          <div class="social-buttons">
            <button @click="socialLogin('google')" class="social-btn google">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            
            <button @click="socialLogin('apple')" class="social-btn apple">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path fill="#000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
            
            <button @click="socialLogin('facebook')" class="social-btn facebook">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotModal" class="forgot-modal">
        <div class="forgot-content">
          <h3>Reset Password</h3>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
          <div class="form-group">
            <input
              v-model="forgotEmail"
              type="email"
              placeholder="Enter your email"
              class="form-input"
              required
            >
          </div>
          <div class="forgot-actions">
            <button @click="hideForgotPassword" class="secondary-btn">Cancel</button>
            <button @click="handleForgotPassword" class="primary-btn">Send Reset Link</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: 'signin',
      showSigninPassword: false,
      showSignupPassword: false,
      showConfirmPassword: false,
      signinLoading: false,
      signupLoading: false,
      showForgotModal: false,
      forgotEmail: '',
      signinForm: {
        email: '',
        password: '',
        remember: false
      },
      signupForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      }
    }
  },
  computed: {
    isVisible() {
      return this.visible
    },
    passwordsMatch() {
      return this.signupForm.password === this.signupForm.confirmPassword
    },
    passwordStrength() {
      const password = this.signupForm.password
      if (password.length < 6) return 'weak'
      if (password.length < 8) return 'medium'
      if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'strong'
      return 'medium'
    },
    passwordStrengthText() {
      const strength = this.passwordStrength
      return strength.charAt(0).toUpperCase() + strength.slice(1)
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    setActiveTab(tab) {
      this.activeTab = tab
    },
    toggleSigninPassword() {
      this.showSigninPassword = !this.showSigninPassword
    },
    toggleSignupPassword() {
      this.showSignupPassword = !this.showSignupPassword
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    showForgotPassword() {
      this.showForgotModal = true
    },
    hideForgotPassword() {
      this.showForgotModal = false
      this.forgotEmail = ''
    },
    async handleSignIn() {
      this.signinLoading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('Sign in:', this.signinForm)
        // Would integrate with actual auth service
        this.$emit('signin-success', this.signinForm)
        this.closeModal()
      } catch (error) {
        console.error('Sign in error:', error)
      } finally {
        this.signinLoading = false
      }
    },
    async handleSignUp() {
      if (!this.passwordsMatch || !this.signupForm.agreeTerms) return
      
      this.signupLoading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('Sign up:', this.signupForm)
        // Would integrate with actual auth service
        this.$emit('signup-success', this.signupForm)
        this.closeModal()
      } catch (error) {
        console.error('Sign up error:', error)
      } finally {
        this.signupLoading = false
      }
    },
    async handleForgotPassword() {
      if (!this.forgotEmail) return
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Reset password for:', this.forgotEmail)
        alert('Password reset link sent to your email!')
        this.hideForgotPassword()
      } catch (error) {
        console.error('Forgot password error:', error)
      }
    },
    socialLogin(provider) {
      console.log(`Social login with ${provider}`)
      // Would integrate with social auth providers
      this.$emit('social-login', provider)
    }
  }
}
</script>

<style scoped>
.auth-modal {
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-modal.open {
  visibility: visible;
  opacity: 1;
}

.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
  backdrop-filter: blur(10px);
}

.auth-container {
  position: relative;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  overflow: hidden;
  margin: 20px;
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-modal.open .auth-container {
  transform: scale(1);
}

/* Fashion-inspired background texture */
.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 10% 10%, rgba(255, 215, 0, 0.05) 0%, transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(138, 43, 226, 0.05) 0%, transparent 30%),
    repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(0,0,0,0.01) 50px, rgba(0,0,0,0.01) 52px);
  pointer-events: none;
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.brand-name {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
  color: #666;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.auth-tabs {
  position: relative;
  display: flex;
  margin: 0 32px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;
  z-index: 2;
}

.tab-btn.active {
  color: #333;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-indicator.move-right {
  transform: translateX(100%);
}

.auth-content {
  padding: 32px;
  max-height: 60vh;
  overflow-y: auto;
}

.auth-form {
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.form-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 32px;
  font-size: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  padding-right: 50px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #999;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}

.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e1e5e9;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  width: 33%;
  background: #ff6b6b;
}

.strength-fill.medium {
  width: 66%;
  background: #ffd93d;
}

.strength-fill.strong {
  width: 100%;
  background: #6bcf7f;
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.remember-me,
.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.remember-me input,
.terms-checkbox input {
  opacity: 0;
  position: absolute;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.remember-me input:checked + .checkmark,
.terms-checkbox input:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.remember-me input:checked + .checkmark::after,
.terms-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.forgot-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

.primary-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.social-login {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 24px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 24px;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #999;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.social-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-icon {
  width: 20px;
  height: 20px;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.forgot-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
}

.forgot-content {
  padding: 32px;
  text-align: center;
  max-width: 300px;
}

.forgot-content h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

.forgot-content p {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.forgot-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.secondary-btn {
  flex: 1;
  padding: 12px 20px;
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .auth-container {
    margin: 10px;
    max-height: 95vh;
    border-radius: 16px;
  }
  
  .auth-header {
    padding: 20px 24px 16px;
  }
  
  .brand-name {
    font-size: 20px;
  }
  
  .logo-icon {
    font-size: 28px;
  }
  
  .auth-content {
    padding: 24px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .form-subtitle {
    font-size: 14px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .social-buttons {
    flex-direction: column;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    margin: 5px;
    border-radius: 12px;
  }
  
  .auth-header {
    padding: 16px 20px 12px;
  }
  
  .auth-content {
    padding: 20px;
  }
  
  .auth-tabs {
    margin: 0 20px;
  }
  
  .form-input {
    padding: 14px 16px;
    padding-right: 45px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .primary-btn {
    padding: 14px 20px;
  }
}
</style>
