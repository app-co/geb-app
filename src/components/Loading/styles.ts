import { Image } from 'react-native';
import styled from 'styled-components/native';

import theme from '../../global/styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.focus};
  align-items: center;
  justify-content: center;
`;

export const title = styled.Text``;

export const bg = styled(Image)`
  width: 140px;
  height: 58px;

  margin-bottom: 20px;
`;
