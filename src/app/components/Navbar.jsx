import Image from 'next/image';

export default function Navbar() {
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
        </div>
      </nav>
    );
  }
  