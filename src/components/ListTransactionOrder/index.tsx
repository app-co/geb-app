import { Avatar, Box, Center, HStack } from 'native-base';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import { IConsumoRelation } from '../../dtos';
import { _currency } from '../../utils/mask';
import * as S from './styles';

interface IProps {
  item: IConsumoRelation;
  load: boolean;

  confirmation: () => void;
  recuse: () => void;
}

export function ListTransactionOrder({
  item,
  load = false,
  confirmation,
  recuse,
}: IProps) {
  const valor = _currency(String(item.objto.valor));

  return (
    <S.Container>
      <HStack space="10">
        <Box px="4">
          <Avatar bg="#fff" />
          <S.text>{item.objto.consumidor_name}</S.text>
        </Box>

        <Box flex="1">
          <S.text>{valor}</S.text>
          <S.text>{item.objto.description}</S.text>
        </Box>
      </HStack>

      <Center mt="4">
        <HStack space={8}>
          <S.recusar disabled={load} onPress={recuse}>
            {load ? (
              <ActivityIndicator />
            ) : (
              <S.buttonText>RECUSAR</S.buttonText>
            )}
          </S.recusar>

          <S.confirm disabled={load} onPress={confirmation}>
            {load ? (
              <ActivityIndicator />
            ) : (
              <S.buttonText>CONFIRMAR</S.buttonText>
            )}
          </S.confirm>
        </HStack>
      </Center>
    </S.Container>
  );
}
