/* eslint-disable camelcase */
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { add, format, isAfter, max } from 'date-fns';
import * as Location from 'expo-location';
import { Center } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';

import { Header } from '../../components/Header';
import { useRelation } from '../../contexts/relation';
import { IPresensaRelation } from '../../dtos';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import {
  Box,
  ButtonValidar,
  Container,
  TextButtonValidar,
  Title,
} from './styles';

interface I {
  lat: number;
  log: number;
}

export function Valide() {
  const { user } = useAuth();
  const { listAllRelation } = useRelation();
  const { nome, id } = user;
  const { navigate } = useNavigation();
  const [data, setData] = useState(format(new Date(Date.now()), 'dd/MM/yyyy'));
  const [load, setLoad] = useState(false);

  const [location, setLocation] = useState<I>({ lat: 0, log: 0 });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {}, []);

  const geoLocation = React.useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation({
      lat: location.coords.latitude,
      log: location.coords.longitude,
    });
  }, []);

  const presendaData = (listAllRelation.data as IPresensaRelation[]) || [];
  const filPres = presendaData.find(h => {
    const date = format(new Date(h.created_at), 'dd/MM/yyyy');

    if (date === data && h.type === 'PRESENCA' && h.fk_user_id === user.id) {
      return h;
    }
  });

  useFocusEffect(
    useCallback(() => {
      geoLocation();
    }, [geoLocation]),
  );

  const hanldeValidar = useCallback(async () => {
    if (filPres) {
      return Alert.alert(
        'Você não pode validar mais de uma presença no mesmo dia',
      );
    }

    const local = {
      lat: -22.8894586,
      log: -48.442223,
    };

    if (local.lat !== location.lat && local.log !== location.log) {
      Alert.alert(
        'Atenção',
        'Você precisa estar no local para lançar a sua presença',
      );
    }
    const dados = {
      nome,
      user_id: id,
      objto: {
        user_id: id,
        avatar: user.profile.avatar,
      },
      type: 'PRESENCA',
      situation: false,
    };

    await api
      .post('/relation-create', dados)
      .then(h => {
        setLoad(false);
        navigate('INÍCIO');
        Alert.alert(
          'Solicitação enviada',
          'Aguarde um adm validar sua presença',
        );
      })
      .catch(h => {
        Alert.alert('Ops!', h.response.data.message);
      });
  }, [
    filPres,
    id,
    location.lat,
    location.log,
    navigate,
    nome,
    user.profile.avatar,
  ]);

  return (
    <Container>
      <Header title="Valide sua presença" />

      <Box>
        <Title>{data} </Title>
      </Box>

      <ButtonValidar onPress={hanldeValidar}>
        {load ? (
          <ActivityIndicator />
        ) : (
          <TextButtonValidar>validar</TextButtonValidar>
        )}
      </ButtonValidar>
    </Container>
  );
}
