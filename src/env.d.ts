/// <reference path="../.astro/types.d.ts" />

declare interface SimpleFoodType {
  slug: string;
  name: string;
  price: number;
}

declare interface MenuFoodType extends SimpleFoodType {
  description: string;
  image: string;
  extra?: Array<SimpleFoodType>;
}

declare type MenuType = {
  intro: Array<MenuFoodType>;
  menu: Array<MenuFoodType>;
  other: Array<MenuFoodType>;
};

declare type ConfigType = {
  breakfast: {
    start: number;
    end: number;
  };
  lunch: {
    start: number;
    end: number;
  };
  dinner: {
    start: number;
    end: number;
  };
  updated: number;
  picking: number;
  delivery: number;
  open: boolean;
  working: boolean;
};
