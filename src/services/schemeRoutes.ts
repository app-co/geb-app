/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-underscore-dangle

interface I {
  params?: string;
}

export const routesScheme = {
  relationShip: {
    create: `/relation-create`,
    list_by_provider: 'relation/prestador',
  },

  users: {
    list_all_users: '/user/list-all-user',
    self_ponts: '/user/global-rank-ind',
  },
};

export function paramsRoutesScheme(params: string | undefined) {
  const routes = {
    relationShip: {
      create: `/relation-create`,
      list_by_provider: 'relation/prestador',
    },
  };

  return routes;
}
