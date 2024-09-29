import { resizeBlob } from '@/utils/resizeBlob';
import { useState } from 'react';

interface Props {
  name?: string;
  labelName?: string;
  onChange?: (base64: string) => void;
}

export default function ImageLoader({ name, labelName, onChange }: Props) {
  const [fname, setFname] = useState<string | undefined>();

  const onChangeGen: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const f = e.target.files[0];
        if (f.size > 10 * 1024 ** 2) {
          throw new Error('File is bigger than 10MB');
        }

        const buffer = await f.arrayBuffer();
        const blob = new Blob([buffer]);

        const resized = await resizeBlob(blob, 128, 128);
        if (!resized) throw new Error('Somtheing went wrong with image');
        const buffer8 = new Uint8Array(resized);
        const buffer_string = buffer8.reduce(
          (acc, c) => acc + String.fromCharCode(c),
          '',
        );
        const base64 = btoa(buffer_string);
        setFname(f.name);
        if (onChange) onChange(base64);
      } catch (err) {
        setFname(undefined);
        if (onChange) onChange('');
      }
    }
  };

  return (
    <label className='flex flex-col gap-2'>
      <span>{labelName ?? name}</span>
      <div className='relative rounded-md border-[1px] border-zinc-400 bg-zinc-300 hover:cursor-pointer'>
        <span className='-z-0 flex size-full text-ellipsis px-2 py-1 italic'>
          {fname?.slice(0, 10) ?? 'no content'}
        </span>
        <input
          type='file'
          name={name}
          className='absolute left-0 top-0 flex size-full appearance-none opacity-0 disabled:pointer-events-none'
          onChange={onChangeGen}
        />
      </div>
    </label>
  );
}
