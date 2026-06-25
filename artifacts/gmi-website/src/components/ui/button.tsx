import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]",
 {
 variants:{
 variant:{
 primary:"bg-primary text-primary-foreground border border-primary-border hover:brightness-110 shadow-sm hover:shadow-md",
 secondary:"bg-accent text-accent-foreground border border-accent-border hover:brightness-110 shadow-sm",
 destructive:"bg-destructive text-destructive-foreground shadow-sm border-destructive-border hover:brightness-110",
 outline:"border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
 ghost:"text-foreground hover:bg-muted/50 border border-transparent",
 link:"text-primary underline-offset-4 hover:underline",
 },
 size:{
 sm:"min-h-9 px-4 text-xs",
 md:"min-h-10 px-6 text-sm",
 default:"min-h-11 px-6 text-sm",
 lg:"min-h-12 px-8 text-base",
 xl:"min-h-14 px-10 text-lg",
 icon:"h-10 w-10",
 },
 },
 defaultVariants:{
 variant:"primary",
 size:"default",
 },
 }
)

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 VariantProps<typeof buttonVariants> {
 asChild?:boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, asChild = false, ...props }, ref) => {
 const Comp = asChild ? Slot :"button"
 return (
 <Comp
 className={cn(buttonVariants({ variant, size, className }))}
 ref={ref}
 {...props}
 />
 )
 }
)
Button.displayName = "Button"

export { Button, buttonVariants }
