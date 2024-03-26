// main.js

const baseURL = 'http://localhost:3000/api/search';

async function searchMovies() {
  const query = document.getElementById('searchInput').value;

  try {
    const response = await fetch(`${baseURL}?query=${query}`);
    const data = await response.json();
    
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';

    if (data.Search) {
      data.Search.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.innerHTML = `
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
          <button onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
        `;
        moviesList.appendChild(movieElement);
      });
    } else {
      moviesList.innerHTML = '<p>No movies found.</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function addToFavorites(movieId) {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movieId }),
    });
    const data = await response.json();
    if (data.success) {
      alert('Movie added to favorites!');
    } else {
      alert('Failed to add movie to favorites.');
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}


async function getFavorites() {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      
      const favoritesList = document.getElementById('favoritesList');
      favoritesList.innerHTML = '';
  
      if (data.length > 0) {
        data.forEach(favorite => {
          const favoriteElement = document.createElement('div');
          favoriteElement.innerHTML = `
            <p>${favorite.movieId}</p>
            <button onclick="removeFromFavorites('${favorite.id}')">Remove</button>
          `;
          favoritesList.appendChild(favoriteElement);
        });
      } else {
        favoritesList.innerHTML = '<p>No favorites added yet.</p>';
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
  
  async function removeFromFavorites(id) {
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('Removed from favorites!');
        getFavorites(); // Refresh favorites list
      } else {
        alert('Failed to remove from favorites.');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }
  
  // Add an event listener to call getFavorites when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    getFavorites();
  });
  