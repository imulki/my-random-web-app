import Title from 'antd/es/typography/Title'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Title level={1}>
        Hello there.
      </Title>
    </main>
  )
}
