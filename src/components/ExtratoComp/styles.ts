import styled from 'styled-components/native';

import theme from '../../global/styles/theme';
import { _text, _title } from '../../utils/size';

export const content = styled.View`
  margin: 5px;
  border-width: 1px;
  border-radius: 8px;
  padding: 5px;
  min-height: 60px;
`;

export const Container = styled.View`
  background-color: #9d9d9d98;
  padding: 5px 10px;

  flex-direction: row;
  align-items: center;
  margin: 5px 10px;
  border-radius: 5px;
`;

export const box = styled.View`
  flex: 1;
  margin-left: 15px;
`;

export const title = styled.Text`
  color: #fff;
  font-family: ${theme.fonts.bold};
  font-size: ${_title}px;
`;

export const text = styled.Text`
  color: #141414;
  font-family: ${theme.fonts.regular};
  font-size: ${_text + 2}px;
`;
