// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System?node-id=2490-17019
// source=packages/react/src/components/Accordion/Accordion.tsx
// component=Accordion
import figma from 'figma';

const instance = figma.selectedInstance;

// Each Accordion item renders through its own (accordion-item) template rather
// than being hardcoded here.
const items = instance.findConnectedInstances(
  (node) => node.codeConnectId() === 'accordion-item'
);
// size / align / isFlush are Accordion props in code, but they are authored on
// the item variants in Figma. Read them from the first item's hoisted metadata.
let size;
let align;
let isFlush = false;
const first = items[0];
if (first && first.type === 'INSTANCE') {
  const props = first.executeTemplate().metadata?.props || {};
  size = props.size;
  align = props.align;
  isFlush = props.isFlush === 'true';
}

// Render each item via its own (accordion-item) template. Interpolating an array
// of executeTemplate().example results does not render, so accumulate them into a
// single section sequence with figma.code.
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
  example: figma.code`<Accordion${size ? ` size="${size}"` : ''}${align ? ` align="${align}"` : ''}${isFlush ? ' isFlush' : ''}>
  ${children ?? ''}
</Accordion>`,
  imports: ['import { Accordion } from "@carbon/react"'],
  id: 'accordion',
  metadata: {
    nestable: false,
  },
};
