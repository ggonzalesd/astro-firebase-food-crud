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
  open: boolean;
  disabled: boolean;
};

export const menuStore = atom<MenuStoreType>({
  menu: initialMenuStore,
  selected: undefined,
  open: false,
  disabled: false,
});

export const menuDisabled = (disabled: boolean) => {
  menuStore.set({
    ...menuStore.get(),
    disabled,
  });
};

export const menuClose = () => {
  menuStore.set({
    ...menuStore.get(),
    open: false,
  });
};

export function menuOpen(key: string) {
  menuStore.set({
    ...menuStore.get(),
    key,
    index: undefined,
    selected: undefined,
    open: true,
  });
}

export function menuReset(menu?: MenuType) {
  menuStore.set({
    ...menuStore.get(),
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
      ...store,
      open: false,
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
    open: true,
    selected: { ...food, extra: food.extra && [...food.extra] },
    index,
    key,
  });
}

export function menuSelect(food?: Food) {
  const store = menuStore.get();
  const key = store.key;

  const selected: MenuFoodType | undefined = food && {
    extra: [],
    slug: food.slug,
    image: food.image ?? '',
    name: food.name,
    description: food.description,
    price: food.price,
  };

  if (
    store.key !== 'menu' &&
    selected &&
    key &&
    Object.keys(store.menu).includes(key)
  ) {
    let array = store.menu[key as keyof MenuType];
    array.push(selected);

    const newMenu: MenuStoreType = {
      ...store,
      open: false,
      selected: undefined,
      menu: { ...store.menu, [key]: array },
    };

    menuStore.set(newMenu);
  } else {
    menuStore.set({
      ...store,
      selected,
    });
  }
}

export function menuSelection(food: Food, hasExtra: boolean = false) {
  const menu = menuStore.get();
  if (hasExtra && menu.selected !== undefined) {
    menuSelectToggleExtra(food);
  } else {
    menuSelect(food);
  }
}

export function menuItemMove(key: string, index: number, other: number) {
  const store = menuStore.get();
  const array = store.menu[key as keyof MenuType];
  if (
    !!key &&
    array &&
    index >= 0 &&
    other >= 0 &&
    index < array.length &&
    other < array.length
  ) {
    const temp = array[index];
    array[index] = array[other];
    array[other] = temp;

    menuStore.set({
      ...store,
      menu: {
        ...store.menu,
        [key]: array,
      },
    });
  }
}
