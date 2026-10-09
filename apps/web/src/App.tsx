import { FileView } from './components/FileView';
import { ServerView } from './components/ServerView';
import { ThemeToggle } from './components/ThemeToggle';
import { isServerMode } from './lib/mode';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <h1 className="text-base font-semibold">markcooler</h1>
        <ThemeToggle />
      </header>
      {isServerMode ? <ServerView /> : <FileView />}
    </div>
  );
}
