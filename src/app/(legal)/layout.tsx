import Link from 'next/link';
import { Button } from '~/components/ui/button';
export default async function Layout(
  { children }: { children: React.ReactNode },
) {
  return (
    <section className='container w-full mx-auto pb-4'>
      <header className='top-0 pt-4 sticky flex w-full justify-between items-center bg-gradient-to-b from-background to-transparent via-background'>
        <Link href='/chat' className='text-4xl font-semibold'>
          Faist
        </Link>
        <div className='flex gap-4 items-center'>
          <Button asChild variant={'link'}>
            <Link href='/terms'>Terms</Link>
          </Button>
        </div>
      </header>
      <main className='max-w-screen-md mx-auto w-full markdown-container'>
        {children}
      </main>
    </section>
  );
}
