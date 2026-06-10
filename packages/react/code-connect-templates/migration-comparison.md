# Migration script vs Cursor-authored Code Connect templates (React)

This is a **reference / comparison artifact only**. It is not a publishable Code
Connect file (three default exports cannot live in one template), and it sits
outside the `*.figma.ts` include glob so it is never picked up by
`figma connect publish`.

## How the migration output was generated

The migration CLI parses the existing parser-based `.figma.tsx` files and rewrites
them as parserless template files. It was run against the three legacy React
files in `packages/react/code-connect/`:

```bash
# Run from packages/react. A temporary config was used because the migrate
# command resolves the component import to a real file; with no node_modules
# present, "@carbon/react" was unresolvable and crashed mapImportPath(). The
# temp config added: "paths": { "@carbon/react": ["src/index.ts"] }
npx -y @figma/code-connect@latest connect migrate \
  --file code-connect/Button/Button.figma.tsx \
  --outDir /tmp/cc-migration --config <temp-config>
# ...repeated for TreeView/TreeView.figma.tsx and TreeView/TreeNode.figma.tsx
```

Notable mechanics observed:

- The migration always writes one template per source connection plus a
  `figma.config.json` into the `--outDir`.
- `Button` migrated "with variants" because the legacy file had a second
  `figma.connect(ButtonSkeleton, ..., { variant: { State: 'Skeleton' } })`.
- Migrated `// url=` comments keep the **published library** file key
  (`YAnB1jKx0yCUL29j6uSLpg`), since that is what the legacy files referenced.
  The Cursor templates target the **community** file (`HrLUpkVhlUa6GCNxyBCr72`).
  The node IDs are identical across both files.

---

## Button

### Migration output (`/tmp/cc-migration/Button.figma.ts`)

```ts
// url=https://www.figma.com/file/YAnB1jKx0yCUL29j6uSLpg/(v11)-All-themes---Carbon-Design-System?type=design&node-id=1854-1776&mode=dev
// component=Button

import figma from "figma"

// Branch per variant combination.

let template
if (figma.selectedInstance.getPropertyValue("State") === "Skeleton") {
  const size = figma.selectedInstance.getEnum("Size", {
    Large: "lg",
    Medium: "md",
    Small: "sm",
    "Extra small": "xs",
    "Extra large": "xl",
    "2X large": "2xl",
  })

  template = {
    id: "ButtonSkeleton",
    imports: ["import { ButtonSkeleton } from '@carbon/react';"],
    example: figma.code`<ButtonSkeleton${figma.helpers.react.renderProp(
      "size",
      size,
    )}/>`,
    metadata: { nestable: true },
  }
} else {
  const disabled = figma.selectedInstance.getEnum("State", {
    Disabled: true,
  })
  const buttonText = figma.selectedInstance.getString("Button text")
  const kind = figma.selectedInstance.getEnum("Style", {
    Primary: "primary",
    Secondary: "secondary",
    Tertiary: "tertiary",
    Ghost: "ghost",
    "Danger primary": "danger",
    "Danger tertiary": "danger--tertiary",
    "Danger ghost": "danger--ghost",
  })
  const size = figma.selectedInstance.getEnum("Size", {
    Large: "lg",
    Medium: "md",
    Small: "sm",
    "Extra small": "xs",
    "Extra large": "xl",
    "2X large": "2xl",
  })
  const isExpressive = figma.selectedInstance.getEnum("Size", {
    Expressive: true,
  })
  const hasIconOnly = figma.selectedInstance.getEnum("Type", {
    "Icon only": true,
  })
  const renderIcon = figma.selectedInstance
    .getInstanceSwap("Swap icon")
    ?.executeTemplate().example

  template = {
    id: "Button",
    imports: ["import { Button } from '@carbon/react';"],
    example: figma.code`<Button${figma.helpers.react.renderProp(
      "disabled",
      disabled,
    )}${figma.helpers.react.renderProp(
      "kind",
      kind,
    )}${figma.helpers.react.renderProp(
      "size",
      size,
    )}${figma.helpers.react.renderProp(
      "isExpressive",
      isExpressive,
    )}${figma.helpers.react.renderProp(
      "hasIconOnly",
      hasIconOnly,
    )}${figma.helpers.react.renderProp(
      "renderIcon",
      renderIcon,
    )}>${figma.helpers.react.renderChildren(buttonText)}</Button>`,
    metadata: { nestable: true },
  }
}

export default template
```

### Cursor-authored (`packages/react/code-connect-templates/Button/Button.figma.ts`)

