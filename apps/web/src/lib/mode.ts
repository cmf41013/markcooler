import type { RunMode } from '@markcooler/shared';

/** 纯函数：按协议判断运行模式，便于测试。 */
export function detectRunMode(protocol: string): RunMode {
  return protocol === 'file:' ? 'file' : 'server';
}

/** 通过协议判断运行模式：file:// 为双击模式，否则为服务器模式。 */
export const runMode: RunMode = detectRunMode(location.protocol);

export const isServerMode = runMode === 'server';
export const isFileMode = runMode === 'file';
