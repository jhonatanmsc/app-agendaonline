export default {
  // Endpoints
  loginEndpoint: '/login',
  registerEndpoint: '/new-user',
  refreshEndpoint: '/token/refresh',
  logoutEndpoint: '/logout',
  userData: '/me',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}
