"use client"
import { Menu } from 'antd'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import StyledComponentsRegistry from '@/lib/AntdRegistry'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentMenu, setCurrentMenu] = useState('home')

  const topbarList = [
    {
      label: 'Home',
      key: '/',
    },
    {
      label: 'Amogus',
      key: '/amogus'
    }
  ]

  const topbar = () => {
    return <Menu onClick={(e) => router.push(e.key)} selectedKeys={[pathname]} mode='horizontal' items={topbarList}/>
  }

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {topbar()}
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
