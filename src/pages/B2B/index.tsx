/* eslint-disable camelcase */
import fire from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { Center } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Header } from '../../components/Header';
import { Input } from '../../components/Inputs';
import { MembrosComponents } from '../../components/MembrosCompornents';
import { useData } from '../../contexts/useData';
import { IStars, IUserDtos } from '../../dtos';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Box } from '../FindMembro/styles';
import { Container } from './styles';

export function B2B() {
  const { navigate } = useNavigation();
  const { users } = useData();
  const { user } = useAuth();

  const [value, setValue] = useState('');

  const hanldeTransaction = useCallback(
    (prestador: IUserDtos) => {
      navigate('orderB2b', { prestador });
    },
    [navigate],
  );

  const list = React.useMemo(() => {
    const userData = (users.data as IUserDtos[]) || [];
    const us = userData.filter(h => h.id !== user.id) || [];

    const userList =
      value.length > 0
        ? us.filter(h => {
            const up = h.nome.toLocaleUpperCase();
            return up.includes(value.toLocaleUpperCase());
          })
        : us;

    const lista = [];
    userList.forEach(h => {
      let i = 0;
      const total = h.Stars.length === 0 ? 1 : h.Stars.length;
      let star = 0;
      const st = [];

      h.Stars.forEach((h: IStars) => {
        star += h.star;
      });
      const md = star / total;
      const value = Number(md.toFixed(0)) === 0 ? 1 : Number(md.toFixed(0));

      while (i < value) {
        i += 1;
        st.push(i);
      }

      const data = {
        ...user,
        media: value,
      };

      lista.push(data);
    });

    const filter = us.filter(h => {
      if (!h.situation.inativo) {
        return h;
      }
    });

    return filter;

    return us;
  }, [user, users.data, value]);

  useFocusEffect(
    useCallback(() => {
      users.refetch();
    }, []),
  );

  if (users.isLoading) {
    return <ActivityIndicator size={30} />;
  }

  return (
    <Container>
      <Header />

      <Center>
        <Form>
          <Box>
            <Input
              name="find"
              icon="search"
              onChangeText={text => setValue(text)}
              value={value}
            />
          </Box>
        </Form>
      </Center>

      <View style={{ paddingBottom: 350 }}>
        <FlatList
          data={list}
          keyExtractor={h => h.id}
          renderItem={({ item: h }) => (
            <MembrosComponents
              star={h.media}
              icon="b2b"
              pres={() => hanldeTransaction(h)}
              userName={h.nome}
              user_avatar={h.profile.avatar}
              oficio={h.profile.workName}
              imageOfice={h.profile.logo}
              // inativoPres={h.profile.inativo}
              // inativo={h.profile.inativo}
            />
          )}
        />
      </View>
    </Container>
  );
}
