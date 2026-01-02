# Migrate from MUI/Joy to shadcn

Migrate UI components from MUI/Joy to shadcn, following the pattern used in txn.fobrix.com codebase.

## Reference Projects

| Project | Path | Notes |
|---------|------|-------|
| txn.fobrix.com | `/Users/alex/ec2code/cashflowy/txn.fobrix.com` | Primary reference (JSX) |
| partpricing | `/Users/alex/ec2code/imgears/temp/partpricing` | Secondary reference (TSX) |

## MUI Components to Migrate

### Files Using MUI (12 files)

| File | MUI Components Used |
|------|---------------------|
| `src/components/Navbar/Navbar.jsx` | Box, Sheet, Button |
| `src/components/Navbar/NavbarContainer.jsx` | Box |
| `src/components/StatusChip.jsx` | Chip |
| `src/components/PageHeader.jsx` | Box, Typography, Breadcrumbs, Link |
| `src/components/MLInput.jsx` | FormControl, FormLabel, Input, Select, Option |
| `src/components/Link.jsx` | Link (JoyLink) |
| `src/components/Icon.jsx` | AspectRatio |
| `src/app/tasks/[slug]/ViewTask.jsx` | Container, Typography, Box, Card, ButtonGroup, Button, Table, Chip, Link |
| `src/app/monitoring/MonitoringDashboard.jsx` | Box, Typography, Card, CardContent, Grid, Table, Sheet, Button, Select, Option, Input, Chip, IconButton |
| `src/app/tasks/[slug]/runs/[r_id]/ViewRun.jsx` | Container, Table, Link, Chip, Typography, Sheet, Alert |
| `src/app/tasks/[slug]/runs/[r_id]/_components/DropdownActions/DropdownActions.jsx` | Menu, MenuItem, MenuButton, Dropdown, Button |
| `src/app/library/[[...f_path]]/ViewFolder.jsx` | Table, Box, Container, Typography |

### Component Mapping

| MUI/Joy Component | shadcn Replacement | Source File |
|-------------------|-------------------|-------------|
| `Chip` | `Badge` | `txn.fobrix.com/src/components/ui/badge.jsx` |
| `Button` | `Button` | `txn.fobrix.com/src/components/ui/button.jsx` |
| `IconButton` | `Button` (size="icon") | `txn.fobrix.com/src/components/ui/button.jsx` |
| `Input` | `Input` | `txn.fobrix.com/src/components/ui/input.jsx` |
| `Select/Option` | `Select/*` | `txn.fobrix.com/src/components/ui/select.jsx` |
| `Table` | `Table/*` | `txn.fobrix.com/src/components/ui/table.jsx` |
| `Card/CardContent` | `Card/*` | `txn.fobrix.com/src/components/ui/card.jsx` |
| `Dropdown/Menu/MenuItem` | `DropdownMenu/*` | `txn.fobrix.com/src/components/ui/dropdown-menu.jsx` |
| `Alert` | `Alert` | `txn.fobrix.com/src/components/ui/alert.jsx` |
| `Typography` | `Typography` | `txn.fobrix.com/src/components/ui/typography.jsx` |
| `Box` (flex) | `Stack` or Tailwind classes | `txn.fobrix.com/src/components/ui/stack.jsx` |
| `Breadcrumbs` | `Breadcrumb/*` | `txn.fobrix.com/src/components/ui/breadcrumb.jsx` |
| `FormLabel` | `Label` | `txn.fobrix.com/src/components/ui/label.jsx` |
| `Sheet` | `div` with Tailwind | N/A - use Tailwind classes |
| `Container` | `div` with Tailwind | N/A - use `max-w-7xl mx-auto px-4` |
| `Grid` | Tailwind grid classes | N/A - use `grid grid-cols-*` |
| `AspectRatio` | `div` with aspect ratio | N/A - use `aspect-square` |
| `ButtonGroup` | `div` with flex | N/A - use `flex gap-2` |

## Files to Copy from txn.fobrix.com

### UI Components (copy to `packages/core/src/components/ui/`)

