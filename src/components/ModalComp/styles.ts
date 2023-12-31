import styled from 'styled-components/native';

import { _subTitle } from '../../utils/size';

export const Container = styled.View`
  flex: 1;
  background-color: rgba(51, 51, 51, 0.523);
`;

export const title = styled.Text`
  font-size: ${_subTitle}px;
  font-family: 'bold';
`;

export const box = styled.View`
  background-color: #a1a1a1;
  padding: 20px;
`;
