import type { Food } from '@/models/food.model';
import { useEffect, useState } from 'react';

import { getAllFoods } from '@/firebase/client';

export default function Foods() {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllFoods();

        setFoods(data);
      } catch (error) {
        console.error({ error });
      }
    };
    fetchData();
  }, []);

  return (
    <div className='flex flex-wrap gap-2'>
      {foods.map(({ slug, name, image, description }) => (
        <div key={slug} className='flex flex-col'>
          <span>{name}</span>
          <span>{image}</span>
          <span>{description}</span>
        </div>
      ))}
    </div>
  );
}
