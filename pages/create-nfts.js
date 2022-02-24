import React,{useState,useEffect} from 'react'
import { create } from 'ipfs-http-client'
import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'
import { useRouter } from 'next/router'


const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
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




    const [urlHash,setUrlHash] = useState()
    const onChange = async(e)=>{
        const file = e.target.files[0];

        console.log("before")

        try{
            console.log("after try")
            const addedFile = await ipfsClient.add(file);
            
             const ipfsUrl = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
            setUrlHash(ipfsUrl)

        }catch(e){
            console.log(e)
        }

    }

    const [nftFormInput,setNftFormInput] =useState({
        price:'',
        name:"",
        description:""
    })

    const createMarketItem =  async()=>{
        const {price,name,description}=nftFormInput;
        if(!price||!name||!description ||!urlHash) return

        const data = JSON.stringify({
            name,description,image:urlHash
        });

        try{
            const addedFile = await ipfsClient.add(data);
            
            const ipfsUrl = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
            createMarketForSale(ipfsUrl);


        }catch(e){
            console.log(e)
        }


    }


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
               window.alert("You are at Wrong Netweok, Connect with BINANCE TESTNET")
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

                 
            
                 <div className="grid grid-cols-1 space-y-2 py-4">
                                    <label className="text-sm font-bold text-pink-500 tracking-wide">OUR NFT ART</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                                <div className="h-full w-full text-center flex flex-col justify-center items-center  ">
                                    
                                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                                        {
                                            urlHash?    <img className="has-mask  object-center" src="https://exchange.mixontoken.com/wp-content/uploads/2022/02/favicon.png" alt="NFT art"/> :                                    <img className="has-mask h-36 object-center" src="https://exchange.mixontoken.com/wp-content/uploads/2022/02/favicon.png?ext=png" alt="NFT art"/>


                                        }
                                    </div>
                                    


                                </div>
                                <input  onChange={onChange} />
                            </label>
                        </div>
                    </div>


           

                            <button className="font-bold bg-pink-500 mt-5 rounded p-4 text-white"  onClick={createMarketItem}>Mint Your NFT</button>

                    
        </div>
        </div>

    )
}

export default createNfts;
