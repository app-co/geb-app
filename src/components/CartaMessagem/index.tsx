import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Circle, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import theme from '../../global/styles/geb';

interface Props {
  pres: () => void;
  quantity: number;
}

export function CartaMessagem({ pres, quantity }: Props) {
  return (
    <Box>
      <TouchableOpacity onPress={pres}>
        <Circle
          top="2"
          bg={theme.colors.focus_second}
          alignItems="center"
          justifyContent="center"
          size="5"
        >
          <Text
            fontFamily={theme.fonts.bold}
            color={theme.colors.text_secundary}
            fontSize={12}
          >
            {quantity}
          </Text>
        </Circle>
        <MaterialCommunityIcons
          color={theme.colors.focus}
          size={40}
          name="email-outline"
        />
      </TouchableOpacity>
    </Box>
  );
}
