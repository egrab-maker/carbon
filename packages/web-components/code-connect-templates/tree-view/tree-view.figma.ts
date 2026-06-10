// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=11948-286738
// source=packages/web-components/src/components/tree-view/tree-view.ts
// component=cds-tree-view
import figma from 'figma';

const instance = figma.selectedInstance;

// Resolve the child tree nodes dynamically so each renders via its own
// (cds-tree-node) template rather than being hardcoded here.
const nodes = instance
  .findConnectedInstances((node) => node.hasCodeConnect())
  .map((child) => child.executeTemplate().example);

export default {
  example: figma.code`<cds-tree-view label="Tree view">
  ${nodes}
</cds-tree-view>`,
  imports: ["import '@carbon/web-components/es/components/tree-view/index.js'"],
  id: 'cds-tree-view',
  metadata: {
    nestable: false,
  },
};
