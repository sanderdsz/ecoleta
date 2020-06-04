import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import axios from "axios";

import "./styles.css";
import logo from "../../assets/logo.svg";
import { FiArrowLeft } from "react-icons/fi";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);

  // @get da API
  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  // Chamada API IBGE para estados
  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => {
        console.log(response);
      });
  }, []);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Back
        </Link>
      </header>

      <form>
        <h1>Pick-up spot registration</h1>

        <fieldset>
          <legend>
            <h2>Personal data</h2>
          </legend>
        </fieldset>

        <div className="field">
          <label htmlFor="name">Entity name</label>
          <input type="text" name="name" id="name" />
        </div>

        <div className="field-group">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input type="email" name="email" id="email" />
          </div>
          <div className="field">
            <label htmlFor="name">Whatsapp</label>
            <input type="text" name="whatsapp" id="whatsapp" />
          </div>
        </div>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select your address on the map</span>
          </legend>

          <Map center={[-28.5201796, -49.3227657]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-28.5201796, -49.3227657]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">State</label>
              <select name="uf" id="uf">
                <option value="0">Select your state</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select name="city" id="city">
                <option value="0">Select your city</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Pick-up item</h2>
            <span>Select one or more items below</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => {
              return (
                <li key={item.id}>
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CreatePoint;
