import cn from 'classnames';
import { useMemo, useState } from 'react';
import { arrayToBase64, resizeBlob } from '@/utils/resizeBlob';

interface Props {
  name?: string;
  disabled?: boolean;
  defaultSrc?: string;
  onChange?: (value: string) => void;
}

export default function ImageInput({
  name,
  disabled,
  defaultSrc,
  onChange,
}: Props) {
  const [error, setError] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();

  const src = useMemo(() => url ?? defaultSrc, [defaultSrc, url]);

  const onChangeImage: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const fileInput = e.target;

    if (!fileInput || !fileInput.files || fileInput.files.length < 1) return;
    try {
      const file = fileInput.files[0];

      if (url) {
        URL.revokeObjectURL(url);
      }

      if (!file || !file.type.startsWith('image/')) {
        throw new Error('File is not image');
      }

      if (file.size > 10 * 1024 ** 2) {
        throw new Error('Image is bigger than 10MB');
      }

      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result;

          if (!(result instanceof ArrayBuffer)) {
            return reject(new Error('Error while reading'));
          }

          const blob = new Blob([result]);

          const resized = await resizeBlob(blob, 128, 128);
          if (!resized) {
            return reject(new Error('Something wrong with image'));
          }

          const base64 = arrayToBase64(resized);

          setUrl(URL.createObjectURL(new Blob([resized])));
          setError(undefined);
          if (onChange) onChange(base64);
          resolve();
        };
        reader.readAsArrayBuffer(file);
      });
    } catch (err) {
      setUrl(undefined);
      if (onChange) onChange('');
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <label
      aria-disabled={disabled}
      className='input-img group relative flex flex-col gap-2 hover:cursor-pointer aria-disabled:pointer-events-none'
    >
      <span>{name}</span>
      <div className='flex items-center overflow-hidden rounded-md border-[1px] border-zinc-400'>
        <input
          disabled={disabled}
          name={name}
          type='file'
          className='sr-only'
          onChange={onChangeImage}
        />
        <div
          aria-disabled={disabled}
          className='flex aspect-square size-8 bg-cover bg-center group-[.input-img:hover]:brightness-110 aria-disabled:saturate-0'
          style={{
            backgroundImage: src && `url(${src})`,
          }}
        />
        <div className='flex h-8 w-full items-center bg-zinc-300 group-[.input-img:hover]:bg-zinc-200'>
          <span className='text-ellipsis px-2'>
            {url ? 'Loaded' : defaultSrc ? 'Default' : 'No Image'}
          </span>
        </div>
      </div>
    </label>
  );
}
