import { EnumElementType } from "../enum";

export const elementGroup = (ele: string, modeTCG: boolean) => {
  if (modeTCG) {
    switch (ele) {
      case EnumElementType.BUG:
        return EnumElementType.GRASS;
      case EnumElementType.GHOST:
      case EnumElementType.POISON:
        return EnumElementType.PSYCHIC;
      default:
        return ele;
    }
  } else {
    return ele;
  }
};
