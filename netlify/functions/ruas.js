exports.handler = async function () {
  const query = '[out:json][timeout:25];area["name"="Codó"]["boundary"="administrative"]->.codo;(way(area.codo)["highway"]["name"];);out tags;';
  const servers = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter'
  ];

  let lastError = 'Servidores de mapas indisponíveis.';
  for (const server of servers) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(server, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: 'data=' + encodeURIComponent(query),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Overpass respondeu com HTTP ' + response.status);
