/* All editorial country data lives here: no local fetch or build step.
 * Population: rounded 2024 World Bank estimates. Area: total surface area.
 * Time-zone descriptions distinguish daylight saving and outlying regions.
 * Links in each field guide let visitors explore the underlying sources.
 */
window.COUNTRIES = {
  COL: {
    name: 'Colombia', localName: 'Colombia', flag: '🇨🇴', region: 'South America',
    greeting: '¡Hola, Colombia!', hello: 'Hola', pronunciation: 'OH-lah', languageCode: 'es-CO',
    description: 'A warm hello from the land of a thousand rhythms.',
    colors: ['#FCD116', '#003893', '#CE1126'], accent: '#FCD116',
    lat: 4.5, lng: -73, altitude: 0.66, capital: 'Bogotá', capitalLat: 4.711, capitalLng: -74.0721, timeZone: 'America/Bogota',
    population: '52.9 million', populationYear: 2024, languages: 'Spanish; ethnic languages official in their territories', currency: 'Colombian peso · COP', zones: 'UTC−5 · no daylight saving', area: '1,141,748 km²',
    facts: [
      ['🦜', 'A paradise for bird lovers', 'Colombia has more recorded bird species than any other country on Earth. Its mountains, rainforests and coastlines create an extraordinary variety of habitats.'],
      ['☕', 'Coffee with a world heritage', 'The Coffee Cultural Landscape of Colombia became a UNESCO World Heritage Site in 2011, celebrating generations of coffee-growing traditions.'],
      ['🌊', 'Two coasts, one country', 'Colombia is the only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea.'],
      ['🌴', 'Palms that touch the sky', 'The Quindío wax palm, Colombia’s national tree, can grow to around 60 metres tall. The Cocora Valley is a famous place to see it.'],
      ['📖', 'A home of magical realism', 'Colombian author Gabriel García Márquez, who wrote One Hundred Years of Solitude, received the Nobel Prize in Literature in 1982.']
    ],
    sources: [['Colombia Travel', 'https://colombia.travel/en/nature-and-adventure'], ['UNESCO', 'https://whc.unesco.org/en/list/1121/'], ['Nobel Prize', 'https://www.nobelprize.org/prizes/literature/1982/summary/']]
  },
  USA: {
    name: 'United States', shortName: 'USA', localName: 'United States', flag: '🇺🇸', region: 'North America',
    greeting: 'Hello, USA!', hello: 'Hello', pronunciation: 'heh-LOH', languageCode: 'en-US',
    description: 'Big landscapes. Bigger possibilities. One simple hello.',
    colors: ['#0A3161', '#B31942', '#FFFFFF'], accent: '#B9D5FF',
    lat: 38, lng: -98, altitude: 1.05, capital: 'Washington, D.C.', capitalLat: 38.9072, capitalLng: -77.0369, timeZone: 'America/New_York',
    population: '340.1 million', populationYear: 2024, languages: 'English · federal official language since 2025', currency: 'US dollar · USD', zones: '50 states: UTC−10 to −5; daylight saving in most. Territories also use UTC−11, −4 and +10.', area: '9,833,517 km²',
    facts: [
      ['🏞️', 'Where national parks began', 'Established in 1872, Yellowstone is widely recognized as the world’s first national park. It stretches across Wyoming, Montana and Idaho.'],
      ['🌕', 'One giant leap', 'In July 1969, NASA’s Apollo 11 mission landed the first humans on the Moon: Neil Armstrong and Buzz Aldrin.'],
      ['🏔️', 'Alaska is on another scale', 'Alaska is the largest US state by area—more than twice the size of Texas. It is also home to Denali, North America’s highest peak.'],
      ['🗽', 'A gift across the Atlantic', 'The Statue of Liberty was a gift from France to the United States. It was dedicated in New York Harbor in 1886.'],
      ['🏜️', 'A canyon carved through time', 'The Grand Canyon stretches about 277 river miles (446 kilometres). Its exposed rock layers reveal a remarkable record of Earth’s history.']
    ],
    sources: [['National Park Service', 'https://www.nps.gov/yell/learn/historyculture/index.htm'], ['NASA · Apollo 11', 'https://www.nasa.gov/mission/apollo-11/'], ['Statue of Liberty', 'https://www.nps.gov/stli/learn/historyculture/index.htm']]
  },
  ARG: {
    name: 'Argentina', localName: 'Argentina', flag: '🇦🇷', region: 'South America',
    greeting: '¡Hola, Argentina!', hello: 'Hola', pronunciation: 'OH-lah', languageCode: 'es-AR',
    description: 'From the rhythm of tango to the edge of Patagonia.',
    colors: ['#74ACDF', '#FFFFFF', '#F6B40E'], accent: '#91C9FA',
    lat: -35.5, lng: -64, altitude: 0.87, capital: 'Buenos Aires', capitalLat: -34.6037, capitalLng: -58.3816, timeZone: 'America/Argentina/Buenos_Aires',
    population: '45.7 million', populationYear: 2024, languages: 'Spanish · de facto national language; some regional co-official languages', currency: 'Argentine peso · ARS', zones: 'UTC−3 · no daylight saving', area: '2,780,400 km²',
    facts: [
      ['💃', 'It takes two countries to tango', 'Tango grew in the Río de la Plata communities of Buenos Aires and Montevideo. Argentina and Uruguay share its UNESCO intangible heritage recognition.'],
      ['⛰️', 'The roof of the Americas', 'At about 6,961 metres, Aconcagua is the highest mountain outside Asia. It rises in the Andes in the province of Mendoza.'],
      ['🧉', 'A ritual worth sharing', 'Mate is an infusion of yerba mate leaves, traditionally sipped through a metal straw called a bombilla. Sharing it is an everyday social ritual.'],
      ['💦', 'A waterfall, multiplied', 'Iguazú Falls, on the border with Brazil, is a vast system of about 275 waterfalls, with the exact count varying with water levels.'],
      ['🧊', 'A glacier you can hear', 'In Los Glaciares National Park, large pieces of the Perito Moreno Glacier break into Lake Argentino with a thunderous sound.']
    ],
    sources: [['Visit Argentina', 'https://www.argentina.travel/en/about-argentina'], ['UNESCO · Tango', 'https://ich.unesco.org/en/RL/tango-00258'], ['Los Glaciares', 'https://whc.unesco.org/en/list/145/']]
  },
  ESP: {
    name: 'Spain', localName: 'España', flag: '🇪🇸', region: 'Europe',
    greeting: '¡Hola, España!', hello: 'Hola', pronunciation: 'OH-lah', languageCode: 'es-ES',
    description: 'A little sunshine. A little sobremesa. A lot to discover.',
    colors: ['#AA151B', '#F1BF00', '#AA151B'], accent: '#F1BF00',
    lat: 40.1, lng: -3.7, altitude: 0.4, capital: 'Madrid', capitalLat: 40.4168, capitalLng: -3.7038, timeZone: 'Europe/Madrid',
    population: '48.8 million', populationYear: 2024, languages: 'Spanish; Catalan/Valencian, Galician, Basque and Aranese co-official in their regions', currency: 'Euro · EUR', zones: 'Mainland & Balearics: UTC+1 (+2 summer). Canary Islands: UTC+0 (+1 summer).', area: '505,990 km²',
    facts: [
      ['💃', 'Flamenco is more than dance', 'Flamenco brings together singing, dancing and instrumental music, especially guitar. It was inscribed on UNESCO’s intangible cultural heritage list in 2010.'],
      ['🫒', 'A landscape of olive groves', 'Spain is the world’s largest producer of olive oil, with much of its production concentrated in Andalusia.'],
      ['🎨', 'A remarkable artistic legacy', 'Pablo Picasso was born in Málaga, Salvador Dalí in Figueres and Joan Miró in Barcelona. Their art helped reshape the twentieth century.'],
      ['🥘', 'Paella’s Valencian roots', 'Paella originated in the Valencia region. Traditional Valencian paella commonly includes rice, rabbit, chicken and beans.'],
      ['🌋', 'Spain’s highest peak is on an island', 'Mount Teide, a volcano on Tenerife in the Canary Islands, is Spain’s highest peak at about 3,715 metres.']
    ],
    sources: [['Spain Tourism', 'https://www.spain.info/en/'], ['UNESCO · Flamenco', 'https://ich.unesco.org/en/RL/flamenco-00363'], ['Teide National Park', 'https://whc.unesco.org/en/list/1258/']]
  },
  DEU: {
    name: 'Germany', localName: 'Deutschland', flag: '🇩🇪', region: 'Europe',
    greeting: 'Hallo, Deutschland!', hello: 'Hallo', pronunciation: 'hah-LOH', languageCode: 'de-DE',
    description: 'Fairytale forests meet a wonderfully inventive spirit.',
    colors: ['#000000', '#DD0000', '#FFCC00'], accent: '#FFCC00',
    lat: 51, lng: 10.4, altitude: 0.42, capital: 'Berlin', capitalLat: 52.52, capitalLng: 13.405, timeZone: 'Europe/Berlin',
    population: '83.5 million', populationYear: 2024, languages: 'German; recognized regional and minority languages', currency: 'Euro · EUR', zones: 'UTC+1 · UTC+2 during daylight saving', area: '357,592 km²',
    facts: [
      ['🍞', 'Bread is a culture of its own', 'The German Bread Institute’s register contains more than 3,000 bread specialities. Regional baking traditions are an important part of everyday life.'],
      ['🏰', 'A real-life fairytale castle', 'Bavaria’s Neuschwanstein Castle was commissioned by King Ludwig II in the nineteenth century. Its dramatic setting helped inspire Disney’s Sleeping Beauty Castle.'],
      ['📚', 'A revolution in print', 'Around 1450, Johannes Gutenberg developed a movable-metal-type printing system in Mainz, helping transform the spread of books across Europe.'],
      ['🎼', 'Beethoven’s first home', 'Ludwig van Beethoven was born in Bonn in 1770. His birthplace is now a museum dedicated to his life and music.'],
      ['🌲', 'A forest full of stories', 'The Black Forest in southwest Germany is known for its wooded mountains, cuckoo-clock traditions and namesake cherry cake.']
    ],
    sources: [['Germany Travel', 'https://www.germany.travel/en/experience-enjoy/german-bread-and-baked-goods.html'], ['Neuschwanstein', 'https://www.neuschwanstein.de/englisch/palace/'], ['Beethoven-Haus', 'https://www.beethoven.de/en/']]
  }
};
