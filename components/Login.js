import React, { useContext } from 'react'
import { Button } from '@nextui-org/react'
import { WalletConnectContext } from '../context/WalletConnectContext'

const Login = () => {

    const connectContext = useContext(WalletConnectContext)

    const { ConnectWallet } = connectContext
  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2 bg-[#141313]'>
       <Button size="xl" auto bordered  color='warning' onClick={ConnectWallet}>
         Connect Wallet
       </Button>
     </div>
  )
}

export default Login