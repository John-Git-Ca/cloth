import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';

if (typeof window === 'object') {
  // mark that the app was server-side rendered
  window.__WAS_SSR = true;
}

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
