import axios from "axios";
 const api = axios.create({
    baseURL: 'http://localhost:3001',
 });

 api.interceptors.request.use(config =>{
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization =`Bearer ${token}`;
 }
    return config; 
 });

 api.interceptors.responde.use(
    resposta => resposta,
 erro => {
    if (erro.responde?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(erro);
 }
);
  export default api;
