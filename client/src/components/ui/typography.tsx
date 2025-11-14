import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const typographyVariants = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm text-muted-foreground",
  muted: "text-sm text-muted-foreground",
};

const displayVariants = {
  heavy: "font-black",
  bold: "font-bold",
  semibold: "font-semibold",
  medium: "font-medium",
  normal: "font-normal",
};

const colorVariants = {
  primary: "text-[#1D1D1B]",
  secondary: "text-[#1D1D1B]/70",
  muted: "text-[#1D1D1B]/60",
  light: "text-[#1D1D1B]/50",
  white: "text-white",
  whiteSecondary: "text-white/90",
  whiteMuted: "text-white/70",
  primaryDark: "text-primary",
  primaryLight: "text-primary/90",
  accent: "text-[#1D1D1B] hover:text-primary/90 transition-colors",
};

export interface TypographyProps {
  variant?: keyof typeof typographyVariants;
  display?: keyof typeof displayVariants;
  color?: keyof typeof colorVariants;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function Typography({
  variant = "p",
  display = "normal",
  color = "primary",
  className,
  children,
  asChild = false,
  ...props
}: TypographyProps) {
  const Comp = asChild ? Slot : "p";

  const displayClasses = displayVariants[display];
  const colorClasses = colorVariants[color];

  return (
    <Comp
      className={cn(
        typographyVariants[variant],
        displayClasses,
        colorClasses,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

// Exports individuels pour une utilisation plus facile
export function H1({ children, className, display = "heavy", color = "primary", ...props }: Omit<TypographyProps, 'variant' | 'display' | 'color'>) {
  return (
    <Typography variant="h1" display={display} color={color} className={className} {...props}>
      {children}
    </Typography>
  );
}

export function H2({ children, className, display = "bold", color = "primary", ...props }: Omit<TypographyProps, 'variant' | 'display' | 'color'>) {
  return (
    <Typography variant="h2" display={display} color={color} className={className} {...props}>
      {children}
    </Typography>
  );
}

export function H3({ children, className, display = "bold", color = "primary", ...props }: Omit<TypographyProps, 'variant' | 'display' | 'color'>) {
  return (
    <Typography variant="h3" display={display} color={color} className={className} {...props}>
      {children}
    </Typography>
  );
}

export function H4({ children, className, display = "bold", color = "primary", ...props }: Omit<TypographyProps, 'variant' | 'display' | 'color'>) {
  return (
    <Typography variant="h4" display={display} color={color} className={className} {...props}>
      {children}
    </Typography>
  );
}

export function P({ children, className, color = "primary", ...props }: Omit<TypographyProps, 'variant' | 'color'>) {
  return (
    <Typography variant="p" color={color} className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Blockquote({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="blockquote" color="secondary" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Code({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="inlineCode" color="primary" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Lead({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="lead" color="primary" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Large({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="large" color="primary" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Small({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="small" color="muted" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Muted({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="muted" color="muted" className={className} {...props}>
      {children}
    </Typography>
  );
}

// Composants spécialisés pour le thème Melring
export function DisplayTitle({ children, className, ...props }: Omit<TypographyProps, 'variant' | 'display'>) {
  return (
    <Typography variant="h1" display="heavy" color="white" className={`font-display ${className || ''}`} {...props}>
      {children}
    </Typography>
  );
}

export function SectionTitle({ children, className, ...props }: Omit<TypographyProps, 'variant' | 'display'>) {
  return (
    <Typography variant="h2" display="extrabold" color="white" className={`font-display ${className || ''}`} {...props}>
      {children}
    </Typography>
  );
}

export function CardTitle({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="h3" display="bold" color="primary" className={`font-display ${className || ''}`} {...props}>
      {children}
    </Typography>
  );
}

export function Subtitle({ children, className, ...props }: Omit<TypographyProps, 'variant' | 'color'>) {
  return (
    <Typography color="secondary" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function BodyText({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="p" color="primary" className={`font-body ${className || ''}`} {...props}>
      {children}
    </Typography>
  );
}

export function AccentText({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography color="accent" className={className} {...props}>
      {children}
    </Typography>
  );
}

export default Typography;