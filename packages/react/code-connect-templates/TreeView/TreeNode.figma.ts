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

// Branch nodes can be expanded (isExpanded is meaningful) and can contain
// nested tree nodes; leaf nodes cannot.
const isBranch = instance.getEnum('Node', {
  Branch: true,
  Leaf: false,
});

// Recursively resolve nested tree nodes so each branch renders its own
// children via the (tree-node) template, mirroring how TreeView composes them.
const children = isBranch
  ? instance
      .findConnectedInstances((node) => node.hasCodeConnect())
      .map((child) => child.executeTemplate().example)
  : [];

export default {
  example:
    isBranch && children.length
      ? figma.code`<TreeNode label="${label}"${disabled ? ' disabled' : ''}${isExpanded ? ' isExpanded' : ''}>
  ${children}
</TreeNode>`
      : figma.code`<TreeNode label="${label}"${disabled ? ' disabled' : ''}${isBranch && isExpanded ? ' isExpanded' : ''} />`,
  imports: ['import { TreeNode } from "@carbon/react"'],
  id: 'tree-node',
  metadata: {
    nestable: true,
  },
};
