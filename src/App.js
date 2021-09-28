import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react"
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = 'Nazeeh21';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 100;

const CONTRACT_ADDRESS = "0xe4DF53565D59A0A9e80D9ef122Dc924ab6feF7A3";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenMinted, setTokenMinted] = useState(null)
  const [mintNftLoading, setMintNftLoading] = useState(false)
  const [connectWalletLoading, setConnectWalletLoading] = useState(false)

  const checkIfWalletIsConnected = async () => {
    /*
   * First make sure we have access to window.ethereum
   */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have connected to ethereum")
      return;
    } else {
      console.log("Your ethereum wallet is connected")
    }

    /*
      * Check if we're authorized to access the user's wallet
      */
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    /*
    * User can have multiple authorized accounts, we grab the first one if its there!
    */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async () => {
    if(connectWalletLoading) {return}
    setConnectWalletLoading(true)
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!")
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0])
      console.log("Connected accounts: ", accounts[0])

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
      setConnectWalletLoading(false)
    } catch (error) {
      console.log(error)
      setConnectWalletLoading(false)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

        const currentTokenId = await connectedContract.getTotalNFtsMinted()
        const intTokenId = (parseInt(currentTokenId._hex, 16).toString(2)).padStart(8, '0')

        // console.log(currentTokenId)
        console.log('currentTokenId: ', intTokenId)
        setTokenMinted(intTokenId)


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    if(mintNftLoading) {return}
    setMintNftLoading(true)
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
      setMintNftLoading(false)
    } catch (error) {
      console.log(error)
      setMintNftLoading(false)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button loading={connectWalletLoading.toString()} disabled={connectWalletLoading} onClick={connectWallet} className="cta-button connect-wallet-button">
      {connectWalletLoading ? 'Connecting...' : 'Connect to Wallet'}
    </button>
  );

  const renderMintUI = () => (
    <button loading={mintNftLoading.toString()} disabled={mintNftLoading} onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      {mintNftLoading ? 'Minting...' : 'Mint NFT'}
    </button>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>

        <div className="footer-container">
          {tokenMinted && <div className='token-data'>
            {tokenMinted} / {TOTAL_MINT_COUNT} tokens Minted
        </div>}
          <div className="twitter-info">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a></div>
        </div>
      </div>
    </div>
  );
};

export default App;
