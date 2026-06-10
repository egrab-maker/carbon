// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System?node-id=2490-17019
// source=packages/web-components/src/components/accordion/accordion.ts
// component=cds-accordion
import figma from 'figma';

const instance = figma.selectedInstance;

// Each accordion item renders through its own (cds-accordion-item) template
// rather than being hardcoded here.
const items = instance.findConnectedInstances(
  (node) => node.codeConnectId() === 'cds-accordion-item'
);
// size / alignment / isFlush are cds-accordion attributes in code, but they are
// authored on the item variants in Figma. Read them from the first item's
// hoisted metadata.
let size;
let alignment;
let isFlush = false;
const first = items[0];
if (first && first.type === 'INSTANCE') {
  const props = first.executeTemplate().metadata?.props || {};
  size = props.size;
  alignment = props.align;
  isFlush = props.isFlush === 'true';
}

// Render each item via its own (cds-accordion-item) template. Interpolating an
// array of executeTemplate().example results does not render, so accumulate them
// into a single section sequence with figma.code.
let children;
for (const item of items) {
  const itemCode = item.executeTemplate().example;
  children =
    children === undefined
      ? figma.code`${itemCode}`
      : figma.code`${children}
  ${itemCode}`;
}

export default {
  example: figma.code`<cds-accordion${size ? ` size="${size}"` : ''}${alignment ? ` alignment="${alignment}"` : ''}${isFlush ? ' isFlush' : ''}>
  ${children ?? ''}
</cds-accordion>`,
  imports: [
    "import '@carbon/web-components/es/components/accordion/accordion.js'",
  ],
  id: 'cds-accordion',
  metadata: {
    nestable: false,
  },
};
