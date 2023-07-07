import React from "react";
import pokeball from "../../assets/icons/pokeball.svg";
export default function Navbar() {
  return (
    <nav>
      <h1>Pokémon</h1>
      <img src={pokeball} alt="pokeball" className="nav-img-pokeball" />
    </nav>
  );
}
