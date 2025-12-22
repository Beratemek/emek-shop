import axios from 'axios';

const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5001/api';
  }
  return 'https://emek-shop-production.up.railway.app/api';
};

const API = axios.create({ baseURL: getBaseUrl() });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile') || '{}').token}`;
  }
  return req;
});

export const fetchProducts = () => API.get('/products');
export const fetchProduct = (id: string) => API.get(`/products/${id}`);
export const createProduct = (newProduct: any) => API.post('/products', newProduct);
export const updateProduct = (id: string, updatedProduct: any) => API.put(`/products/${id}`, updatedProduct);
export const deleteProduct = (id: string) => API.delete(`/products/${id}`);

export const signIn = (formData: any) => API.post('/auth/login', formData);
export const signUp = (formData: any) => API.post('/auth/register', formData);
export const forgotPassword = (email: string) => API.post('/auth/forgotPassword', { email });
export const resetPassword = (token: string, password: string) => API.post(`/auth/resetPassword/${token}`, { password });

export const fetchUsers = () => API.get('/users');
export const updateUser = (id: string, formData: any) => API.patch(`/users/${id}`, formData);
export const deleteUser = (id: string) => API.delete(`/users/${id}`);

export const fetchOrders = () => API.get('/orders');
export const createOrder = (orderData: any) => API.post('/orders', orderData);

export const createMessage = (messageData: any) => API.post('/messages', messageData);
export const fetchMessages = () => API.get('/messages');
export const deleteMessage = (id: string) => API.delete(`/messages/${id}`);

export const checkout = (checkoutData: any) => API.post('/payment/checkout', checkoutData);

