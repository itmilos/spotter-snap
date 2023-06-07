import { useContext, useEffect } from 'react';
import styled from 'styled-components';
// import { assert } from '@metamask/utils';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
} from '../components';
import { request, useLazyGetAccountsQuery } from '../utils/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [getAccounts, { isLoading: isLoadingAccounts, data: accounts }] =
    useLazyGetAccountsQuery();

  const [state, dispatch] = useContext(MetaMaskContext);

  useEffect(() => {
    getAccounts()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((accounts) => console.log(`###: accounts`, accounts))
      .catch((e) => console.log(`###: e`, e));
  }, []);

  const handleConnectClick = async () => {
    try {
      await connectSnap();

      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  // const handleSendHelloClick = async () => {
  //   try {
  //     await sendHello();
  //   } catch (e) {
  //     console.error(e);
  //     dispatch({ type: MetamaskActions.SetError, payload: e });
  //   }
  // };


  const handleSendTransaction = (contractAddress: string, score: number) => () => {
    console.log(`###: accountsHandleTransaction`, accounts);
    // assert(accounts?.length);



    const account = accounts[0];
    // @ts-ignore
      request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: account,
          to: contractAddress,
          value: '0x0',
          data: '0x1',
          score,
        },
      ],
    });


  };

  return (
    <Container>
      <Heading>
        Spotter Snap
      </Heading>
      <Subtitle>
        Real-time notifications on potential hacks. Stay secure!
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        <Card
          content={{
            title: 'Reconnect',
            description:
              'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
            button: (
              <ReconnectButton
                onClick={handleConnectClick}
              />
            ),
          }}
        />
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {state.installedSnap && (
          <Card
            background={'red'}
            content={{
              title: 'High Security Risk',
              description:
                'Try high risk contract.',
              button: (
                <ConnectButton
                  onClick={handleSendTransaction(
                    `0xssssss`,
                    1,
                  )}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {state.installedSnap && (
          <Card
            background={'orange'}
            content={{
              title: 'Mid Security Risk',
              description:
                'Try mid risk contract.',
              button: (
                <ConnectButton
                  onClick={handleSendTransaction(
                    `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`,
                    2,
                  )}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {state.installedSnap && (
          <Card
            background={'green'}
            content={{
              title: 'No Security Risk',
              description:
                'Try no security risk contract.',
              button: (
                <ConnectButton
                  onClick={handleSendTransaction(
                    `0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9`,
                    3,
                  )}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
      </CardContainer>
    </Container>
  );
};

export default Index;
