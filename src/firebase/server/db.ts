import {
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { serverFirestore } from './config';

import type { Food } from '@/models/food.model';

const foodCollection = serverFirestore.collection('foods').withConverter({
  toFirestore(doc: Food): DocumentData {
    return doc;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Food {
    return snapshot.data()! as Food;
  },
});

export const getAllFoods = async () => {
  const data = await foodCollection.get();
  return data.docs.map((doc) => doc.data());
};
