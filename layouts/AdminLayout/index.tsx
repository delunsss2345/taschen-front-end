'use client'
import { Search } from '@/components/common/Search'
import { ProfileDropdown } from '@/components/profile/ProfileDropdown'
import { Header } from './Header'
import { Main } from './Main'
import { TopNav } from './TopNav'


export function Dashboard() {
  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          {/* <ThemeSwitch /> */}
          {/* <ConfigDrawer /> */}
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
       
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]

