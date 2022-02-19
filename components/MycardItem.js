import React from 'react'

 const MycardItem = () => {
    return (
        <div>
    <div className="h-screen">
      <div className="w-80 mt-24 m-auto lg:mt-16 max-w-sm">
        <img src="https://image.freepik.com/free-vector/app-development-illustration_52683-47931.jpg" alt=""className="rounded-t-2xl shadow-2xl lg:w-full 2xl:w-full 2xl:h-44 object-cover"/>
        <div className="bg-white shadow-2xl rounded-b-3xl">
          <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">Nft Name</h2>
          <div className="w-5/6 m-auto">
            <p className="text-center text-gray-500 pt-5"> Description You can now listen to millions of songs, audiobooks ands podcasts on any device anywhere you like!</p>
          </div>
          <div className="grid grid-cols-4 w-72 lg:w-5/6 m-auto bg-indigo-50 mt-5 p-4 lg:p-4 rounded-2xl">
            <div className="col-span-1 flex">
 
              <img className="flex justify-center w-15 lg:w-12" src="https://img.icons8.com/fluency/48/000000/ethereum.png" alt="music icon"/>
            </div>
            <div className="col-span-2 pt-1 ">
              <p className="text-gray-800 font-bold lg:text-sm">Price</p>
              <p className="text-gray-500 text-sm font-bold">2 ETH</p>
            </div>
        
          </div>
          <div className="bg-gray-800 w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-yellow-500 rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700">
            <button classNames="lg:text-sm text-lg font-bold">Proceed to Buy</button>
          </div>
          <div className="text-center m-auto mt-6 w-full h-1">
          </div>
        </div>
      </div>
    </div>
        </div>
    )
}

export default MycardItem;