const { OpenAI } = require('openai');

// OpenAI yapılandırması: API anahtarınızı buraya ekleyin.

const openai = new OpenAI({
  apiKey: 'your-api-key',
});

// Otonom ajan fonksiyonu
async function autonomousAgent() {
  console.log('Ajan çalışmaya başladı...');

  // 1. Adım: Sensör verisini simüle et (örneğin, rastgele bir sayı)
  const sensorData = Math.random() * 100;
  console.log('Sensör verisi:', sensorData);

  // 2. Adım: Sensör verisine dayalı karar vermek için OpenAI'ya prompt gönder
  const prompt = `Sensör verisi: ${sensorData}. Eğer veri 50'den büyükse "Alarm", 50 veya daha düşükse "Normal" sonucunu tek kelime olarak ver.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0.3,
    });

    const decision = response.choices[0].message.content.trim();
    console.log('Ajan Kararı:', decision);

    // 3. Adım: OpenAI'dan gelen karara göre hareket et
    if (decision === 'Alarm') {
      console.log('Alarm durumu tespit edildi, gerekli işlemleri başlatıyor...');
      // Burada alarmı tetiklemek veya bildirim göndermek gibi işlemler yapılabilir.
    } else if (decision === 'Normal') {
      console.log('Durum normal, bekleme modunda...');
      // Normal durumda yapılacak başka işlemler eklenebilir.
    } else {
      console.log('Bilinmeyen karar, tekrar kontrol ediliyor...');
      // Beklenmeyen durumlarda hata yönetimi yapılabilir.
    }
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}

// Ajanı her 30 saniyede bir otomatik olarak çalıştır.
setInterval(autonomousAgent, 10000);

// Program başladığında hemen bir kere çalıştır.
autonomousAgent();
