import { z } from "zod";

export const laporanSchema = z.object({
  jenisSampahId: z.string().min(1, "Pilih jenis sampah"),
  jumlah: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  satuan: z.enum(["KG", "PCS"]),
  wilayahId: z.string().min(1, "Pilih wilayah"),
  asalSetoranLainnya: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
});

export const rejectSchema = z.object({
  alasanPenolakan: z.string().min(3, "Alasan penolakan wajib diisi"),
});

export const adminLaporanSchema = z.object({
  userId: z.string().min(1, "Pilih warga yang menyetor"),
  jenisSampahId: z.string().min(1, "Pilih jenis sampah"),
  jumlah: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  satuan: z.enum(["KG", "PCS"]),
  wilayahId: z.string().min(1, "Pilih wilayah"),
  asalSetoranLainnya: z.string().optional().nullable(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  alasanPenolakan: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
});

export const registerSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  noHp: z.string().min(9, "Nomor HP tidak valid").max(15, "Nomor HP tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const profilSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
});

export const passwordSchema = z.object({
  passwordLama: z.string().min(1, "Masukkan password lama"),
  passwordBaru: z.string().min(6, "Password baru minimal 6 karakter"),
});
