import { HomeIcon } from '@remio/design-system/components/dashboard/sidebar/icons/home'
import { SquarePenIcon } from '@remio/design-system/components/dashboard/sidebar/icons/square-pen'
import { CircleDollarSignIcon } from '../icons/dollar'
import { FileStackIcon } from '../icons/files'
import { UsersIcon } from '../icons/users'

export const dashboardSidebarItemsTop = [
  {
    title: 'Dashboard',
    icon: <HomeIcon />,
    href: '/dashboard/overview',
    key: 'dashboard',
  },
  {
    title: 'New Matter',
    icon: <SquarePenIcon />,
    href: '/dashboard/new',
    key: 'new',
  },
]

export const dashboardSidebarItems = [
  {
    title: 'Clients',
    icon: <UsersIcon />,
    href: '/dashboard/clients',
    key: 'clients',
  },
  ,
  {
    title: 'Payments',
    icon: <CircleDollarSignIcon />,
    href: '/dashboard/payments',
    key: 'payments',
  },
  {
    title: 'Files',
    icon: <FileStackIcon />,
    href: '/dashboard/files',
    key: 'files',
  },
]

export type DashboardSidebarItem = (typeof dashboardSidebarItems)[number]
