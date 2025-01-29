'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { LucideCheck, LucideChevronsUpDown } from 'lucide-react';
import { Button } from '~/components/ui/button';
import React from 'react';
import { clientModels } from '~/lib/ai-models';
import { useAtomValue } from 'jotai';
import { sessionAtom } from '~/front-end/atoms/session';

export function AISelect() {
  const [selected, setSelected] = React.useState<
    typeof clientModels[number]['key']
  >(
    localStorage.getItem('assistant') as
      | typeof clientModels[number]['key']
      | undefined || clientModels[0].key,
  );

  const user = useAtomValue(sessionAtom);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if ((!user || !user.premium) && selected != 'gpt-4o-mini') {
      setSelected('gpt-4o-mini');
      localStorage.setItem('assistant', 'gpt-4o-mini');
    } else if (user) {
      const authAssistant = localStorage.getItem('auth-assistant');
      if (!authAssistant) return setSelected('gpt-4o-mini');
      if (!user.premium && authAssistant != 'gpt-4o-mini') {
        localStorage.setItem('auth-assistant', 'gpt-4o-mini');
        setSelected('gpt-4o-mini');
      }
      localStorage.setItem('assistant', authAssistant);
      setSelected(authAssistant as typeof clientModels[number]['key']);
    }
  }, [user]);

  const handleSelect = (value: typeof clientModels[number]['key']) => {
    if (user) {
      localStorage.setItem('auth-assistant', value);
    } else {
      localStorage.setItem('assistant', value);
    }
    setSelected(value);
    setIsOpen(false);
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className='min-w-[150px] justify-between'>
          {clientModels.find((m) => m.key == selected)?.label}
          <LucideChevronsUpDown className='size-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0'
        align='end'
      >
        <Command>
          <CommandList>
            <CommandGroup autoFocus={false}>
              {clientModels.map((m) => (
                <CommandItem
                  value={m.key}
                  className='cursor-pointer'
                  onSelect={() => {
                    handleSelect(m.key);
                  }}
                  key={m.key}
                  autoFocus={false}
                  disabled={user?.premium ? false : m.key != 'gpt-4o-mini'}
                >
                  {m.label}
                  {m.key == selected && (
                    <LucideCheck className='ml-auto size-4' />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
