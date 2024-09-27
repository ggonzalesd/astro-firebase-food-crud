import {
  collection,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore/lite';
import { firebaseDatabase } from './config';

export type FoodType = {
  description: string;
  image: string;
  name: string;
  slug: string;
};

const foodCollection = collection(firebaseDatabase, 'foods').withConverter({
  toFirestore(doc: FoodType): DocumentData {
    return doc;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): FoodType {
    return snapshot.data()! as FoodType;
  },
});

export const getAllFoods = async () => {
  const data = await getDocs(foodCollection);
  return data.docs.map((doc) => doc.data());
};
