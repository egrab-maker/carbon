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

// Branch nodes can be expanded (is-expanded is meaningful); leaf nodes cannot.
const isBranch = instance.getEnum('Node', {
  Branch: true,
  Leaf: false,
});

export default {
  example: isBranch
    ? figma.code`<cds-tree-node label="${label}"${disabled ? ' disabled' : ''}${isExpanded ? ' is-expanded' : ''}></cds-tree-node>`
    : figma.code`<cds-tree-node label="${label}"${disabled ? ' disabled' : ''}></cds-tree-node>`,
  imports: ["import '@carbon/web-components/es/components/tree-view/index.js'"],
  id: 'cds-tree-node',
  metadata: {
    nestable: true,
  },
};
