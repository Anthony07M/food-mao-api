import { randomUUID } from 'crypto';
import { PrismaService } from '../src/infrastructure/config/prisma/prisma.service';
import { faker } from '@faker-js/faker';
// import { ClientId } from '../src/domain/entities/client/client.entity';

const prisma = new PrismaService();

function generateCPF(): string {
  const randomDigit = () => Math.floor(Math.random() * 10);
  const mod = (base: number[], weights: number[]) =>
    base.reduce((sum, num, idx) => sum + num * weights[idx], 0) % 11;

  const base = Array.from({ length: 9 }, randomDigit);

  const d1 = mod(base, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  base.push(d1 < 2 ? 0 : 11 - d1);

  const d2 = mod(base, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  base.push(d2 < 2 ? 0 : 11 - d2);

  return base.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export const seed = async () => {
  const categories = [
    {
      id: '7aebd329-b303-4d19-9787-db749fc0ce74',
      name: 'Bebidas',
      description: 'Bebidas geladas',
    },
    {
      id: '80ca9b53-3ab7-4f6a-a574-2c814766287c',
      name: 'Sanduiches',
      description: 'Sanduíches artesanais',
    },
    {
      id: '781bc515-39bb-4a3a-8c52-e0b0cda19c0d',
      name: 'Sobremesas',
      description: 'Sobremesas geladas',
    },
    {
      id: '251239ca-06de-40fb-a530-28f378b7ca53',
      name: 'Tapiocas',
      description: 'Tapiocas salgadas',
    },
  ];

  const products = [
    {
      id: 'b619076d-c198-435f-aa6f-7361d752a160',
      name: 'X-caboquinho',
      description: 'x-caboquinho no pão',
      price: 19.2,
      imageUrl: 'http://x-caboquinho.png',
      categoryId: String(categories.at(1)?.id),
    },
    {
      id: '6975ea9c-75c6-4f4e-a79e-9a4aa3741455',
      name: 'Tapioquinha da casa',
      description:
        'Tapioquinha de 30cm acompanha ovo, carne seca, banana e queijo.',
      price: 18.2,
      imageUrl: 'http://tapioquinha.png',
      categoryId: String(categories.at(0)?.id),
    },
    {
      id: '83f35ec3-0bd8-44f1-a0c3-7527521bc93d',
      name: 'X-Tudo',
      description:
        'X-tudo acompanha 2 ovos, 2 carnes, salsisha, presunto, queijo.',
      price: 12.43,
      imageUrl: 'http://x-caboquinho.png',
      categoryId: String(categories.at(1)?.id),
    },
    {
      id: '4b44dd4c-7595-416b-b5c2-433f9bcb5d59',
      name: 'Pudim',
      description: 'Pudim de maracujá.',
      price: 19.2,
      imageUrl: 'http://pudin.png',
      categoryId: String(categories.at(2)?.id),
    },
    {
      id: 'f13db303-5b67-4526-9e73-98ce6b9f8e0a',
      name: 'Coca-cola zero',
      description: 'Coca-cola zero acúcar.',
      price: 15,
      imageUrl: 'http://coca-cola.png',
      categoryId: String(categories.at(0)?.id),
    },
  ];

  const clients = Array.from({ length: 7 }, () => ({
    id: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: generateCPF(),
    created_at: faker.date.recent(),
  }));

  try {
    await prisma.category.createMany({
      data: categories,
    });

    await prisma.product.createMany({
      data: products,
    });

    await prisma.client.createMany({
      data: clients,
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

(async () => {
  await seed();
  console.log('seed apply.');
})();
