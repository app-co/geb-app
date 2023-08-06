import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

import { LoadData } from '../contexts/LoadDataContext';
import { PadrinhoContext } from '../contexts/padrinho/context';
import { Pontos } from '../contexts/pontos/context';
import { RelationContex } from '../contexts/relation/context';
import { TokenContext } from '../contexts/Token/context';
import { useAuth } from '../hooks/useAuth';
import { SingIn } from '../pages/LogIn';
import { DrawerApp } from './DrawerApp';

export function Route() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <LoadData>
          <Pontos>
            <PadrinhoContext>
              <TokenContext>
                <RelationContex>
                  <DrawerApp />
                </RelationContex>
              </TokenContext>
            </PadrinhoContext>
          </Pontos>
        </LoadData>
      ) : (
        <SingIn />
      )}
    </NavigationContainer>
  );
}
