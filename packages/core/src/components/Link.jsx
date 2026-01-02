'use client'
import React from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types';
import { cn } from '@/utils/css/cn';


export default function Link({ href='/', className='', target='_self', onClick=()=>{}, children, Component=null }) {
  if (Component) {
    return (
      <NextLink href={href} target={target} passHref>
        <Component
          onClick={(e) => { if (onClick) { onClick(e) } }}
          className={className}>
          {children}
        </Component>
      </NextLink>
    )
  }

  return (
    <NextLink
      href={href}
      target={target}
      className={cn(
        "text-foreground no-underline bg-transparent hover:bg-transparent",
        className
      )}
      onClick={(e) => { if (onClick) { onClick(e) } }}
    >
      {children}
    </NextLink>
  )
}


// For Storybook Documentation
Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  Component: PropTypes.elementType,
  href: PropTypes.string.isRequired,
  target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
};

