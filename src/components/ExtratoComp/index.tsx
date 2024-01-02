import { Circle } from 'native-base';
import React, { memo } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { IRelashionship } from '../../dtos';
import theme from '../../global/styles/geb';
import * as S from './styles';

interface I {
  day: number;
  item: IRelashionship[];
}

function ExtratoCompMemo({ item = [], day }: I) {
  return (
    <S.content>
      <Circle size="sm" bg={theme.colors.focus[1]}>
        <S.title>{day}</S.title>
      </Circle>

      {item.map(h => (
        <S.Container key={h.id}>
          <S.box>
            {h.objto?.apadrinhado_name ? (
              <S.text>{h.objto?.apadrinhado_name}</S.text>
            ) : (
              <S.text>{h.objto.descricao}</S.text>
            )}
          </S.box>

          {h.objto?.valor && (
            <S.text style={{ fontFamily: 'bold', fontSize: RFValue(16) }}>
              {h.objto.currency}
            </S.text>
          )}
        </S.Container>
      ))}
    </S.content>
  );
}

export const ExtratoComp = memo(ExtratoCompMemo);
