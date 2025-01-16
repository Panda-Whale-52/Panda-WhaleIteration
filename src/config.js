const config = {
  baseURL: 'http://localhost:3000/api',
  // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzg4MTI5OGJmMWE5YjA2ZmMxMTM5YTYiLCJpYXQiOjE3MzY5NzE0NzIsImV4cCI6MTczNjk3NTA3Mn0.00hhBl6pgGRXjyxjFAtPeOCJ6nHAETF7PdiloSppzQ8'
  token: localStorage.getItem('token'),
};

export default config;
