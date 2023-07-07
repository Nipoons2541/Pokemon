export interface PokemonProps {
  name: string;
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
}
