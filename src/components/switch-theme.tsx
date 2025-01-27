import { LucideMoon, LucideSun } from 'lucide-react';
import cookies from 'js-cookie';
import { Button } from '~/components/ui/button';
import React from 'react';

export const SwitchTheme = () => {
  const [theme, setTheme] = React.useState<'dark' | 'white'>(
    document.documentElement.className.includes('dark') ? 'dark' : 'white',
  );
  const handleSwitch = () => {
    cookies.set('theme', theme == 'dark' ? 'white' : 'dark', { expires: 30 });
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(theme == 'dark' ? 'white' : 'dark');
    setTheme(theme == 'dark' ? 'white' : 'dark');
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
