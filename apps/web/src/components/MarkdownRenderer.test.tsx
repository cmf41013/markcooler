import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('渲染标题与列表', () => {
    render(<MarkdownRenderer content={'# 标题\n\n- 项目 A\n- 项目 B\n'} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('标题');
    expect(screen.getByText('项目 A')).toBeInTheDocument();
  });

  it('渲染 GFM 表格', () => {
    render(<MarkdownRenderer content={'| a | b |\n| --- | --- |\n| 1 | 2 |\n'} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('代码块添加 hljs 高亮 class', () => {
    render(<MarkdownRenderer content={'```js\nconst x = 1;\n```\n'} />);
    expect(document.querySelector('.hljs')).not.toBeNull();
  });
});
