// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=1854-1776
// source=packages/react/src/components/Button/Button.tsx
// component=Button
import figma from 'figma';

const instance = figma.selectedInstance;

const label = instance.getString('Button text');

const kind = instance.getEnum('Style', {
  Primary: 'primary',
  Secondary: 'secondary',
  Tertiary: 'tertiary',
  Ghost: 'ghost',
  'Danger primary': 'danger',
  'Danger tertiary': 'danger--tertiary',
  'Danger ghost': 'danger--ghost',
});

const size = instance.getEnum('Size', {
  '2X large': '2xl',
  'Extra large': 'xl',
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
  'Extra small': 'xs',
  Expressive: 'lg',
});

const isExpressive = instance.getEnum('Size', {
  '2X large': false,
  'Extra large': false,
  Large: false,
  Medium: false,
  Small: false,
  'Extra small': false,
  Expressive: true,
});

const hasIconOnly = instance.getEnum('Type', {
  'Text + Icon': false,
  'Icon only': true,
});

const disabled = instance.getEnum('State', {
  Enabled: false,
  Hover: false,
  Active: false,
  Focus: false,
  Disabled: true,
  Skeleton: false,
});

const hasIcon = instance.getBoolean('Icon');
const icon = instance.getInstanceSwap('Swap icon');
let iconCode;
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example;
}
const showIcon = hasIcon || hasIconOnly;

export default {
  example: figma.code`<Button
  kind="${kind}"
  size="${size}"${isExpressive ? ' isExpressive' : ''}${hasIconOnly ? ' hasIconOnly' : ''}${disabled ? ' disabled' : ''}${showIcon && iconCode ? figma.code`
  renderIcon={${iconCode}}` : ''}
>
  ${hasIconOnly ? '' : label}
</Button>`,
  imports: ['import { Button } from "@carbon/react"'],
  id: 'button',
  metadata: {
    nestable: false,
  },
};
