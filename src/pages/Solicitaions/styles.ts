import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';

import theme from '../../global/styles/theme';
import { _title } from '../../utils/size';

export const Container = styled.View`
  padding-top: ${Platform.OS === `ios` ? getStatusBarHeight() : 20}px;
  background-color: ${theme.colors.focus_light};
  flex: 1;
`;

export const title = styled.Text`
  font-size: ${_title}px;

  margin: 20px;
`;

export const box = styled.View`
  flex: 1;

  padding: 10px;
`;
