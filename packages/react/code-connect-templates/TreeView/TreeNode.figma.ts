// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=11828-285325
// source=packages/react/src/components/TreeView/TreeNode.tsx
// component=TreeNode
import figma from 'figma';

const instance = figma.selectedInstance;

const label = instance.getString('Node text');

// Only the Disabled state maps to a code prop; the remaining states (Hover,
// Focus, Active, Selected, ...) are interaction states owned by the parent tree.
const disabled = instance.getEnum('State', {
  Enabled: false,
  Hover: false,
  Focus: false,
  Active: false,
  Selected: false,
  'Selected + Hover': false,
  Disabled: true,
});

const isExpanded = instance.getEnum('Open', {
  False: false,
  True: true,
});

// Branch nodes can be expanded (isExpanded is meaningful); leaf nodes cannot.
const isBranch = instance.getEnum('Node', {
  Branch: true,
  Leaf: false,
});

export default {
  example: isBranch
    ? figma.code`<TreeNode label="${label}"${disabled ? ' disabled' : ''}${isExpanded ? ' isExpanded' : ''} />`
    : figma.code`<TreeNode label="${label}"${disabled ? ' disabled' : ''} />`,
  imports: ['import { TreeNode } from "@carbon/react"'],
  id: 'tree-node',
  metadata: {
    nestable: true,
  },
};
