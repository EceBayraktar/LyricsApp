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
          saveToHistory(artist, song); // ✅ Başarılıysa geçmişe kaydet
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
  
  // Geçmişe ekle
  function saveToHistory(artist, song) {
    if (!artist.trim() || !song.trim()) {
        return; // ⚠️ Boş ise kaydetme
      }

    const history = JSON.parse(localStorage.getItem("lyricsHistory")) || [];
    const entry = { artist, song };
  
    // Aynı şarkı varsa tekrar ekleme
    if (!history.some(item => item.artist === artist && item.song === song)) {
      history.unshift(entry); // En yeni başta
      if (history.length > 10) history.pop(); // En fazla 10 kayıt tut
      localStorage.setItem("lyricsHistory", JSON.stringify(history));
    }
  
    displayHistory();
  }

  // Geçmişi ekranda göster
  function displayHistory() {
    const history = JSON.parse(localStorage.getItem("lyricsHistory")) || [];
    const list = document.getElementById("history");
    const historyContainer = document.getElementById("historyContainer"); // Bu div tüm geçmiş bölümünü sarmalı

    list.innerHTML = ""; // Öncekileri temizle

    if (history.length === 0) {
        historyContainer.style.display = "none"; // Hiç geçmiş yoksa gizle
        return;
    }

    historyContainer.style.display = "block"; // Geçmiş varsa göster

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

  function updateAutocompleteSuggestions() {
    const history = JSON.parse(localStorage.getItem("lyricsHistory")) || [];
  
    const artistSet = new Set();
    const songSet = new Set();
  
    history.forEach(entry => {
      artistSet.add(entry.artist);
      songSet.add(entry.song);
    });
  
    const artistSuggestions = document.getElementById("artistSuggestions");
    const songSuggestions = document.getElementById("songSuggestions");
  
    artistSuggestions.innerHTML = "";
    songSuggestions.innerHTML = "";
  
    artistSet.forEach(artist => {
      const option = document.createElement("option");
      option.value = artist;
      artistSuggestions.appendChild(option);
    });
  
    songSet.forEach(song => {
      const option = document.createElement("option");
      option.value = song;
      songSuggestions.appendChild(option);
    });
  }
  
  
  // Sayfa yüklendiğinde geçmişi göster
  window.onload = () => {
    displayHistory();
    updateAutocompleteSuggestions();
  };
  