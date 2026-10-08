import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from './hooks/useTheme';
import { cn } from './lib/cn';

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[0]!;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          'inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm',
          'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100',
          'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800',
        )}
      >
        <current.icon className="h-4 w-4" />
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          className={cn(
            'z-50 min-w-36 rounded-md border p-1 shadow-lg',
            'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
          )}
        >
          {THEME_OPTIONS.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              onSelect={() => setTheme(opt.value)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none',
                'text-neutral-700 focus:bg-neutral-100 dark:text-neutral-200 dark:focus:bg-neutral-800',
                opt.value === theme && 'font-medium',
              )}
            >
              <opt.icon className="h-4 w-4" />
              {opt.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <h1 className="text-base font-semibold">markcooler</h1>
        <ThemeToggle />
      </header>
      <main className="px-5 py-4 text-sm text-neutral-500 dark:text-neutral-400">
        M2 骨架已就绪：React + Vite + Tailwind，主题切换可用。
      </main>
    </div>
  );
}
