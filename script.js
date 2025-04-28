function getLyrics() {
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();
    
    if (!artist || !song) {
      alert("Lütfen hem sanatçı hem de şarkı ismini girin.");
      return;
    }

    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      .then(response => response.json())
      .then(data => {
        if (data.lyrics) {
          document.getElementById('lyrics').innerText = data.lyrics;
        } else {
          document.getElementById('lyrics').innerText = "Şarkı sözleri bulunamadı. Başka bir şarkı deneyin.";
        }
      })
      .catch(error => {
        console.error('Şarkı sözleri getirilirken hata oluştu:', error);
        document.getElementById('lyrics').innerText = "Şarkı sözleri alınırken hata oluştu.";
      });
}

// Kullanıcı Enter tuşuna basarsa da şarkı sözünü getir
document.getElementById('artist').addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    getLyrics();
  }
});

document.getElementById('song').addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    getLyrics();
  }
});
