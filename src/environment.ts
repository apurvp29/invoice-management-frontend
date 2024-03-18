export const environment = {
  production: false,
  auth: {
    domain: 'dev-aebxkuruzt2a5vuj.us.auth0.com',
    clientId: 'CehLkBhTaBzUvZWLtJdgOQm0MjaTLKJ0',
    authorizationParams: {
      redirect_uri: 'http://localhost:4200',
      audience: 'http://localhost:8000/api',
    },
  },
};

export const baseUrl: string = 'http://192.168.29.156:8000/api/';
