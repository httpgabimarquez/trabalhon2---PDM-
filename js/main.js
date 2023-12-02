import { openDB } from "idb";

if ('serviceWorker' in navigator){
  window.addEventListener('load', async () => {
      try {
          let reg; 
          reg = await navigator.serviceWorker.register('/sw.js', {type: "module"});

          console.log('Service worker registrada!', reg);
          postNews();
      } catch (err){
          console.log('Service worker de registro falhou:', err);
      }
  });
}

let db;

async function criarDB() {
    try {
        db = await openDB('banco', 2, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                  case 0:
                  case 2:
    const capturedPhotosStore = db.createObjectStore('capturedPhotos', { autoIncrement: true, keyPath: 'id' });
      console.log("Banco de dados de fotos capturadas criado!");
     }
    }
  });
      console.log("Bancos de dados abertos!");
    } catch (e) {
      console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async (event) => {
    criarDB();
    document.getElementById('btnCarregar').addEventListener('click', buscarTodasfotos);
});

async function buscarTodasfotos() {
  if (db == undefined) {
      console.log("O banco de dados está fechado.");
  }
  const tx = await db.transaction('capturedPhotos', 'readonly');
  const store = await tx.objectStore('capturedPhotos');
  const fotos = await store.getAll();
  await tx.done; 
  if (fotos) {
      const divLista = fotos.map(foto => {
          return `<div class="item">
                  <p>Finalidade da imagem ↓</p>
                  <p>${foto.titulo}</p>
                  <img src="${foto.imageData}"/>
              </div>`;
      });
      listagem(divLista.join(' '));
  }
}

async function adicionarcadastro() {
  let titulo = document.getElementById("titulo").value;
    try {
     const tx = await db.transaction('capturedPhotos', 'readwrite')
     const store = tx.objectStore('capturedPhotos');
       await store.add({ titulo: titulo });
       await tx.done;
  console.log('Registro de foto adicionado com sucesso!');
} catch (error) {
    console.error('Erro ao adicionar registro de foto:', error);
    tx.abort();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.error('Erro ao acessar a câmera: ', error);
        });

    captureBtn.addEventListener('click', async function () {
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/png');
        await saveToIndexedDB(imageData);
    });

async function saveToIndexedDB(imageData) {
   try {
      let titulo = document.getElementById("titulo").value;
      const tx = await db.transaction('capturedPhotos', 'readwrite');
      const store = tx.objectStore('capturedPhotos');
      const photoData = { imageData: imageData, timestamp: new Date(), titulo: titulo };
        await store.add(photoData);
        await tx.done;
console.log('Foto capturada e armazenada no IndexedDB com sucesso!');
  } catch (error) {
      console.error('Erro ao armazenar a foto no IndexedDB: ', error);
        }
    }
});
function listagem(text) {
    document.getElementById('resultados').innerHTML = text;
}