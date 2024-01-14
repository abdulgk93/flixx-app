const global = {
    currentPage: window.location.pathname,
    search : {
        type : '',
        term : '',
        page: 1,
        totalPages: '',
        totalResults:''
    },
    API_KEY : 'd9a09b549860e2a8a09a435e0d583aea',
    API_URL : 'https://api.themoviedb.org/3/'
}


function highlightActiveLink(){
    const headerLinks = document.querySelectorAll('.nav-link')
    headerLinks.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage){
            link.classList.add('active')
        }
    })
}

async function fetchDataAPI(endpoint){
    const API_KEY= global.API_KEY
    const API_URL = global.API_URL
    showSpinner()
    const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)
    
    const data = await res.json()

    hideSpinner();
    return data
}

async function searchApi(){
    const API_KEY= global.API_KEY
    const API_URL = global.API_URL
    showSpinner()
    const res = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&include_adult=false&language=en-US
                        &query=${global.search.term}&page=${global.search.page}`)
    
    const data = await res.json()
    console.log(data);
    hideSpinner();
    return data

}

//###################### DISPLAY FUNCTIONs

async function displayPopularMovies(){
    const {results} = await fetchDataAPI('movie/popular')
    //console.log(results);
    const popDiv = document.getElementById('popular-movies')
    results.forEach((movie) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
                        ${movie.poster_path 
                            ?  `<img src="https://image.tmdb.org/t/p/w220_and_h330_face${movie.poster_path}"
                            class="card-img-top"
                            alt="${movie.title}" />`
                            :
                            `<img src="images/no-image.jpg" class="card-img-top" alt="Movie Title" />`
                        }
                       
                        </a>
                        <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">
                            <small class="text-muted">Release: ${movie.release_date}</small>
                        </p>
                        </div>`
        
        popDiv.appendChild(div)
    })

}

async function displayPopularShows(){
    const {results} = await fetchDataAPI('tv/popular')
    console.log(results);
    const popDiv = document.getElementById('popular-shows')
    results.forEach((show) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `<a href="tv-details.html?id=${show.id}">
                        ${show.poster_path
                            ? `<img
                                src="https://image.tmdb.org/t/p/w220_and_h330_face${show.poster_path}"
                                class="card-img-top"
                                alt="${show.name}"
                            />`
                            : `<img src="images/no-image.jpg" class="card-img-top" alt="Show Title" />`

                        }

                        </a>
                        <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <p class="card-text">
                            <small class="text-muted">Aired: ${show.first_air_date}</small>
                        </p>
                        </div>`
        
        popDiv.appendChild(div)
    })

}

//Display Movie details
async function displayMovieDetails(){
    const showID= window.location.search.split('=')[1]
    console.log(showID);
    const movie = await fetchDataAPI(`/movie/${showID}`);

    displayBackgroundPoster('movie',movie.backdrop_path);
    const div = document.createElement('div');
    div.innerHTML = `<div class="details-top">
    <div>
      <img
        src="https://image.tmdb.org/t/p/w220_and_h330_face${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>${movie.overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">${movie.genres.map((m) => `<li>${m.name}</li>`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${movie.budget.toLocaleString()}</li>
      <li><span class="text-secondary">Revenue:</span> $${movie.revenue.toLocaleString()}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map((m) => m.name).join(', ')}</div>
    <h2 id="cast">Cast</h2>
  </div>`

  document.querySelector('#movie-details').appendChild(div)
  displayCredits(showID)
}

