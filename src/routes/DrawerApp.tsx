/* eslint-disable react/no-unstable-nested-components */
import { Feather, FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import { DrawerContent } from '../components/DrawerComponent';
import theme from '../global/styles/geb';
import { useAuth } from '../hooks/useAuth';
import { Ranking } from '../pages/ADM/Classificacao';
import { SingUp } from '../pages/ADM/CreateUser';
import { DeletUser } from '../pages/ADM/DeleteUser';
import { UploadAvatar } from '../pages/ADM/UploadAvatar';
import { ValidateDanates } from '../pages/ADM/ValidateDanates';
import { ValidateGuest } from '../pages/ADM/ValidateGuest';
import { ListPresenca } from '../pages/ADM/ValidatePresenca';
import { Consumo } from '../pages/Consumo';
import { Donates } from '../pages/Donates';
import { FindUser } from '../pages/FindMembro';
import { Indicacoes } from '../pages/Indicacoes';
import { Inicio } from '../pages/Inicio';
import { Padrinho } from '../pages/Padrinho';
import { Profile } from '../pages/Profile';
import { Solicitaions } from '../pages/Solicitaions';
import { Valide } from '../pages/ValidePresenca';
import { Visitante } from '../pages/Visitante';
import { StackB2b } from './StackB2b';
import { StacKMembros } from './StackMembros';
import { TabBarApp } from './TabBarApp';

const { Navigator, Screen } = createDrawerNavigator();

export function DrawerApp() {
  const { user } = useAuth();

  const rotas = [
    {
      focus: theme.colors.focus[1],
      color: theme.colors.color_text.dark,
      name: 'POSTS',
      component: TabBarApp,
      icon: 'camera-retro',
    },
    {
      focus: theme.colors.focus[1],
      color: theme.colors.focus[1],
      name: 'PERFIL',
      component: Profile,
      icon: 'user-circle-o',
    },
    {
      focus: theme.colors.focus[1],
      color: theme.colors.focus[1],
      name: 'LOCALIZE OS MEMBROS',
      component: FindUser,
      icon: 'map-marker',
    },
    {
      focus: theme.colors.focus[1],
      color: theme.colors.focus[1],
      name: 'EXTRATO',
      component: Consumo,
      icon: 'line-chart',
    },
    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'VALIDE SUA PRESENÇA',
      component: Valide,
      icon: 'hand-peace-o',
    },
    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'LANÇAR CONSUMO',
      component: StacKMembros,
      icon: 'handshake-o',
    },
    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'INDICAÇÕES',
      component: Indicacoes,
      icon: 'exchange',
    },
    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'B2B',
      component: StackB2b,
      icon: 'coffee',
    },

    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'CONVIDADOS',
      component: Visitante,
      icon: 'user-plus',
    },

    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'DONATIVOS',
      component: Donates,
      icon: 'diamond',
    },

    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'APADRINHAR',
      component: Padrinho,
      icon: 'mortar-board',
    },

    {
      focus: theme.colors.focus,
      color: theme.colors.focus[1],
      name: 'SOLICITAÇÕES',
      component: Solicitaions,
      icon: 'envelope',
    },
  ];

  const rotasAdm = [
    {
      color: theme.colors.secundary,
      name: 'RANKING',
      component: Ranking,
      icon: '',
    },
    {
      color: theme.colors.secundary,
      name: 'CADASTRAR MEMBRO',
      component: SingUp,
      icon: '',
    },
    {
      color: theme.colors.secundary,
      name: 'VALIDAR PRESENÇA',
      component: ListPresenca,
      icon: '',
    },
    // {
    //   color: theme.colors.secundary,
    //   name: 'ALTERAR SENHA DE UM MEMBRO',
    //   component: UpdateSenhaUser,
    //   icon: '',
    // },
    {
      color: theme.colors.secundary,
      name: 'EXCLUIR MEMBROS',
      component: DeletUser,
      icon: '',
    },

    {
      color: theme.colors.secundary,
      name: 'Carregar Avatar',
      component: UploadAvatar,
      icon: '',
    },
    // {
    //   color: theme.colors.secundary,
    //   name: 'INATIVAR UM MEMBRO',
    //   component: Inativo,
    //   icon: '',
    // },
    // {
    //   color: theme.colors.secundary,
    //   name: 'LISTA DE PRESENÇA',
    //   component: ListaPresença,
    //   icon: '',
    // },

    {
      color: theme.colors.secundary,
      name: 'VALIDAR CONVIDADOS',
      component: ValidateGuest,
      icon: '',
    },
    {
      color: theme.colors.secundary,
      name: 'VALIDAR DONATIVOS',
      component: ValidateDanates,
      icon: '',
    },
  ];
  // const { adm } = user.user;
  return (
    <Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        options={{
          drawerIcon: ({ focused, size }) => (
            <FontAwesome
              name="home"
              size={size}
              color={focused ? theme.colors.focus[1] : theme.colors.focus[2]}
            />
          ),
        }}
        name="INÍCIO"
        component={Inicio}
      />
      {rotas.map(h => (
        <Screen
          key={h.name}
          options={{
            drawerIcon: ({ focused, size }) => (
              <FontAwesome
                name={h.icon}
                size={size}
                color={focused ? h.focus : h.color}
              />
            ),
          }}
          name={h.name}
          component={h.component}
        />
      ))}

      {user.adm &&
        rotasAdm.map(h => (
          <Screen
            key={h.name}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Feather name={h.icon} size={size} color="red" />
              ),
            }}
            name={h.name}
            component={h.component}
          />
        ))}
    </Navigator>
  );
}
