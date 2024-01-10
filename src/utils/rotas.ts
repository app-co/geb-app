import theme from '../global/styles/geb';
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
import { Padrinho } from '../pages/Padrinho';
import { Profile } from '../pages/Profile';
import { Solicitaions } from '../pages/Solicitaions';
import { Valide } from '../pages/ValidePresenca';
import { Visitante } from '../pages/Visitante';
import { StackB2b } from '../routes/StackB2b';
import { StacKMembros } from '../routes/StackMembros';
import { TabBarApp } from '../routes/TabBarApp';

export const rotas = [
  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
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
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'VALIDE SUA PRESENÇA',
    component: Valide,
    icon: 'hand-peace-o',
  },
  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'LANÇAR CONSUMO',
    component: StacKMembros,
    icon: 'handshake-o',
  },
  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'INDICAÇÕES',
    component: Indicacoes,
    icon: 'exchange',
  },
  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'B2B',
    component: StackB2b,
    icon: 'coffee',
  },

  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'CONVIDADOS',
    component: Visitante,
    icon: 'user-plus',
  },

  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'DONATIVOS',
    component: Donates,
    icon: 'diamond',
  },

  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'APADRINHAR',
    component: Padrinho,
    icon: 'mortar-board',
  },

  {
    focus: theme.colors.focus[1],
    color: theme.colors.focus[1],
    name: 'SOLICITAÇÕES',
    component: Solicitaions,
    icon: 'envelope',
  },
];

export const rotasAdm = [
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
