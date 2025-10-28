<<<<<<< HEAD
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
=======
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
<<<<<<< HEAD
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className,
=======
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
=======
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<'a'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'a'
=======
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4

  return (
    <Comp
      data-slot="breadcrumb-link"
<<<<<<< HEAD
      className={cn('hover:text-foreground transition-colors', className)}
=======
      className={cn("hover:text-foreground transition-colors", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

<<<<<<< HEAD
function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
=======
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
<<<<<<< HEAD
      className={cn('text-foreground font-normal', className)}
=======
      className={cn("text-foreground font-normal", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<'li'>) {
=======
}: React.ComponentProps<"li">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
<<<<<<< HEAD
      className={cn('[&>svg]:size-3.5', className)}
=======
      className={cn("[&>svg]:size-3.5", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<'span'>) {
=======
}: React.ComponentProps<"span">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
<<<<<<< HEAD
      className={cn('flex size-9 items-center justify-center', className)}
=======
      className={cn("flex size-9 items-center justify-center", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
