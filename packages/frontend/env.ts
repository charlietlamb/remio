import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string(),
    AUTH_DRIZZLE_URL: z.string().url(),
    AUTH_RESEND_KEY: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET_NAME: z.string(),
    AWS_REGION: z.string(),
  },
  client: {
    NEXT_PUBLIC_LOCATION: z.string().url(),
    NEXT_PUBLIC_AWS_S3_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_LOCATION: process.env.NEXT_PUBLIC_LOCATION,
    NEXT_PUBLIC_AWS_S3_URL: process.env.NEXT_PUBLIC_AWS_S3_URL,
  },
})

export default env
