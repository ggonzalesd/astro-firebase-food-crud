import type { Food } from '@/models/food.model';
import { atom } from 'nanostores';

const initialMenuStore: MenuType = {
  intro: [],
  menu: [],
  other: [],
};

type MenuStoreType = {
  menu: MenuType;
  selected?: MenuFoodType;
  index?: number;
  key?: string;
};

export const menuStore = atom<MenuStoreType>({
  menu: initialMenuStore,
  selected: undefined,
});

export function menuOpen(key: string) {
  menuStore.set({
    ...menuStore.get(),
    key,
    index: undefined,
    selected: undefined,
  });
}

export function menuReset(menu?: MenuType) {
  menuStore.set({
    menu: menu ?? initialMenuStore,
  });
}

export function menuDelete(key: string, index: number) {
  const store = menuStore.get();
  if (key && Object.keys(store.menu).includes(key)) {
    const array = store.menu[key as keyof MenuType];

    const newMenu: MenuStoreType = {
      ...store,
      menu: {
        ...store.menu,
        [key]: array.filter((_, i) => i !== index),
      },
    };

    menuStore.set(newMenu);
  }
}

export function menuAddSelected() {
  const store = menuStore.get();
  const key = store.key;
  const index = store.index;
  if (key && Object.keys(store.menu).includes(key)) {
    let array = store.menu[key as keyof MenuType];

    if (index !== undefined) {
      array = array.map((v, i) => (i === index ? store.selected! : v));
    } else {
      array.push(store.selected!);
    }

    const newMenu: MenuStoreType = {
      selected: undefined,
      menu: { ...store.menu, [key]: array },
    };

    menuStore.set(newMenu);
  }
}

export function menuSelectToggleExtra(food: Food) {
  const store = menuStore.get();
  if (store.selected !== undefined) {
    let ex = store.selected.extra ?? [];
    const exists = ex.find((f) => f.slug === food.slug);

    // Check if push or delete
    if (!exists) {
      ex.push({ name: food.name, price: food.price, slug: food.slug });
    } else {
      ex = ex.filter((e) => e.slug !== food.slug);
    }

    // Building New Selected
    const newMenu: MenuStoreType = {
      ...store,
      selected: {
        ...store.selected,
        extra: ex,
      },
    };

    // Save Menu
    menuStore.set(newMenu);
  }
}

export function menuSelectToEdit(
  food: MenuFoodType,
  key: string,
  index: number,
) {
  menuStore.set({
    ...menuStore.get(),
    selected: { ...food, extra: food.extra && [...food.extra] },
    index,
    key,
  });
}

export function menuSelect(food?: Food) {
  const menu = menuStore.get();
  menuStore.set({
    ...menu,
    selected: food && {
      extra: [],
      slug: food.slug,
      image: food.image ?? '',
      name: food.name,
      description: food.description,
      price: food.price,
    },
  });
}

export function menuSelection(food: Food, hasExtra: boolean = false) {
  const menu = menuStore.get();
  if (hasExtra && menu.selected !== undefined) {
    menuSelectToggleExtra(food);
  } else {
    menuSelect(food);
  }
}
