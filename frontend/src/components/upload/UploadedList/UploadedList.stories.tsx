// src/components/UploadedList/UploadedList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import UploadedList from './UploadedList';

const meta = {
  title: 'Components/UploadedList',
  component: UploadedList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UploadedList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFiles = [
  {
    id: '1',
    title: '정보처리기사 필기 이론',
    type: 'TXT',
  },
  {
    id: '2',
    title: '정보처리기사 필기 준비',
    type: 'DOC',
  },
  {
    id: '3',
    title: '정보처리기사 필기 준비',
    type: 'PDF',
  },
  {
    id: '4',
    title: '정보처리기사 필기 준비',
    type: 'TXT',
  },
];

export const Default: Story = {
  args: {
    files: mockFiles,
    maxFiles: 10,
    onDelete: (id) => {},
  },
};

export const Empty: Story = {
  args: {
    files: [],
    maxFiles: 10,
  },
};

export const Full: Story = {
  args: {
    files: Array(10)
      .fill(null)
      .map((_, index) => ({
        id: String(index + 1),
        title: `파일 ${index + 1}`,
        type: 'PDF',
      })),
    maxFiles: 10,
  },
};
