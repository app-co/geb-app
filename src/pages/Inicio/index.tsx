/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable camelcase */
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { AxiosError } from 'axios';
import * as Contants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {
  Avatar,
  Box,
  Center,
  HStack,
  ScrollView,
  Text,
  TextArea,
} from 'native-base';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';

// import * as Updates from 'expo-updates';

import { useQuery } from 'react-query';

import { Classificacao } from '../../components/Classificacao';
import { Header } from '../../components/Header';
import { Input } from '../../components/Inputs';
import { Loading } from '../../components/Loading';
import { ModalComp } from '../../components/ModalComp';
import { OrdersRelashion } from '../../components/OrdersRelashion';
import { usePontos } from '../../contexts/pontos';
import { useToken } from '../../contexts/Token';
import { useData } from '../../contexts/useData';
import {
  IB2bRelation,
  IConsumoRelation,
  IIndicationRelation,
  IRelashionship,
} from '../../dtos';
import theme from '../../global/styles/theme';
import { useOrderRelation } from '../../hooks/relations';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { _currency, _number } from '../../utils/mask';
import { _subTitle } from '../../utils/size';
import * as S from './styles';

interface IResponse {
  consumo: IConsumoRelation[];
  venda: IConsumoRelation[];
  b2b: IRelashionship[];
  donate: IRelashionship[];
  indication: IRelashionship[];
  padrinho: IRelashionship[];
  presenca: IRelashionship[];
  totalConsumo: number;
  totalVenda: number;
  invit: IRelashionship[];
}

export function Inicio() {
  const { user, logOut } = useAuth();
  const { navigate } = useNavigation();
  const { indRank } = useData();
  const { mytoken } = useToken();
  const { data, isLoading, error, refetch } = useOrderRelation();

  const [showModalSolicitations, setModalSolicitations] = React.useState(false);

  const version = Contants.default.expoConfig?.version;

  // const validated = useQuery('valid-consumo', async () => {
  //   const rs = await api.get('/relation/extrato-valid');

  //   return rs.data as IResponse;
  // });

  React.useEffect(() => {
    if (user.token !== mytoken) {
      api.patch('/user/update-membro', {
        token: mytoken,
        id: user.id,
      });
    }
  }, [mytoken, user]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <Box flex={1}>
        <Header
          openMail={() => {
            navigate('SOLICITAÇÕES');
          }}
          title="Home"
          orders={data?.length}
        />

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
              {0}
            </S.text>

            <S.text>Meus pontos:</S.text>
            <S.text style={{ fontSize: _subTitle, fontFamily: 'medium' }}>
              {0}
            </S.text>
          </Box>
        </HStack>

        <Center>
          <HStack space={2} alignItems="center">
            <S.text style={{ fontSize: _subTitle }}>Acumulados do GEB:</S.text>
            <S.text style={{ fontSize: _subTitle, fontFamily: 'medium' }}>
              {0}
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
