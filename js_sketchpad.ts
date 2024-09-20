async function getWeatherData(location) {
    const apiEndpoints = [
      // Geolocation-based weather API (primary method)
      'https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid=YOUR_API_KEY',
      
      // IP-based weather API (fallback 1)
      'https://ipapi.co/{ip}/json/',
      
      // City-based weather API (fallback 2)
      `https://api.openweathermap.org/data/2.5/weather?q={city}&appid=YOUR_API_KEY`
    ];
  
    try {
      const response = await Promise.all(apiEndpoints.map(endpoint => fetch(endpoint.replace('{latitude}', location.latitude).replace('{longitude}', 
  location.longitude).replace('{ip}', location.ip).replace('{city}', location.city))));
      
      const data = await Promise.all(response.map(d => d.json()));
      
      // Handle different types of weather data
      if (data[0].status === 200) {
        return data[0];
      } else if (data[1] && data[1].city) {
        return data[1];
      } else {
        throw new Error(`Failed to fetch weather data for ${location.city}.`);
      }
      
    } catch (error) {
      console.error(error);
      // Display error message to user
      alert('Error fetching weather data. Please try again later.');
      return null;
    }
  }
  

  getWeatherData({ latitude: 37.7749, longitude: -122.4194 })
  .then(data => console.log(data))
  .catch(error => console.error(error));