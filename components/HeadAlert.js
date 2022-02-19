import React from 'react'

 const HeadAlert = (props) => {
    return (
        <div>
                        <div className=" container absolutepy-4 p-10 justify-center items-center">
            {
                props.children.account?    <div
                classNameName="w-6/3 bg-blue-100 rounded-lg shadow-sm p-5 border-dashed border border-blue-500 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
                    <div className="bg-blue-200 flex p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"></path>
                        </svg></div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-gray-700 font-bold tracking-wider">My Account Address:</h1>
                        <p className="text-gray-500 font-semibold"> {props.children.account}</p>
                    </div>
                </div>
            </div>
               :""
            }

                    <div className="   animated fadeIn faster    ">
<div className="flex flex-col p-8 bg-white shadow-md hover:shodow-lg rounded-2xl">
	<div className="flex items-center justify-between">
		<div className="flex items-center">

            <svg className="w-16 h-16 rounded-2xl p-3 border border-gray-100 text-yellow-400 bg-gray-800" viewBox="0 0 24 24" stroke="currentColor">
							<path d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"></path>
						</svg>
			<div className="flex flex-col ml-3">
				<div className="font-bold leading-none"> {props.children.title}</div>
				<p className="text-lg text-gray-600 leading-none mt-1"> {props.children.createdNumber} 
				</p>
			</div>
		</div>
	</div>
</div>
</div>
        </div>
        </div>

        
    )
}
export default HeadAlert;