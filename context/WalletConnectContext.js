import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import truncateEthAddress from "truncate-eth-address";
import Abi from '../config/Abi.json'
import toast from "react-hot-toast";

export const WalletConnectContext = createContext();

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed1.binance.org'
      },
      chainId: 56
    }
  }
}

export const ConnectWalletProvider = ({ children }) => {

    const [addr, setAddr] = useState(null);
    const [account, setAccount] = useState(null);
    const [web3Modal, setWeb3Modal] = useState({});
    const [contract, setContract] = useState(null)
    const [cost, setCost] = useState(0)
    const [isMinting, setIsminting] = useState(false)
    const [receipt, setReceipt] = useState()
    const [supply, setSupply] = useState()
    const [bal, setBal] = useState()
    const [notification, setNotification] = useState()
    const [amount, setAmount] = useState()
    const [totalCost, setTotalCost] = useState()

    useEffect(() => {
        const connectWalletOnPageLoad = async () => {
          if (localStorage?.getItem('isWalletConnected') === ('true')) {
            try{ 
                if (typeof window !== "undefined") {
                  const web3Modal = new Web3Modal({
                    network: "mainnet", // optional
                    cacheProvider: true, // optional
                    providerOptions, // required
                    theme: "dark",
                  });
                setWeb3Modal(web3Modal)
                  await ConnectWallet()
                localStorage.setItem('isWalletConnected', true)
              }
  
            } catch(ex) {
              console.log(ex)
            }
          }
        }
        connectWalletOnPageLoad()
      },[])
  
    const isConnected = () => {
      account != null ? true : false;
    };
  
    const ConnectWallet = async () => {
      if (typeof window !== "undefined") {
        var modal = new Web3Modal({
          network: "mainnet", // optional
          cacheProvider: true, // optional
          providerOptions, // required
          theme: "dark",
        });
        setWeb3Modal(modal);
      }
      localStorage.setItem("isWalletConnected", true);
      const connection = await modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      let pr = await provider.getNetwork();
      let bal = await provider.getBalance(addr)
      let f = (ethers.utils.formatEther((bal)))
      setBal(Number(f).toFixed(4))
      setAddr(addr);
      const address = truncateEthAddress(addr);
      setAccount(address);
      let nftContract = await new ethers.Contract('0xE33cc98d90975Ad42e56251B0A1cd8bda9FAF003', Abi, signer)
      setContract(nftContract)
      let HacW = await nftContract.HacWhitelist(addr)
      let collabW = await nftContract.collabWhitelist(addr)
      if(HacW == true) {
        let c = await nftContract.HacWhitelistCost()
        let pro = String(parseInt(c))
        setCost(ethers.utils.formatEther(pro))
      } else if (collabW == true) {
        let c = await nftContract.collabWhitelistCost()
        let pro = String(parseInt(c))
        setCost(ethers.utils.formatEther(pro))
      } else {
        let c = await nftContract.cost()
        let pro = String(parseInt(c))
        setCost(ethers.utils.formatEther(pro))
      }
      let sup = await nftContract.totalSupply()
      setSupply(parseInt(sup))
     /* const itemArray = []
      for(let i = 0; i < 12; i++) {
        const token = i + 1
        const owner = await nftContract.ownerOf(token)
        itemArray.push(owner)
      }

      console.log(itemArray)
      setNfts(itemArray) */

    }

   /* const add = async() => {
        await contract.addUsersToCollabWhitelist(nfts)
    } */

    const DisconnectWallet = async () => {
        try {
          await web3Modal.clearCachedProvider();
          setAccount(null);
          localStorage.setItem("isWalletConnected", false);
        } catch (ex) {
          console.log(ex);
        }
      };
  
    const calcAddMint = async () => {
    setAmount( prev => prev += 1);
    let tc = Number(cost) * amount;
    setTotalCost(tc.toFixed(3));
  };

  const calcSubMint = async () => {
    setAmount( prev => prev -= 1);
    let tc = Number(cost) * amount;
    setTotalCost(tc.toFixed(3));
  };

      const mint = async (mintAmount) => {
        
            let tc = Number(cost) * mintAmount;
    setTotalCost(tc);
    let tx = await contract.mint(addr, mintAmount, {
      value: ethers.utils.parseEther(totalCost.toString()),
    });
    setIsminting(true);
    await tx.wait();
    setIsminting(false);
    setAmount(0);
    setTotalCost(0);
    let supply = await contract.totalSupply();
    setSupply(parseInt(supply));
      }
      return (
        <WalletConnectContext.Provider
          value={{
            account,
            ConnectWallet,
            DisconnectWallet,
            cost,
            isMinting,
            mint,
            receipt,
            supply,
            notification,
            setNotification,
            amount,
            totalCost,
            calcAddMint,
            calcSubMint
          }} >
          {children}
        </WalletConnectContext.Provider>
      );
    };    