```ts
// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=1854-1776
// source=packages/react/src/components/Button/Button.tsx
// component=Button
import figma from 'figma';

const instance = figma.selectedInstance;

const label = instance.getString('Button text');
const kind = instance.getEnum('Style', { /* ...same 7 mappings... */ });
const size = instance.getEnum('Size', {
  '2X large': '2xl', 'Extra large': 'xl', Large: 'lg', Medium: 'md',
  Small: 'sm', 'Extra small': 'xs', Expressive: 'lg',
});
const isExpressive = instance.getEnum('Size', { /* every value -> false, Expressive: true */ });
const hasIconOnly = instance.getEnum('Type', { 'Text + Icon': false, 'Icon only': true });
const disabled = instance.getEnum('State', {
  Enabled: false, Hover: false, Active: false, Focus: false, Disabled: true, Skeleton: false,
});
const hasIcon = instance.getBoolean('Icon');
const icon = instance.getInstanceSwap('Swap icon');
let iconCode;
if (icon && icon.type === 'INSTANCE') { iconCode = icon.executeTemplate().example; }
const showIcon = hasIcon || hasIconOnly;

export default {
  example: figma.code`<Button
  kind="${kind}"
  size="${size}"${isExpressive ? ' isExpressive' : ''}${hasIconOnly ? ' hasIconOnly' : ''}${disabled ? ' disabled' : ''}${showIcon && iconCode ? figma.code`
  renderIcon={${iconCode}}` : ''}
>
  ${hasIconOnly ? '' : label}
</Button>`,
  imports: ['import { Button } from "@carbon/react"'],
  id: 'button',
  metadata: { nestable: false },
};
```

### Differences

- **ButtonSkeleton**: migration preserves the `State === "Skeleton"` branch and
  emits a separate `ButtonSkeleton` snippet; the Cursor template omits Skeleton
  entirely (maps `Skeleton: false` and only ever renders `Button`).
- **Rendering style**: migration wraps every prop in
  `figma.helpers.react.renderProp(...)` (and `renderChildren`), which safely
  omits a prop when its value is undefined. Cursor hand-writes the JSX with
  explicit conditionals and quoted/braced interpolation.
- **`Size` -> `Expressive`**: migration leaves `size` undefined when the variant
  is `Expressive` (it is not in the `size` map) and sets `isExpressive: true`.
  Cursor maps `Expressive -> 'lg'` for `size` AND `isExpressive: true`.
- **`State` exhaustiveness**: migration mirrors the legacy partial map
  (`{ Disabled: true }` only). Cursor lists every state value explicitly.
- **Icon**: both resolve `Swap icon` via `getInstanceSwap().executeTemplate()`.
  Cursor adds an extra `Icon` boolean gate (`showIcon`) before emitting
  `renderIcon`; migration always emits it (renderProp drops it if undefined).
- **`id`/`nestable`**: migration uses `id: "Button"` / `nestable: true`; Cursor
  uses `id: 'button'` / `nestable: false`.

---

## TreeView

### Migration output (`/tmp/cc-migration/TreeView.figma.ts`)

```ts
// url=https://www.figma.com/design/YAnB1jKx0yCUL29j6uSLpg/(v11)-All-themes---Carbon-Design-System?node-id=11948-286738&t=aG4cJRjteQHcd71k-4
// component=TreeView

import figma from "figma"

const treeNode = (function () {
  const nestedLayer0 = figma.selectedInstance.findInstance("Branch node item")
  return {
    size:
      nestedLayer0.type !== "ERROR"
        ? nestedLayer0.getEnum("Size", {
            Small: "sm",
            "Extra small": "xs",
          })
        : undefined,
  }
})()
const children = figma.properties.children(["Branch node item"])

export default {
  id: "TreeView",
  imports: ["import { TreeView } from '@carbon/react';"],
  example: figma.code`<TreeView${figma.helpers.react.renderProp(
    "size",
    treeNode.size,
  )}>
        {/* Figma component doesn't currently nest TreeNodes accurately
  code sample below is incomplete */}
        ${figma.helpers.react.renderChildren(children)}
      </TreeView>`,
  metadata: { nestable: true },
}
```

### Cursor-authored (`packages/react/code-connect-templates/TreeView/TreeView.figma.ts`)

```ts
// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=11948-286738
// source=packages/react/src/components/TreeView/TreeView.tsx
// component=TreeView
import figma from 'figma';

const instance = figma.selectedInstance;

const nodes = instance
  .findConnectedInstances((node) => node.hasCodeConnect())
  .map((child) => child.executeTemplate().example);

export default {
  example: figma.code`<TreeView label="Tree view">
  ${nodes}
</TreeView>`,
  imports: ['import { TreeView } from "@carbon/react"'],
  id: 'tree-view',
  metadata: { nestable: false },
};
```

### Differences

- **`size` prop**: migration faithfully reproduces the legacy behavior of pulling
  `size` from a nested `Branch node item` (`findInstance(...).getEnum('Size')`).
  Cursor drops `size` (the Figma `TreeView` node itself has no size property; its
  only variant is `Icon`, which has no code equivalent).
- **`label`**: Cursor adds the required `label="Tree view"` prop (mandatory in
  the React API). Migration omits it (the legacy file never mapped it), so the
  migrated snippet is missing a required prop.
- **Children resolution**: migration uses the legacy `figma.properties.children`
  helper; Cursor uses `findConnectedInstances(...).executeTemplate()`.
