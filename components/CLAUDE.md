# CLAUDE.md - Components Directory

This directory contains all React components for the application.

## Directory Structure

```
components/
├── ui/                     # shadcn/ui components
│   ├── accordion.tsx
│   ├── alert.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── radio-group.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   └── tooltip.tsx
├── motion.tsx              # Framer Motion wrapper components
└── AnimatedCounter.tsx     # Custom animated number counter
```

## shadcn/ui Components (`ui/`)

These are pre-built components from shadcn/ui using Radix UI primitives.

### Adding New Components

```bash
npx shadcn@latest add <component-name>
```

Available components: https://ui.shadcn.com/docs/components

### Usage Pattern

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

### Button Variants

```typescript
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Form Components

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Motion Components (`motion.tsx`)

Framer Motion wrapper components for consistent animations.

### Available Components

```typescript
import {
  MotionDiv,
  MotionButton,
  MotionSection,
  MotionModal,
  MotionOverlay,
  MotionDropdown,
  MotionToast,
  MotionStaggerContainer,
  MotionStaggerItem,
  MotionFade,
  MotionFadeUp,
} from '@/components/motion'
```

### Usage Examples

```typescript
// Basic fade-up animation
<MotionFadeUp>
  <h1>Animated Title</h1>
</MotionFadeUp>

// Staggered list animation
<MotionStaggerContainer>
  {items.map(item => (
    <MotionStaggerItem key={item.id}>
      <Card>{item.name}</Card>
    </MotionStaggerItem>
  ))}
</MotionStaggerContainer>

// Custom animation
<MotionDiv
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</MotionDiv>

// Modal with overlay
<MotionOverlay onClick={onClose}>
  <MotionModal>
    <Dialog.Content>...</Dialog.Content>
  </MotionModal>
</MotionOverlay>
```

### Animation Presets

Import from `@/lib/animations`:

```typescript
import { variants, durations, easings } from '@/lib/animations'

<MotionDiv
  variants={variants.fadeUp}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: durations.standard, ease: easings.easeOut }}
>
```

## AnimatedCounter Component

Animated number counter for statistics display.

```typescript
import { AnimatedCounter } from '@/components/AnimatedCounter'

// Basic usage
<AnimatedCounter value={500} />

// With prefix/suffix
<AnimatedCounter value={100} suffix="%" />
<AnimatedCounter value={30} prefix="<" suffix="s" />

// Custom duration
<AnimatedCounter value={1000} duration={2} />
```

## Component Guidelines

### Creating New Components

1. **Location**: Place in appropriate directory:
   - `ui/` - Reusable UI primitives (shadcn-style)
   - Root `components/` - Feature-specific or custom components

2. **File naming**: Use PascalCase for component files
   ```
   components/
   ├── WorkspaceCard.tsx
   ├── SessionTimer.tsx
   └── UserAvatar.tsx
   ```

3. **Component structure**:
   ```typescript
   'use client'  // Only if needed

   import { cn } from '@/lib/utils'

   interface ComponentProps {
     className?: string
     children?: React.ReactNode
   }

   export function Component({ className, children }: ComponentProps) {
     return (
       <div className={cn('base-styles', className)}>
         {children}
       </div>
     )
   }
   ```

### Styling

- Use Tailwind CSS classes
- Use `cn()` utility for conditional classes
- Reference design tokens from `globals.css`:
  ```typescript
  // Colors
  className="bg-primary text-primary-foreground"
  className="bg-secondary text-secondary-foreground"
  className="text-muted-foreground"

  // Borders
  className="border border-border rounded-lg"

  // Shadows
  className="shadow-sm"
  ```

### Accessibility

- Use semantic HTML elements
- Include ARIA attributes where needed
- Ensure keyboard navigation works
- Test with screen readers
- Respect `prefers-reduced-motion` for animations

### Icons

Use Lucide React icons:

```typescript
import { User, Settings, LogOut, Plus } from 'lucide-react'

<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>
```

## Best Practices

1. **Don't modify `ui/` components directly** - They're managed by shadcn. Extend with wrapper components instead.

2. **Use the `cn()` utility** - For merging Tailwind classes safely.

3. **Keep components focused** - One responsibility per component.

4. **Use TypeScript interfaces** - Define props explicitly.

5. **Client components only when needed** - Default to server components unless you need interactivity.

6. **Avoid React.FC** - Use regular function syntax with typed props.
