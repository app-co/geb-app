import React from 'react';

import {
  IB2bRelation,
  IConsumoRelation,
  IIndicationRelation,
} from '../../dtos';
import { ListB2bOrder } from '../ListB2bOrder';
import { ListTransactionOrder } from '../ListTransactionOrder';
import { ModalComp } from '../ModalComp';
import { OrderIndicationComp } from '../OrderIndicationComp';
import * as S from './styles';

interface I {
  b2bItem: IB2bRelation;
  indicationIttem: IIndicationRelation;
  consumoItem: IConsumoRelation;
  isOpen: () => void;
  confirmationB2b: () => void;
  recuseB2b: () => void;
  confirmationInd: () => void;
  recuseInd: () => void;
  confirmationOrder: () => void;
  recuseOrder: () => void;
  typeIndication: () => void;
  children: React.ReactNode;

  load: boolean;
}

export function OrdersRelashion({
  b2bItem,
  indicationIttem,
  consumoItem,
  isOpen,
  load,
  typeIndication,
  children,
  confirmationB2b,
  confirmationInd,
  confirmationOrder,
  recuseB2b,
  recuseInd,
  recuseOrder,
}: I) {
  return (
    <S.Container>
      <ModalComp title="Confira suas solicitações" closed={isOpen}>
        <ListB2bOrder
          confirmation={confirmationB2b}
          recuse={recuseB2b}
          load={load}
          item={b2bItem}
        />

        <ListTransactionOrder
          confirmation={confirmationOrder}
          recuse={recuseOrder}
          load={load}
          item={consumoItem}
        />

        <OrderIndicationComp
          confirmation={confirmationInd}
          reject={recuseInd}
          load={load}
          item={indicationIttem}
          valueType={typeIndication}
        >
          {children}
        </OrderIndicationComp>
      </ModalComp>
    </S.Container>
  );
}
