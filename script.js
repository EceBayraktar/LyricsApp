function getLyrics() {
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();
    
    if (!artist || !song) {
      showAlert("Lütfen hem sanatçı hem de şarkı ismini girin.");
      return;
    }

    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      .then(response => response.json())
      .then(data => {
        const lyricsElement = document.getElementById('lyrics');
        if (data.lyrics) {
          lyricsElement.innerText = data.lyrics;
        } else {
          lyricsElement.innerText = "Şarkı sözleri bulunamadı. Başka bir şarkı deneyin.";
        }
        lyricsElement.style.display = "block"; // Sözleri göster
        document.getElementById('container').classList.add('top-align'); // Yukarı taşı
      })
      .catch(error => {
        console.error('Şarkı sözleri getirilirken hata oluştu:', error);
        const lyricsElement = document.getElementById('lyrics');
        lyricsElement.innerText = "Şarkı sözleri alınırken hata oluştu.";
        lyricsElement.style.display = "block"; // Hata bile olsa alanı göster
        document.getElementById('container').classList.add('top-align');
      });
}

// Enter tuşu ile de çalıştır
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

// Özel alert kutusunu göster
function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    
    alertMessage.innerText = message;
    alertBox.style.display = "block";
  }
  
  // Özel alert kutusunu kapat
  function closeAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = "none";
  }