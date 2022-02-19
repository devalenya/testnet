import React from 'react'

 const NewImageHead = (props) => {
    return (
        <>


<div className="p-1 ">
  <div className=""></div>
    <div className="container">
      <div className="max-w-md w-full bg-gray-900 shadow-lg rounded-xl p-6">
        <div className="flex flex-col ">
          <div className="">
            <div className="relative h-50 w-50 mb-3">
              <div className="absolute flex flex-col top-0 right-0 p-3">
          
              </div>
              <img src={props.children.image} alt="" className="    object-fill  rounded-2xl"/>
            </div>
            <div className="flex-auto justify-evenly">
              <div className="flex flex-wrap ">
              
                <div className="flex items-center w-full justify-between min-w-0 ">
                  <h2 className="text-lg mr-auto cursor-pointer text-gray-200 hover:text-yellow-500 truncate ">
                  {props.children.description} </h2>
                  
                </div>
              </div>
              <div className="text-xl text-white font-semibold mt-1">{props.children.price} ETH </div>
         
              <div className="flex space-x-2 text-sm font-medium justify-start">
                <button className="transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-yellow-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-gray-600 ">
                  <span><a name="" id="" class="btn btn-primary" onClick={props.children.buy}  role="button">Buy</a></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
                </>
    )
}

export default NewImageHead