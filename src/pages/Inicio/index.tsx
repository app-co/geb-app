/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ListB2bOrder } from '../../components/ListB2bOrder';
import { ListTransactionOrder } from '../../components/ListTransactionOrder';
import { Loading } from '../../components/Loading';
import { ModalComp } from '../../components/ModalComp';
import { OrderIndicationComp } from '../../components/OrderIndicationComp';
import { useB2b } from '../../contexts/b2b';
import { useIndication } from '../../contexts/indication';
import { useOrderTransaction } from '../../contexts/orderTransaction';
import { usePontos } from '../../contexts/pontos';
import { useRelation } from '../../contexts/relation';
import { useToken } from '../../contexts/Token';
import { useTransaction } from '../../contexts/transaction';
import { useCreation } from '../../contexts/useCreation';
import { useData } from '../../contexts/useData';
import { useOrders } from '../../contexts/useOrders';
import {
  IB2b,
  IB2bRelation,
  IConsumoRelation,
  IIndicationDto,
  IIndicationRelation,
  IOrderTransaction,
  IRelashionship,
  ISelfPonts,
  ITransaction,
} from '../../dtos';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { locale } from '../../utils/LocalStrigMoney';
import { _currency, _number } from '../../utils/mask';
import { _subTitle } from '../../utils/size';
import { Consumo } from '../Consumo';
import * as S from './styles';

const wt = Dimensions.get('window').width;

