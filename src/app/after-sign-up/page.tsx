'use client'

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

  useEffect(() => {
    async function init() {
      while(!user?.publicMetadata?.stripeSubscriptionId) {
        await sleep(1000)
        await user?.reload()
      }
      router.push('/dashboard')
    }
    init()
  }, [])

  return (
    <div>
      loading...
    </div>
  )
}

export default AfterSignUp