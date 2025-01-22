import React, { useState } from 'react'

const App = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [moviesDetails, setMoviesDetails] = useState({});
  const submitHandler = e => {
    e.preventDefault();

    fetch(`https://www.omdbapi.com/?s=${search}&apikey=7830a93b`)
      .then((response) => response.json())
      .then((value) => {
        if (value.Search) {
          setData(value.Search);

          value.Search.forEach((movie) => {
            fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=7830a93b`)
              .then((response) => response.json())
              .then((details) => {
                setMoviesDetails((prevDetails) => ({
                  ...prevDetails,
                  [movie.imdbID]: details, // Store details using imdbID as the key
                }));
              });
          });
        }
      });
  };
  const download = url => {
    fetch(url).then(response => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.png");
        document.body.appendChild(link);
        link.click();
      });
    })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <div>
      <center>
        <h1>Movies Search Site</h1>
        <form onSubmit={submitHandler}>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} /><br /><br />
          <input type="submit" value="Search"  className="btn btn-primary"/>
        </form>
        <div className="row" >
          {data.length >= 1
            ? data.map((movie) => {
              const details = moviesDetails[movie.imdbID]; // Get detailed info for the movie
              return (
                <div className="col-md-4" key={movie.imdbID}>
                  <div className="card" style={{ width: '18rem' }}>
                    <img
                      src={movie.Poster}
                      className="card-img-top"
                      alt={movie.Title}
                    />
                    <div className="card-body">
                      <h4 className="card-title">{movie.Title}</h4>
                      <p className="card-Year">
                        <strong>Year:</strong> {movie.Year}
                      </p>
                      {details && (
                        <>
                          <p className="card-Plot">
                            <strong>Plot:</strong> {details.Plot}
                          </p>
                          <p className="card-Genre">
                            <strong>Genre:</strong> {details.Genre}
                          </p>
                        </>
                      )}
                      <a
                        className="btn btn-primary"
                        onClick={() => download(movie.Poster)}
                      >
                        Download Poster
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
            : null}
        </div>
      </center>
    </div>
  );
};

export default App
