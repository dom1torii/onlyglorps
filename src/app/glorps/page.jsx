// src/app/glorps/page.js
import db from '../../database/db';
import Image from 'next/image';

export default function Glorps() {
  const images = db.prepare('SELECT * FROM images').all();

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-5xl py-5'>Uploaded Glorps</h1>
      <ul className='flex flex-wrap items-center justify-center gap-5'>
        {images.map((image) => (
          <li key={image.id} className='flex flex-col items-center max-w-[300px]'>
            <a
              href={image.file_path}
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security best practice
              className='relative h-[300px] aspect-square'
            >
              <Image
                src={image.file_path}
                alt={image.name}
                layout='fill'
                objectFit='cover'
                className='rounded-md'
              />
            </a>
            <div className='flex flex-row gap-3 items-center justify-center w-full'>
                <h2 className='mt-2 truncate'>{image.name}</h2>
                <a
                href={image.file_path}
                download={image.name} // Add download attribute
                className='bg-[#19230b] rounded-md px-4 py-2 mt-2 hover:bg-[#17200b]'
                title='Download'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>
                </a>  
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}