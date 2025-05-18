import type { Meta, StoryObj } from '@storybook/react';
import SmallBtn from './SmallBtn';

const meta = {
  title: 'Components/SmallBtn',
  component: SmallBtn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SmallBtn>;

export default meta;
type Story = StoryObj<typeof SmallBtn>;

export const Default: Story = {
  args: {
    text: '로그인',
  },
};

export const WithOnClick: Story = {
  args: {
    text: '로그아웃',
    onClick: () => alert('버튼이 클릭되었습니다!'),
  },
};

export const MultipleButtons: Story = {
  render: () => (
    <div className='flex gap-2'>
      <SmallBtn text='확인' />
      <SmallBtn text='취소' />
      <SmallBtn text='저장' />
    </div>
  ),
};
