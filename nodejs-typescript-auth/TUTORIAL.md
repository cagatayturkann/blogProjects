# TypeScript ile Node.js Authentication API Geliştirme: Kapsamlı Rehber

## Giriş

Modern web uygulamaları geliştirirken tip güvenliği ve kod kalitesi giderek daha önemli hale geliyor. Bu eğitimde, TypeScript'in sunduğu güçlü özellikleri kullanarak güvenli ve ölçeklenebilir bir REST API nasıl geliştirilir öğreneceğiz. JWT ve Google OAuth kimlik doğrulaması ile birlikte bir Todo yönetim sistemi oluşturacağız.

Bu proje, TypeScript'in teorik kavramlarının gerçek dünya uygulamasını göstermek için ideal bir örnek sunuyor. Her bir TypeScript özelliğinin neden ve nasıl kullanıldığını, JavaScript'e kıyasla ne gibi avantajlar sağladığını göreceğiz.

## İçindekiler

1. [Proje Kurulumu ve TypeScript Konfigürasyonu](#proje-kurulumu)
2. [TypeScript'in Temel Yapı Taşları](#typescript-temelleri)
3. [Tip Sistemi ve Güvenli Kod Yazımı](#tip-sistemi)
4. [Nesne Yönelimli Programlama ile API Tasarımı](#nesne-yönelimli-programlama)
5. [Kimlik Doğrulama Sistemi](#kimlik-doğrulama-sistemi)
6. [Todo Yönetimi ve İş Mantığı](#todo-yönetimi)
7. [API Testi ve Best Practices](#api-testi)

## Proje Kurulumu ve TypeScript Konfigürasyonu

### Temel Kurulum

TypeScript ile bir Node.js projesi başlatmak, JavaScript'e kıyasla birkaç ek adım gerektirir. Bu adımlar bize tip güvenliği ve gelişmiş IDE desteği gibi önemli avantajlar sağlar.

```bash
mkdir nodejs-typescript-auth
cd nodejs-typescript-auth
npm init -y
npm install typescript ts-node @types/node --save-dev
```

### Bağımlılıklar ve Tip Tanımlamaları

TypeScript ile çalışırken, kullandığımız kütüphanelerin tip tanımlamalarını da yüklememiz gerekir. Bu, IDE'nin kod tamamlama özelliklerini kullanmamızı ve olası hataları derleme zamanında yakalamamızı sağlar.

```bash
# Ana bağımlılıklar
npm install express mongoose dotenv jsonwebtoken bcrypt passport passport-google-oauth20 passport-jwt cors

# Tip tanımlamaları
npm install @types/express @types/mongoose @types/jsonwebtoken @types/bcrypt @types/passport @types/passport-google-oauth20 @types/passport-jwt @types/cors --save-dev
```

### TypeScript Compiler Konfigürasyonu

TypeScript derleyicisi, projemizin nasıl derleneceğini belirleyen bir konfigürasyon dosyasına ihtiyaç duyar. Bu dosya, tip kontrolü seviyesi, çıktı formatı ve diğer önemli ayarları içerir.

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Önemli Ayarlar ve Açıklamaları:**
- ```target```: JavaScript çıktı versiyonu (ES2016, modern Node.js sürümleri için uygun)
- ```strict```: Katı tip kontrolünü aktifleştirir (null kontrolü, tip güvenliği)
- ```outDir```: Derlenmiş JavaScript dosyalarının konumu
- ```rootDir```: TypeScript kaynak dosyalarının konumu

## TypeScript'in Temel Yapı Taşları

### Tip Tanımlamaları ve Type Annotations

TypeScript'in en temel özelliği, değişkenlere ve fonksiyon parametrelerine tip atayabilmemizdir. Projemizde bu özelliği sıkça kullanıyoruz:

```typescript
// JavaScript'te:
const port = process.env.PORT || 3000;

// TypeScript'te:
const port: number = Number(process.env.PORT) || 3000;
const apiVersion: string = 'v1';
const isProduction: boolean = process.env.NODE_ENV === 'production';

// Union types ile daha spesifik tip tanımları:
type UserRole = 'user' | 'admin';  // Sadece bu iki değeri alabilir
const userRole: UserRole = 'user';
```

### Fonksiyonlar ve Tip İmzaları

TypeScript ile fonksiyonlarımızın parametre ve dönüş tiplerini net bir şekilde belirtebiliriz. Bu, API'mizin kullanımını daha güvenli ve anlaşılır hale getirir:

```typescript
// JavaScript'te:
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// TypeScript'te:
async function verifyPassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Arrow functions ile tip tanımları:
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};
```

### Nesne Tipleri ve Interface'ler

TypeScript'in en güçlü özelliklerinden biri, karmaşık veri yapılarını interface'ler aracılığıyla tanımlayabilmemizdir. Bu, API'mizin veri modelini net bir şekilde belgelememizi sağlar:

```typescript
// Temel interface tanımı
interface IBaseUser {
  email: string;
  name: string;
}

// Interface inheritance örneği
interface IUser extends IBaseUser {
  password?: string;  // Optional field
  googleId?: string;  // OAuth için optional field
  role: 'user' | 'admin';  // Union type kullanımı
  comparePassword(candidatePassword: string): Promise<boolean>;  // Method tanımı
}

// API response için generic interface
interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

## Nesne Yönelimli Programlama ile API Tasarımı

### Abstract Classes ve Inheritance

TypeScript'in OOP özellikleri, kodumuzun yeniden kullanılabilirliğini artırır ve DRY (Don't Repeat Yourself) prensibini uygulamamızı sağlar:

```typescript
// Base service sınıfı
abstract class BaseService<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }
}

// Inheritance örneği
class TodoService extends BaseService<ITodo> {
  async createTodo(todoData: ICreateTodo, userId: string): Promise<ITodo> {
    return this.model.create({ ...todoData, user: userId });
  }
}
```

### Generics Kullanımı

Generics, tip güvenliğini korurken esnek ve yeniden kullanılabilir kod yazmamızı sağlar:

```typescript
// Generic response creator
function createResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): IApiResponse<T> {
  return { success, message, data, error };
}

// Kullanım örnekleri:
const todoResponse = createResponse(true, 'Todo created', todo);
const errorResponse = createResponse<null>(false, 'Error occurred', null, 'Invalid input');
```

### Type Narrowing ve Güvenli Tip Dönüşümleri

TypeScript'in type narrowing özelliği, runtime'da tip kontrolü yapmamızı ve hataları güvenli bir şekilde yönetmemizi sağlar:

```typescript
function handleError(error: unknown): IApiResponse<null> {
  // Type narrowing ile error tipini belirleme
  if (error instanceof Error) {
    return createResponse(false, 'Error occurred', null, error.message);
  }
  
  if (typeof error === 'string') {
    return createResponse(false, 'Error occurred', null, error);
  }
  
  return createResponse(false, 'Unknown error occurred', null);
}
```

## Kimlik Doğrulama Sistemi

Kimlik doğrulama sistemimiz, TypeScript'in tip güvenliği özelliklerinden tam anlamıyla yararlanır:

```typescript
class AuthService {
  public async login(loginData: IUserLogin): Promise<{ user: IUser; token: string }> {
    const user = await UserModel.findOne({ email: loginData.email });
    if (!user || !(await user.comparePassword(loginData.password))) {
      throw new Error('Geçersiz kimlik bilgileri');
    }
    
    return {
      user,
      token: this.generateToken(user)
    };
  }
}
```

## Todo Yönetimi

Todo servisi, TypeScript'in OOP ve generic özelliklerini kullanarak temiz ve tip güvenli bir API sunar:

```typescript
class TodoService extends BaseService<ITodo> {
  public async getAllTodos(userId: string): Promise<ITodo[]> {
    return this.model.find({ user: userId });
  }

  public async updateTodo(
    todoId: string,
    todoData: Partial<ITodo>,
    userId: string
  ): Promise<ITodo | null> {
    return this.model.findOneAndUpdate(
      { _id: todoId, user: userId },
      todoData,
      { new: true }
    );
  }
}
```

## Best Practices ve Öneriler

1. **Tip Güvenliği**
   - Her zaman mümkün olduğunca spesifik tipler kullanın
   - ```any``` tipinden kaçının
   - Union types ile olası değerleri sınırlayın

2. **Kod Organizasyonu**
   - Interface'leri ayrı dosyalarda tutun
   - Servis katmanını abstract class'lar ile genelleştirin
   - Generic tipleri tekrar kullanılabilir şekilde tasarlayın

3. **Hata Yönetimi**
   - Custom error tipleri tanımlayın
   - Type narrowing ile hata tiplerini doğru şekilde belirleyin
   - Global error handler kullanın

4. **API Tasarımı**
   - Response tiplerini generic interface'ler ile standardize edin
   - Request/Response şemalarını interface'ler ile dokümante edin
   - Middleware'lerde tip güvenliğini koruyun

## Sonuç

Bu projede TypeScript'in sunduğu temel özellikleri gerçek bir uygulama üzerinde inceledik:

- Tip sistemi ile runtime hatalarını minimize ettik
- Interface'ler ile veri yapılarını net bir şekilde tanımladık
- Generic'ler ile yeniden kullanılabilir ve tip güvenli kod yazdık
- OOP prensiplerini TypeScript'in güçlü özellikleriyle uyguladık

TypeScript, JavaScript'in esnekliğini korurken bize tip güvenliği, daha iyi IDE desteği ve daha maintainable kod yazma imkanı sağlıyor. Bu özellikleri doğru kullanmak, projelerimizin kalitesini ve geliştirme sürecinin verimliliğini önemli ölçüde artırıyor. 