// url=https://www.figma.com/design/HrLUpkVhlUa6GCNxyBCr72/-v11--Carbon-Design-System--Community-?node-id=1854-1776
// source=packages/web-components/src/components/button/button.ts
// component=cds-button
import figma from 'figma';

const instance = figma.selectedInstance;

const label = instance.getString('Button text');

const kind = instance.getEnum('Style', {
  Primary: 'primary',
  Secondary: 'secondary',
  Tertiary: 'tertiary',
  Ghost: 'ghost',
  'Danger primary': 'danger',
  'Danger tertiary': 'danger-tertiary',
  'Danger ghost': 'danger-ghost',
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
  example: figma.code`<cds-button
  kind="${kind}"
  size="${size}"${isExpressive ? ' isExpressive' : ''}${disabled ? ' disabled' : ''}>
  ${hasIconOnly ? '' : label}${showIcon && iconCode ? figma.code`
  ${iconCode}` : ''}
</cds-button>`,
  imports: ["import '@carbon/web-components/es/components/button/button.js'"],
  id: 'cds-button',
  metadata: {
    nestable: false,
  },
};
