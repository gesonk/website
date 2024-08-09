document.getElementById('button1').addEventListener( "click",() => {
    const studentNumber = document.querySelector('#000924782').value;

    fetch(`https://csunix.mohawkcollege.ca/~adams/10259/a5_responder.php?studentNumber=${studentNumber}`)
       .then(response => response.text())
       .then(data => {
            document.getElementById('responseHeader').innerText = data;
            document.getElementById('responseHeader').style.textAlign = 'center';
        })
       .catch(error => console.error('Error:', error));
});
button2.addEventListener('click', () => {
  const choice = document.querySelector('#options').value;
  if (choice === 'mario' || choice === 'starwars') {
    fetch(`https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php?choice=${choice}`)
      .then(response => response.json())
      .then(data => {
       
        while (output.firstChild) {
          output.removeChild(output.firstChild);
        }

        data.forEach(item => {
          const container = document.createElement('div');
          container.classList.add('item-container');

          const heading = document.createElement('h2');
          heading.textContent = item.series;

          const image = document.createElement('img');
          image.src = item.url;
          image.alt = item.name;
          image.classList.add('item-image');

          const paragraph = document.createElement('p');
          paragraph.textContent = item.name;

          container.appendChild(heading);
          container.appendChild(image);
          container.appendChild(paragraph);

          output.appendChild(container);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    alert('Invalid input. Please select either "Mario" or "Star Wars".');
  }
});

 button3.addEventListener('click', () => {
  const choice = document.querySelector('#options').value; // Retrieve selected option
  if (choice === 'mario' || choice === 'starwars') {
    fetch(`https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `choice=${choice}`
    })
      .then(response => response.json())
      .then(data => {
        // Clear previous table content
        while (table.firstChild) {
          table.removeChild(table.firstChild);
        }

        const headerRow = document.createElement('tr');
        const nameHeader = document.createElement('th');
        nameHeader.textContent = 'Name';
        const urlHeader = document.createElement('th');
        urlHeader.textContent = 'URL';
        const seriesHeader = document.createElement('th');
        seriesHeader.textContent = 'Series';
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(urlHeader);
        headerRow.appendChild(seriesHeader);
        table.appendChild(headerRow);

        data.forEach(item => {
          const row = document.createElement('tr');

          const nameCell = document.createElement('td');
          nameCell.textContent = item.name;
          row.appendChild(nameCell);

          const urlCell = document.createElement('td');
          const urlLink = document.createElement('a');
          urlLink.href = item.url;
          urlLink.textContent = item.url;
          urlLink.target = '_blank'; // Open link in new tab
          urlCell.appendChild(urlLink);
          row.appendChild(urlCell);

          const seriesCell = document.createElement('td');
          seriesCell.textContent = item.series;
          row.appendChild(seriesCell);

          table.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    alert('Invalid input. Please select either "Mario" or "Star Wars".');
  }
});
