import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

import theme from '../../global/styles/geb';
import { _subTitle, _text } from '../../utils/size';

const { colors, fonts } = theme;

interface PropsFiltro {
  filtro: boolean;
}

interface PropsTyps {
  type: boolean;
}

interface TypeEx {
  type: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.primary};
`;

export const toch = styled.TouchableOpacity<TypeEx>`
  padding: 4px;

  border-width: 1px;
  border-color: ${theme.colors.secundary};
  border-radius: 8px;

  background-color: ${h => (h.type ? theme.colors.secundary : 'transparent')};
`;

export const text = styled.Text`
  font-size: ${_text + 2}px;
  font-family: ${theme.fonts.Regular};
`;

export const reloaded = styled.TouchableOpacity`
  padding: 2px 10px;
  background-color: ${theme.colors.focus_light};
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const title = styled.Text`
  font-size: ${_subTitle}px;
  font-family: ${theme.fonts.Regular};
`;

export const BoxTotal = styled.View`
  width: 100%;
  background-color: ${theme.colors.focus};
  justify-content: center;
  padding: 10px 20px;
`;

export const Text = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.text_secundary};
`;

export const BoxFiltros = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px;
  margin-bottom: ${RFValue(16)}px;
`;

export const TextFiltro = styled.Text<PropsFiltro>`
  font-size: ${RFValue(14)}px;
  font-family: ${fonts.Regular};
  color: ${({ filtro }) => (filtro ? colors.text_secundary : colors.text)};
`;

export const BoxFiltroTouch = styled.TouchableOpacity<PropsFiltro>`
  background-color: ${({ filtro }) => (filtro ? colors.focus : colors.primary)};
  border-radius: 10px;
  align-items: center;
  justify-content: center;

  width: ${RFValue(70)}px;
  padding: 2px;

  border-width: 1px;
  border-color: ${colors.focus};
`;

export const BoxTypeTransaction = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  /* background-color: red; */
  height: 70px;
  width: 100%;
`;

export const TextTypeTransaction = styled.Text<PropsTyps>`
  font-size: ${RFValue(14)}px;
  font-family: ${theme.fonts.bold};
  color: ${({ type }) => (type ? colors.text_secundary : colors.text)};
`;

export const BoxTypeTransactionTouch = styled.TouchableOpacity<PropsTyps>`
  background-color: ${({ type }) =>
    type ? colors.focus_light : colors.primary};
  /* width: ${RFPercentage(8)}px;
    height: ${RFPercentage(3)}px; */

  border-radius: ${RFValue(10)}px;

  align-items: center;
  justify-content: center;

  border-width: 1px;
  border-color: ${colors.focus_light};
  margin-left: ${RFValue(15)}px;
  padding: 3px ${RFValue(6)}px;
`;
