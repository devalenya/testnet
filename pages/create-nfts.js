import React,{useState,useEffect} from 'react'

import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'
import { useRouter } from 'next/router'



 const createNfts = () => {

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
    const[unsoldItems,setUnsoldItems]= useState([])


   
    
    
    
    
    

    

    const [nftFormInput,setNftFormInput] =useState({
        price:'',
        name:"",
        description:""
    })

    const createMarketItem =  async()=>{
        const {price,name,description}=nftFormInput;
        if(!price||!name||!description) return

        const data = JSON.stringify({
            name,description
        });

     
     
     
     
        
       

        const createMarketForSale = async(url)=>{
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
            const marketAddress = nftMarketWorkObject.address;

            const deployedNftContract = await new web3Api.web3.eth.Contract(nFTAbi,nftAddress);
            setNFtContract(deployedNftContract)
            const deployedMarketContract = await new web3Api.web3.eth.Contract(markrtAbi,marketAddress);
            setMarketContract(deployedMarketContract)
            
            if(account){
                            //Start to create NFt Item Token To MarketPlace
            let createTokenResult  = await deployedNftContract.methods.createNFtToken(url).send({from:account})

            const tokenid = createTokenResult.events.Transfer.returnValues["2"]

            console.log(tokenid)

            let marketFees = await deployedMarketContract.methods.gettheMarketFees().call()
            marketFees =marketFees.toString()

            const priceToWei = Web3.utils.toWei(nftFormInput.price,"ether")


                const lanchTheNFtForSale = await deployedMarketContract.methods.createItemForSale(nftAddress,tokenid,priceToWei).send({from:account,value:marketFees})
                router.push("/")
            } else{
                window.alert(" UNlock Your Wallet Or Please install any provider wallet like MetaMask")
                
                router.push("https://metamask.io/download.html")
            }

         


 
           }else{
               window.alert("You are at Wrong Network, set youe metamask wallet to BINANCE TESTNET then reload your page")
           }









        }





    return (
        <div className="flex justify-center">
            <div className = "w-1/2 flex flex-col pb-11">
                <input
                className = "mt-8 borderd rounded p-3 bg-pink-200"
                placeholder="Enter your NFT Name"
                onChange = {e=>setNftFormInput({...nftFormInput,name:e.target.value})}
                />
                 <input
                className = "mt-8 borderd rounded p-3 bg-pink-200"
                placeholder="Enter your NFT Price in BNB"
                onChange = {e=>setNftFormInput({...nftFormInput,price:e.target.value})}
                />
                 <textarea
                className = "mt-8 borderd rounded p-3 bg-pink-200"
                placeholder="Enter your NFT Description"
                onChange ={e=>setNftFormInput({...nftFormInput,description:e.target.value})}
                />

                 
            
                 


           

                            <button className="font-bold bg-pink-500 mt-5 rounded p-4 text-white"  onClick={createMarketItem}>Mint Your NFT</button>

                    
        </div>
        </div>

    )
}

export default createNfts;
