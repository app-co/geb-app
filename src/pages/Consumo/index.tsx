/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  addDays,
  addMonths,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  subDays,
  subMonths,
} from 'date-fns';
import { Box, Center, HStack } from 'native-base';
import React, { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery } from 'react-query';

import { colecao } from '../../collection';
import { ExtratoComp } from '../../components/ExtratoComp';
import { Header } from '../../components/Header';
import { ListConsumo } from '../../components/ListConsumo';
import { Loading } from '../../components/Loading';
import { useRelation } from '../../contexts/relation';
import {
  IB2b,
  IB2bRelation,
  IConsumoRelation,
  IDonate,
  IGuest,
  IIndicationDto,
  IInviteRelation,
  IPadrinho,
  IPresencaDto,
  IPresensaRelation,
  IRelashionship,
  ITransaction,
  IUserDto,
} from '../../dtos';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { locale } from '../../utils/LocalStrigMoney';
import { _currency } from '../../utils/mask';
import { months } from '../../utils/month';
import * as S from './styles';

export interface PropTransactions {
  id: string;
  prestador_id: string;
  consumidor: string;
  descricao: string;
  type: 'entrada' | 'saida';
  valor: string;
  updated_at: string;
}

interface IQntGeral {
  qntPadrinho: number;
  qntPresenca: number;
  qntIndicacao: number;
  user_id: string;
}

type Presença = {
  nome: string;
  data: string;
  status: string;
};

type TType =
  | 'entrada'
  | 'saida'
  | 'presenca'
  | 'padrinho'
  | 'b2b'
  | 'guest'
  | 'donate'
  | 'indication';

const types = [
  { type: 'entrada', name: 'Entrada', id: '1' },
  { type: 'saida', name: 'Saida', id: '2' },
  { type: 'indication', name: 'Indicações', id: '8' },
  { type: 'presenca', name: 'Presença', id: '3' },
  { type: 'b2b', name: 'B2B', id: '5' },
  { type: 'guest', name: 'Convidados', id: '6' },
  { type: 'donate', name: 'Donativos', id: '7' },
  { type: 'padrinho', name: 'Padrinho', id: '4' },
];

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

type T = 'valid' | 'peding';