```
txn.fobrix.com/src/components/ui/badge.jsx
txn.fobrix.com/src/components/ui/button.jsx
txn.fobrix.com/src/components/ui/input.jsx
txn.fobrix.com/src/components/ui/select.jsx
txn.fobrix.com/src/components/ui/table.jsx
txn.fobrix.com/src/components/ui/card.jsx
txn.fobrix.com/src/components/ui/dropdown-menu.jsx
txn.fobrix.com/src/components/ui/alert.jsx
txn.fobrix.com/src/components/ui/typography.jsx
txn.fobrix.com/src/components/ui/stack.jsx
txn.fobrix.com/src/components/ui/breadcrumb.jsx
txn.fobrix.com/src/components/ui/label.jsx
txn.fobrix.com/src/components/ui/tabs.jsx
```

### Utility Files (copy to `packages/core/src/utils/css/`)

```
txn.fobrix.com/src/utils/css/cn.js
```

### CSS (merge into `packages/core/src/app/globals.css`)

Copy CSS variables and theme setup from:
```
txn.fobrix.com/src/app/globals.css
```

## Dependencies to Add

```bash
npm install @radix-ui/react-slot @radix-ui/react-select @radix-ui/react-dropdown-menu @radix-ui/react-label class-variance-authority clsx tailwind-merge lucide-react tailwindcss tw-animate-css
```

## Dependencies to Remove

```bash
npm uninstall @mui/joy @emotion/react @emotion/styled
```

## Migration Steps

### Phase 1: Setup Infrastructure

1. [ ] Install new dependencies
2. [ ] Copy `cn.js` utility to `packages/core/src/utils/css/cn.js`
3. [ ] Update `globals.css` with CSS variables from txn.fobrix.com
4. [ ] Configure Tailwind CSS (if not already configured)

### Phase 2: Copy UI Components

1. [ ] Create `packages/core/src/components/ui/` directory
2. [ ] Copy all UI component files from txn.fobrix.com
3. [ ] Update import paths in copied files (`@/utils/css/cn` → correct path)

### Phase 3: Migrate Each File

#### 3.1 StatusChip.jsx (simplest)
- Replace `Chip` with `Badge`
- Map color variants: success→success, warning→warning, primary→default, danger→destructive

#### 3.2 Link.jsx
- Replace JoyLink with Next.js Link + Tailwind classes
- Keep the component interface similar for easy migration

#### 3.3 Icon.jsx + FontAwesome icons
- Remove Icon.jsx component entirely
- Replace all icons with lucide-react (matching reference projects)

**Icon mapping:**

| Current | lucide-react |
|---------|-------------|
| `<Icon icon='send'>` | `<Send />` |
| `<Icon icon='folder'>` | `<Folder />` |
| `<Icon icon='ellipsis-vertical'>` | `<EllipsisVertical />` |
| `<i class="fa-regular fa-folder">` | `<Folder />` |
| `<i class="fa-solid fa-paper-plane">` | `<Send />` |
| `<i class="fa-solid fa-ellipsis-vertical">` | `<EllipsisVertical />` |
| `<i class="fa-solid fa-up-right-from-square">` | `<ExternalLink />` |

**Files using FontAwesome:**
- `DropdownActions.jsx` - ellipsis-vertical
- `ViewFolder.jsx` - folder, paper-plane
- `ViewTask.jsx` - up-right-from-square

#### 3.4 MLInput.jsx
- Replace `FormControl` with `div`
- Replace `FormLabel` with `Label`
- Replace `Input` with shadcn `Input`
- Replace `Select/Option` with shadcn `Select/*`

#### 3.5 PageHeader.jsx
- Replace `Box` with `div` + Tailwind flex classes
- Replace `Typography` with shadcn `Typography`
- Replace `Breadcrumbs` with shadcn `Breadcrumb/*`

#### 3.6 Navbar/Navbar.jsx
- Replace `Sheet` with `div` + Tailwind classes
- Replace `Box` with `div` + Tailwind flex classes
- Replace `Button` with shadcn `Button`

#### 3.7 Navbar/NavbarContainer.jsx
- Replace `Box` with `div` + Tailwind classes

