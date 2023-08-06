/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import { FormControl, WarningOutlineIcon, Text } from 'native-base';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, View } from 'react-native';

// import { Input } from "../../components/Inputs";
import logo from '../../assets/logo.png';
import { Button } from '../../components/Button';
import { Input } from '../../components/Inputs';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { version } from '../../utils/updates';
import { BoxInput, BoxLogo, Container, Logo } from './styles';

export function SingIn() {
  const { login } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const [membro, setMembro] = useState('');
  const [pass, setPass] = useState('');
  const [errEmail, setErrEmail] = useState(false);
  const [errPass, setErrPass] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (membro === '' || pass === '') {
      return Alert.alert('Login', 'forneça um email e uma senha');
    }

    setErrEmail(false);
    setErrPass(false);

    await login({
      membro,
      senha: pass,
    }).catch(h => {
      console.log(h);
      Alert.alert('Erro ao logar com sua conta', h.response.data.message);
    });

    return null;
  }, [membro, pass, login]);

  return (
    <Container behavior="padding">
      <Text
        style={{
          alignSelf: 'flex-end',
          color: theme.colors.primary_light,
          fontSize: 12,
          marginRight: 20,
          top: 30,
        }}
      >
        version: {version}
      </Text>
      <BoxLogo>
        <Logo source={logo} />
      </BoxLogo>

      <BoxInput>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input
            name="membro"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={h => setMembro(h)}
            placeholder="MEMBRO"
            value={membro}
          />
          <Input
            name="membro"
            value={pass}
            selectionColor={theme.colors.text_secundary}
            secureTextEntry
            placeholder="SENHA"
            onChangeText={setPass}
          />

          <View style={{ marginTop: 32 }}>
            <Button pres={() => formRef.current?.submitForm()} title="ENTRAR" />
          </View>
        </Form>
      </BoxInput>
    </Container>
  );
}
