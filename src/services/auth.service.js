import api from './api'
import { ENDPOINTS } from '../config/endpoints'

export const authService = {
  login(email, password) {
    return api.post(ENDPOINTS.LOGIN, { email, password })
  },

  me() {
    return api.get(ENDPOINTS.ME)
  },

  changePassword(currentPassword, newPassword) {
    return api.patch(ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword })
  },
}
