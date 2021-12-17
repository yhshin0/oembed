document.getElementById('submit-btn').addEventListener('click', () => {
  fetch('/oembed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: document.getElementById('url').value }),
  })
    .then((res) => res.json())
    .then((response) => {
      document.getElementById('result').innerHTML =
        '<table><tbody></tbody></table>';
      for (const key of Object.keys(response)) {
        document
          .querySelector('#result>table>tbody')
          .insertAdjacentHTML(
            'beforeend',
            `<tr><td>${key}</td><td>${response[key]}</td></tr>`,
          );
      }
    })
    .catch((error) => console.log(error));
});
