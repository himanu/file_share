import React from 'react'

const Loader = () => {
  return (
    <div className='absolute w-[100vw] h-[100vh] max-h-[100vh] flex justify-center items-center backdrop-blur z-[50] overflow-hidden left-0 top-0'>
        <svg className='lg:w-[10%] w-[20%]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#FEFFF1" stroke="#FEFFF1" strokeWidth="3" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FEFFF1" stroke="#FEFFF1" strokeWidth="3" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FEFFF1" stroke="#FEFFF1" strokeWidth="3" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
    </div>
  )
}

export default Loader
