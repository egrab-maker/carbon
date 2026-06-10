// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System?node-id=2154-8478
// source=packages/react/src/components/Accordion/AccordionItem.tsx
// component=AccordionItem
import figma from 'figma';

const instance = figma.selectedInstance;

const title = instance.getString('Title text');
const content = instance.getString('Content text');

// Only the Disabled state maps to a code prop; the remaining states (Hover,
// Focus, Skeleton) are interaction/loading states with no AccordionItem prop.
const disabled = instance.getEnum('State', {
  Enabled: false,
  Hover: false,
  Focus: false,
  Disabled: true,
  Skeleton: false,
});

const open = instance.getEnum('Expanded', {
  False: false,
  True: true,
});

// size, align, and isFlush are Accordion-level props in code, but in Figma they
// live on the item's variants. Surface them through metadata.props so the parent
// Accordion template can hoist them onto <Accordion>.
const size = instance.getEnum('Size', {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
});

const align = instance.getEnum('Alignment', {
  Start: 'start',
  End: 'end',
});

const isFlush = instance.getEnum('Flush', {
  False: 'false',
  True: 'true',
});

// The body can hold a freeform swapped instance, gated by the Slot toggle.
const hasSlot = instance.getBoolean('Slot');
const slot = hasSlot ? instance.getInstanceSwap('Swap slot') : null;
let slotCode;
if (slot && slot.type === 'INSTANCE') {
  slotCode = slot.executeTemplate().example;
}

export default {
  example: figma.code`<AccordionItem title="${title}"${open ? ' open' : ''}${disabled ? ' disabled' : ''}>
  <p>${content}</p>${slotCode ? figma.code`
  ${slotCode}` : ''}
</AccordionItem>`,
  imports: ['import { AccordionItem } from "@carbon/react"'],
  id: 'accordion-item',
  metadata: {
    nestable: true,
    props: {
      size,
      align,
      isFlush,
    },
  },
};
