import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { updateProfileInDB } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada file foto yang dipilih' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipe file harus berupa format JPG, PNG, atau WebP' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maksimal 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran foto maksimal adalah 5MB' },
        { status: 400 }
      );
    }

    // Tentukan ekstensi
    let ext = '.png';
    if (file.type === 'image/jpeg') ext = '.jpg';
    else if (file.type === 'image/webp') ext = '.webp';
    else if (file.type === 'image/gif') ext = '.gif';

    const filename = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // Simpan ke database
    const updatedProfile = await updateProfileInDB({ avatar: avatarUrl });

    return NextResponse.json({
      success: true,
      avatarUrl,
      profile: updatedProfile,
      message: 'Foto profil berhasil diunggah dan disimpan ke database!',
    });
  } catch (error: any) {
    console.error('Upload avatar error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memproses unggahan foto profil' },
      { status: 500 }
    );
  }
}

