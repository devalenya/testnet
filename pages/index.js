import HeadSection from '../components/HeadSection'
import styles from '../styles/Home.module.css'
import { useState,useEffect } from 'react'
import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'
import axios from 'axios'
import MycardItem from '../components/MycardItem'
import { useRouter } from 'next/router'
import HeadAccount from '../components/HeadAccount'
import NewImageHead from '../components/NewImageHead'



export default function Home() {
    const[web3Api,setWe3Api] = useState({
        provider:null,
        web3:null
    })
    const router = useRouter();


    //Craete function to listen the change in account changed and network changes

    const providerChanged = (provider)=>{
        provider.on("accountsChanged",_=>window.location.reload());
        provider.on("chainChanged",_=>window.location.reload());

    }

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

              window.alert(" UNlock Your Wallet Or Please install any provider wallet like MetaMask")
                
              router.push("https://metamask.io/download.html")
            }


        }

        loadProvider()
    },[])
    //Create LoadAccounts Function
    const[account,setAccount]= useState(null);
    const[accountBalance,setAccountBalance]= useState(null);


    useEffect(()=>{
         const loadAccount = async()=>{
             const accounts = await web3Api.web3.eth.getAccounts();
             setAccount(accounts[0])

             

              const myBalance = await web3Api.web3.eth.getBalance(accounts[0])
              const convertBalance = await  web3Api.web3.utils.fromWei(myBalance,"ether")
              setAccountBalance(convertBalance)
 
             
         }

       web3Api.web3&& loadAccount();
    },[ web3Api.web3])

    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[nftAddress,setNFtAddress]= useState(null)
    const[marketAddress,setMarketAddress]= useState(null)
    const[unsoldItems,setUnsoldItems]= useState([])

  const indexOfunsold = unsoldItems.length;

    const firstOne = unsoldItems[indexOfunsold-1 ]
    const seconsOne = unsoldItems[indexOfunsold-2]
    const thirdOne = unsoldItems[indexOfunsold-3]
    const fourthOne = unsoldItems[indexOfunsold-4]
    const fivthOne = unsoldItems[indexOfunsold-5]


    useEffect(()=>{
        const LoadContracts = async()=>{
            //Paths of Json File
            const nftContratFile =  await fetch("/abis/NFT.json");
            const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
//Convert all to json
           const  convertNftContratFileToJson = await nftContratFile.json();
           const  convertMarketContractFileToJson = await marketContractFile.json();
//Get The ABI
           const markrtAbi = convertMarketContractFileToJson.abi;
           const nFTAbi = convertNftContratFileToJson.abi;

           const netWorkId =  await web3Api.web3.eth.net.getId();

           const nftNetWorkObject =  convertNftContratFileToJson.networks[netWorkId];
           const nftMarketWorkObject =  convertMarketContractFileToJson.networks[netWorkId];

           if(nftMarketWorkObject && nftMarketWorkObject){
            const nftAddress = nftNetWorkObject.address;
            setNFtAddress(nftAddress)
            const marketAddress = nftMarketWorkObject.address;
            setMarketAddress(marketAddress)

            const deployedNftContract = await new web3Api.web3.eth.Contract(nFTAbi,nftAddress);
            setNFtContract(deployedNftContract)
            const deployedMarketContract = await new web3Api.web3.eth.Contract(markrtAbi,marketAddress);
            setMarketContract(deployedMarketContract)

            //Fetch all unsold items
            const data =  await deployedMarketContract.methods.getAllUnsoldItems().call()
            console.log(data)
               const items = await Promise.all(data.map(async item=>{
                const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
                console.log(nftUrl)
                console.log(item)
                const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
                const metaData =  await axios.get(nftUrl);

//TODO: fix this object
              let myItem = {
                price:priceToWei,
                itemId : item.id,
                owner :item.owner,
                seller:item.seller,
                image:metaData.data.image,
                name:metaData.data.name,
                description:metaData.data.description
            }
            console.log(item)

            return myItem;

  
            
  
              }))

              setUnsoldItems(items)
         



 
           }else{
               window.alert("You are at Wrong Netweok, Connect with Roposten Please")
           }


        }
        web3Api.web3&&LoadContracts()

    },[web3Api.web3])
//Create nft Buy Function
const buyNFT = async (nftItem)=>{
    console.log("********")
    console.log(account)
    console.log(nftAddress)
    console.log(marketContract)

    const priceToWei = Web3.utils.toWei((nftItem.price).toString(),"ether")
    const convertIdtoInt = Number(nftItem.itemId)
  

   const result =  await marketContract.methods.createMarketForSale(nftAddress,convertIdtoInt).send({from:account,value:priceToWei})
  router.reload()
   console.log(result)
   


}






}
