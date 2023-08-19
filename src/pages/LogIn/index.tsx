/* eslint-disable @typescript-eslint/no-explicit-any */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import { FormControl, WarningOutlineIcon, Text } from 'native-base';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, View } from 'react-native';

// import { Input } from "../../components/Inputs";
import logo from '../../assets/logo.png';
import { Button } from '../../components/Button';
import { Input } from '../../components/Inputs';
import { Loading } from '../../components/Loading';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { IsActiveFingerTokenStorage } from '../../storage/acitve-finger-token';
import { LocalAuthData } from '../../storage/local-auth-data';
import { version } from '../../utils/updates';
import { localAuth } from './LocalAurh';
import { BoxInput, BoxLogo, Container, Logo } from './styles';

const authStorage = new LocalAuthData();
const isActiveFingerToken = new IsActiveFingerTokenStorage();

export function SingIn() {
  const { login } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const [membro, setMembro] = useState('');
  const [pass, setPass] = useState('');
  const [load, setLoad] = React.useState(false);
  const [authencationStatus, setAuthenticationStatus] = React.useState<
    boolean | null
  >(null);

  const handleSubmit = useCallback(async () => {
    const credentials = await authStorage.getStorage();

    if (!authencationStatus) {
      if (membro === '' || pass === '') {
        return Alert.alert('Login', 'forneça um email e uma senha');
      }
      login({
        membro,
        senha: pass,
      });
    }
  }, [authStorage, authencationStatus, membro, pass, login]);

  React.useEffect(() => {
    async function Auth() {
      const isActive = await isActiveFingerToken.getStorage();

      console.log(isActive);

      const credentials = await authStorage.getStorage();

      if (isActive.isActive) {
        const isAuth = await localAuth();
        if (credentials) {
          if (isAuth) {
            setLoad(true);
            login(credentials);
          } else {
            setAuthenticationStatus(isAuth);
          }
        } else {
          await isActiveFingerToken.setStorage({ isActive: false });
        }
      }
    }

    Auth();
  }, [login]);

  if (load) {
    return <Loading />;
  }

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
