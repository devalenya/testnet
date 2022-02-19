const { assert } = require("chai");

const NFTMarketPlace = artifacts.require("NFTMarketPlace");
const NFT = artifacts.require("NFT");
require("chai").use(require("chai-as-promised")).should();

contract("NFT", accounts => {
    let market;
    let nftInstance;
    let nftAdress ;
    let marketAddress;
    let fees;
    let items = [];
    let accountTwo ;
    before( async()=>{

         market =  await NFTMarketPlace.new();
         nftInstance = await NFT.new(market.address);
          accountTwo = accounts[1]

    })
    describe("development", async ()=>{

        it("check the market Fees",async ()=>{

          fees = await market.gettheMarketFees();
        const converFees = fees.toString()
    
        assert.equal(converFees, "10000000000000000", "The Market fees is 10000000000000000");

        })

        it("check the contracts Address and Conver to wei", async()=>{

            nftAdress =  await nftInstance.address;
            marketAddress = await market.address;

            assert.notEqual(nftAdress, " ") 
            assert.notEqual(nftAdress, "0X0")
            assert.notEqual(nftAdress, "undefiend")

            assert.notEqual(marketAddress, " ") 
            assert.notEqual(marketAddress, "0X0")
            assert.notEqual(marketAddress, "undefiend")


        })

        it("Create NFts",async()=>{
            const oneEther = web3.utils.toWei("1","ether")
            // const mySymbol = await nftInstance.symbol();
//Create NFT
            await nftInstance.createNFtToken("https://ardapps.com/1.png")
            await nftInstance.createNFtToken("https://ardapps.com/2.png")

 


            await market.createItemForSale(nftAdress,1,oneEther,{value:fees})
            await market.createItemForSale(nftAdress,2,oneEther,{value:fees})


            items = await market.getAllUnsoldItems()
            items = await Promise.all(items.map(async(item)=>{
              const nftUrl = await nftInstance.tokenURI(item.tokenId);

              let myItem = {
                  price:item.price.toString(),
                  tokenId : item.tokenId.toString(),
                  nftUrl,
                  owner :item.owner,
                  seller:item.seller
              }
              return myItem;


            }))

            console.log("My Items Are",items)

        })
     

    })
});