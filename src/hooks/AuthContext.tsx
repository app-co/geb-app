/* eslint-disable react/jsx-no-constructed-context-values */
// /* eslint-disable react/jsx-no-constructed-context-values */
// /* eslint-disable consistent-return */
// /* eslint-disable react/prop-types */
// /* eslint-disable camelcase */
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { STORAGE_KEY, STORAGE_KEY_TOKEN } from '@types';
import { useToast } from 'native-base';
import React, { ReactNode, createContext, useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { IUserDtos } from '../dtos';
import { api } from '../services/api';
import { AppError } from '../utils/AppError';

interface ILogin {
  membro: string;
  senha: string;
}

interface IAuthContextData {
  user: IUserDtos;
  login(credential: ILogin): Promise<void>;
  loading: boolean;
  logOut(): Promise<void>;
  updateUser(user: IUserDtos): Promise<void>;
}

type TAuthContext = {
  children: ReactNode;
};

type AuthState = {
  token: string;
  user: IUserDtos;
};
const keyToken = '@appGeb:token';
const key = '@appGeb:user';

export const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData,
);

export function AuthContextProvider({ children }: TAuthContext) {
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [data, setData] = useState<AuthState>({} as AuthState);

  const LoadingUser = useCallback(async () => {
    await AsyncStorage.removeItem('first');

    const [token, user] = await AsyncStorage.multiGet([keyToken, key]);
    api.defaults.headers.common.Authorization = `Bearer ${token[1]}`;

    if (token[1] && user[1])
      if (token && user) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    LoadingUser();
  }, []);

  const login = useCallback(async ({ membro, senha }: ILogin) => {
    try {
      await api
        .post('/user/session', {
          membro,
          senha,
        })
        .then(async h => {
          const { token } = h.data;
          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          await api.get('/user/find-user-by-id').then(async h => {
            const user = h.data;
            setData({ token, user });

            await AsyncStorage.multiSet([
              [keyToken, token],
              [key, JSON.stringify(user)],
            ]);
          });
        });
    } catch (error) {
      const isError = error instanceof AppError;
      const title = isError
        ? error.message
        : 'Não foi possível entrar na sua conta, tente novamente mais tarde';

      toast.show({
        title,
        description: 'Entre com suas credenciais corretas',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    }
  }, []);

  const logOut = useCallback(async () => {
    await AsyncStorage.multiRemove([keyToken, key]);
    setData(data as AuthState);
    setData({} as AuthState);
  }, [data]);

  const updateUser = useCallback(
    async (user: IUserDtos) => {
      await AsyncStorage.setItem(key, JSON.stringify(user));

      const dados = {
        token: data.token,
        user,
      };

      setData(dados);
    },
    [data.token],
  );

  const tokkenFail = React.useCallback(async () => {
    logOut();
    toast.show({
      title: 'Seu token expirou.',
      description: 'Entre novamente com suas credenciais',
      placement: 'bottom',
      bg: 'red.500',
    });
  }, []);

  React.useEffect(() => {
    const subscribe = api.registerIntercepTokenManager(tokkenFail);

    return () => {
      subscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, login, logOut, loading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