type TTypeValue = 'not-yeat' | 'not' | 'handshak';

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
  const { indRank } = useData();
  const { listProviderRelation, relationCreate, listAllRelation } =
    useRelation();
  const { pontosListMe } = usePontos();
  const version = Contants.default.expoConfig?.version;
  const { mytoken } = useToken();

  const [load, setLoad] = React.useState(false);
  const [index, setIndex] = React.useState('');
  const [descripton, setDescription] = React.useState('');

  const [b2bModal, setB2bModal] = React.useState(false);
  const [consumoModal, setConcumoModal] = React.useState(false);
  const [indiModal, setIndModal] = React.useState(false);
  const [typeIndication, setTypeIndication] =
    React.useState<TTypeValue>('not-yeat');
  const [mail, setMail] = React.useState(false);

  const [value, setValue] = React.useState('');

  const validated = useQuery('valid-consumo', async () => {
    const rs = await api.get('/relation/extrato-valid');

    return rs.data as IResponse;
  });

  const relation = React.useMemo(() => {
    let orders: IRelashionship[] = [];

    if (!listProviderRelation.isLoading) {
      const data = (listProviderRelation.data as IRelashionship[]) || [];

      orders = data.filter(
        h => h.situation === false && h.type !== 'INVIT' && h.type !== 'DONATE',
      );
    }

    const b2b = orders.filter(h => h.type === 'B2B') as IB2bRelation[];

    const consumo = orders.filter(
      h => h.type === 'CONSUMO_OUT',
    ) as IConsumoRelation[];

    const indication = orders.filter(
      h => h.type === 'INDICATION',
    ) as IIndicationRelation[];

    return { b2b, orders, consumo, indication };
  }, [listProviderRelation.data, listProviderRelation.isLoading]);

  const { b2b, consumo, indication } = relation;

  const [select, setSelect] = React.useState<IIndicationRelation[]>(
    relation.indication,
  );

  const selection = React.useCallback(
    async (item: IIndicationRelation) => {
      const index = select.findIndex(i => i.id === item.id);
      const arrSelect = [...select];
      if (index !== -1) {
        arrSelect.splice(index, 1);
      } else {
        arrSelect.push(item);
      }

      setSelect(arrSelect);
    },
    [select],
  );

  const resumo = React.useMemo(() => {
    const TotalCurrency = String(validated.data?.totalVenda / 100);
    const allRelation = (listAllRelation.data as IRelashionship[]) || [];

    const ptB2b = validated.data?.b2b.length * 20;
    const ptVenda = validated.data?.venda.length * 10;
    const ptConsumo = validated.data?.consumo.length * 10;
    const ptIndi = validated.data?.indication.length * 15;
    const ptPadr = validated.data?.padrinho.length * 35;
    const ptInvit = validated.data?.invit.length * 10;
    const ptDonat = validated.data?.donate.length * 50;
    const ptPres = validated.data?.presenca.length * 10;

    const totalPontos =
      ptB2b +
      ptVenda +
      ptConsumo +
      ptIndi +
      ptPadr +
      ptInvit +
      ptDonat +
      ptPres;

    const all = allRelation
      .filter(h => h.situation === true && h.type === 'CONSUMO_OUT')
      .reduce((ac, i) => {
        return ac + i.objto.valor;
      }, 0);

    const totalGeb = locale(String(all / 100 + 7782628));
    return { totalPontos, TotalCurrency, totalGeb };
  }, [validated, listAllRelation]);

  React.useEffect(() => {
    if (relation.b2b.length > 0) {
      setB2bModal(true);
    }

    if (relation.consumo.length > 0) {
      setConcumoModal(true);
    }

    if (relation.indication.length > 0) {
      setIndModal(true);
    }

    if (relation.b2b.length === 0) {
      setB2bModal(false);
    }

    if (relation.consumo.length === 0) {
      setConcumoModal(false);
    }

    if (relation.indication.length === 0) {
      setIndModal(false);
    }
  }, [relation, mail]);

  const currency = _currency(value);

  const handleAproved = React.useCallback(
    async (item: IRelashionship) => {
      try {
        // setLoad(true);

        if (item.type === 'INDICATION') {
          setIndex(item.id);

          const it = item as IIndicationRelation;
          switch (typeIndication) {
            case 'handshak':
              {
                const value = Number(_number(currency));
                const dt = {
                  prestador_id: user.id,
                  ponts: 10,
                  objto: {
                    consumidor_name: it.objto.client_name,
                    descripton,
                    valor: value,
                  },
                  situation: true,
                  type: 'CONSUMO_OUT',
                };

                await api.post('/relation-create', dt);

                await api
                  .put('/relation-update', {
                    id: item.id,
                    situation: true,
                  })
                  .then(h => {
                    listProviderRelation.refetch();
                    setSelect(select.filter(h => h.id !== item.id));
                    setIndex('');
                    pontosListMe.refetch();
                    listAllRelation.refetch();
                    validated.refetch();
                  });
              }

              break;

            case 'not-yeat':
              setLoad(false);
              selection(item);

              break;

            case 'not':
              await api.delete(`/relation-delete/${item.id}`).then(h => {
                listProviderRelation.refetch();
                setLoad(false);
                setSelect(select.filter(h => h.id !== item.id));
              });
              break;

            default:
              break;
          }
        } else {
          setIndex(item.id);

          await api
            .put('/relation-update', {
              id: item.id,
              situation: true,
            })
            .then(h => {
              listProviderRelation.refetch();
              setLoad(false);
              pontosListMe.refetch();
              validated.refetch();
              listAllRelation.refetch();
              setIndex('');
            });
        }
      } catch (err: any) {
        setLoad(false);
        setIndex('');

        const message = err?.response?.data?.message;
        if (message) {
          return Alert.alert('Algo não está certo!', message);
        }
      }
    },
    [
      currency,
      descripton,
      listProviderRelation,
      pontosListMe,
      select,
      selection,
      typeIndication,
      user.id,
      validated,
    ],
  );

  const handleRecused = React.useCallback(
    async (item: IRelashionship) => {
      setIndex(item.id);
      try {
        setLoad(true);

        await api.delete(`/relation-delete/${item.id}`).then(h => {
          listProviderRelation.refetch();
          setLoad(false);
        });
      } catch (err) {
        setLoad(false);
      }
    },
    [listProviderRelation],
  );

  React.useEffect(() => {
    if (user.token !== mytoken) {
      api.put('/user/update-membro', {
        token: mytoken,
      });
    }
  }, [mytoken, user.token]);

  useFocusEffect(
    useCallback(() => {
      listProviderRelation.refetch();
      listAllRelation.refetch();
      validated.refetch();
      setIndex('');
      setSelect(relation.indication);
    }, []),
  );

  if (listProviderRelation.isLoading && listAllRelation.isLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <Box flex={1}>
        <Header
          openMail={() => {
            setMail(!mail);
            setSelect(relation.indication);
            setIndex('');
          }}
          title="Home"
          orders={relation.orders.length}
        />
        {/* MODAL B2B */}
        <Modal visible={b2bModal} animationType="slide" transparent>
          <ModalComp
            closed={() => {
              setB2bModal(false);
            }}
            title="B2B"
          >
            <FlatList
              data={relation.b2b}
              renderItem={({ item: h }) => (
                <ListB2bOrder
                  load={h.id === index}
                  item={h}
                  index={index}
                  confirmation={() => handleAproved(h)}
                  recuse={() => handleRecused(h)}
                />
              )}
            />
          </ModalComp>
        </Modal>

        <Modal visible={consumoModal} animationType="fade" transparent>
          <ModalComp closed={() => setConcumoModal(false)} title="Consumo">
            <FlatList
              data={relation.consumo}
              renderItem={({ item: h }) => (
                <ListTransactionOrder
                  load={h.id === index}
                  item={h}
                  confirmation={() => handleAproved(h)}
                  recuse={() => handleRecused(h)}
                />
              )}
            />
          </ModalComp>
        </Modal>

        <Modal visible={indiModal} animationType="fade" transparent>
          <ModalComp
            closed={() => {
              setIndModal(false);
            }}
            title="Suas indicações"
          >
            <FlatList
              data={select}
              keyExtractor={h => h.id}
              renderItem={({ item: h }) => (
                <OrderIndicationComp
                  load={h.id === index}
                  valueType={h => setTypeIndication(h)}
                  confirmation={() => handleAproved(h)}
                  reject={() => handleRecused(h)}
                  item={h}
                >
                  <Form>
                    <Center m={10}>
                      <Input
                        placeholderTextColor="#b6b6b6"
                        name="name"
                        placeholder="Digite o valor que foi negociado"
                        onChangeText={setValue}
                        value={currency}
                        keyboardType="numeric"
                      />

                      <TextArea
                        w="64"
                        mt="2"
                        _focus={{
                          backgroundColor: theme.colors.secundary,
                          fontFamily: theme.fonts.regular,
                        }}
                        color="#fff"
                        placeholder="Descricão"
                        onChangeText={setDescription}
                        value={descripton}
                      />
                    </Center>
                  </Form>
                </OrderIndicationComp>
              )}
            />
          </ModalComp>
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
              {locale(resumo.TotalCurrency)}
            </S.text>

            <S.text>Meus pontos:</S.text>
            <S.text style={{ fontSize: _subTitle, fontFamily: 'medium' }}>
              {resumo.totalPontos}
            </S.text>
          </Box>
        </HStack>

        <Center>
          <HStack space={2} alignItems="center">
            <S.text style={{ fontSize: _subTitle }}>Acumulados do GEB:</S.text>
            <S.text style={{ fontSize: _subTitle, fontFamily: 'medium' }}>
              {resumo.totalGeb}
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
