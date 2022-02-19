import React from 'react'

 const HeadAccount = (props) => {
    return (
        <div>
<div className="flex justify-center items-center">
<div className="w-3/3  rounded-lg shadow-sm p-8">
<div className="flex justify-between items-center">
<h1 className="font-extrabold tracking-wider">My Account Information:</h1>
<button className="hover:bg-blue-50 p-2 rounded-sm">
</button></div><div className="flex flex-col mt-5 gap-7 text-sm">
<div className="bg-yellow-50 flex justify-between items-center p-3 rounded-sm shadow-sm">
<div className="flex justify-start items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd"></path></svg><div>
<p className="text-gray-700 font-bold tracking-wider">Wallet Address:{props.children.account}</p>
<p className="text-yellow-700 font-bold tracking-wider">Balance : {props.children.balance} ETH</p>
        </div>
        </div>
        </div>
        </div>

        </div>
        </div>
        </div>


    )
}

export default HeadAccount;