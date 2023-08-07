/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from 'react-query';

import { IStars, IUserDtos } from '../../dtos';
import { api } from '../../services/api';
import { routesScheme } from '../../services/schemeRoutes';

export async function getUsers() {
  const { data } = await api.get(routesScheme.users.list_all_users);

  const list = data as IUserDtos[];

  const users = list
    .filter(h => h.situation.inativo !== true)
    .map(h => {
      const total = h.Stars.length === 0 ? 1 : h.Stars.length;
      let star = 0;

      h.Stars.forEach((h: IStars) => {
        star += h.star;
      });
      const md = star / total;
      const value = Number(md.toFixed(0)) === 0 ? 1 : Number(md.toFixed(0));

      const data = {
        ...h,
        media: value,
      };

      return data;
    });

  const fil = users.sort((a, b) => {
    if (a.nome < b.nome) {
      return -1;
    }
    return 1;
  });

  return fil;
}

export function useAllUsers() {
  return useQuery('all-users', getUsers);
}
