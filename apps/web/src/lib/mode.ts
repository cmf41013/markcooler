import type { RunMode } from '@markcooler/shared';

/** 通过协议判断运行模式：file:// 为双击模式，否则为服务器模式。 */
export const runMode: RunMode = location.protocol === 'file:' ? 'file' : 'server';

export const isServerMode = runMode === 'server';
export const isFileMode = runMode === 'file';
