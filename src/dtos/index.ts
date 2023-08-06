/* eslint-disable camelcase */
export interface IUserDtos {
  id: string;
  nome: string;
  membro: string;
  senha: string;
  adm: boolean;
  token: string;

  //! ! FK_USERS
  situation: ISituationUser;
  profile: IProfileDto;
  links: ILinkDto;
  region: IRegion;
  Stars: IStars[];
}

export interface ISituationUser {
  id: string;
  inativo: boolean;
  firstLogin: boolean;
  apadrinhado: boolean;
  fk_id_user: string;
}

export interface IProfileDto {
  fk_id_user: string;
  // fk_id_post: string;
  whats: string;
  workName: string;
  CNPJ: string;
  CPF: string;
  ramo: string;
  enquadramento: string;
  email: string;
  insta: string;
  web: string;
  face: string;
  whatsApp: string;
  logo: string;
  avatar: string;
}

export interface IRegion {
  id: string;
  city: string;
  fk_id_user: string;
}

type T =
  | 'B2B'
  | 'CONSUMO_IN'
  | 'CONSUMO_OUT'
  | 'PADRINHO'
  | 'INDICATION'
  | 'DONATE'
  | 'INVIT'
  | 'PRESENCA';

export interface IRelashionship {
  id: string;
  objto: object;
  fk_user_id: string;
  situation: boolean;
  prestador_id?: string;
  client_id?: string;
  ponts: number;

  created_at: Date | string;
  updated_at: Date | string;
  type: T;
}

export interface IRelashionshipCreate {
  objto: object;
  fk_user_id?: string;
  prestador_id?: string;
  client_id?: string;
  type: T;
}

export interface IB2bRelation {
  id: string;
  objto: {
    description: string;
    send_name: string;
  };
  fk_user_id: string;
  situation: boolean;
  prestador_id?: string;
  client_id?: string;
  ponts: number;
  type: T;
}

export interface IIndicationRelation {
  id: string;
  objto: {
    quemIndicaou_name: string;
    client_name: string;
    phone_number_client: string;
    description: string;
  };
  fk_user_id: string;
  situation: boolean;
  prestador_id?: string;
  client_id?: string;
  ponts: number;
  type: T;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface IConsumoRelation {
  id: string;
  objto: {
    consumidor_name: string;
    valor: string;
    description: string;
  };
  fk_user_id: string;
  situation: boolean;
  prestador_id?: string;
  client_id?: string;
  ponts: number;
  type: T;

  created_at: Date | string;
  updated_at: Date | string;
}

export interface IInviteRelation {
  id?: string;
  objto: {
    name_convidado: string;
  };
  fk_user_id: string;
  situation: boolean;
  prestador_id?: string;
  client_id?: string;
  ponts: number;
  type: T;
}

export interface IPresensaRelation {
  id?: string;
  objto: {
    user_id: string;
    avatar: string;
    user_name: string;
  };
  fk_user_id: string;
  situation: boolean;
  prestador_id?: string;
  client_id?: string;
  ponts: number;
  type: T;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface IRelashionshipUpdate {
  id: string;
  objto?: object;
  fk_user_id?: string;
  situation?: boolean;
  prestador_id?: string;
  client_id?: string;
  ponts?: number;
  type: T;
}

export interface IPresencaDto {
  id: string;
  nome: string;
  user_id: string;
  presenca: boolean;
  createdAt: Date;
}

export interface IOrderTransaction {
  id: string;
  consumidor_name: string;
  prestador_name: string;
  consumidor_id: string;

  prestador_id: string;
  valor: number;
  descricao: string;
  createdAt?: Date;
}

export interface ITransaction {
  id?: string;
  consumidor_name?: string;
  prestador_name: string;
  consumidor_id?: string;
  order_id?: string;
  prestador_id: string;
  valor: number;
  descricao: string;
  created_at?: Date;
  date?: string;
  updated_at?: string;
  valorFormated?: string;
}

export interface IB2b {
  send_id: string;
  send_name: string;
  recevid_name: string;
  recevid_id: string;
  appointment: Date | string;
  assunto: string;
  createdAt?: Date;
  validate: boolean;
  updated_at?: string;
  id?: string;
}

export interface IIndicationDto {
  id?: string;
  indicado_id: string;
  indicado_name: string;
  quemIndicou_id: string;
  quemIndicou_name: string;
  client_name: string;
  phone_number_client: number;
  description: string;
  validate?: boolean;
  updated_at?: string;
  createdAt?: Date;
}

export interface ILinkDto {
  id: string;
  user_id: string;
  nome: string;
  link: string;
}

export interface IPostsDtos {
  id: string;
  image: string;
  fk_id_user: string;
  description: string;
  like: ILikeDto[];
  profile: IProfileDto;
  user: IUserDtos;
  created_at: Date;
  date: number;
}

export interface ILikeDto {
  id: string;
  like: number;
  fk_id_post: string;
}

export interface IStars {
  id: string;
  fk_id_user: string;
  star: number;
  valiador: string;
}

interface IPropsPonts {
  id: string;
  nome: string;
  pontos: number;
  valor: number;
  rank: number;
}

export interface ISelfPonts {
  compras: IPropsPonts;
  vendas: IPropsPonts;
  presenca: IPropsPonts;
  indication: IPropsPonts;
  b2b: IPropsPonts;
  padrinho: IPropsPonts;
  donates: IPropsPonts;
  convidado: IPropsPonts;
}

export interface IGlobalPonts {
  compras: IPropsPonts[];
  vendas: IPropsPonts[];
  presenca: IPropsPonts[];
  indication: IPropsPonts[];
  b2b: IPropsPonts[];
  padrinho: IPropsPonts[];
  donates: IPropsPonts[];
  convidado: IPropsPonts[];
  TP: {
    nome: string;
    totalPontos: number;
  }[];
}

export interface IGuest {
  id?: string;
  fk_user_id?: string;
  name_convidado: string;
  approved?: boolean;
  created_at?: Date;
  updated_at?: Date;
  user: IUserDtos;
}

export interface IDonate {
  id?: string;
  fk_id_user: string;
  approved?: boolean;
  itens: string;
  created_at?: string;
  updated_at?: string;
}

export interface IPadrinho {
  id?: string;
  user_id: string;
  apadrinhado_name: string;
  apadrinhado_id: string;
  updated_at?: string;
  created_at?: string;
  qnt: number;
}
