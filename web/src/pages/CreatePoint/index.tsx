import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import axios from "axios";
import { LeafletMouseEvent } from "leaflet";

import Dropzone from "../../components/Dropzone";
import "./styles.css";
import logo from "../../assets/logo.svg";
import { FiArrowLeft } from "react-icons/fi";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  // Armazenamento dos items cadastrados na API
  const [items, setItems] = useState<Item[]>([]);
  // Armazenamento da seleção de UF
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, SetSelectedUf] = useState("0");
  // Armazenamento das cidades
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");
  // Posição inicial do leaflet map quando abre a página
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  // Armazentamento da posição no leaflet map
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  // Armanzenamento das informações nos inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  // Armazena os itens selecionados
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  // Armazena imagem da dropzone
  const [selectedFile, setSelectedFile] = useState<File>();

  // Retorna usuário à página principal
  const history = useHistory();

  // Estado para posição do map ao abrir a página
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  // @get da API
  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  // Chamada API IBGE para estados
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  // Chamada API IBGE para cidades conforme estado
  useEffect(() => {
    if (selectedUf === "0") {
      return;
    } else {
      axios
        .get<IBGECityResponse[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
        )
        .then((response) => {
          const cityNames = response.data.map((city) => city.nome);
          setCities(cityNames);
        });
    }
  }, [selectedUf]);

  // Função que cuida da seleção do UF
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    SetSelectedUf(uf);
  }

  // Função que cuida da seleção da cidade
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  // Função de seleção no mapa
  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  // Função que guarda os inputs
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      // Mantém os dados existentes
      ...formData,
      [name]: value,
    });
  }

  // Função armazena o estado dos itens selecionados
  function handleSelectItem(id: number) {
    // Retorna um numero acima ou igual 0 se o item já está no array
    // Verifica se há um item === id na lista dentro do array
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      // Contém todos os itens menos o que deseja remover
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      // Adiciona item no array
      setSelectedItems([...selectedItems, id]);
    }
  }

  // Função de post do registro
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    await api.post("points", data);
    alert("Pick-up spot registred");
    history.push("/");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Back
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Pick-up spot registration</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Personal data</h2>
          </legend>
        </fieldset>

        <div className="field">
          <label htmlFor="name">Entity name</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleInputChange}
          />
        </div>

        <div className="field-group">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="name">Whatsapp</label>
            <input
              type="text"
              name="whatsapp"
              id="whatsapp"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select your address on the map</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">State</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">Select your state</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select
                name="city"
                id="city"
                onChange={handleSelectCity}
                value={selectedCity}
              >
                <option value="0">Select your city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
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
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? "selected" : ""}
                >
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
