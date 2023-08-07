import { useQuery } from 'react-query';

import {
  IB2bRelation,
  IConsumoRelation,
  IIndicationRelation,
  IRelashionship,
} from '../../dtos';
import { api } from '../../services/api';

interface IResponse {
  b2b: IB2bRelation;
  cons: IConsumoRelation;
  ind: IIndicationRelation;
  id: string;
}

export async function solitations(): Promise<IRelashionship[]> {
  const response = await api.get('/relation/prestador');
  const orders = response.data as IRelashionship[];

  const fil = orders.filter(h => h.situation === false);

  return fil;
}

export function useOrderRelation() {
  return useQuery('relation-orders', solitations);
}
