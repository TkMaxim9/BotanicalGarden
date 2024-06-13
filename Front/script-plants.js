document.addEventListener('DOMContentLoaded', () => {
  let currentUserRole = null;
  const addPlantForm = document.getElementById('addPlantForm');

  async function checkAuthPlants() {
    try {
      const userResponse = await fetch('/api/auth/current_user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        currentUserRole = userData.Role;
      } else {
        window.location.href = '/login.html';
      }
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      window.location.href = '/login.html';
    }

    if (currentUserRole !== 'admin'){
      addPlantForm.style.display = 'none';
    }
  }

  checkAuthPlants();

  const plantsList = document.getElementById('plantsList');
  const logoutButtonPlants = document.getElementById('logout');
  const error = document.getElementById('error');

  logoutButtonPlants.addEventListener('click', async (e) => {
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

  addPlantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentUserRole !== "admin"){
      error.textContent = "Недостаточый доступ";
      return;
    }

    const formData = new FormData(addPlantForm);
    const data = Object.fromEntries(formData.entries());

    fetch('/api/plants', {
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
        loadPlants();
      })
      .catch(error => console.error('Error:', error));

    addPlantForm.reset();
  })

  function loadPlants() {
    fetch('/api/plants')
      .then(response => response.json())
      .then(data => {
        plantsList.innerHTML = '';
        data.forEach(plant => {
          const plantItem = document.createElement('div');
          plantItem.innerHTML = `
            <h2>${plant.Name}</h2>
            <p><strong>Семейство:</strong> ${plant.Family}</p>
            <p><strong>Происхождение:</strong> ${plant.Origin}</p>
            <p><strong>Описание:</strong> ${plant.Description}</p>
        `;

          if (currentUserRole === "admin"){
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Удалить";
            deleteButton.classList.add('del-button');
            deleteButton.addEventListener('click', () => {
              deletePlant(plant.PlantID);
            })
            plantItem.appendChild(deleteButton);
          }

          plantsList.appendChild(plantItem);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  function deletePlant(plantId) {
    fetch(`/api/plants/${plantId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Plant deleted:', data);
        // Перезагрузка списка секций и растений после удаления
        loadPlants();
      })
      .catch(error => console.error('Error:', error));
  }

  loadPlants();
})

