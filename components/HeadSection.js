import React from 'react'
import Link from "next/link"
import { useState,useEffect } from 'react'
import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'

const HeadSection = () => {
   const[web3Api,setWe3Api] = useState({
       provider:null,
       web3:null
   })

   const providerChanged = (provider)=>{
       provider.on("accountsChanged",_=>window.location.reload());
       provider.on("chainChanged",_=>window.location.reload());

   }
   const[account,setAccount]= useState(null);
   useEffect(()=>{
       const loadProvider = async()=>{
           const provider =  await detectEthereumProvider();

           if(provider){
               providerChanged(provider);
               setWe3Api({
                   provider,
                   web3:new Web3(provider),
               })
           } else {

             window.alert("Unlock Your Wallet or Install a Wallet Like Metamask")
               
             router.push("https://metamask.io/download.html")
           }


       }

       loadProvider()
   },[])


   useEffect(()=>{
       const loadAccount = async()=>{
           const accounts = await web3Api.web3.eth.getAccounts();
           setAccount(accounts[0])

           
       }

     web3Api.web3&& loadAccount();
  },[ web3Api.web3])
 

   useEffect(()=>{
       const connect = async()=>{
          await connectMetamask()
       }
       web3Api.web3&& account&&connect()
      
   },[web3Api.web3&&account])


   const connectMetamask = async () => {
       const currentProvider = await detectEthereumProvider();
       console.log( "WE ARE IN META MASK CONNECT" );
         if (currentProvider) {
             // let web3InstanceCopy = new Web3(currentProvider);
             // setWeb3Instance(web3InstanceCopy);
             if (!window.ethereum.selectedAddress) {
               await window.ethereum.request({ method: 'eth_requestAccounts' });
             }
             await window.ethereum.enable();
             let currentAddress = window.ethereum.selectedAddress;
             console.log(currentAddress);
             setAccount(currentAddress);
              const web3 = new Web3(currentProvider);
             let amount = await web3.eth.getBalance(currentAddress);
             amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
         } else {
             console.log('Please install MetaMask!');
         }
   
     }


       return (
         <div className="relative max-w-7xl mx-auto px-4 dark:bg-bgcolor">
          <section>
              <div className="relative dark:bg-bgcolor overflow-hidden">
               <div className="max-w-7xl mx-auto">
               <div className="relative z-10 pb-8 indigo-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                   <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                   </div>
                   <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                   <div className="sm:text-center lg:text-left">
                   <h1 className="text-4xl tracking-tight font-extrabold text-yellow-500 sm:text-5xl md:text-6xl">
                       <span className="block lg:py-3 xl:inline">Upload Your NFTs </span>
                       <span className="block dark:text-white xl:inline">Discover, Collect, and Sell Extraordinary NFTs</span>
                       </h1>
                       <p className="mt-3 text-base dark:text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0" >
                       on the world's first & largest NFT marketplace,this Arabic Dapps Course that is will learn more about nfts and solidity programming language   </p>
                    
                           <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                       <div className="rounded-md shadow">
                           {
                               !account?      
                        <button className=" w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-gray-700 md:py-4 md:text-lg md:px-10"onClick={connectMetamask} >Connect Wallet</button>:
                        <button className=" w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 md:py-4 md:text-lg md:px-10" >{account.toString()}</button>
                           }

                           <Link href="/create-nfts">
                           <a  className="mt-4 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-gray-700 md:py-4 md:text-lg md:px-10">
       
                           Create Your NFT
                           </a>
                           </Link>
                       </div>
                   
                       </div>
                   </div>
                   </main>
               </div>
               </div>
               <div className="lg:absolute lg:inset-y-3 lg:right-0 lg:w-1/2">
               <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://ardapps.com/wp-content/uploads/2021/11/head-1.png" alt="headerSection Image" />
               </div>
               </div>


                           </section>
                           
                       </div>
                   )
               }

export default HeadSection;
