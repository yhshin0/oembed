document.getElementById('url').addEventListener('keyup', (evt) => {
  if (evt.key === 'Enter') {
    fetchOembedData();
  }
});

document.getElementById('submit-btn').addEventListener('click', () => {
  fetchOembedData();
});

const fetchOembedData = () => {
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
        let value = response[key];
        if (
          key === 'thumbnail_url' ||
          key === 'thumbnail_url_with_play_button'
        ) {
          value = `<img src='${value}' />`;
        } else if (key.includes('url')) {
          value = `<a href='${value}'>${value}</a>`;
        }
        document
          .querySelector('#result>table>tbody')
          .insertAdjacentHTML(
            'beforeend',
            `<tr><td>${key}</td><td>${value}</td></tr>`,
          );
      }
    })
    .catch((error) => console.log(error));
};
