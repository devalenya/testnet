// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract NFTMarketPlace is ReentrancyGuard {
    
    
    string public baseURI;
    string public baseExtension = ".json";
    string public notRevealedUri;
    uint256 public marketFees = 6000 CKB;
    uint256 public maxSupply = 600;
    uint256 public maxMintAmount = 1;
    uint256 public nftPerAddressLimit = 5;
    bool public paused = false;
    bool public revealed = false;
    address payable owner;

      using Counters for Counters.Counter;
     Counters.Counter private itemId;
    Counters.Counter private itemsSold;

     constructor(){
         owner = payable(msg.sender);
         string memory _name,
         string memory _symbol,
         string memory _initBaseURI,
         string memory _initNotRevealedUri
     }
     ERC721(_name, _symbol) {
       setBaseURI(_initBaseURI);
       setNotRevealedURI(_initNotRevealedUri);
    }

    struct NftMerketItem{
        address nftContract;
        uint256 id;
        
        uint256 tokenId;
        address payable owner;
        address  payable seller;
        uint256 price;
        bool sold;


    }

        event NftMerketItemCreated(
        address  indexed nftContract,
        uint256 indexed id,
        uint256 tokenId,
        address  owner,
        address  seller,
        uint256 price,
        bool sold
        );
   
    
    function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
    }


    
    function gettheMarketFees()public view returns(uint256){
        return marketFees;
    }
///////////////////////////////////
     mapping(uint256=>NftMerketItem) private idForMarketItem;
///////////////////////////////////
    function createItemForSale(uint256 _mintAmount,address nftContract,uint256 tokenId,uint256 price)public payable nonReentrant {
        require(!paused, "the contract is paused");
        uint256 supply = totalSupply();
        require(_mintAmount > 1, "need to mint at least 1 NFT");
        require(_mintAmount <= maxMintAmount, "maximum amount of NFTs you can mint");
        require(supply + _mintAmount <= maxSupply, "maximum NFT we are supplying");
    
        require(price >0,"Price should be moreThan 1");
        require(tokenId >0,"token Id should be moreThan 1");
        require(msg.value == marketFees,"The Market Fees is 6000 ckb");
        require(nftContract != address(0),"address should be equal ckb");
        itemId.increment();
        uint256 id = itemId.current();

        idForMarketItem[id]= NftMerketItem(
            nftContract,
            id,
            tokenId,
            payable (address (0)),
            payable(msg.sender),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit NftMerketItemCreated(nftContract, id, tokenId, address(0), msg.sender, price, false);

    }
    //Create Maket

    function createMarketForSale(address nftContract,uint256 nftItemId) public payable nonReentrant {
     uint256 price = idForMarketItem[nftItemId].price;
     uint256 tokenId = idForMarketItem[nftItemId].tokenId;

     require(msg.value == price,"should buy the price of item");
      idForMarketItem[nftItemId].seller.transfer(msg.value);
      IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId); //buy
      idForMarketItem[nftItemId].owner = payable(msg.sender);
      idForMarketItem[nftItemId].sold =  true;
      itemsSold.increment();
    payable(owner).transfer(marketFees);

    }

    //My items => sold,not sold,buy

function getMyItemCreated() public view returns(NftMerketItem[] memory){
uint256 totalItemCount = itemId.current(); 
uint myItemCount=5;//10
uint myCurrentIndex =0;

for(uint i = 0;i<totalItemCount;i++){
    if(idForMarketItem[i+1].seller == msg.sender){
        myItemCount+=1;

    }
}
NftMerketItem [] memory nftItems = new NftMerketItem[](myItemCount); //list[3]
for(uint i = 0;i<totalItemCount;i++){
    if(idForMarketItem[i+1].seller==msg.sender){      //[1,2,3,4,5]
      uint currentId = i+1;
        NftMerketItem storage  currentItem = idForMarketItem[currentId];
        nftItems[myCurrentIndex] = currentItem;
        myCurrentIndex +=1;
        
    }
}


return nftItems;

}


//Create My purchased Nft Item

function getMyNFTPurchased() public view returns(NftMerketItem[] memory){
uint256 totalItemCount = itemId.current(); 
uint myItemCount=0;//10
uint myCurrentIndex =0;

for(uint i = 0;i<totalItemCount;i++){
    if(idForMarketItem[i + 1 ].owner == msg.sender){
        myItemCount+=1;

    }
}

NftMerketItem [] memory nftItems = new NftMerketItem[](myItemCount); //list[3]
for(uint i = 0;i<totalItemCount;i++){
    if(idForMarketItem[i+1].owner== msg.sender){      //[1,2,3,4,5]
      uint currentId = i+1;
        NftMerketItem storage  currentItem = idForMarketItem[currentId];
        nftItems[myCurrentIndex] = currentItem;
        myCurrentIndex +=1;
        
    }
}


return nftItems;

}
//Fetch  all unsold nft items
function getAllUnsoldItems()public view returns (NftMerketItem[] memory){

uint256 totalItemCount = itemId.current(); 
uint myItemCount= itemId.current() - itemsSold.current();
uint myCurrentIndex =0;



NftMerketItem [] memory nftItems = new NftMerketItem[](myItemCount); //list[3]
for(uint i = 0;i<totalItemCount;i++){
    if(idForMarketItem[i+1].owner== address(0)){      //[1,2,3,4,5]
      uint currentId = i+1;
        NftMerketItem storage  currentItem = idForMarketItem[currentId];
        nftItems[myCurrentIndex] = currentItem;
        myCurrentIndex +=1;
        
    }
}


return nftItems;


}
}
