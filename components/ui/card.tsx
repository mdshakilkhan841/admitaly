<<<<<<< HEAD
import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
=======
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <div
      data-slot="card"
      className={cn(
<<<<<<< HEAD
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className,
=======
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
=======
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <div
      data-slot="card-header"
      className={cn(
<<<<<<< HEAD
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
=======
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
=======
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

<<<<<<< HEAD
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
=======
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

<<<<<<< HEAD
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
=======
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <div
      data-slot="card-action"
      className={cn(
<<<<<<< HEAD
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
=======
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
=======
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

<<<<<<< HEAD
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
=======
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
