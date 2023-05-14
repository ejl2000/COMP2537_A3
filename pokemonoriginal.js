const PAGE_SIZE = 10
let currentPage = 1;
let pokemons = []
//const numPageBtn = 5;
$(document).ready(function () {
    const apiUrl = 'https://pokeapi.co/api/v2/type';

    // Fetch Pokémon types from the APIs
    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function (response) {
            //fetch types
            const types = response.results;

            // Generate checkboxes for each Pokémon type
            types.forEach(function (type) {
                const checkbox = $('<input type="checkbox" class="typeCheckbox" value="' + type.name + '">');
                const label = $('<label class="typeLabel">' + type.name + '</label>');

                $('#typegroup').append(checkbox);
                $('#typegroup').append(label);
            });
        },
        error: function () {
            console.log('Error occurred while fetching Pokémon types.');
        }
    });
});


const updatePaginationDiv = (currentPage, numPages) => {

    $('#pagination').empty()
    $('#pagination').append(`
    <button type="button" class="btn btn-primary page ml-1 prevButtons" value = "${currentPage - 1}" id="prev">Prev</button>
    `)



    const startPage = 1;
    const endPage = numPages;
    const x = currentPage;
    const prev = x - 1;
    const next = x + 1;


    if (x == 1) {
        $("#prev").hide();
    }

    if (x == 81) {
        $("#next").hide();
    }

    for (let i = Math.max(x - 2, 1); i <= Math.min(x + 2, 81); i++) {
        let buttonClass = "btn btn-primary page ml-1 numberedButtons";
        if (i == x) {
            buttonClass += " active";
        }
        $('#pagination').append(`
            <button class= "${buttonClass}" value = "${i}" > ${i}</button>
            `);
    }
    $('#pagination').append(`
    <button type="button" class="btn btn-primary page ml-1 prevButtons" value = "${currentPage + 1}" id="next">Next</button>
    `)

}


const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
    selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    $('#pokeCards').empty()
    selected_pokemons.forEach(async (pokemon) => {
        const res = await axios.get(pokemon.url)
        $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `)
    })
}

const setup = async () => {
    // test out poke api using axios here


    $('#pokeCards').empty()
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    pokemons = response.data.results;


    paginate(currentPage, PAGE_SIZE, pokemons)
    const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
    updatePaginationDiv(currentPage, numPages)



    // pop up modal when clicking on a pokemon card
    // add event listener to each pokemon card
    $('body').on('click', '.pokeCard', async function (e) {
        const pokemonName = $(this).attr('pokeName')
        // console.log("pokemonName: ", pokemonName);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        // console.log("res.data: ", res.data);
        const types = res.data.types.map((type) => type.type.name)
        // console.log("types: ", types);
        $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>
        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
        </div>
        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `)
        $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
    })

    // add event listener to pagination buttons
    $('body').on('click', ".numberedButtons", async function (e) {
        currentPage = Number(e.target.value)
        paginate(currentPage, PAGE_SIZE, pokemons)

        //update pagination buttons
        updatePaginationDiv(currentPage, numPages)
    })

    $('body').on('click', ".prevButtons", async function (e) {
        currentPage = Number(e.target.value)
        paginate(currentPage, PAGE_SIZE, pokemons)

        //update pagination buttons
        updatePaginationDiv(currentPage, numPages)
    })

    $('body').on('click', ".nextButtons", async function (e) {
        currentPage = Number(e.target.value)
        paginate(currentPage, PAGE_SIZE, pokemons)

        //update pagination buttons
        updatePaginationDiv(currentPage, numPages)
    })

}


$(document).ready(setup)