- **Carry-over comment**: migration preserves the legacy
  "doesn't currently nest TreeNodes accurately / incomplete" JSX comment verbatim
  inside the snippet. Cursor does not.

---

## TreeNode

### Migration output (`/tmp/cc-migration/TreeNode.figma.ts`)

```ts
// url=https://www.figma.com/design/YAnB1jKx0yCUL29j6uSLpg/(v11)-All-themes---Carbon-Design-System?node-id=11828-285325&t=aG4cJRjteQHcd71k-4
// component=TreeNode

import figma from "figma"

const label = figma.selectedInstance.getString("Node text")
const disabled = figma.selectedInstance.getEnum("State", {
  Disabled: true,
})
const isExpanded = figma.selectedInstance.getBoolean("Open")

export default {
  id: "TreeNode",
  imports: ["import { TreeNode } from '@carbon/react';"],
  example: figma.code`<TreeNode renderIcon={Icon}${figma.helpers.react.renderProp(
    "label",
    label,
  )}${figma.helpers.react.renderProp(
    "disabled",
    disabled,
  )}${figma.helpers.react.renderProp("isExpanded", isExpanded)}/>`,
  metadata: { nestable: true },
}
```

### Cursor-authored (`packages/react/code-connect-templates/TreeView/TreeNode.figma.ts`)

```ts
// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=11828-285325
// source=packages/react/src/components/TreeView/TreeNode.tsx
// component=TreeNode
import figma from 'figma';

const instance = figma.selectedInstance;

const label = instance.getString('Node text');
const disabled = instance.getEnum('State', {
  Enabled: false, Hover: false, Focus: false, Active: false,
  Selected: false, 'Selected + Hover': false, Disabled: true,
});
const isExpanded = instance.getEnum('Open', { False: false, True: true });
const isBranch = instance.getEnum('Node', { Branch: true, Leaf: false });

export default {
  example: isBranch
    ? figma.code`<TreeNode label="${label}"${disabled ? ' disabled' : ''}${isExpanded ? ' isExpanded' : ''} />`
    : figma.code`<TreeNode label="${label}"${disabled ? ' disabled' : ''} />`,
  imports: ['import { TreeNode } from "@carbon/react"'],
  id: 'tree-node',
  metadata: { nestable: true },
};
```

### Differences

- **`renderIcon={Icon}` bug carried over**: migration faithfully reproduces the
  legacy example `<TreeNode renderIcon={Icon} ... />`, where `Icon` is an
  **undefined identifier** (the legacy `.figma.tsx` referenced a symbol that was
  never imported). The migrated snippet inherits this broken reference. Cursor
  omits `renderIcon` entirely (there is no clean Figma property to map it from).
- **`Open` mapping**: migration uses `getBoolean('Open')`; Cursor uses
  `getEnum('Open', { False: false, True: true })`. Functionally equivalent.
- **Branch vs leaf**: Cursor adds an `isBranch` (`Node` variant) check so leaf
  nodes never emit `isExpanded`. Migration has no branch/leaf distinction.
- **`State` exhaustiveness**: migration keeps `{ Disabled: true }` only; Cursor
  lists every state value explicitly.

---

## Summary

| Dimension | Migration script | Cursor-authored |
|---|---|---|
| Figma file (URL) | Published lib `YAnB...` (from legacy) | Community `HrLU...` |
| Rendering | `figma.helpers.react.renderProp` / `renderChildren` | Hand-written conditional JSX |
| Variant exhaustiveness | Mirrors legacy partial maps | Every variant value mapped |
| ButtonSkeleton | Preserved (Skeleton branch) | Omitted |
| Button `Expressive` size | `size` undefined + `isExpressive` | `size='lg'` + `isExpressive` |
| TreeView `size` | Pulled from nested node | Dropped (no code equivalent) |
| TreeView `label` (required) | Missing | Added (`"Tree view"`) |
| TreeNode `renderIcon` | `renderIcon={Icon}` (undefined, broken) | Omitted |
| TreeNode branch/leaf | Not distinguished | `isBranch` gate on `isExpanded` |
| `source=` comment | Not emitted | Present |
| `id` / `nestable` | PascalCase id, `nestable: true` | kebab id, component-appropriate `nestable` |

**Takeaways**

- The migration is a faithful, mechanical 1:1 translation of the legacy parser
  files. It preserves both their strengths (TreeView `size` from the nested node,
  ButtonSkeleton variant) and their bugs (`renderIcon={Icon}`, missing required
  `TreeView` `label`). The docs explicitly call the output a "starting point."
- The Cursor templates were authored fresh from the live Figma component
  properties, so they are more correct/complete on the props that matter
  (exhaustive variant maps, required `label`, branch/leaf handling, no broken
  `renderIcon`) but intentionally drop a few things (ButtonSkeleton, TreeView
  `size`).
- A best-of-both result would take the migration's `renderProp` ergonomics +
  ButtonSkeleton branch + TreeView nested `size`, and Cursor's exhaustive maps,
  required `label`, branch/leaf logic, and removal of the `renderIcon={Icon}` bug.
