import fire from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import * as Linkin from 'expo-linking';
import { Center } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  View,
} from 'react-native';
import { useQuery } from 'react-query';

import { FindMembroComponent } from '../../components/FindMembro';
import { Header } from '../../components/Header';
import { Input } from '../../components/Inputs';
import { Loading } from '../../components/Loading';
import { useAuth } from '../../hooks/useAuth';
import { useAllUsers } from '../../hooks/user';
import { Box, Container } from './styles';

export function FindUser() {
  const { user } = useAuth();
  const { data, refetch, isLoading } = useAllUsers();

  const [search, setSearch] = React.useState('');

  const handlePress = useCallback(async (url: string) => {
    await Linkin.openURL(`https://${url}`);
  }, []);

  const handleNavigateToWatts = useCallback(async (url: string) => {
    await Linkin.openURL(`https://wa.me/55${url}`);
  }, []);

  const membros = data || [];

  const users =
    search.length > 0
      ? membros.filter(h => {
          const up = h.nome.toLocaleUpperCase();

          if (up.includes(search.toLocaleUpperCase()) && h.id !== user.id) {
            return h;
          }
          return null;
        })
      : membros.filter(h => h.id !== user.id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title="Localize os membros" />

      <Center>
        <Form>
          <Box>
            <Input
              name="find"
              icon="search"
              autoCapitalize="characters"
              onChangeText={setSearch}
            />
          </Box>
        </Form>
      </Center>

      <FlatList
        // contentContainerStyle={{ paddingBottom: 150 }}
        data={users}
        keyExtractor={h => h.id}
        renderItem={({ item: h }) => (
          <View>
            <FindMembroComponent
              star={h.media}
              avatar={h?.profile?.avatar}
              name={h.nome}
              workName={h.profile.workName}
              whats={() => {
                handleNavigateToWatts(h.profile.whats);
              }}
              face={() => {}}
              insta={() => {}}
              maps={() => {}}
            />
          </View>
        )}
      />
    </Container>
  );
}
