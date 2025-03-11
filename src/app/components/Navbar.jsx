'use client'
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
      return <p>Loading...</p>; // Show a loading state
    }

    return (
      <nav className="w-full h-20 bg-[#19230b] p-2">
        <div className="flex flex-row w-full h-full *:h-full *:px-7">
            <div className="flex h-full w-50 items-center relative">
              <div className='flex relative h-[90%] w-full'>
                <Image src="/logo.png" layout='fill' objectFit='cover' alt='logo'/>
              </div>
            </div>
            <div className="flex items-center gap-5 *:text-2xl">
                <a href="/">Home</a>
                <a href="/glorps">Glorps</a>
                <a href="/upload">Upload</a>
            </div>
            <div className='ml-auto flex items-center justify-center'>
            {session ? (
              <div className='flex flex-row items-center gap-3'>
                <a href='/profile'>{session.user.name}</a>
                <button
                  onClick={() => signOut()}
                  className='bg-[#19230b] rounded-md p-2 cursor-pointer'
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('twitch')}
                className='bg-[#19230b] rounded-md p-2 cursor-pointer'
              >
                Login with Twitch
              </button>
            )}
            </div>
        </div>
      </nav>
    );
  }
  