/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable camelcase */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Contants from 'expo-constants';
import { Avatar, Box, Center, HStack, Text, useToast } from 'native-base';
import { setCookie } from 'nookies';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';

import { Classificacao } from '../../components/Classificacao';
import { Header } from '../../components/Header';
import { Input } from '../../components/Inputs';
import { Loading } from '../../components/Loading';
import { usePontos } from '../../contexts/pontos';
import { useRelation } from '../../contexts/relation';
import { useToken } from '../../contexts/Token';
import { useData } from '../../contexts/useData';
import { IRelashionship, ISelfPonts } from '../../dtos';
import theme from '../../global/styles/theme';
import { useOrderRelation } from '../../hooks/relations';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { routesScheme } from '../../services/schemeRoutes';
import { IsActiveFingerTokenStorage } from '../../storage/acitve-finger-token';
import { LocalAuthData } from '../../storage/local-auth-data';
import { AppError } from '../../utils/AppError';
import { _subTitle } from '../../utils/size';
import * as S from './styles';

const isActiveFigerToken = new IsActiveFingerTokenStorage();
const localAuthData = new LocalAuthData();

export function Inicio() {
  const ref = useRef<FormHandles>(null);
  const toast = useToast();

  const { user, login, logOut, updateUser } = useAuth();
  const { navigate } = useNavigation();
  const { pontosListMe } = usePontos();
  const { indRank } = useData();
  const { mytoken } = useToken();
  const { listAllRelation } = useRelation();
  const { data, isLoading, error, refetch } = useOrderRelation();
  const [modalAuth, setModalAuth] = React.useState(false);
  const [permissionFingerprint, setPermissionFingerprinte] =
    React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [loadingInterface, setLoadInterface] = React.useState(true);

  const [showModalSolicitations, setModalSolicitations] = React.useState(true);

  const version = Contants.default.expoConfig?.version;

  const resumo = React.useMemo(() => {
    let pontos = 0;
    let currency = 'R$ 00,00';
    const ponts = (pontosListMe.data as ISelfPonts) || ({} as ISelfPonts);

    if (ponts.b2b) {
      const {
        b2b,
        compras,
        convidado,
        vendas,
        indication,
        donates,
        padrinho,
        presenca,
      } = ponts as ISelfPonts;

      pontos =
        b2b.pontos +
        compras.pontos +
        convidado.pontos +
        indication.pontos +
        donates.pontos +
        padrinho.pontos +
        presenca.pontos +
        vendas.pontos;
    }

    if (listAllRelation?.data) {
      const lastCurrencty = 7782628;

      const relation = listAllRelation.data as IRelashionship[];

      const validated = relation.filter(
        h => h.situation === true && h.type === 'CONSUMO_OUT',
      );

      const total = validated.reduce((ac, i) => {
        return ac + i.objto.valor;
      }, 0);

      currency = (total / 100 + lastCurrencty).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }

    return { pontos, currency };
  }, [listAllRelation.data, pontosListMe.data]);

  React.useEffect(() => {
    if (user.token !== mytoken) {
      api
        .patch('/user/update-membro', {
          token: mytoken,
          id: user.id,
        })
        .then(h => {
          updateUser({ ...user, token: mytoken });
        });
    }
  }, [mytoken, updateUser, user]);

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoadInterface(false);
      }, 3000);
      refetch();
      if (data?.relation?.length > 0) {
        setModalSolicitations(true);
      } else {
        setModalSolicitations(false);
      }
    }, [data?.relation?.length]),
  );

  const handleSavePass = React.useCallback(
    async ({ pass }: { pass: string }) => {
      setLoad(true);
      const auth = {
        membro: user.membro,
        senha: pass,
      };

      try {
        await api.post('/user/session', auth);
        await isActiveFigerToken.setStorage({
          isActive: true,
        });

        await localAuthData.setStorage(auth);

        setLoad(false);
        setModalAuth(false);
      } catch (error) {
        setLoad(false);
        const erro = error instanceof AppError;

        if (erro) {
          Alert.alert('Erro ao validar sua senha', error.message);
        }
      }
    },
    [toast, user.membro],
  );

  React.useEffect(() => {
    async function auth() {
      const permissionAuth = await isActiveFigerToken.getStorage();

      console.log(permissionAuth)

      if (!permissionAuth) {
        if (!loadingInterface) {
          setModalAuth(!permissionAuth);
        }
      }
    }

    auth();

    return () => {
      auth();
    };
  }, [loadingInterface]);

  if (isLoading && loadingInterface) {
    return <Loading />;
  }

  return (
    <S.Container>
      <Modal visible={modalAuth}>
        <Center flex="1">
          <Text style={{ marginBottom: 20 }}>
            Deseja ativar acesso com sua biometria?
          </Text>

          <HStack space={8}>
            <TouchableOpacity
              onPress={() => setModalAuth(false)}
              style={{
                width: 130,
                alignItems: 'center',
                padding: 10,
                borderRadius: 10,
                backgroundColor: theme.colors.focus_second,
              }}
            >
              <Text style={{ color: '#fff', fontFamily: theme.fonts.bold }}>
                MAIS TARDE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPermissionFingerprinte(true)}
              style={{
                width: 130,
                alignItems: 'center',
                padding: 10,
                borderRadius: 10,
                backgroundColor: theme.colors.focus,
              }}
            >
              <Text style={{ color: '#fff', fontFamily: theme.fonts.bold }}>
                SIM
              </Text>
            </TouchableOpacity>
          </HStack>

          {permissionFingerprint && (
            <Form ref={ref} onSubmit={handleSavePass}>
              <Center mt="16">
                <Input icon="lock" placeholder="Digite sua senha" name="pass" />

                <TouchableOpacity
                  onPress={() => ref.current?.submitForm()}
                  style={{
                    width: 130,
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: theme.colors.focus,
                  }}
                >
                  {load ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      style={{ color: '#fff', fontFamily: theme.fonts.bold }}
                    >
                      SALVAR
                    </Text>
                  )}
                </TouchableOpacity>
              </Center>
            </Form>
          )}
        </Center>
      </Modal>

      <Box flex={1}>
        <Header
          openMail={() => {
            navigate('SOLICITAÇÕES');
          }}
          title="Home"
          orders={data?.relation.length}
        />

        <Modal
          animationType="fade"
          visible={showModalSolicitations}
          transparent
        >
          <Center flex={1}>
            <Box p="16" bg="dark.600" borderRadius={8}>
              <S.title style={{ textAlign: 'center' }}>
                Voce tem negócios para aprovar
              </S.title>
              <HStack space={8} mt="4">
                <TouchableOpacity
                  onPress={() => setModalSolicitations(false)}
                  style={{
                    padding: 8,
                    backgroundColor: theme.colors.focus_second,
                    borderRadius: 8,
                  }}
                >
                  <S.text style={{ color: '#fff' }}>APROVAR DEPOIS</S.text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalSolicitations(false);
                    navigate('SOLICITAÇÕES');
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: theme.colors.focus,
                    borderRadius: 8,
                  }}
                >
                  <S.text style={{ color: '#fff' }}>APROVAR AGORA</S.text>
                </TouchableOpacity>
              </HStack>
            </Box>
          </Center>
        </Modal>

        <Center>
          <S.text style={{ fontFamily: 'medium', fontSize: _subTitle }}>
            {user.nome}
          </S.text>
          <S.text>{user.profile.workName}</S.text>
        </Center>

        <HStack space={10} justifyContent="center" my="4" alignItems="center">
          <Avatar size="xl" source={{ uri: user?.profile.avatar }} />

          <Box w="1" bg="black" h="full" />

          <Box alignItems="flex-end">
            <S.text>Vendas este ano:</S.text>
            <S.text style={{ fontSize: _subTitle, fontFamily: 'medium' }}>
              {data?.totalValor}
            </S.text>

            <S.text>Meus pontos:</S.text>
            <S.text style={{ fontSize: _subTitle, fontFamily: 'medium' }}>
              {resumo.pontos}
            </S.text>
          </Box>
        </HStack>

        <Center>
          <HStack space={2} alignItems="center">
            <S.text style={{ fontSize: _subTitle }}>Acumulados do GEB:</S.text>
            <S.text style={{ fontSize: _subTitle, fontFamily: 'medium' }}>
              {resumo.currency}
            </S.text>
          </HStack>
        </Center>

        <S.Line />

        {indRank.isLoading ? (
          <ActivityIndicator size={36} />
        ) : (
          <Classificacao />
        )}
      </Box>

      <Text>version: {version}</Text>
    </S.Container>
  );
}
