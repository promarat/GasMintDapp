import Web3 from "web3";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Logo from "./assets/imgs/Logo.png";
import twitterPng from "./assets/imgs/twitter.png";
import discordPng from "./assets/imgs/discord.png";
import openseaPng from "./assets/imgs/opensea.png";
import mainPng from "./assets/imgs/hide.gif";
import './App.css';
import { useEffect, useState } from "react";
import contractAbi from "./abi/doodle.json";

const contractAddress = "0x42F95803cCB7D9FC5eB6A1Bf19F2c0Da12E0EE4B";
const sale = true;
const publicSale = true;

function App() {
  var web3;
  var nftContract;
  var address;
  var chainId;
  const [maxQuantity] = useState(5);
  const [quantity, setQuantity] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [leftToken, setLeftToken] = useState(5000);
  if(window.ethereum != null) {
  	web3 = new Web3(window.ethereum);
  }

  const connectWallet = async () => {
    if(window.ethereum != null) {
      await window.ethereum.request({method: 'eth_requestAccounts'}).then((data) => {
        address = data[0];
        setWalletAddress(address);
      });
    } else {
      notificationfunc("error", 'Can\'t Find Metamask Wallet. Please install it and reload again to mint NFT.');
    }
  }

  const mintToken = async () => {
    if (!walletAddress){
      notificationfunc("info", 'Please connect Metamask before mint!');
    } else {
      if (quantity <= 0){
        notificationfunc("warning", "Quantity should be more than 0.");
      } else {
        if (publicSale && quantity > maxQuantity) {
          notificationfunc("error", "Max quantity is " + maxQuantity);
        } else {
          nftContract = contractAbi;
          if (window.ethereum == null) {
            notificationfunc("error", 'Wallet connect error! Please confirm that connect wallet.');
          } else {
            await window.ethereum.request({method: 'eth_chainId'}).then(data => {
              chainId = data;
            });
   
            //Public Sale
            if(chainId === '0x3') {
              const contract = new web3.eth.Contract(nftContract, contractAddress);
              await contract.methods.presale().call(async(err,result)=>{
                if (err){
                  notificationfunc("warning", "Please check your wallet.");
                }
                else {
                  await contract.methods.mint(walletAddress, quantity).send({
                    value: result ? 0 : (25000000000000000*quantity),
                    from: walletAddress
                  })
                  .then(data => {
                    notificationfunc("success", 'Successfully Minted!');
                  })
                  .catch(err => {
                    notificationfunc("error", err.message);
                  })
                }
              })
            }else {
              notificationfunc("info", "Please change the network to Ethereum Mainnet and try again...");
            }
          }
        }
      }
    }
  }


  const notificationfunc = (type, message) => {
    switch (type) {
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message);
        break;
      case 'warning':
        NotificationManager.warning(message, 'Warning', 3000);
        break;
      case 'error':
        NotificationManager.error(message, 'Error', 5000);
        break;
      default:
        break;
    }
  }

  const noSaletime = () => {
    notificationfunc("info", "Mint presale will be live on March 18th");
  }

  const checkConnection = async () => {
    // Check if browser is running Metamask
    let web3;
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    };
    // Check if User is already connected by retrieving the accounts
    if (web3){
      web3.eth.getAccounts()
      .then(async (addr) => {
          setWalletAddress(addr[0]);
          if (sale) {
            setInterval( async () => {
              if (web3){
                let contract = new web3.eth.Contract(contractAbi, contractAddress);
                if (contract){
                  await contract.methods.totalSupply().call((err, result) => {
                    if (err){
                      console.log(err);
                    } else {
                      let leftTokenNumber = 5000 - result;
                      if (leftTokenNumber < 0) leftTokenNumber = 0;
                      setLeftToken(leftTokenNumber);
                    }
                  })
                }
              }
            }, 5000);
          }
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="App">
      <div className="container-fluid main-container">
        <div className="page-container">
          <header className="header"> 
            <img src={Logo} alt="Logo" width={420} height={140}/>
            <div className="button-wrap">
              <a className="ml-20" rel="noreferrer" href="https://twitter.com/doodleapes_nft" target="_blank">
                <img alt="Twitter" className="social-btn" src={twitterPng}  height="50"/>
              </a>
              <a className="ml-20" rel="noreferrer" href="https://discord.gg/PyFgjGNtGd" target="_blank">
                <img alt="Discord" className="social-btn" src={discordPng} height="50"/>
              </a>
              <a className="ml-20" rel="noreferrer" href="https://opensea.io/collection/doodle-apes-society-das" target="_blank">
                <img alt="Opensea" className="social-btn" src={openseaPng} height="55"/>
              </a>
              {walletAddress ? 
              <p className="address-text">{walletAddress.substr(0,6) + "..." + walletAddress.substr(walletAddress.length - 4)}</p> :
              <button onClick={connectWallet} className="connect-button">Connect Wallet</button>
              }
              
            </div>
          </header>

          <main>
            <div className="mintform">
              <div className="mt-2 mainPng">
                <img alt="" aria-hidden="true" src={mainPng} width="220" height="220"/>
              </div>
              <h1 className="form-title">
                <span className="cblue">M</span>
                <span className="cgreen">I</span>
                <span className="cpink">N</span>
                <span className="cpurple">T</span>
                &nbsp;
                <span className="cyellow">Y</span>
                <span className="cblue">O</span>
                <span className="cpyellow">U</span>
                <span className="cblue">R</span>
              </h1>
              <h1 className="form-title1">
                <span className="cblue">G</span>
                <span className="cgreen">R</span>
                <span className="cpink">O</span>
                <span className="cpurple">W</span>
                <span className="cyellow">N</span>
                &nbsp;
                <span className="cpyellow">A</span>
                <span className="cblue">P</span>
                <span className="cgreen">E</span>
                <span className="cpink">S</span>
              </h1>
              {/* <h2 className="sub-title">2500 at 0.05 Max 5 per transactions</h2> */}
              {/* <h2 className="sub-title">2500 at 0.05 Max 3 per transactions</h2> */}
              <div className="max-title">Enter Quantity</div>
              <input className="quantity-input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value < 0 ? 0  : e.target.value)} placeholder={0} min="0"/>
              <button type="button" className="mint-button" disabled="" onClick={sale ? mintToken : noSaletime}>MINT</button>
              <h3 className="left-token"><span className="cgreen">{leftToken}</span>/<span className="cpink">5000</span> <span className="cblue">left</span></h3>
            </div>
          </main>
        </div>
        
      </div>
      <NotificationContainer/>
    </div>
  );
}

export default App;
