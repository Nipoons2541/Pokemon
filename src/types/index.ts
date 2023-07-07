export interface PokemonProps {
  name: string;
  modeTCG?: boolean;
}
export interface ImagePokemonProps extends PokemonProps {
  url: string;
  background: string;
  caption: string;
}
export interface DetailPokemonProps {
  stat: any;
  ability: any;
}
export interface IconElementProps {
  element: string;
  modeTCG: boolean;
}
