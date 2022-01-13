import { AppProps } from 'next/app'
import { useEffect } from 'react';
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  // Check protocol
  useEffect(() => {
    if (window.location.protocol == 'http:' && window.location.hostname != 'localhost') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  },[]);

  return (
    <Component {...pageProps} />
  );
}

export default MyApp
