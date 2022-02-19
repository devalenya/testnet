import HeadSection from '../components/HeadSection'
import styles from '../styles/Home.module.css'
import { useState,useEffect } from 'react'
import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'
import axios from 'axios'
import MycardItem from '../components/MycardItem'
import { useRouter } from 'next/router'
import purchased from './purchased'
import HeadAlert from '../components/HeadAlert'



const dashboard  = ()=>{
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

                window.alert("Please install any provider wallet like MetaMask")
            }


        }

        loadProvider()
    },[])
    //Create LoadAccounts Function
    const[account,setAccount]= useState(null);

    useEffect(()=>{
         const loadAccount = async()=>{
             const accounts = await web3Api.web3.eth.getAccounts();
             setAccount(accounts[0])

         }

       web3Api.web3&&  loadAccount();
    },[ web3Api.web3])

    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[nftAddress,setNFtAddress]= useState(null)
    const[marketAddress,setMarketAddress]= useState(null)
    const[creathedItems,setcreathedItems]= useState([])
    const[soldItems,setSoldItems]= useState([])


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

            console.log(account);
            //Fetch all unsold items
            const data =  await deployedMarketContract.methods.getMyItemCreated().call({from:account})
               const items = await Promise.all(data.map(async item=>{
                const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
                console.log(nftUrl)
                console.log(item)
                const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
                const metaData =  await axios.get(nftUrl);

//TODO: fix this object
              let myItem = {
                price:priceToWei,
                sold:item.sold,
                itemId : item.id,
                owner :item.owner,
                seller:item.seller,
                image:metaData.data.image,
                name:metaData.data.name,
                description:metaData.data.description
            }

            return myItem;

              }))

              const mySoldItems = items.filter(item=>item.sold);
              setSoldItems(mySoldItems)
              setcreathedItems(items)
         



 
           }else{
               window.alert("You are at Wrong Netweok, Connect with Roposten Please")
           }



        }
        web3Api.web3&&LoadContracts()

    },[account])









    return (
         <div >
        
           <div className = "flex justify-center">

               <div className="px-4 " style={{maxWidth:"1600px"}}>
               <HeadAlert >{{account:account,createdNumber:`Good Job You Created ${creathedItems.length} NfT Items`,title:"Number Of Created Items"}}</HeadAlert>

              {
                  !creathedItems.length ? 
                   <h1 className=" py-20 text-4xl tracking-tight font-extrabold text-yellow-500 sm:text-5xl md:text-6xl">
                  <span className="block lg:py-3 xl:inline">You Don`t Have Any  Nft Item </span>
                  </h1> :<>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-1">
                   {
               creathedItems.map((item,index)=>{

                return(
                    <>
     <div>
    <div className="">
      <div className="w-80 mt-24 m-auto lg:mt-16 max-w-sm">
        <img src={item.image} alt=""className="rounded-t-2xl shadow-2xl lg:w-full 2xl:w-full 2xl:h-44 object-cover"/>
        <div className="bg-white shadow-2xl rounded-b-3xl">
          <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">{item.name}</h2>
          <div className="w-5/6 m-auto">
            <p className="text-center text-gray-500 pt-5"> {item.description}</p>
          </div>
          <div className="grid grid-cols-4 w-72 lg:w-5/6 m-auto bg-indigo-50 mt-5 p-4 lg:p-4 rounded-2xl">
            <div className="col-span-1 flex">
 
              <img className="flex justify-center w-15 lg:w-12" src="https://img.icons8.com/fluency/48/000000/ethereum.png" alt="music icon"/>
            </div>
            <div className="col-span-2 pt-1 ">
              <p className="text-gray-800 font-bold lg:text-sm">Price</p>
              <p className="text-gray-500 text-sm font-bold">{item.price} ETH</p>
            </div>
        
          </div>
    
          <div className="text-center m-auto mt-6 w-full h-1">
          </div>
        </div>
      </div>
    </div>
        </div>
                    </>
                )
               })
           }
      

                   </div>
                  </>
              }

               </div>

           </div>
           <div className = "flex justify-center">
               <div className="px-4 " style={{maxWidth:"1600px"}}>
                <HeadAlert >{{createdNumber:`Number of your NFt Items solded: ${soldItems.length} `,title:"Number Of Sold Items"}}</HeadAlert>

              {
                  !soldItems.length ? 
                   <h1 className=" py-20 text-4xl tracking-tight font-extrabold text-yellow-500 sm:text-5xl md:text-6xl">
                  <span className="block lg:py-3 xl:inline">You Don`t Have Any  Sold Item </span>
                  </h1> :<>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-1">
                   {
               soldItems.map((item,index)=>{

                return(
                    <>
     <div>
    <div className="">
      <div className="w-80 mt-24 m-auto lg:mt-16 max-w-sm">
        <img src={item.image} alt=""className="rounded-t-2xl shadow-2xl lg:w-full 2xl:w-full 2xl:h-44 object-cover"/>
        <div className="bg-white shadow-2xl rounded-b-3xl">
          <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">{item.name}</h2>
          <div className="w-5/6 m-auto">
            <p className="text-center text-gray-500 pt-5"> {item.description}</p>
          </div>
          <div className="grid grid-cols-4 w-72 lg:w-5/6 m-auto bg-indigo-50 mt-5 p-4 lg:p-4 rounded-2xl">
            <div className="col-span-1 flex">
 
              <img className="flex justify-center w-15 lg:w-12" src="https://img.icons8.com/fluency/48/000000/ethereum.png" alt="music icon"/>
            </div>
            <div className="col-span-2 pt-1 ">
              <p className="text-gray-800 font-bold lg:text-sm">Price</p>
              <p className="text-gray-500 text-sm font-bold">{item.price} ETH</p>
            </div>
        
          </div>
    
          <div className="text-center m-auto mt-6 w-full h-1">
          </div>
        </div>
      </div>
    </div>
        </div>
                    </>
                )
               })
           }
      

                   </div>
                  </>
              }

               </div>

           </div>

           
           
             
         </div>
    )
}

export default dashboard;