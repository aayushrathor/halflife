const jokes = [
  'Why did the atom break up? Too much potential, not enough reaction.',
  'I told my friend 10 jokes about radioactive decay. He laughed half to death.',
  'What do you call a fish made of two sodium atoms? 2Na.',
  'Why can\'t you trust an atom? They make up everything.',
  'What did the nuclear physicist have for lunch? Fission chips.',
  'Never trust an electron. They\'re always negative.',
  'The optimist sees the glass half full. The pessimist half empty. The physicist sees half-life.',
  'What\'s a geologist\'s favorite kind of music? Bedrock.',
  'Why do chemists like nitrates? They\'re cheaper than day rates.',
  'What did the atom say to the electron? "Stop being so negative."',
  'Why did the proton get promoted? It had a positive attitude.',
  'What do you get when you cross a joke with a radioactive isotope? A laughing matter that\'s half gone.',
  'I have a radioactive cat. Its half-life is 18 of 9.',
  'Why are chemists so good at solving problems? They have all the solutions.',
  'Uranium-238 walks into a bar. Bartender says "We don\'t serve heavier elements here." Uranium-238 says "That\'s OK, I\'ll just decay into lead and come back later."',
];

/** Display a random atomic joke in the joke card @returns {void} */
function showRandomJoke() {
  const el = document.getElementById('jokeText');
  if (!el) return;
  el.textContent = jokes[Math.floor(Math.random() * jokes.length)];
}

/** Initialize the joke card with a random joke and click-to-next behavior @returns {void} */
function initJokes() {
  const container = document.getElementById('jokeCard');
  if (!container) return;
  showRandomJoke();
  container.addEventListener('click', function () {
    showRandomJoke();
    container.classList.remove('joke-pop');
    void container.offsetWidth;
    container.classList.add('joke-pop');
  });
}
