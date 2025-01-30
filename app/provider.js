// pages/_app.js
import { SessionProvider } from "next-auth/react";
import Provider from "../components/Provider";
import "../styles/globals.css"; // Import global styles if needed

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Provider session={session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;