import { boot } from 'quasar/wrappers';
import axios from 'axios';
  const baseURL = 'http://backend.test/api';
  const api = axios.create({ baseURL: baseURL });
  export default boot(({ app }) => {
    app.config.globalProperties.$axios = axios;
    app.config.globalProperties.$api = api;
  });
  
  export { api };