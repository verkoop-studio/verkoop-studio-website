import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Arrow from './Arrow'

/** Text link with an underline that draws on hover and an arrow that slides through. */
export default function TextLink({
  to,
  href,
  children,
  arrow = 'right',
  className = '',
  onClick,
}: {
  to?: string
  href?: string
  children: ReactNode
  arrow?: 'right' | 'up-right' | false
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  const classes = `vs-textlink vs-textlink--arrow ${className}`.trim()
  const inner = <>{children}{arrow && <Arrow direction={arrow} size={15} />}</>
  if (to) return <Link to={to} className={classes} onClick={onClick}>{inner}</Link>
  return <a href={href} className={classes} onClick={onClick}>{inner}</a>
}
