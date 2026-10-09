import { describe, expect, it } from 'vitest';
import { detectRunMode } from './mode';

describe('detectRunMode', () => {
  it('file: 协议 → file 模式', () => {
    expect(detectRunMode('file:')).toBe('file');
  });

  it('http/https → server 模式', () => {
    expect(detectRunMode('http:')).toBe('server');
    expect(detectRunMode('https:')).toBe('server');
  });
});
