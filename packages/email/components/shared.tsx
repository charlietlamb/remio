import {
  Button,
  Container,
  Heading,
  Hr,
  Img,
  Section,
  Text,
} from '@react-email/components'
import { env } from '@remio/env'

export function EmailHeader() {
  return (
    <Img
      src={`${env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/public/remio/logo.svg`}
      width="48"
      height="48"
      alt="Company Logo"
      className="mx-auto mb-4"
    />
  )
}

export function EmailHeading({ children }: { children: React.ReactNode }) {
  return (
    <Heading className="text-2xl font-bold text-center text-gray-800 mb-4">
      {children}
    </Heading>
  )
}

export function EmailButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Section className="text-center mb-6">
      <Button
        className="bg-primary text-white font-bold rounded-md px-8 py-6"
        href={href}
      >
        {children}
      </Button>
    </Section>
  )
}

export function EmailFooter() {
  return (
    <>
      <Hr className="border-gray-300 my-4" />
      <Text className="text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} remio. All rights reserved.
      </Text>
    </>
  )
}

export function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="mx-auto py-5 px-5 max-w-xl">
      <EmailHeader />
      {children}
      <EmailFooter />
    </Container>
  )
}

export function EmailMessage({ children }: { children: React.ReactNode }) {
  return <Text className="text-gray-700 mb-4">{children}</Text>
}
