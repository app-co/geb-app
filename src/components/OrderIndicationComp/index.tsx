import { format } from 'date-fns';
import { Box, Center, Radio } from 'native-base';
import React, { ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { IIndicationDto, IIndicationRelation } from '../../dtos';
import theme from '../../global/styles/theme';
import { _text } from '../../utils/size';
import * as S from './styles';

type TTypeValue = 'not-yeat' | 'not' | 'handshak';

interface IProps {
  item: IIndicationRelation;
  reject: () => void;
  confirmation: () => void;
  valueType: (item: TTypeValue) => void;
  children: ReactNode;
  load: boolean;
}

export function OrderIndicationComp({
  item,
  reject,
  valueType,
  confirmation,
  children,
  load,
}: IProps) {
  const [value, setValue] = React.useState('');

  return (
    <S.Container>
      <S.title>
        {item.objto.quemIndicaou_name} indicou você para fazer negócios com...
      </S.title>
      <S.flex style={{ marginTop: 20 }}>
        <S.title>Nome do cliente: </S.title>
        <S.text>{item.objto?.client_name}</S.text>
      </S.flex>
      <S.flex>
        <S.title>Contato: </S.title>
        <S.text>{item.objto?.phone_number_client}</S.text>
      </S.flex>
      <S.flex>
        <S.title>Descrição: </S.title>
        <S.text>{item.objto?.description}</S.text>
      </S.flex>
      <S.flex>
        <S.title>Data que foi indicado: </S.title>
        <S.text>{format(new Date(item.created_at), 'dd/MM/yy')}</S.text>
      </S.flex>

      <Center
        _text={{
          color: theme.colors.focus_second,
          fontFamily: theme.fonts.bold,
          fontWeight: 800,
          fontSize: _text,
        }}
        m={5}
      >
        Você fechou negócio?
      </Center>

      <Radio.Group
        flexDir="row"
        name="myRadioGroup"
        accessibilityLabel="favorite number"
        onChange={h => {
          valueType(h);
          setValue(h);
        }}
      >
        <Radio
          _text={{
            color: '#fff',
            fontFamily: theme.fonts.medium,
            fontSize: RFValue(12),
          }}
          value="not-yeat"
        >
          Ainda não
        </Radio>

        <Radio
          _text={{
            color: '#fff',
            fontFamily: theme.fonts.medium,
            fontSize: RFValue(12),
          }}
          ml={3}
          value="not"
        >
          Não deu certo
        </Radio>

        <Radio
          _text={{
            color: '#fff',
            fontFamily: theme.fonts.medium,
            fontSize: RFValue(12),
          }}
          ml={3}
          value="handshak"
        >
          Sim
        </Radio>
      </Radio.Group>

      {value === 'handshak' && <Box>{children}</Box>}

      <S.flexButton>
        <S.buttonRe disabled={load} onPress={reject}>
          {load ? <ActivityIndicator /> : <S.text>REJEITAR</S.text>}
        </S.buttonRe>

        <S.buttonOk disabled={load} onPress={confirmation}>
          {load ? <ActivityIndicator /> : <S.text>CONFIRMAR</S.text>}
        </S.buttonOk>
      </S.flexButton>
    </S.Container>
  );
}