async function displayCredits(showID){
    const {cast} = await fetchDataAPI(`movie/${showID}/credits`);
    console.log(cast);
    cast.forEach((cast) => {
        const div = document.createElement('div');
        div.classList.add('card-cast')
        div.innerHTML = `<div>
        ${cast.profile_path
            ?  `<img src="https://image.tmdb.org/t/p/w220_and_h330_face${cast.profile_path}"
            class="card-img-top"
            alt="${cast.name}" />`
            :
            `<img src="images/no-image.jpg" class="card-img-top-cast alt="${cast.name}" />`
        }
        <div class="card-body">
            <h5 class="card-title">${cast.name}</h5>
            <small class="text-muted" style="font-size:10pt">${cast.character}</small>
        </div>`
        document.querySelector('#movie-details').appendChild(div)
    })
    
}

//show show details
async function displayShowDetails(){
    const showID= window.location.search.split('=')[1]
    
    const show = await fetchDataAPI(`/tv/${showID}`);
    console.log(show);
    displayBackgroundPoster('tv',show.backdrop_path);
    const div = document.createElement('div');
    div.innerHTML = `<div class="details-top">
    <div>
      <img
        src="https://image.tmdb.org/t/p/w220_and_h330_face${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${show.first_air_date}</p>
      <p>${show.overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">${show.genres.map((m) => `<li>${m.name}</li>`).join('')}
      </ul>
      <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes::</span> ${show.number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
       <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map((m) => m.name).join(',')}</div>
  </div>`

  document.querySelector('#show-details').appendChild(div)
}

function displaySearchResults(results){

    document.querySelector('#search-results-heading').innerHTML = ''
    document.querySelector('#search-results').innerHTML = ''
    document.querySelector('#pagination').innerHTML = ''

    results.forEach((result) => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `<a href="${global.search.type}-details.html?id=${result.id}">
                    ${result.poster_path 
                        ?  `<img src="https://image.tmdb.org/t/p/w220_and_h330_face${result.poster_path}"
                        class="card-img-top"
                        alt="${ global.search.type === 'movie' ? result.title : result.name}" />`
                        :
                        `<img src="images/no-image.jpg" class="card-img-top" alt="${ global.search.type === 'movie' ? result.title : result.name}" />`
                    }
                
                    </a>
                    <div class="card-body">
                    <h5 class="card-title">${ global.search.type === 'movie' ? result.title : result.name}</h5>
                    <p class="card-text">
                        <small class="text-muted">Release: ${ global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
                    </p>
                    </div>`
                    document.querySelector('#search-results').appendChild(div)
    })

    document.querySelector('#search-results-heading').innerHTML = `<h2>Showing ${results.length} of ${global.search.totalResults} result</h2>`
    displayPagination();

}

function displayPagination(){
    const div = document.createElement('div');
    div.classList.add('pagination')
    div.innerHTML = `<button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`

    document.querySelector('#pagination').appendChild(div)

    //Next click
    document.querySelector('#next').addEventListener('click',async () => {
        global.search.page++;
        const {results, total_pages} = await searchApi()
        displaySearchResults(results)

    })

    //Prev click
    document.querySelector('#prev').addEventListener('click',async () => {
        global.search.page--;
        const {results, total_pages} = await searchApi()
        displaySearchResults(results)
    })

    //disable prev or next conditionally
    if(global.search.page === 1){
        document.querySelector('#prev').disabled = true;
    }
    if(global.search.page === global.search.totalPages){
        document.querySelector('#next').disabled = true;
    }
}
async function search(){
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    global.search.type = urlParams.get('type')
    global.search.term = urlParams.get('search-term')
    console.log(global);

    if(global.search.term !== '' && global.search.term !== null){
        const {results,total_pages,page,total_results} = await searchApi();
        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;
        if(results.length === 0 ) {
            showAlert('No result found')
        }
        
        displaySearchResults(results)
        document.querySelector('#search-term').value = ''
    }else{
        showAlert('Please enter search value');
    }

    //show heading of results numbers
    //add pagination feature
}

//###################### UTILITY FUNCTIONs

function showAlert(message,className){
    const alertEle = document.createElement('div');
    alertEle.classList.add('alert',className)
    alertEle.appendChild(document.createTextNode(message))
    document.querySelector('#alert').appendChild(alertEle)

    setTimeout(()=> alertEle.remove(),2000)
}

async function displaySwiper(){
    const {results} = await fetchDataAPI('movie/now_playing');
    console.log(results);

    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
        </h4>`;
        document.querySelector('.swiper-wrapper').appendChild(div);
    })
    
    initSwiper();
}

function initSwiper(){
    const swiper = new Swiper('.swiper',{
        slidesPerView : 1,
        spaceBetween: 30,
        freeMode : true,
        loop: true,
        autoplay: {
            delay : 400,
            disableOnInteraction : false
        },
        breakpoints :{
            500 : {
                slidesPerView: 1
            },
            700 : {
                slidesPerView: 2
            },
            1200 : {
                slidesPerView: 4
            }
        }
    })
}

//spinners handling
function showSpinner(){
    document.querySelector('.spinner').classList.add('show')
}

function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show')
}

function displayBackgroundPoster(type,backgroundPath){
    overlayDiv = document.createElement('div');
    console.log(backgroundPath);
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if(type === 'movie'){
        document.querySelector(`#movie-details`).appendChild(overlayDiv)
    }else{
        document.querySelector(`#show-details`).appendChild(overlayDiv)
    }

}


// MAIN INIT FUNC
function init(){
    //to check what is current page
    switch(global.currentPage){
        case '/':
        case '/index.html':
            console.log('Home');
            displaySwiper();
            displayPopularMovies();
            break;
        case '/shows.html':
        case '/shows':
            console.log('Shows');
            displayPopularShows();
            break;
        case '/movie-details.html':
            console.log('Movie Details Page');
            displayMovieDetails();
            break;
        case '/tv-details.html':
            console.log('TV Details Page');
            displayShowDetails();
            break;
        case '/search.html':
            console.log('Search');
            search();
            break;
        default:
            console.log('Unknown Page');
    }
    highlightActiveLink()

}
document.addEventListener('DOMContentLoaded',init) 