export function Consumo() {
  const [type, setType] = useState<TType>('entrada');
  const [date, setDate] = React.useState(new Date());
  const [typeExtrato, setTypeExtrato] = React.useState<T>('valid');

  const validated = useQuery('valid-consumo', async () => {
    const rs = await api.get('/relation/extrato-valid');

    return rs.data as IResponse;
  });

  const peding = useQuery('peding-consumo', async () => {
    const rs = await api.get('/relation/extrato-peding');

    return rs.data as IResponse;
  });

  const reloaded = React.useCallback(async () => {
    setDate(new Date());
  }, []);

  const handlePlus = React.useCallback(async () => {
    const dt = addMonths(date, 1);

    setDate(dt);
  }, [date]);

  const handleMinus = React.useCallback(async () => {
    const dt = subMonths(date, 1);

    setDate(dt);
  }, [date]);

  //* *..........................................................................

  const currencyDateFormated = format(date, 'MM/yy');

  const extratoValidated = React.useMemo(() => {
    const currencyConsumo = validated.data?.totalConsumo;
    const currenyVenda = validated.data?.totalVenda / 100;

    const venda = validated?.data?.venda.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const consumo = validated?.data?.consumo.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const b2b = validated?.data?.b2b.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const indication = validated?.data?.indication.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const invit = validated?.data?.invit.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const donate = validated?.data?.donate.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const presenca = validated?.data?.presenca.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const padrinho = validated?.data?.padrinho.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const totalP = currenyVenda?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const totalC = currencyConsumo?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return {
      totalC,
      totalP,
      venda,
      invit,
      donate,
      padrinho,
      presenca,
      consumo,
      indication,
      b2b,
    };
  }, [currencyDateFormated, validated.data]);

  const extratoPending = React.useMemo(() => {
    const currencyConsumo = peding.data?.totalConsumo / 100;
    const currenyVenda = peding.data?.totalVenda / 100;

    const venda = peding?.data?.venda.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const consumo = peding?.data?.consumo.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const b2b = peding?.data?.b2b.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const indication = peding?.data?.indication.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const invit = peding?.data?.invit.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const donate = peding?.data?.donate.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const presenca = peding?.data?.presenca.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const padrinho = peding?.data?.padrinho.filter(h => {
      const updated = format(new Date(h.updated_at), 'MM/yy');

      if (updated === currencyDateFormated) {
        return h;
      }
    });

    const totalP = currenyVenda?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const totalC = currencyConsumo?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return {
      totalC,
      totalP,
      venda,
      invit,
      donate,
      padrinho,
      presenca,
      consumo,
      indication,
      b2b,
    };
  }, [currencyDateFormated, peding.data]);

  const handleDeleteOrder = React.useCallback(async (id: string) => {
    await api.delete(`/relation-delete${id}`);
  }, []);

  //* *..........................................................................

  useFocusEffect(
    useCallback(() => {
      validated.refetch();
      peding.refetch();
    }, []),
  );

  const month = getMonth(date);

  if (validated.isLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <Header />

      <HStack w="full" justifyContent="space-between" p="4">
        <S.toch
          onPress={() => setTypeExtrato('valid')}
          type={typeExtrato === 'valid'}
        >
          <S.title>Relações validadas</S.title>
        </S.toch>

        <S.toch
          onPress={() => setTypeExtrato('peding')}
          type={typeExtrato === 'peding'}
        >
          <S.title>Relações pendentes</S.title>
        </S.toch>
      </HStack>

      <View style={{ height: 70 }}>
        <ScrollView
          horizontal
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            height: 70,
            paddingHorizontal: 20,
          }}
        >
          <S.BoxTypeTransaction>
            {types.map(h => (
              <S.BoxTypeTransactionTouch
                type={h.type === type}
                onPress={() => setType(h.type)}
                key={h.id}
              >
                <S.TextTypeTransaction type={h.type === type}>
                  {h.name}
                </S.TextTypeTransaction>
              </S.BoxTypeTransactionTouch>
            ))}
          </S.BoxTypeTransaction>
        </ScrollView>
      </View>

      <HStack
        w="full"
        mb="4"
        justifyContent="space-around"
        alignItems="center"
        p="2"
        px="4"
      >
        <TouchableOpacity style={{ padding: 3 }} onPress={handleMinus}>
          <MaterialIcons name="arrow-back-ios" size={34} color="black" />
        </TouchableOpacity>

        <Center>
          <S.text>{currencyDateFormated}</S.text>
          <S.title>{months[month]}</S.title>
          <S.reloaded onPress={reloaded}>
            <S.text style={{ color: '#fff' }}>AUTALIZAR</S.text>
          </S.reloaded>
        </Center>

        <TouchableOpacity style={{ padding: 3 }} onPress={handlePlus}>
          <MaterialIcons name="arrow-forward-ios" size={34} color="black" />
        </TouchableOpacity>
      </HStack>

      <S.BoxTotal>
        {type === 'saida' && (
          <S.title style={{ color: '#fff' }}>Total de consumo no ano</S.title>
        )}
        {type === 'entrada' && (
          <S.title style={{ color: '#fff' }}>Total de venda no ano</S.title>
        )}
        {type === 'entrada' && (
          <S.Text>
            {typeExtrato === 'valid'
              ? extratoValidated.totalP
              : extratoPending.totalP}
          </S.Text>
        )}
        {type === 'saida' && (
          <S.Text>
            {typeExtrato === 'valid'
              ? extratoValidated.totalC
              : extratoPending.totalC}
          </S.Text>
        )}
        {type === 'indication' && <S.Text>Suas inidicações</S.Text>}
        {type === 'presenca' && <S.Text>Suas presenças</S.Text>}
        {type === 'padrinho' && <S.Text>Seus afilhiados</S.Text>}
        {type === 'b2b' && <S.Text>Seus B2Bs</S.Text>}
        {type === 'donate' && <S.Text>Seus donativos</S.Text>}
        {type === 'guest' && <S.Text>Seus convidados</S.Text>}
      </S.BoxTotal>

      {typeExtrato === 'valid' && (
        <Box>
          {type === 'entrada' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.venda}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  valor={locale(h.objto.valor)}
                  description={h.objto.descricao}
                />
              )}
            />
          )}

          {type === 'saida' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.consumo}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  valor={locale(h.objto.valor)}
                  description={h.objto.descricao}
                />
              )}
            />
          )}

          {type === 'indication' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.indication}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={`Cliente indicado: ${h.objto.client_name}`}
                />
              )}
            />
          )}

          {type === 'presenca' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.presenca}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description=""
                />
              )}
            />
          )}

          {type === 'b2b' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.b2b}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={h.objto.description}
                />
              )}
            />
          )}

          {type === 'guest' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.invit}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={`Convidado: ${h.objto.name_convidado}`}
                />
              )}
            />
          )}

          {type === 'padrinho' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.padrinho}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={`Afiliado: ${h.objto.apadrinhado_name}`}
                />
              )}
            />
          )}

          {type === 'donate' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoValidated.donate}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={h.objto.itens}
                />
              )}
            />
          )}
        </Box>
      )}

      {typeExtrato === 'peding' && (
        <Box>
          {type === 'entrada' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.venda}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  valor={locale(h.objto.valor)}
                  description={h.objto.descricao}
                />
              )}
            />
          )}

          {type === 'saida' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.consumo}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  valor={locale(h.objto.valor)}
                  description={h.objto.descricao}
                />
              )}
            />
          )}

          {type === 'indication' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.indication}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={`Cliente indicado: ${h.objto.client_name}`}
                />
              )}
            />
          )}

          {type === 'presenca' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.presenca}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description=""
                />
              )}
            />
          )}

          {type === 'b2b' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.b2b}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={h.objto.description}
                />
              )}
            />
          )}

          {type === 'guest' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.invit}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={`Convidado: ${h.objto.name_convidado}`}
                />
              )}
            />
          )}

          {type === 'padrinho' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.padrinho}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={`Afiliado: ${h.objto.apadrinhado_name}`}
                />
              )}
            />
          )}

          {type === 'donate' && (
            <FlatList
              contentContainerStyle={{
                paddingBottom: 400,
              }}
              data={extratoPending.donate}
              keyExtractor={h => String(h.id)}
              renderItem={({ item: h }) => (
                <ExtratoComp
                  data={format(new Date(h.updated_at), 'dd/MM/yy')}
                  description={h.objto.itens}
                />
              )}
            />
          )}
        </Box>
      )}
    </S.Container>
  );
}
