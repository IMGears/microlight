import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/utils/css/cn"

const typographyVariants = cva(
  "", // base styles
  {
    variants: {
      variant: {
        // Headings
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
        h4: "scroll-m-20 text-xl font-semibold tracking-tight",

        // Title variants (from MUI Joy mapping)
        "title-lg": "text-lg font-semibold leading-tight",
        "title-md": "text-base font-medium leading-tight",
        "title-sm": "text-sm font-medium leading-tight",

        // Body text variants
        "body-lg": "text-lg leading-7",
        "body-md": "text-base leading-7",
        "body-sm": "text-sm leading-6",
        "body-xs": "text-xs leading-5",

        // Special variants
        lead: "text-xl text-muted-foreground",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-sm text-muted-foreground",
      },
      color: {
        default: "",
        muted: "text-muted-foreground",
        success: "text-green-600",
        warning: "text-yellow-600",
        danger: "text-red-600",
        primary: "text-primary",
        neutral: "text-gray-600",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      }
    },
    defaultVariants: {
      variant: "body-md",
      color: "default",
    },
  }
)

/**
 * @typedef {Object} TypographyOwnProps
 * @property {React.ElementType} [as] - The component to render
 * @property {'h1' | 'h2' | 'h3' | 'h4' | 'title-lg' | 'title-md' | 'title-sm' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs'} [level] - Legacy MUI Joy level prop
 * @property {React.ElementType} [component] - Legacy MUI Joy component prop
 * @property {string} [className] - Custom className
 * @property {React.ReactNode} [children] - Children content
 * @property {'sm' | 'md' | 'lg' | 'xl'} [fontSize] - Legacy MUI Joy fontSize prop
 * @property {'normal' | 'medium' | 'lg' | 'bold'} [fontWeight] - Legacy MUI Joy fontWeight prop
 * @property {React.ReactNode} [startDecorator] - Element to render at the start
 * @property {React.ReactNode} [endDecorator] - Element to render at the end
 * @property {boolean} [noWrap] - Prevents text wrapping
 * @property {React.CSSProperties | Object} [sx] - Style object
 * @property {string} [title] - HTML title attribute
 * @property {string} [variant] - Typography variant
 * @property {'default' | 'muted' | 'success' | 'warning' | 'danger' | 'primary' | 'neutral'} [color] - Text color
 * @property {'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'} [weight] - Font weight
 * @property {'left' | 'center' | 'right' | 'justify'} [align] - Text alignment
 */

/** @typedef {TypographyOwnProps} TypographyProps */

/**
 * Get the default semantic element for a given variant/level
 * @param {string | null} [variant]
 * @param {string | null} [level]
 * @returns {React.ElementType}
 */
function getDefaultElement(variant, level) {
  const target = level || variant

  switch (target) {
    case "h1": return "h1"
    case "h2": return "h2"
    case "h3": return "h3"
    case "h4": return "h4"
    case "title-lg": return "h2"
    case "title-md": return "h3"
    case "title-sm": return "h4"
    case "lead": return "p"
    case "large": return "div"
    case "small": return "small"
    case "muted": return "p"
    default: return "p"
  }
}

/**
 * Convert legacy MUI Joy props to new variant system
 * @param {TypographyProps} props
 * @returns {string}
 */
function getLegacyVariant(props) {
  // Handle legacy level prop
  if (props.level) {
    return props.level
  }

  // Handle legacy fontSize + fontWeight combination
  if (props.fontSize && props.fontWeight) {
    if (props.fontSize === "md" && props.fontWeight === "lg") return "title-sm"
    if (props.fontSize === "lg" && props.fontWeight === "lg") return "title-md"
  }

  // Handle standalone fontSize
  if (props.fontSize) {
    switch (props.fontSize) {
      case "sm": return "body-sm"
      case "md": return "body-md"
      case "lg": return "body-lg"
      case "xl": return "title-lg"
    }
  }

  return props.variant || "body-md"
}

/**
 * Convert legacy fontWeight to weight prop
 * @param {string} [fontWeight]
 * @returns {'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | undefined}
 */
function getLegacyWeight(fontWeight) {
  switch (fontWeight) {
    case "lg": return "medium"
    case "bold": return "bold"
    default: return undefined
  }
}

/** @type {React.ForwardRefExoticComponent<TypographyProps & React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>} */
const Typography = React.forwardRef(
  ({
    as,
    component,
    level,
    variant: variantProp,
    color,
    weight: weightProp,
    align,
    className,
    fontSize,
    fontWeight,
    startDecorator,
    endDecorator,
    noWrap,
    sx,
    title,
    children,
    ...props
  }, ref) => {
    // Handle legacy props
    const variant = getLegacyVariant({ level, variant: variantProp, fontSize, fontWeight })
    const weight = weightProp || getLegacyWeight(fontWeight)

    // Determine the component to render
    const Component = as || component || getDefaultElement(variant, level)

    // Build className with noWrap support
    const typographyClasses = cn(
      typographyVariants({
        variant: variant,
        color,
        weight,
        align
      }),
      noWrap && "truncate whitespace-nowrap overflow-hidden",
      className
    )

    // Handle sx prop by converting to inline styles (simplified approach)
    const sxStyles = sx ? { ...sx } : undefined

    // If we have decorators, wrap in a flex container
    if (startDecorator || endDecorator) {
      return (
        <Component
          className={cn("flex items-center gap-2", className)}
          style={sxStyles}
          title={noWrap ? title : undefined}
          ref={ref}
          {...props}
        >
          {startDecorator && (
            <span className="flex-shrink-0 flex items-center">
              {startDecorator}
            </span>
          )}
          <span className={typographyClasses}>
            {children}
          </span>
          {endDecorator && (
            <span className="flex-shrink-0 flex items-center">
              {endDecorator}
            </span>
          )}
        </Component>
      )
    }

    return (
      <Component
        className={typographyClasses}
        style={sxStyles}
        title={noWrap ? title : undefined}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = "Typography"

export { Typography, typographyVariants }
