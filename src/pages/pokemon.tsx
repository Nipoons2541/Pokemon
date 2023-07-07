import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { PokemonProps, ImagePokemonProps, DetailPokemonProps } from "../types";
import IconElement from "../components/iconElement";
import { v4 as uuidv4 } from "uuid";
import pokeball from "../assets/icons/pokeball.svg";
import { elementGroup } from "../utils/utils";

function ImagePokemon(props: ImagePokemonProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.url) {
      setLoading(false);
    }
  }, [props.url]);

  return (
    <>
      <div className={`card-image-wrap `}>
        <img
          src={loading ? pokeball : props.url}
          alt={props.name}
          className={`card-image-pokemon ${loading ? "loading-pokeball" : ""}`}
        />
      </div>
      <p className="card-image-caption">{props.caption}</p>
    </>
  );
}
function DetailPokemon(props: DetailPokemonProps) {
  const id = uuidv4();
  return (
    <>
      <div className="detail-stat-wrap">
        {props.stat
          ?.filter(
            (item: any) =>
              item.statName === "attack" ||
              item.statName === "defense" ||
              item.statName === "speed"
          )
          .map((item: any, index: number) => (
            <p key={id + index} className="detail-text">
              {item.statName}: {item.statPoint}{" "}
            </p>
          ))}
      </div>
      <h2 className="detail-sub-header">Abilities</h2>
      <div className="detail-ability-wrap">
        {props.ability?.map((item: any) => (
          <p key={id + item.abilityName} className="detail-text">
            {item.abilityName}
          </p>
        ))}
      </div>
    </>
  );
}
function CardPokemon(props: PokemonProps) {
  const [pokemonData, setPokemonData] = useState<any>();
  const [stats, setStats] = useState<any>();
  const [image, setImage] = useState<any>();
  const [types, setTypes] = useState<any>();
  const [ability, setAbility] = useState<any>();
  const fetchEachPokemon = useCallback(async () => {
    const api = `https://pokeapi.co/api/v2/pokemon/${props.name}`;
    const getPokemon = await axios.get(api);

    const result = getPokemon.data;

    setPokemonData(result);
    setTimeout(() => {
      setImage(result?.sprites?.other?.["official-artwork"]?.front_default);
    }, 800);
    setStats(
      result?.stats.map((item: any) => ({
        statPoint: item?.base_stat,
        statName: item?.stat?.name,
      }))
    );

    setTypes(result?.types);
    setAbility(
      result?.abilities.map((item: any) => ({ abilityName: item.ability.name }))
    );
    return () => {
      clearTimeout(
        setTimeout(() => {
          setImage(result?.sprites?.other?.["official-artwork"]?.front_default);
        }, 800)
      );
    };
  }, []);

  useEffect(() => {
    fetchEachPokemon();
  }, [fetchEachPokemon]);
  return (
    <div
      className={`card-wrap ${
        types && elementGroup(types[0].type.name, props.modeTCG ?? false)
      }`}
    >
      <div className="card-header">
        <h1 className="card-text-header">{props.name}</h1>
        <p className="card-text-hp">
          <span>Hp</span>
          {stats?.filter((item: any) => item.statName === "hp")[0].statPoint}
        </p>
        <IconElement
          element={types && types[0]?.type?.name}
          modeTCG={props.modeTCG ?? false}
        />
      </div>

      <ImagePokemon
        url={image}
        name={props.name}
        background={types && types[0].type.name}
        caption={`No. ${
          Number(pokemonData?.id) <= 9
            ? "00" + pokemonData?.id
            : Number(pokemonData?.id) <= 99
            ? "0" + pokemonData?.id
            : pokemonData?.id
        } HT:${Number(pokemonData?.height) * 10} cm WT:${(
          Number(pokemonData?.weight) /
          10 /
          0.45359237
        ).toFixed(1)} lbs`}
      />

      <DetailPokemon stat={stats} ability={ability} />
    </div>
  );
}

export default function Pokemon() {
  const [pokemonName, setPokemonName] = useState<string[]>([]);
  const [modeTCG, setModeTCG] = useState(false);
  const [fetchLimit, setFetchLimit] = useState<number>(12);
  const fetchPokemon = useCallback(async () => {
    const api = `https://pokeapi.co/api/v2/pokemon?limit=12&offset=${
      fetchLimit - 12
    }`;
    const getPokemon = await axios.get(api);
    const result = getPokemon.data.results.map((item: any) => item.name);
    setPokemonName([...pokemonName, ...result]);
  }, [fetchLimit]);
  const handleLoadMore = () => {
    setFetchLimit(fetchLimit + 12);
  };
  const handleModeTCG = () => {
    setModeTCG(!modeTCG);
  };
  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return (
    <div className="pokemon-page">
      {/* <button onClick={handleModeTCG}>toggle</button> */}
      <div className="grid-pokemon">
        {pokemonName.map((name: string) => (
          <CardPokemon key={name} name={name} modeTCG={modeTCG} />
        ))}
      </div>
      {pokemonName.length < 1280 && (
        <div>
          <button type="button" onClick={handleLoadMore}>
            load more
          </button>
        </div>
      )}
    </div>
  );
}
