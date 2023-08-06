import React from 'react';

import { ListB2bOrder } from '../ListB2bOrder';
import { ModalComp } from '../ModalComp';
import * as S from './styles';

export function OrdersRelashion() {
  return (
    <S.Container>
      <ModalComp>
        <ListB2bOrder />
      </ModalComp>
    </S.Container>
  );
}
