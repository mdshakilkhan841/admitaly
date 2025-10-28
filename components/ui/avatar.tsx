<<<<<<< HEAD
'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
=======
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
<<<<<<< HEAD
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
=======
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
<<<<<<< HEAD
      className={cn('aspect-square size-full', className)}
=======
      className={cn("aspect-square size-full", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
<<<<<<< HEAD
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
=======
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
