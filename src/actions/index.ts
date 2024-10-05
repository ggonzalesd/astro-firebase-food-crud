import { auth } from './auth.action';
import { config } from './config.action';
import { foods } from './foods.action';
import { menu } from './menu.action';

export const server = {
  auth,
  foods,
  menu,
  config,
};
