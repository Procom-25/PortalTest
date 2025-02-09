// pages/_app.js
import Provider from "../components/provider";
// import "../styles/globals.css"; // Import global styles if needed
import { Toaster } from "sonner";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Provider session={session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;