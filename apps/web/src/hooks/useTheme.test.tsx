import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('默认跟随系统', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('读取已保存主题', () => {
    localStorage.setItem('markcooler:theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('切换主题更新 class 与 localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('markcooler:theme')).toBe('dark');
  });
});
