import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

import { _subTitle, _text } from '../../utils/size';

const w = Dimensions.get('screen').width;

export const Container = styled.View`
  /* height: 200px; */
  background-color: ${h => h.theme.colors.focus[2]};
  border-radius: 8px;

  width: 100%;
  padding: 20px;
  margin: 10px 0;
`;

export const flex = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 3px 0;
`;

export const title = styled.Text`
  color: ${h => h.theme.colors.color_text.ligh};
  font-family: ${h => h.theme.fonts.regular};
  font-size: ${_subTitle}px;
`;

export const text = styled.Text`
  color: ${h => h.theme.colors.color_text.ligh};
  font-family: ${h => h.theme.fonts.regular};
  font-size: ${_text}px;
`;

export const flexButton = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${w * 0.8}px;
  margin: 20px 0;
`;

export const buttonOk = styled.TouchableOpacity`
  padding: 10px;
  align-items: center;
  justify-content: center;

  background-color: ${h => h.theme.colors.bg_button[1]};
  border-radius: 8px;
`;
export const buttonRe = styled.TouchableOpacity`
  border-radius: 8px;

  padding: 10px;
  align-items: center;
  justify-content: center;

  background-color: ${h => h.theme.colors.bg_button[2]};
`;

export const boxDescription = styled.View`
  flex: 1;
`;
