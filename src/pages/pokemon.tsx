import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { PokemonProps, ImagePokemonProps } from "../types";
import IconElement from "../components/iconElement";
import { v4 as uuidv4 } from "uuid";

function ImagePokemon(props: ImagePokemonProps) {
  return (
    <div className={`card-image-wrap ${props.background}`}>
      <img src={props.url} alt={props.name} className={`card-image-pokemon `} />
    </div>
  );
}
function CardPokemon(props: PokemonProps) {
  const [pokemonData, setPokemonData] = useState<any>();
  const [stats, setStats] = useState<any>();
  const [image, setImage] = useState<any>();
  const [types, setTypes] = useState<any>();
  const id = uuidv4();

  const fetchEachPokemon = useCallback(async () => {
    const api = `https://pokeapi.co/api/v2/pokemon/${props.name}`;
    const getPokemon = await axios.get(api);
    console.log(getPokemon.data);

    const result = getPokemon.data;

    setPokemonData(result);
    setImage(result?.sprites?.other?.dream_world?.front_default);
    setStats(
      result?.stats.map((item: any) => ({
        statPoint: item?.base_stat,
        statName: item?.stat?.name,
      }))
    );
    setTypes(result?.types);
  }, []);

  useEffect(() => {
    fetchEachPokemon();
  }, [fetchEachPokemon]);
  return (
    <div className={`card-wrap `}>
      <div className="card-header">
        <h1 className="card-text-header">{props.name}</h1>
        {types &&
          types.map((item: any) => (
            <IconElement key={id + item.type.name} element={item.type.name} />
          ))}
      </div>
      <ImagePokemon
        url={image}
        name={props.name}
        background={types && types[0].type.name}
      />
    </div>
  );
}

export default function Pokemon() {
  const [pokemonName, setPokemonName] = useState<string[]>([]);
  const [fetchLimit, setFetchLimit] = useState<number>(9);
  const fetchPokemon = useCallback(async () => {
    const api = `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${
      fetchLimit - 9
    }`;
    const getPokemon = await axios.get(api);
    const result = getPokemon.data.results.map((item: any) => item.name);
    setPokemonName([...pokemonName, ...result]);
  }, [fetchLimit]);
  const handleLoadMore = () => {
    setFetchLimit(fetchLimit + 10);
  };
  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return (
    <div className="pokemon-page">
      <h1>Pokemon {pokemonName.length}</h1>
      <div className="grid-pokemon">
        {pokemonName.map((name: string) => (
          <CardPokemon key={name} name={name} />
        ))}
      </div>
      <div>
        <button type="button" onClick={handleLoadMore}>
          load more
        </button>
      </div>
    </div>
  );
}
