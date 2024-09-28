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
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const deleteOneFood = async (id: string) => {
  return await foodCollection.doc(id).delete();
};

export const getPaginatorFoods = async (
  size: number,
  pivot?: any,
  mode: 'after' | 'before' = 'after',
) => {
  let snap: FirebaseFirestore.QuerySnapshot<Food, DocumentData> | undefined =
    undefined;

  if (!pivot) {
    snap = await foodCollection.orderBy('name').limit(size).get();
  } else {
    if (mode === 'before') {
      snap = await foodCollection
        .orderBy('name')
        .endBefore(pivot)
        .limit(size)
        .get();
    } else {
      snap = await foodCollection
        .orderBy('name')
        .startAfter(pivot)
        .limit(size)
        .get();
    }
  }

  const data = snap.docs.map((food) => food.data());

  return {
    data,
    first: !snap.empty ? data[0] : undefined,
    last: !snap.empty ? data[data.length - 1] : undefined,
  };
};
