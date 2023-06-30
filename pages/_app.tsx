import client from '@/client';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client/react';
import Layout from '@/components/layout/Layout';
import store from '@/lib/store/store';
import { Provider } from 'react-redux/es/exports';
import wrapper from '@/lib/store/store';

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default wrapper.withRedux(App);
