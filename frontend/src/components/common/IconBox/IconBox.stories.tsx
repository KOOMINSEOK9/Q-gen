// src/components/IconBox/IconBox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import IconBox from './IconBox';

const meta = {
  title: 'Components/IconBox',
  component: IconBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'chevronDown',
        'download',
        'edit',
        'link',
        'menu',
        'pieChart',
        'plus',
        'plusCircle',
        'text',
        'x',
      ],
      description: '아이콘 이름',
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 4 },
      description: '아이콘 크기 (px)',
    },

    rotate: {
      control: { type: 'number', min: 0, max: 360, step: 45 },
      description: '회전 각도 (도)',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
  },
} satisfies Meta<typeof IconBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    name: 'plus',
    size: 24,
  },
};

// 모든 아이콘 보기
export const AllIcons: Story = {
  args: {
    size: 24,
    name: 'plus', // 기본값 필요
  },
  render: (args) => (
    <div className='grid grid-cols-5 gap-4 p-4'>
      {(meta.argTypes.name.options as string[]).map((name) => (
        <div
          key={name}
          className='flex flex-col items-center gap-2 p-4 border rounded'
        >
          <IconBox {...args} name={name as any} />
          <span className='text-sm text-gray-600'>{name}</span>
        </div>
      ))}
    </div>
  ),
};

// 다양한 크기
export const Sizes: Story = {
  args: {
    name: 'plus',
  },
  render: (args) => (
    <div className='flex items-center gap-4'>
      <IconBox {...args} size={16} />
      <IconBox {...args} size={24} />
      <IconBox {...args} size={32} />
      <IconBox {...args} size={48} />
    </div>
  ),
};

// 회전
export const Rotation: Story = {
  args: {
    name: 'chevronDown',
    size: 24,
  },
  render: (args) => (
    <div className='flex items-center gap-4'>
      <IconBox {...args} rotate={0} />
      <IconBox {...args} rotate={90} />
      <IconBox {...args} rotate={180} />
      <IconBox {...args} rotate={270} />
    </div>
  ),
};

// 색상 변경
export const Colors: Story = {
  args: {
    name: 'plus',
    size: 24,
  },
  render: (args) => (
    <div className='flex items-center gap-4'>
      <IconBox {...args} />
      <IconBox {...args} />
      <IconBox {...args} />
      <IconBox
        {...args}
        className='text-purple-500 hover:text-purple-700 transition-colors'
      />
    </div>
  ),
};

// 클릭 가능한 아이콘
export const Clickable: Story = {
  args: {
    name: 'plus',
    size: 24,
    onClick: () => alert('Clicked!'),
  },
};

// 커스텀 스타일
export const CustomStyles: Story = {
  args: {
    name: 'plus',
    size: 24,
  },
  render: (args) => (
    <div className='flex items-center gap-4'>
      <IconBox
        {...args}
        className='p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors'
      />
      <IconBox
        {...args}
        className='p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors'
      />
      <IconBox
        {...args}
        className='p-2 border-2 border-blue-500 rounded-full hover:border-blue-600 transition-colors'
      />
    </div>
  ),
};
