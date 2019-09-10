import React, { Component } from 'react';

let POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=3';

class Pokemon extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pokemons: [],
            previous: false,
            next: true
        }

        this.handlePreviousNextClick = this.handlePreviousNextClick.bind(this);
    }

    render() {
        const listItems = this.state.pokemons.map((pk) => {
            return <div key={pk.id}>
                <header className="Pokemon-header">
                    <div className="left">{pk.name}</div>
                    <div className="right">ID: {pk.id}</div>
                </header>
                <img className="Pokemon-img" src={pk.img_url} alt="Pokemon" />
            </div>
        });

        return (
            <div>
                <div className="container">
                    {listItems}
                </div>
                <div className="container button-container">
                    <button disabled={!this.state.previous} value={this.state.previous} onClick={this.handlePreviousNextClick}>Prev</button>
                    <button disabled={!this.state.next} value={this.state.next} onClick={this.handlePreviousNextClick}>Next</button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getPokemonData();
    }

    getPokemonData() {
        fetch(`${POKEMON_URL}`)
            .then(response => response.json())
            .then(data => {
                this.getPokemonDetailsByURL(data);
            });
    }

    handlePreviousNextClick = ev => {
        POKEMON_URL = ev.target.value;
        this.getPokemonData();
    }

    getPokemonDetailsByURL(pokemons) {
        const pkMonUrls = [];
        this.setState({
            next: pokemons.next,
            previous: pokemons.previous
        });

        pokemons.results.forEach((pkMon) => {
            pkMonUrls.push(pkMon.url);
        });

        this.fetchPokemonDetails(pkMonUrls)
    }

    fetchPokemonDetails(pkMonUrls) {
        Promise.all(pkMonUrls.map((request) => {
            return fetch(request).then((response) => {
                return response.json();
            })
        }))
            .then((values) => {
                this.formatPokemonDetails(values);
            });
    }

    formatPokemonDetails(data) {
        const list = [];
        data.forEach((pkMon) => {
            list.push({
                id: pkMon.id,
                name: pkMon.name,
                img_url: pkMon.sprites.front_default
            });
        });        

        this.setState({
            pokemons: list
        });
    }
}

export default Pokemon;