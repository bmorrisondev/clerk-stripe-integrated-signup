import React from 'react'

// Just an page hit after signup was successful
function Dashboard() {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <span>Welcome to</span>
      <h1 className='text-2xl font-bold'>Cooking with Clerk!</h1>
    </div>
  )
}

export default Dashboard