<<<<<<< HEAD
'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
=======
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
<<<<<<< HEAD
        className={cn('w-full caption-bottom text-sm', className)}
=======
        className={cn("w-full caption-bottom text-sm", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
        {...props}
      />
    </div>
  )
}

<<<<<<< HEAD
function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
=======
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

<<<<<<< HEAD
function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
=======
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

<<<<<<< HEAD
function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
=======
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
<<<<<<< HEAD
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className,
=======
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
=======
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <tr
      data-slot="table-row"
      className={cn(
<<<<<<< HEAD
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className,
=======
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
=======
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <th
      data-slot="table-head"
      className={cn(
<<<<<<< HEAD
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
=======
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
=======
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
  return (
    <td
      data-slot="table-cell"
      className={cn(
<<<<<<< HEAD
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
=======
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
=======
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
