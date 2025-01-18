'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { LucideCheck, LucideChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { clientModels } from '@/lib/models';

export const AISelect = React.memo(() => {
  const [selected, setSelected] = React.useState<
    typeof clientModels[number]['key']
  >(
    localStorage.getItem('assistant') as
      | typeof clientModels[number]['key']
      | undefined || clientModels[0].key,
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: typeof clientModels[number]['key']) => {
    localStorage.setItem('assistant', value);
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
});
