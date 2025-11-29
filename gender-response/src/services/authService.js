// Authentication service with localStorage persistence
const STORAGE_KEY = 'dv_support_users'
const CURRENT_USER_KEY = 'dv_support_current_user'

export const authService = {
  // Get all users from storage
  getUsers() {
    try {
      const users = localStorage.getItem(STORAGE_KEY)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  },

  // Save users to storage
  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Error saving users:', error)
    }
  },

  // Register new user, optionally with captchaToken
  register(userData, captchaToken) {
    // TODO: When using backend API, send captchaToken in the registration request and validate on backend.
    return new Promise((resolve, reject) => {
      if (!captchaToken) {
        reject(new Error('CAPTCHA not verified'));
        return;
      }
      const users = this.getUsers();
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        reject(new Error('Email already registered'));
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        // Include captchaToken for backend (currently unused)
        captchaToken,
      };
      users.push(newUser);
      this.saveUsers(users);
      // Auto-login after registration
      this.setCurrentUser(newUser);
      resolve(newUser);
    });
  },

  // Login user
  login(email, password, captchaToken) {
    // TODO: When switching to real backend, send captchaToken along with email/password to backend
    return new Promise((resolve, reject) => {
      const users = this.getUsers()
      const user = users.find(u => u.email === email && u.password === password)
      // For demo without real backend, we only emulate the CAPTCHA check:
      if (!captchaToken) {
        reject(new Error('CAPTCHA not verified'))
        return
      }
      if (!user) {
        reject(new Error('Invalid email or password'))
        return
      }
      this.setCurrentUser(user)
      resolve(user)
    })
  },

  // Get current user
  getCurrentUser() {
    try {
      const userStr = sessionStorage.getItem(CURRENT_USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  // Set current user
  setCurrentUser(user) {
    try {
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('Error setting current user:', error)
    }
  },

  // Logout
  logout() {
    sessionStorage.removeItem(CURRENT_USER_KEY)
  }
}

