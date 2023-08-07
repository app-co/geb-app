import { Form } from '@unform/mobile';
import { Center, TextArea } from 'native-base';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';

import { Header } from '../../components/Header';
import { Input } from '../../components/Inputs';
import { OrderIndicationComp } from '../../components/OrderIndicationComp';
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
import { _currency } from '../../utils/mask';
import * as S from './styles';

type TSubmit = {
  item: IRelashionship;
};

type TTypeValue = 'not-yeat' | 'not' | 'handshak';

export function Solicitaions() {
  const { user } = useAuth();
  const { data, refetch } = useOrderRelation();

  const [orders, setOrders] = React.useState<IRelashionship[]>([]);

  React.useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const [itemId, setItemId] = React.useState('');
  const [descripton, setDescription] = React.useState('');

  const [typeIndication, setTypeIndication] =
    React.useState<TTypeValue>('not-yeat');
  const [value, setValue] = React.useState('');

  const currency = _currency(value);

  const handleAproved = React.useCallback(
    async ({ item }: TSubmit) => {
      try {
        setItemId(item.id);

        if (item.type === 'INDICATION') {
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

                await api.put('/relation-update', {
                  id: item.id,
                  situation: true,
                });
              }

              break;

            case 'not-yeat':
              {
                setItemId('');
                const index = select.findIndex(i => i.id === item.id);
                const arrSelect = [...select];
                if (index !== -1) {
                  arrSelect.splice(index, 1);
                } else {
                  arrSelect.push(item);
                }
              }

              setSelect(arrSelect);

              break;

            case 'not':
              await api.delete(`/relation-delete/${item.id}`);
              setRelation(relations.filter(h => h.id !== item.id));
              break;

            default:
              break;
          }
        } else {
          await api
            .put('/relation-update', {
              id: item.id,
              situation: true,
            })
            .then(h => {
              setItemId('');
            });
        }
      } catch (err: any) {
        setItemId('');

        const message = err?.response?.data?.message;
        if (message) {
          return Alert.alert('Algo não está certo!', message);
        }
      }
    },
    [currency, descripton, typeIndication, user.id],
  );

  const handleRecused = React.useCallback(async ({ item }: TSubmit) => {
    try {
      await api.delete(`/relation-delete/${item.id}`).then(h => {
        refetch();
        setItemId('');
      });
    } catch (err) {
      setItemId('');
    }
  }, []);

  return (
    <S.Container>
      <Header type="goback" />

      <S.box>
        <FlatList
          contentContainerStyle={{
            paddingBottom: 150,
          }}
          data={data}
          keyExtractor={h => h.id}
          renderItem={({ item: h }) => (
            <OrderIndicationComp
              confirmation={() => handleAproved({ item: h })}
              reject={() => handleRecused({ item: h })}
              itemId={itemId === h.id}
              item={h}
              valueType={h => setTypeIndication(h)}
            >
              <Form onSubmit={() => {}}>
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
      </S.box>
    </S.Container>
  );
}
