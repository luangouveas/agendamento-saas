import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

interface NavLinkProps extends ComponentProps<typeof Link> {}

export function NavLink(props: NavLinkProps) {
  const pathname = usePathname()
  const href = props.href.toString().split('/')
  const path = pathname.split('/')

  const isCurrent = href[3] === path[3]

  return <Link data-current={isCurrent} {...props} />
}
