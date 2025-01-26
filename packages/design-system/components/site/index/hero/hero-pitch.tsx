import Image from 'next/image'

export default function HeroPitch() {
  return (
    <Image
      alt="SaaS Dashboard"
      src={`/demo.webp`}
      width={1000}
      height={698}
      className="rounded-xl border border-border shadow-lg md:w-[80%] w-full"
      priority
    />
  )
}
