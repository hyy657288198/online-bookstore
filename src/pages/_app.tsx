import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from "@/components/Layout";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }: AppProps) {
    return (
      <GoogleOAuthProvider clientId="748150668515-nrsc3n0enatn2p7ah7hbh1obl718v9nj.apps.googleusercontent.com">
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </GoogleOAuthProvider>
  )
}
