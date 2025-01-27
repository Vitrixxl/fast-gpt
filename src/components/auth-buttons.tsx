'use client';
import { signIn } from 'next-auth/react';
import { Button } from '~/components/ui/button';
import { GoogleLogo } from '~/components/icons';

interface BaseLoginButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  name: string;
  icon: React.ReactNode;
}
export const BaseLoginButton: React.FC<BaseLoginButtonProps> = (
  { name, icon, ...props },
) => {
  return (
    <Button
      variant={'outline'}
      className='relative w-full'
      type='submit'
      {...props}
    >
      <span className='absolute left-4 top-1/2 -translate-y-1/2'>
        {icon}
      </span>
      <span>
        {name}
      </span>
    </Button>
  );
};

export const GoogleLogin = () => {
  return (
    <BaseLoginButton
      name='Google'
      icon={<GoogleLogo />}
      onClick={() => signIn('google')}
    />
  );
};
