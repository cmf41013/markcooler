import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileTree } from './FileTree';

const files = [
  { path: 'a.md', name: 'a.md', dir: '', size: 1, modifiedAt: 'x' },
  { path: 'sub/b.md', name: 'b.md', dir: 'sub', size: 1, modifiedAt: 'x' },
];

describe('FileTree', () => {
  it('渲染文件并回调选中', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FileTree files={files} selected={null} onSelect={onSelect} />);
    await user.click(screen.getByText('a.md'));
    expect(onSelect).toHaveBeenCalledWith('a.md');
  });

  it('空列表提示', () => {
    render(<FileTree files={[]} selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/没有 markdown 文件/)).toBeInTheDocument();
  });
});
