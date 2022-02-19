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







    return (
         <div >
           {
                web3Api.provider ? <HeadSection/> : ""
           }
           <HeadAccount >{{account:account,balance:accountBalance}}</HeadAccount>
           {
             (unsoldItems.length < 5 )?
              <>
              <h1 className=" py-20 text-4xl tracking-tight font-extrabold text-yellow-500 sm:text-5xl md:text-6xl">
                  <span className="block lg:py-3 xl:inline">There is Lessthan 5 NFts </span>
                  </h1> 
             </>:
             <>
              <h1 className=" px-20 text-xl tracking-tight font-extrabold text-yellow-500 sm:text-3xl md:text-4xl">
                  <span className="block lg:py-3 xl:inline">Top Newest NFts Today </span>
                  </h1> 
             <div className = "flex justify-center p-2 m-3">
               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-2 pt-1">
             <NewImageHead>{{image:firstOne.image,price :firstOne.price,description:firstOne.description,buy:async()=>{
               buyNFT(firstOne);
             }}}</NewImageHead>
                 <NewImageHead>{{image:seconsOne.image,price :seconsOne.price,description:seconsOne.description,buy:async()=>{
               buyNFT(seconsOne);
             }}}</NewImageHead>
                 <NewImageHead>{{image:thirdOne.image,price :thirdOne.price,description:thirdOne.description,buy:async()=>{
               buyNFT(thirdOne);
             }}}</NewImageHead>
                 <NewImageHead>{{image:fourthOne.image,price :fourthOne.price,description:fourthOne.description,buy:async()=>{
               buyNFT(fourthOne);
             }}}</NewImageHead>
                 <NewImageHead>{{image:fivthOne.image,price :fivthOne.price,description:fivthOne.description,buy:async()=>{
               buyNFT(fivthOne);
             }}}</NewImageHead>

   
  
               </div>
        
             </div>
             </>
           }
         


           <div className = "flex justify-center">
             
               <div className="px-4 " style={{maxWidth:"1600px"}}>
               <h1 className=" px-10 text-xl tracking-tight font-extrabold text-yellow-500 sm:text-3xl md:text-4xl">
                  <span className="block lg:py-3 xl:inline">Explore All Nfts Nad Buy</span>
                  </h1> 
              {
                  !unsoldItems.length ? 
                   <h1 className=" py-20 text-4xl tracking-tight font-extrabold text-yellow-500 sm:text-5xl md:text-6xl">
                  <span className="block lg:py-3 xl:inline">Explore the High Uinque Nfts Item </span>
                  </h1> :<>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-1">
                   {
               unsoldItems.map((item,index)=>{

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
          <div className="bg-gray-800 w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-yellow-500 rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700">
            <button classNames="lg:text-sm text-lg font-bold" onClick = {()=>buyNFT(item)}>Proceed to Buy</button>
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