import { actions } from "../reducers/app";

export const increment = () => {
  return {
    type: actions.getIncrementSuccess.type,
  };
};

export const decrement = () => {
  return {
    type: actions.getDecrementSuccess.type,
  };
};
