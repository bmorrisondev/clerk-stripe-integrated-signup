'use client'

import { Icons } from '@/components/ui/icons'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function AfterSignUp() {
  const router = useRouter();
  const { user } = useUser()

  // Wait for the user to have a stripe subscription id
  useEffect(() => {
    async function init() {
      while(!user?.publicMetadata?.stripeSubscriptionId) {
        await sleep(2000)
        await user?.reload()
      }
      router.push('/dashboard')
    }
    init()
  }, [])

  return (
    <div className='flex items-center justify-center mt-20'>
      <Icons.spinner className="size-8 animate-spin" />
    </div>
  )
}

export default AfterSignUp