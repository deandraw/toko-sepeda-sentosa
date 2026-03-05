import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Hapus data lama agar jika script dijalankan ulang tidak duplicate error jika ada constraint unik
    await prisma.orderDetail.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    // Buat User Admin
    const admin = await prisma.user.create({
        data: {
            namaLengkap: 'Admin Toko',
            email: 'admin@toko.com',
            password: '123456', // Di produksi gunakan bcrypt/argon2
            role: 'admin',
            noTelepon: '081234567890',
            alamatLengkap: 'Jl. Pegangsaan Timur No. 56, Jakarta',
        },
    });

    console.log('Created admin:', admin.email);

    // Buat Kategori
    const categorySepedaGunung = await prisma.category.create({
        data: {
            namaKategori: 'Sepeda Gunung (MTB)',
            deskripsi: 'Sepeda untuk medan kasar dan pegunungan.',
        },
    });

    const categorySepedaBalap = await prisma.category.create({
        data: {
            namaKategori: 'Sepeda Balap (Roadbike)',
            deskripsi: 'Sepeda ringan untuk jalan beraspal mulus.',
        },
    });

    const categoryAksesoris = await prisma.category.create({
        data: {
            namaKategori: 'Aksesoris',
            deskripsi: 'Perlengkapan bersepeda (Helm, Sarung tangan, dll).',
        },
    });

    console.log('Created categories');

    // Buat Produk
    await prisma.product.createMany({
        data: [
            {
                idKategori: categorySepedaGunung.id,
                namaProduk: 'Polygon Cascade 4',
                deskripsiProduk: 'Sepeda Gunung entry-level, cocok untuk pemula yang ingin bersepeda di akhir pekan.',
                harga: 3500000,
                stok: 10,
                gambarUrl: '/placeholder-image.jpg',
            },
            {
                idKategori: categorySepedaBalap.id,
                namaProduk: 'Strattos S5',
                deskripsiProduk: 'Sepeda balap yang dilengkapi dengan frame ALX ringan dan fork carbon untuk performa terbaik.',
                harga: 7500000,
                stok: 5,
                gambarUrl: '/placeholder-image.jpg',
            },
            {
                idKategori: categoryAksesoris.id,
                namaProduk: 'Helm Polygon Rustle',
                deskripsiProduk: 'Helm sepeda dengan desain aerodinamis dan sirkulasi udara maksimal.',
                harga: 350000,
                stok: 20,
                gambarUrl: '/placeholder-image.jpg',
            },
        ],
    });

    console.log('Created products');
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
