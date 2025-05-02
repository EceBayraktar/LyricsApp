// Şarkı sözlerini API'den çek
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
          saveToHistory(artist, song);
        } else {
          lyricsElement.innerText = "Şarkı sözleri bulunamadı. Başka bir şarkı deneyin.";
        }
        lyricsElement.style.display = "block";
        document.getElementById('container').classList.add('top-align');
      })
      .catch(error => {
        console.error('Şarkı sözleri getirilirken hata oluştu:', error);
        const lyricsElement = document.getElementById('lyrics');
        lyricsElement.innerText = "Şarkı sözleri alınırken hata oluştu.";
        lyricsElement.style.display = "block";
        document.getElementById('container').classList.add('top-align');
      });
  }
  
  // Enter tuşu ile arama
  document.getElementById('artist').addEventListener('keydown', function(event) {
    if (event.key === "Enter") getLyrics();
  });
  document.getElementById('song').addEventListener('keydown', function(event) {
    if (event.key === "Enter") getLyrics();
  });
  
  // Uyarı kutusu
  function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerText = message;
    alertBox.style.display = "block";
  }
  
  function closeAlert() {
    document.getElementById('alertBox').style.display = "none";
  }
  
  // Geçmişe kaydet
  function saveToHistory(artist, song) {
    if (!artist.trim() || !song.trim()) return;
  
    const history = JSON.parse(localStorage.getItem("lyricsHistory")) || [];
    const entry = { artist, song };
  
    if (!history.some(item => item.artist === artist && item.song === song)) {
      history.unshift(entry);
      if (history.length > 10) history.pop(); // sadece son 10 giriş
      localStorage.setItem("lyricsHistory", JSON.stringify(history));
    }
  
    displayHistory();
    updateAutocompleteSuggestions();
  }
  
  // Geçmişi göster
  function displayHistory() {
    const history = JSON.parse(localStorage.getItem("lyricsHistory")) || [];
    const list = document.getElementById("history");
    const historyContainer = document.getElementById("historyContainer");
  
    list.innerHTML = "";
  
    if (history.length === 0) {
      historyContainer.style.display = "none";
      return;
    }
  
    historyContainer.style.display = "block";
  
    history.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.artist} - ${item.song}`;
      li.style.cursor = "pointer";
      li.style.marginBottom = "5px";
      li.onclick = () => {
        document.getElementById("artist").value = item.artist;
        document.getElementById("song").value = item.song;
        getLyrics();
      };
      list.appendChild(li);
    });
  }
  
  // Otomatik tamamlama listelerini güncelle
  function updateAutocompleteSuggestions() {
    const history = JSON.parse(localStorage.getItem("lyricsHistory")) || [];
  
    // Sanatçı listesi
    const artistSet = new Set(history.map(entry => entry.artist));
    const artistSuggestions = document.getElementById("artistSuggestions");
    artistSuggestions.innerHTML = "";
    artistSet.forEach(artist => {
      const option = document.createElement("option");
      option.value = artist;
      artistSuggestions.appendChild(option);
    });
  
    // Şarkı listesi: şu anki sanatçıya göre
    updateSongSuggestionsForArtist();
  }
  
  // Seçili sanatçıya göre şarkı önerilerini filtrele
  function updateSongSuggestionsForArtist() {
    const artist = document.getElementById("artist").value.trim().toLowerCase();
    const history = JSON.parse(localStorage.getItem("lyricsHistory")) || [];
    const songSuggestions = document.getElementById("songSuggestions");
    songSuggestions.innerHTML = "";
  
    if (!artist) return;
  
    const matchedSongs = new Set(
      history
        .filter(entry => entry.artist.toLowerCase() === artist)
        .map(entry => entry.song)
    );
  
    matchedSongs.forEach(song => {
      const option = document.createElement("option");
      option.value = song;
      songSuggestions.appendChild(option);
    });
  }
  
  // Sanatçı her değiştiğinde şarkı listesi güncellensin
  document.getElementById("artist").addEventListener("input", updateSongSuggestionsForArtist);
  
  // Sayfa yüklendiğinde geçmişi ve önerileri yükle
  window.onload = () => {
    displayHistory();
    updateAutocompleteSuggestions();
  };
  