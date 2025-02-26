# TypeScript ile Node.js Authentication API Geliştirme: Kapsamlı Rehber

Bu eğitimde, TypeScript, Node.js, Express ve MongoDB kullanarak tam özellikli bir REST API geliştireceğiz. JWT ve Google OAuth kimlik doğrulaması ile birlikte eksiksiz bir Todo yönetim sistemi uygulayacağız. Bu eğitim, güvenli ve ölçeklenebilir API'ler oluşturmak için çeşitli TypeScript özelliklerini ve en iyi uygulamaları kapsayacaktır.

## İçindekiler

1. [Proje Kurulumu](#proje-kurulumu)
2. [TypeScript Temelleri ve Konfigürasyonu](#typescript-temelleri-ve-konfigürasyonu)
3. [Proje Yapısı](#proje-yapısı)
4. [TypeScript ile Temel Özellikler](#typescript-ile-temel-özellikler)
   - [Temel Tipler ve Type Annotations](#temel-tipler)
   - [Fonksiyonlar ve Type Signatures](#fonksiyonlar)
   - [Nesne Tipleri](#nesne-tipleri)
   - [Interfaces](#interfaces)
   - [Classes](#classes)
   - [Generics](#generics)
   - [Type Narrowing](#type-narrowing)
5. [Kimlik Doğrulama Sistemi](#kimlik-doğrulama-sistemi)
6. [Todo Yönetimi](#todo-yönetimi)
7. [API Testi](#api-testi)

## Proje Kurulumu

İlk olarak, projemizi TypeScript ve gerekli bağımlılıklarla kuralım:

```bash
mkdir nodejs-typescript-auth
cd nodejs-typescript-auth
npm init -y
npm install typescript ts-node @types/node --save-dev
```

Gerekli bağımlılıkları yükleyelim:

```bash
npm install express mongoose dotenv jsonwebtoken bcrypt passport passport-google-oauth20 passport-jwt cors
npm install @types/express @types/mongoose @types/jsonwebtoken @types/bcrypt @types/passport @types/passport-google-oauth20 @types/passport-jwt @types/cors --save-dev
```

## TypeScript Temelleri ve Konfigürasyonu

### TypeScript Compiler Konfigürasyonu

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
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Bu yapılandırma dosyası TypeScript derleyicisine projemizin nasıl derleneceğini söyler:
- ```target```: JavaScript çıktı versiyonu
- ```module```: Modül sistemi (CommonJS - Node.js için standart)
- ```outDir```: Derlenmiş JavaScript dosyalarının konumu
- ```strict```: Katı tip kontrolü
- ```esModuleInterop```: ES modülleri ile uyumluluk

## TypeScript ile Temel Özellikler

### Temel Tipler

TypeScript'in temel tiplerini projemizde kullanma örnekleri:

```typescript
// src/types/basic.ts
const port: number = 3000;
const apiVersion: string = 'v1';
const isProduction: boolean = process.env.NODE_ENV === 'production';

// Union types örneği
type UserRole = 'user' | 'admin';
const userRole: UserRole = 'user';
```

### Fonksiyonlar

TypeScript ile fonksiyon tanımlamaları ve tip imzaları:

```typescript
// src/services/auth.service.ts
async function verifyPassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Arrow function ile tip tanımı
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};
```

### Nesne Tipleri

Nesne tiplerini tanımlama ve kullanma:

```typescript
// src/types/config.ts
type DatabaseConfig = {
  uri: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
};

const dbConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI!,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
```

### Interfaces

Interface kullanımı ve inheritance örnekleri:

```typescript
// src/interfaces/user.interface.ts
interface IBaseUser {
  email: string;
  name: string;
}

interface IUser extends IBaseUser {
  password?: string;
  googleId?: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Todo interface örneği
interface ITodo {
  title: string;
  description?: string;
  completed: boolean;
  user: string;
}
```

### Classes

TypeScript sınıfları ve inheritance:

```typescript
// src/services/base.service.ts
abstract class BaseService<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }
}

// Todo service örneği
class TodoService extends BaseService<ITodo> {
  async createTodo(todoData: ICreateTodo, userId: string): Promise<ITodo> {
    return this.model.create({ ...todoData, user: userId });
  }
}
```

### Generics

Generic tiplerin kullanımı:

```typescript
// src/utils/response.ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

function createResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): ApiResponse<T> {
  return { success, message, data, error };
}
```

### Type Narrowing

Type narrowing örnekleri:

```typescript
// src/utils/error-handler.ts
function handleError(error: unknown): ApiResponse<null> {
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

JWT kimlik doğrulama implementasyonu:

```typescript
// src/services/auth.service.ts
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

Todo servisi implementasyonu:

```typescript
// src/services/todo.service.ts
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

## API Testi

API endpoint'lerini test etmek için örnek istekler:

### Kullanıcı Kaydı

```bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Kullanıcı Girişi

```bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Todo Oluşturma

```bash
curl -X POST http://localhost:3000/api/todos \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "title": "Yeni Todo",
    "description": "Todo açıklaması"
  }'
```

Bu eğitim, TypeScript'in temel özelliklerini gerçek bir projede nasıl kullanabileceğinizi göstermektedir. Her bir bölüm, TypeScript'in güçlü tip sistemi ve nesne yönelimli programlama özelliklerini kullanarak güvenli ve ölçeklenebilir bir API geliştirmenin farklı yönlerini ele almaktadır. 