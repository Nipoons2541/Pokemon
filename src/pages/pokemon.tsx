import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PokemonProps, ImagePokemonProps, DetailPokemonProps } from "../types";
import IconElement from "../components/iconElement";
import pokeball from "../assets/icons/pokeball.svg";

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
  const id = new Date().getTime();
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
            <p
              key={id + index + item.statName + item.statPoint}
              className="detail-text"
            >
              {item.statName}: {item.statPoint}{" "}
            </p>
          ))}
      </div>
      <h2 className="detail-sub-header">Abilities</h2>
      <div className="detail-ability-wrap">
        {props.ability?.map((item: any, index: number) => (
          <p key={id + item.abilityName + index} className="detail-text">
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
    <div className={`card-wrap ${types && types[0].type.name}`}>
      <div className="card-header">
        <h1 className="card-text-header">{props.name}</h1>
        <p className="card-text-hp">
          <span>Hp</span>
          {stats?.filter((item: any) => item.statName === "hp")[0].statPoint}
        </p>
        <IconElement element={types && types[0]?.type?.name} />
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
  const [pokemonNameShow, setPokemonNameShow] = useState<string[]>([]);
  const [pokemonNameAll, setPokemonNameAll] = useState<string[]>([]);
  const [fetchLimit, setFetchLimit] = useState<number>(0);
  const [loadMore, setLoadMore] = useState(false);
  const [scrollToBottom, setSetscrollToBottom] = useState(false);
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [sortingBy, setSortingBy] = useState<string | undefined>("");
  const addPokemon = useCallback(async () => {
    if (!randomMode) {
      const pokemonAll = [...pokemonNameAll];
      const pokemonSplice = pokemonAll.splice(fetchLimit, 12);
      setPokemonNameShow([...pokemonNameShow, ...pokemonSplice]);
    }
  }, [fetchLimit]);
  const handleLoadMore = async () => {
    setLoadMore(true);
  };

  const fetchPokemonAll = useCallback(async () => {
    setLoadMore(false);
    const api = `https://pokeapi.co/api/v2/pokemon?limit=20000&offset=0`;
    const getPokemonAll = await axios.get(api);
    const result = getPokemonAll.data.results.map(
      (item: any, index: number) => ({ id: index + 1, name: item.name })
    );

    const pokemonForShow = result.splice(0, 12);

    setPokemonNameShow(pokemonForShow);

    setPokemonNameAll(result);
  }, []);

  const handleSorting = async (type: string) => {
    setLoadMore(false);
    setRandomMode(false);
    setSortingBy(type);
    const api = `https://pokeapi.co/api/v2/pokemon?limit=20000&offset=0`;
    const getPokemonAll = await axios.get(api);
    const result = getPokemonAll.data.results.map(
      (item: any, index: number) => ({ id: index + 1, name: item.name })
    );
    result?.sort(function (a: any, b: any) {
      switch (type) {
        case "AZ":
          if (a.name < b.name) {
            return -1;
          }
          break;
        case "ZA":
          if (a.name > b.name) {
            return -1;
          }
          break;
        case "FIRST":
          if (a.id < b.id) {
            return -1;
          }
          break;
        case "LAST":
          if (a.id > b.id) {
            return -1;
          }
          break;
      }
    });
    const pokemonForShow = result.splice(0, 12);

    setPokemonNameShow(pokemonForShow);

    setPokemonNameAll(result);
  };

  const handleRandomPokemon = () => {
    setLoadMore(false);
    setRandomMode(true);
    setPokemonNameShow([]);
    const pokemonRandom: any = [];
    const pokemonRandomUnique: any = [];
    for (let i = 0; i < 12; i++) {
      const randomNumber = Number(
        (Math.random() * 1000 + pokemonNameAll.length - 1000).toFixed(0)
      );
      pokemonRandom.push(pokemonNameAll[randomNumber]);
    }
    pokemonRandom.forEach((item: any) => {
      if (!pokemonRandomUnique.includes(item)) {
        pokemonRandomUnique.push(item);
      }
    });
    setPokemonNameShow(pokemonRandomUnique);
  };
  const handleScrollLoadMore = () => {
    if (
      window.scrollY ===
      document.documentElement.scrollHeight -
        document.documentElement.clientHeight
    ) {
      setSetscrollToBottom(true);
    } else {
      setSetscrollToBottom(false);
    }
  };
  useEffect(() => {
    if (loadMore) {
      addPokemon();
    }
  }, [addPokemon]);
  useEffect(() => {
    if (scrollToBottom && loadMore) {
      setFetchLimit(fetchLimit + 12);
    }
  }, [scrollToBottom, loadMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollLoadMore);
    return () => {
      window.removeEventListener("scroll", handleScrollLoadMore);
    };
  }, []);
  useEffect(() => {
    fetchPokemonAll();
  }, [fetchPokemonAll]);

  return (
    <div className="pokemon-page">
      <section className="menu">
        <div className="menu-mode">
          <div className="menu-mode-action">
            <button onClick={handleRandomPokemon} className="btn btn-random">
              Random Pokémon
            </button>
          </div>
        </div>
        <div className="menu-sorting">
          <label>Sort by</label>
          <select
            name="sorting"
            id="sort"
            onChange={(e) => {
              console.log(e.target.value);
              handleSorting(e.target.value);
            }}
            value={sortingBy}
          >
            <option value="" disabled>
              Please select filter
            </option>
            <option value="AZ">from A-Z</option>
            <option value="ZA">from Z-A</option>
            <option value="FIRST">first to last card</option>
            <option value="LAST">last to first card</option>
          </select>
          {/* <button
            onClick={() => handleSorting("AZ")}
            className="btn btn-normal"
          >
            A-Z
          </button>
          <button
            onClick={() => handleSorting("ZA")}
            className="btn btn-random"
          >
            Z-A
          </button>
          <button
            onClick={() => handleSorting("FIRST")}
            className="btn btn-random"
          >
            Fisrt Card
          </button>
          <button
            onClick={() => handleSorting("LAST")}
            className="btn btn-random"
          >
            Last Card
          </button> */}
        </div>
      </section>

      <section className="content">
        <div className="grid-pokemon">
          {pokemonNameShow.map((item: any) =>
            item ? (
              <CardPokemon key={item?.name + item.id} name={item.name} />
            ) : (
              ""
            )
          )}
        </div>
        {!loadMore && !randomMode && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="btn-load-more"
          >
            load Pokémon more
          </button>
        )}
      </section>
    </div>
  );
}
