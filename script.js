function getLyrics() {
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();
    
    if (!artist || !song) {
      alert("Please enter both artist and song title.");
      return;
    }
  
    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      .then(response => response.json())
      .then(data => {
        if (data.lyrics) {
          document.getElementById('lyrics').innerText = data.lyrics;
        } else {
          document.getElementById('lyrics').innerText = "Lyrics not found. Try another song.";
        }
      })
      .catch(error => {
        console.error('Error fetching lyrics:', error);
        document.getElementById('lyrics').innerText = "Error fetching lyrics.";
      });
  }
  