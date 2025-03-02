const axios = require('axios');
const { OpenAI } = require('openai');
// API anahtarlarınızı girin
const WEATHER_API_KEY = '<your-openweathermap-api-key>'; // OpenWeatherMap API anahtarınız

// Hava durumu sorgulanacak konum
const LOCATION = 'Istanbul';

// OpenAI yapılandırması
const openai = new OpenAI({
  apiKey: '<your-openai-api-key>',
});

// 1. Adım: Hava Durumu API'sini çağıran fonksiyon
async function getWeatherData(location) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Hava durumu API hatası:', error);
    return null;
  }
}

// 2. Adım: OpenAI API'ye veriyi gönderip analiz yapan fonksiyon
async function analyzeWeather(weatherData) {
  if (!weatherData) return 'Hava durumu verisi alınamadı.';

  // Hava durumu verisine dayalı prompt oluşturma
  const prompt = `Şu an ${weatherData.name}'de hava ${weatherData.weather[0].description} ve sıcaklık ${weatherData.main.temp}°C. Bu hava durumuna göre, gün nasıl geçiyor ve ne tür bir aktivite önerirsiniz? Kısa bir özet ver.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API hatası:', error);
    return 'Hava durumu analiz edilemedi.';
  }
}

// Ana fonksiyon: Araçları sırasıyla çağırır
async function main() {
  console.log('Tool Calling Ajanı başlatılıyor...');

  // Hava durumu verisini almak için aracı çağırma
  const weatherData = await getWeatherData(LOCATION);
  console.log('Alınan Hava Durumu Verisi:', weatherData);

  // OpenAI API'ye veriyi gönderip analiz alıyoruz
  const analysis = await analyzeWeather(weatherData);
  console.log('Analiz Sonucu:', analysis);
}

main();
