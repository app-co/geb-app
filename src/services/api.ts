import axios, { AxiosError, AxiosInstance } from 'axios';
import soketio from 'socket.io-client';

import { AppError } from '../utils/AppError';

type SignOut = () => void;

type APIInstaceProps = AxiosInstance & {
  registerIntercepTokenManager: (signOut: SignOut) => () => void;
};

const dev = 'http://192.168.0.64:3333';
const production = 'https://geb-server.appcom.dev';

const api = axios.create({
  baseURL: production,
}) as APIInstaceProps;

api.registerIntercepTokenManager = signOut => {
  const registerIntercepToken = api.interceptors.response.use(
    config => config,
    error => {
      const erro = error?.response?.data;
      if (error?.response && erro) {
        const { message } = erro;
        if (message === 'token invalido' || message === 'falta o token') {
          console.log(message);
          signOut();
          return Promise.reject(error);
        }
        return Promise.reject(new AppError(message));
      }
      return Promise.reject(error);
    },
  );

  return () => {
    api.interceptors.response.eject(registerIntercepToken);
  };
};

export { api };

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
