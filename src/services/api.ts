import axios, { AxiosError } from 'axios';
import soketio from 'socket.io-client';

const dev = 'http://192.168.0.64:3333';
const production = 'https://geb-server.appcom.dev';

export const api = axios.create({
  baseURL: production,
});

// export const socket = soketio(production);

// api.interceptors.response.use(
//   res => {
//     return res;
//   },
//   (error: AxiosError) => {
//     const message = error?.response?.data?.message;
//     const status = error?.response?.status;

//     console.log(error, 'api');

//     if (status === 401) {
//       console.log(message, 'api');
//     }

//     // console.log(error?.response?.data, 'error');
//   },
// );