#### 3.8 ViewTask.jsx
- Replace `Container` with `div className="max-w-7xl mx-auto px-4"`
- Replace `Typography` with shadcn `Typography`
- Replace `Box` with `div` + Tailwind classes
- Replace `Card` with shadcn `Card`
- Replace `ButtonGroup` with `div className="flex gap-2"`
- Replace `Button` with shadcn `Button`
- Replace `Table` with shadcn `Table/*`
- Replace `Chip` with `Badge`
- Replace `MuiLink` with Next.js Link + Button

#### 3.9 MonitoringDashboard.jsx (most complex)
- Replace all `Box` with `div` + Tailwind classes
- Replace `Typography` with shadcn `Typography`
- Replace `Card/CardContent` with shadcn `Card/*`
- Replace `Grid` with `div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"`
- Replace `Table/Sheet` with shadcn `Table/*`
- Replace `Button` with shadcn `Button`
- Replace `Select/Option` with shadcn `Select/*`
- Replace `Input` with shadcn `Input`
- Replace `Chip` with `Badge`
- Replace `IconButton` with `Button size="icon"`

#### 3.10 ViewRun.jsx
- Replace `Container` with `div className="max-w-7xl mx-auto px-4"`
- Replace `Table` with shadcn `Table/*`
- Replace `Typography` with shadcn `Typography`
- Replace `Sheet` with `div` + Tailwind classes
- Replace `Alert` with shadcn `Alert`
- Replace `Chip` with `Badge`

#### 3.11 DropdownActions.jsx
- Replace `Dropdown/Menu/MenuItem/MenuButton` with shadcn `DropdownMenu/*`

#### 3.12 ViewFolder.jsx
- Replace `Table` with shadcn `Table/*`
- Replace `Box` with `div` + Tailwind classes
- Replace `Container` with `div className="max-w-7xl mx-auto px-4"`
- Replace `Typography` with shadcn `Typography`

### Phase 4: Cleanup

1. [ ] Remove MUI dependencies from package.json
2. [ ] Remove any unused MUI imports
3. [ ] Test all pages/components
4. [ ] Fix any styling issues

## Common Patterns

### Box → div with Tailwind

```jsx
// Before (MUI)
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

// After (Tailwind)
<div className="flex items-center gap-4">
```

### sx prop → Tailwind classes

| MUI sx | Tailwind |
|--------|----------|
| `px: 1` | `px-2` |
| `py: 0.5` | `py-1` |
| `mt: 2` | `mt-4` |
| `gap: 1` | `gap-2` |
| `display: 'flex'` | `flex` |
| `alignItems: 'center'` | `items-center` |
| `justifyContent: 'space-between'` | `justify-between` |
| `flexDirection: 'column'` | `flex-col` |
| `bgcolor: 'white'` | `bg-white` |
| `borderRadius: 'md'` | `rounded-md` |

### Chip → Badge

```jsx
// Before (MUI)
<Chip variant="soft" color="success" size="sm">Complete</Chip>

// After (shadcn)
<Badge variant="success">Complete</Badge>
```

### Table Migration

```jsx
// Before (MUI)
<Table variant='outlined'>
  <thead><tr><th>Header</th></tr></thead>
  <tbody><tr><td>Cell</td></tr></tbody>
</Table>

// After (shadcn)
<Table>
  <TableHeader><TableRow><TableHead>Header</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>Cell</TableCell></TableRow></TableBody>
</Table>
```

### Select Migration

```jsx
// Before (MUI)
<Select size="sm" name="status" defaultValue="all">
  <Option value="all">All Status</Option>
  <Option value="complete">Complete</Option>
</Select>

// After (shadcn)
<Select name="status" defaultValue="all">
  <SelectTrigger size="sm">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Status</SelectItem>
    <SelectItem value="complete">Complete</SelectItem>
  </SelectContent>
</Select>
```

### DropdownMenu Migration

```jsx
// Before (MUI)
<Dropdown>
  <MenuButton>Options</MenuButton>
  <Menu>
    <MenuItem onClick={handleClick}>Action</MenuItem>
  </Menu>
</Dropdown>

// After (shadcn)
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleClick}>Action</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
