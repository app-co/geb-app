import * as LocalAuthentication from 'expo-local-authentication';

export async function localAuth(): Promise<boolean | null> {
  let auth = null;

  try {
    const supported = await LocalAuthentication.hasHardwareAsync();

    if (!supported) {
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isEnrolled) {
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para continuar',
    });

    if (result.success) {
      auth = true;
    } else {
      auth = false;
    }
  } catch (error) {
    console.error('Erro ao autenticar:', error);
  }

  return auth;
}
