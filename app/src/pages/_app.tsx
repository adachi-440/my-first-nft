import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { TransactionProvider } from '../context/GameTransaction';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  );
}

export default MyApp;
