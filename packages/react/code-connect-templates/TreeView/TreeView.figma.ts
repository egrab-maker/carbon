// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=11948-286738
// source=packages/react/src/components/TreeView/TreeView.tsx
// component=TreeView
import figma from 'figma';

const instance = figma.selectedInstance;

// Resolve the child tree nodes dynamically so each renders via its own
// (tree-node) template rather than being hardcoded here.
const nodes = instance
  .findConnectedInstances((node) => node.hasCodeConnect())
  .map((child) => child.executeTemplate().example);

export default {
  example: figma.code`<TreeView label="Tree view">
  ${nodes}
</TreeView>`,
  imports: ['import { TreeView } from "@carbon/react"'],
  id: 'tree-view',
  metadata: {
    nestable: false,
  },
};
