export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
    }
  }
  interface UserUnsafeMetadata {
    cardToken?: string
    priceId?: string
  }
}