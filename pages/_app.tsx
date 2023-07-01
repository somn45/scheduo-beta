import client from '@/client';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client/react';
import Layout from '@/components/layout/Layout';
import { Provider } from 'react-redux';
import wrapper from '@/lib/store/store';

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Layout>
          <Component {...props.pageProps} />
        </Layout>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
