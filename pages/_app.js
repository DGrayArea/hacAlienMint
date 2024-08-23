import '../styles/globals.css'
import { NextUIProvider } from "@nextui-org/react"
import { Toaster } from 'react-hot-toast'
import { ConnectWalletProvider } from "../context/WalletConnectContext";

function MyApp({ Component, pageProps }) {
  return (
  <ConnectWalletProvider>
    <NextUIProvider>
      <Component {...pageProps} />
      <Toaster />
    </NextUIProvider>
    </ConnectWalletProvider>
  )
}

export default MyApp
