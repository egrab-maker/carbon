// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=11828-285325
// source=packages/web-components/src/components/tree-view/tree-node.ts
// component=cds-tree-node
import figma from 'figma';

const instance = figma.selectedInstance;

const label = instance.getString('Node text');

// Only the Disabled state maps to a code attribute; the remaining states
// (Hover, Focus, Active, Selected, ...) are interaction states owned by the
// parent tree.
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

// Branch nodes can be expanded (is-expanded is meaningful) and can contain
// nested tree nodes; leaf nodes cannot.
const isBranch = instance.getEnum('Node', {
  Branch: true,
  Leaf: false,
});

// Recursively resolve nested tree nodes so each branch renders its own
// children via the (cds-tree-node) template, mirroring how the tree view
// composes them.
const children = isBranch
  ? instance
      .findConnectedInstances((node) => node.hasCodeConnect())
      .map((child) => child.executeTemplate().example)
  : [];

export default {
  example:
    isBranch && children.length
      ? figma.code`<cds-tree-node label="${label}"${disabled ? ' disabled' : ''}${isExpanded ? ' is-expanded' : ''}>
  ${children}
</cds-tree-node>`
      : figma.code`<cds-tree-node label="${label}"${disabled ? ' disabled' : ''}${isBranch && isExpanded ? ' is-expanded' : ''}></cds-tree-node>`,
  imports: ["import '@carbon/web-components/es/components/tree-view/index.js'"],
  id: 'cds-tree-node',
  metadata: {
    nestable: true,
  },
};
