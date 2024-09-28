import {
  collection,
  getDocs,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore/lite';
import { firebaseDatabase } from './config';

import type { Food } from '@/models/food.model';

const foodCollection = collection(firebaseDatabase, 'foods').withConverter({
  toFirestore(doc: Food): DocumentData {
    return doc;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Food {
    return snapshot.data()! as Food;
  },
});

export const getAllFoods = async () => {
  const data = await getDocs(foodCollection);
  return data.docs.map((doc) => doc.data());
};
