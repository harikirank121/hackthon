// API service with localStorage for data persistence
// Simulates API calls with loading states and error handling

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const apiService = {
  // Resources API
  resources: {
    async getAll() {
      await delay(500) // Simulate network delay
      const resources = localStorage.getItem('dv_resources')
      return resources ? JSON.parse(resources) : []
    },

    async create(resource) {
      await delay(500)
      const resources = await this.getAll()
      const newResource = {
        id: Date.now().toString(),
        ...resource,
        createdAt: new Date().toISOString()
      }
      resources.push(newResource)
      localStorage.setItem('dv_resources', JSON.stringify(resources))
      return newResource
    },

    async update(id, updates) {
      await delay(500)
      const resources = await this.getAll()
      const index = resources.findIndex(r => r.id === id)
      if (index === -1) throw new Error('Resource not found')
      resources[index] = { ...resources[index], ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem('dv_resources', JSON.stringify(resources))
      return resources[index]
    },

    async delete(id) {
      await delay(500)
      const resources = await this.getAll()
      const filtered = resources.filter(r => r.id !== id)
      localStorage.setItem('dv_resources', JSON.stringify(filtered))
      return { success: true }
    }
  },

  // Support Services API
  supportServices: {
    async getAll() {
      await delay(500)
      const services = localStorage.getItem('dv_support_services')
      return services ? JSON.parse(services) : []
    },

    async create(service) {
      await delay(500)
      const services = await this.getAll()
      const newService = {
        id: Date.now().toString(),
        ...service,
        createdAt: new Date().toISOString()
      }
      services.push(newService)
      localStorage.setItem('dv_support_services', JSON.stringify(services))
      return newService
    },

    async update(id, updates) {
      await delay(500)
      const services = await this.getAll()
      const index = services.findIndex(s => s.id === id)
      if (index === -1) throw new Error('Service not found')
      services[index] = { ...services[index], ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem('dv_support_services', JSON.stringify(services))
      return services[index]
    },

    async delete(id) {
      await delay(500)
      const services = await this.getAll()
      const filtered = services.filter(s => s.id !== id)
      localStorage.setItem('dv_support_services', JSON.stringify(filtered))
      return { success: true }
    }
  },

  // Legal Resources API
  legalResources: {
    async getAll() {
      await delay(500)
      const resources = localStorage.getItem('dv_legal_resources')
      return resources ? JSON.parse(resources) : []
    },

    async create(resource) {
      await delay(500)
      const resources = await this.getAll()
      const newResource = {
        id: Date.now().toString(),
        ...resource,
        createdAt: new Date().toISOString()
      }
      resources.push(newResource)
      localStorage.setItem('dv_legal_resources', JSON.stringify(resources))
      return newResource
    },

    async update(id, updates) {
      await delay(500)
      const resources = await this.getAll()
      const index = resources.findIndex(r => r.id === id)
      if (index === -1) throw new Error('Legal resource not found')
      resources[index] = { ...resources[index], ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem('dv_legal_resources', JSON.stringify(resources))
      return resources[index]
    },

    async delete(id) {
      await delay(500)
      const resources = await this.getAll()
      const filtered = resources.filter(r => r.id !== id)
      localStorage.setItem('dv_legal_resources', JSON.stringify(filtered))
      return { success: true }
    }
  },

  // Users API (for admin)
  users: {
    async getAll() {
      await delay(500)
      const users = localStorage.getItem('dv_support_users')
      return users ? JSON.parse(users) : []
    },

    async update(id, updates) {
      await delay(500)
      const users = await this.getAll()
      const index = users.findIndex(u => u.id === id)
      if (index === -1) throw new Error('User not found')
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem('dv_support_users', JSON.stringify(users))
      return users[index]
    },

    async delete(id) {
      await delay(500)
      const users = await this.getAll()
      const filtered = users.filter(u => u.id !== id)
      localStorage.setItem('dv_support_users', JSON.stringify(filtered))
      return { success: true }
    }
  }
}

