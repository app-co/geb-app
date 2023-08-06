import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import * as S from './styles';

interface I {
  description: string;
  data: string;
  valor?: string | undefined;
}

export function ExtratoComp({ description, data, valor }: I) {
  return (
    <S.Container>
      <S.title style={{ fontFamily: 'bold', fontSize: RFValue(16) }}>
        {data}
      </S.title>
      <S.box>
        <S.title>{description}</S.title>
      </S.box>
      <S.title style={{ fontFamily: 'bold', fontSize: RFValue(16) }}>
        {valor}
      </S.title>
    </S.Container>
  );
}
