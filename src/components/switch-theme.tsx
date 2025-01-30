'use client';
import { LucideMoon, LucideSun } from 'lucide-react';
import cookies from 'js-cookie';
import { Button } from '~/components/ui/button';
import React from 'react';

export const SwitchTheme = () => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>(
    cookies.get('theme') as 'dark' | 'light',
  );
  const handleSwitch = () => {
    cookies.set('theme', theme == 'dark' ? 'light' : 'dark', { expires: 30 });
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(theme == 'dark' ? 'light' : 'dark');
    setTheme(theme == 'dark' ? 'light' : 'dark');
  };
  return (
    <Button
      size={'icon'}
      variant={'ghost'}
      onClick={handleSwitch}
    >
      {theme == 'dark' ? <LucideSun /> : <LucideMoon />}
    </Button>
  );
};
