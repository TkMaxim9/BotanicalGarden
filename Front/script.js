document.addEventListener('DOMContentLoaded', () => {
  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/current_user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.status !== 200) {
        window.location.href = '/login.html'; // Перенаправление на страницу входа, если пользователь не авторизован
      }
    } catch (error) {
      console.error('Ошибка при проверке авторизации:', error);
      window.location.href = '/login.html'; // Перенаправление на страницу входа в случае ошибки
    }
  }

  checkAuth();

  const plantsListElement = document.getElementById('plants-list');
  const plantDetailsElement = document.getElementById('plant-details');
  const plantSelector = document.getElementById('plantName');
  const sectionSelector = document.getElementById('sectionName');
  const addBlockForm = document.getElementById('addForm');
  const searchBlock = document.getElementById('searchedItems');
  const searchForm = document.getElementById('searchForm');
  const searchTextInput = document.getElementById('searchText');
  const cancelSearchButton = document.getElementById('cancelSearchButton');
  const logoutButtonMain = document.getElementById('logout');

  logoutButtonMain.addEventListener('click', async (e) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        window.location.href = '/login.html'; // Перенаправление на страницу входа после выхода
      } else {
        const message = await response.text();
        alert('Ошибка при выходе из аккаунта: ' + message);
      }
    } catch (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
      alert('Ошибка при выходе из аккаунта');
    }
  })

  let plantSections = []
  let plants = []
  let sections = []

// Функция для загрузки данных о растениях с сервера
  function loadPlantsSections() {
    fetch('/api/plantsections')
      .then(response => response.json())
      .then(data => {
        plantSections = data;
        console.log(plantSections);
        plantsListElement.innerHTML = '';
        data.forEach(plant => {
          const dateObject = new Date(plant.DatePlanted);
          const formattedDate = dateObject.toLocaleDateString();
          const plantItem = document.createElement('div');
          plantItem.classList.add('plant-item');
          plantItem.textContent = plant.Name + " (" + plant.SectionName + ", " + formattedDate + ")";
          plantItem.addEventListener('click', () => showPlantSectionDetails(plant));
          plantsListElement.appendChild(plantItem);
        });
      })
      .catch(error => console.error('Error:', error));
  }

// Функция для отображения деталей растения
  function showPlantSectionDetails(plant) {
    const dateObject = new Date(plant.DatePlanted);
    const formattedDate = dateObject.toLocaleDateString();
    plantDetailsElement.innerHTML = `
            <h2>${plant.Name}</h2>
            <p><strong>Секция:</strong> ${plant.SectionName}</p>
            <p><strong>Семейство:</strong> ${plant.Family}</p>
            <p><strong>Описание:</strong> ${plant.Description}</p>
            <p><strong>Дата посадки:</strong> ${formattedDate}</p>
        `;
    const delButton = document.createElement('button');
    delButton.textContent = "Удалить";
    delButton.addEventListener('click', () => deletePlantSection(plant.PlantSectionID));
    plantDetailsElement.appendChild(delButton);
  }

  function deletePlantSection(plantSectionId) {
    fetch(`/api/plantsections/${plantSectionId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Section deleted:', data);
        // Перезагрузка списка секций и растений после удаления
        loadPlantsSections();
        plantDetailsElement.innerHTML = ``;
      })
      .catch(error => console.error('Error:', error));
  }

  function loadPlants() {
    fetch('/api/plants')
      .then(response => response.json())
      .then(data => {
        plants = data;
        plantSelector.innerHTML = '';
        data.forEach(plant => {
          const plantItem = document.createElement('option');
          plantItem.textContent = plant.Name;
          plantItem.value = plant.PlantID;
          plantSelector.appendChild(plantItem);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  function loadSections() {
    fetch('/api/sections')
      .then(response => response.json())
      .then(data => {
        sections = data;
        sectionSelector.innerHTML = '';
        data.forEach(section => {
          const sectionItem = document.createElement('option');
          sectionItem.textContent = section.SectionName;
          sectionItem.value = section.SectionID;
          sectionSelector.appendChild(sectionItem);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  addBlockForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(addBlockForm);
    const data = Object.fromEntries(formData.entries());
    console.log(data)

    fetch('/api/plantsections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('New plant section added:', data);
        // Перезагрузка списка секций и растений после добавления
        loadPlantsSections();
      })
      .catch(error => console.error('Error:', error));

      
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = searchTextInput.value;
    console.log(data);
    console.log(plantSections);

    search(data);
  })

  cancelSearchButton.addEventListener('click', (event) => {
    searchBlock.innerHTML = '';
  })

  function search(searchText) {
    searchBlock.innerHTML = '';
    plantSections.forEach(plant => {
      if (plant.SectionName.toLowerCase().includes(searchText.toLowerCase()) || plant.Name.toLowerCase().includes(searchText.toLowerCase())){
        console.log("sdsd");
        const dateObject = new Date(plant.DatePlanted);
        const formattedDate = dateObject.toLocaleDateString();
        const plantItem = document.createElement('div');
        plantItem.classList.add('plant-item');
        plantItem.textContent = plant.Name + " (" + plant.SectionName + ", " + formattedDate + ")";
        searchBlock.appendChild(plantItem);
      }

    })
  }

// Загрузка данных при загрузке страницы
  loadPlantsSections();
  loadPlants();
  loadSections();
})




