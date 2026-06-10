// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System?node-id=2154-8478
// source=packages/web-components/src/components/accordion/accordion-item.ts
// component=cds-accordion-item
import figma from 'figma';

const instance = figma.selectedInstance;

const title = instance.getString('Title text');
const content = instance.getString('Content text');

// Only the Disabled state maps to a code attribute; the remaining states
// (Hover, Focus, Skeleton) are interaction/loading states with no attribute.
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

// size, alignment, and isFlush are cds-accordion attributes in code, but in
// Figma they live on the item's variants. Surface them via metadata.props so the
// parent cds-accordion template can hoist them onto <cds-accordion>.
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
  example: figma.code`<cds-accordion-item title="${title}"${open ? ' open' : ''}${disabled ? ' disabled' : ''}>
  <p>${content}</p>${slotCode ? figma.code`
  ${slotCode}` : ''}
</cds-accordion-item>`,
  imports: [
    "import '@carbon/web-components/es/components/accordion/accordion-item.js'",
  ],
  id: 'cds-accordion-item',
  metadata: {
    nestable: true,
    props: {
      size,
      align,
      isFlush,
    },
  },
};
