import jwtDefaultConfig from './jwtDefaultConfig';
import jwt_decode from "jwt-decode";

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // For Refreshing Token
  subscribers = []

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      config => {
        // Get token from myStorage
        const accessToken = this.getToken()

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error),
    )

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      response => response,
      error => {
        // const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        let decoded = jwt_decode(this.getToken());
        let today = new Date()
        let exp = new Date(decoded.exp * 1000);

        if (today.getTime() - exp.getTime() > 0) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then(r => {
              this.isAlreadyFetchingAccessToken = false

              // Update accessToken in myStorage
              this.setToken(r.data.access_token)
              this.setRefreshToken(r.data.refresh_token)

              this.onAccessTokenFetched(r.data.access_token)
            })
          }
          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber(accessToken => {
              // Make sure to assign accessToken according to your response.
              // Check: https://pixinvent.ticksy.com/ticket/2413870
              // Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(this.axiosIns(originalRequest))
            })
          })
          return retryOriginalRequest
        }
        return Promise.reject(error)
      },
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    if (localStorage.getItem('keepLogin')) {
        return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
    } else {
        return sessionStorage.getItem(this.jwtConfig.storageTokenKeyName)
    }
  }

  getRefreshToken() {
    if (localStorage.getItem('keepLogin')) {
        return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
    } else {
        return sessionStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
    }
  }

  setToken(value) {
    if (localStorage.getItem('keepLogin')) {
        localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
    } else {
        sessionStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
    }
  }

  setRefreshToken(value) {
    if (localStorage.getItem('keepLogin')) {
        localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
    } else {
        sessionStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
    }
  }

  async login(...args) {
    await localStorage.setItem('keepLogin', args[0].keepLogin);
    delete args[0].keepLogin;
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args)
  }

  logout(...args) {
    return this.axiosIns.delete(this.jwtConfig.logoutEndpoint, ...args)
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
      refresh_token: this.getRefreshToken(),
    })
  }

  getUserData() {
    return this.axiosIns.get(this.jwtConfig.userData)
  }
}
