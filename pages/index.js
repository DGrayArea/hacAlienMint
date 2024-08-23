import Head from "next/head";
import Image from "next/image";
import { Card, Text, Col, Row, Button, Container } from "@nextui-org/react";
import { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { WalletConnectContext } from '../context/WalletConnectContext'
import Login from '../components/Login'

const Home = () => {

  const connectContext = useContext(WalletConnectContext)

  const { ConnectWallet, account, DisconnectWallet, cost, isMinting : minting, mint, supply, setNotification, notification, add } = connectContext

  const [mintAmount, setMintAmount] = useState(0);
  const [totalCost, setTotalCost] = useState(0)

  useEffect((
    () => {
      let c = Number(cost * mintAmount)
      setTotalCost(c.toFixed(2))}
  ), [mintAmount])


  const handleMinting = async () => {
    
     setNotification(toast()); 
      try {
         await mint(mintAmount)
    }  catch (ex) {
      toast.error("Whops something went wrong!", {
        id: notification,
      });
      console.log("contract call failure", ex);
    }
  };

  if (account == null) {
    return <Login />
  } else {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-[#141313] ">
        <Head>
          <title>Horror Ape Club 333 Lottery</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="mt-20 px-4 py-4 flex-1">
          <div className="w-auto rounded-lg overflow-hidden shadow-xl">
            <div className="bg-gradient-to-b from-gray-900 to-[#11290c]">
              <img
                priority
                src="/alien.gif"
                width={140}
                height={140}
                alt="heroIcon"
                className="w-80 mx-auto"
              />
            </div>
            <div className="px-4 py-4 bg-black">
              <div className="flex px-4 py-4 items-center justify-evenly">
                {supply == 3000 ? 
                               <Button
                               disabled={true}
                               auto
                               flat
                               color='success'
                               className="rounded-2xl font-extrabold text-xl bg-gray-500 px-4 py-2 text-white hover:bg-gray-300"
                             > This Collection is  Sold Out
                             </Button>
                 :
                <>
               <Button
                  disabled={minting}
                  auto
                  onClick={add}
                  flat
                  className="rounded-2xl font-extrabold text-xl bg-gray-500 px-4 py-2 text-white hover:bg-gray-300"
                >
                  -
                </Button>
                <Button
                  disabled={minting}
                  bordered
                  auto
                  onClick={handleMinting}
                  color='warning'
                >
                 <Text b color="warning" size={18}>Mint {mintAmount}</Text> 
                </Button>
                <Button
                  disabled={minting}
                  auto
                  flat
                  onClick={() => setMintAmount((prev) => (prev += 1))}
                  className="rounded-2xl font-extrabold text-xl bg-gray-500 px-4 py-2 text-white hover:bg-gray-300"
                >
                  +
                </Button></>
               }
              </div> 
              <div className='flex items-center justify-center text-yellow-400 text-lg italic font-extrabold animate-pulse'>
                <Text size={18}  color="warning">Total cost {totalCost} BNB</Text>
              </div>
              <div className="flex px-4 py-4  items-center mb-5 justify-evenly">
                <div className="text-yellow-600 text-xl font-bold"> {cost} BNB</div>
                <div></div>
                <div className="text-yellow-600 text-xl font-bold"> | </div>
                <div></div>
                <div className="text-yellow-600 text-xl font-bold">{supply}&nbsp;/ 2333</div>
              </div>
              <div className="text-yellow-600 font-bold text-lg text-center">
                Mint your Alien Horror Apes
              </div>
            </div>
            <div className="flex bg-gradient-to-b font-extrabold justify-center items-center from-transparent to-black px-4 py-2">
              {account ?
               <Button
                  disabled={minting}
                  auto
                  bordered
                  onClick={DisconnectWallet}
                  color='warning'
                >
                  {account}
                </Button> :       
                    <Button
                  disabled={minting}
                  auto
                  onClick={ConnectWallet}
                  bordered
                  color='warning'
                >
                  Connect Wallet
                </Button>
                }
            </div>
          </div>
          <div></div>
        </div>
      </div>
    );
  }

};

export default Home;
