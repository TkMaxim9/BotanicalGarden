document.addEventListener('DOMContentLoaded', () => {
  const addSectionForm = document.getElementById('addSectionForm');
  const sectionsList = document.getElementById('sectionsList');
  const sectionName = document.getElementById('sectionName');
  const logoutButtonSec = document.getElementById('logout');

  logoutButtonSec.addEventListener('click', async (e) => {
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

  addSectionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = sectionName.value;

    fetch('/api/sections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        SectionName: data
      })
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
        loadSections();
      })
      .catch(error => console.error('Error:', error));

      sectionName.value = "";
  })

  function loadSections() {
    fetch('/api/sections')
      .then(response => response.json())
      .then(data => {
        sectionsList.innerHTML = '';
        data.forEach(section => {
          const sectionItem = document.createElement('div');
          sectionItem.textContent = section.SectionName;

          const deleteButton = document.createElement('button');
          deleteButton.textContent = "Удалить";
          deleteButton.addEventListener('click', () => {
            deleteSection(section.SectionID);
          })
          sectionItem.appendChild(deleteButton);

          sectionsList.appendChild(sectionItem);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  function deleteSection(sectionId) {
    console.log("sadfaf")
    fetch(`/api/sections/${sectionId}`, {
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
        loadSections();
      })
      .catch(error => console.error('Error:', error));
  }

  loadSections();
})

