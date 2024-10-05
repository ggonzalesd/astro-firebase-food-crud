import {
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { serverFirestore } from './config';

import type { Food } from '@/models/food.model';

const names = import.meta.env.PROD
  ? {
      foods: 'foods',
      menu: 'default',
      config: 'default',
    }
  : {
      foods: 'dev-foods',
      menu: 'dev',
      config: 'dev',
    };

const foodCollection = serverFirestore.collection(names.foods).withConverter({
  toFirestore(doc: Omit<Food, 'id'>): DocumentData {
    return doc;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Omit<Food, 'id'> {
    return snapshot.data()! as Omit<Food, 'id'>;
  },
});

export const getAllFoods = async () => {
  const data = await foodCollection.get();
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Food[];
};

export const deleteOneFood = async (id: string) => {
  return await foodCollection.doc(id).delete();
};

export const getOneFoodBySlug = async (slug: string) => {
  const snapshot = await foodCollection
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snapshot.empty) {
    return undefined;
  }

  return snapshot.docs.map((food) => ({ id: food.id, ...food.data() }))[0];
};

export const updateFood = async (id: string, food: Omit<Food, 'id'>) => {
  await foodCollection.doc(id).set(food);
};

export const saveOneFood = async (food: Omit<Food, 'id'>) => {
  const result = await foodCollection.add(food);
  const newFood = await result.get();
  return newFood.exists
    ? {
        ...newFood.data()!,
        id: newFood.id,
      }
    : undefined;
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

const menuCollection = serverFirestore.collection('menu').withConverter({
  toFirestore(doc: MenuType): DocumentData {
    return doc;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): MenuType {
    return snapshot.data()! as MenuType;
  },
});

export const getMenu = async () => {
  const result = await menuCollection.doc(names.menu).get();
  return result.data();
};

export const setMenu = async (menu: MenuType) => {
  const result = await menuCollection.doc(names.menu).set(menu);
  return result.writeTime;
};

const configCollection = serverFirestore.collection('config').withConverter({
  toFirestore(doc: ConfigType): DocumentData {
    return doc;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ConfigType {
    return snapshot.data()! as ConfigType;
  },
});

export const updateConfig = async (config: ConfigType) => {
  const result = await configCollection.doc(names.config).set(config);
  return result.writeTime;
};

export const getConfig = async () => {
  const result = await configCollection.doc(names.config).get();
  return result.data();
};
