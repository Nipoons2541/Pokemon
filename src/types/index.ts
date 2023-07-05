export interface PokemonProps {
  name: string;
}
export interface ImagePokemonProps extends PokemonProps {
  url: string;
  background: string;
}
export interface IconElementProps {
  element: string;
}
