import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminLaporanSchema } from "@/lib/validation";

// PATCH: admin mengedit laporan apapun statusnya. Stok otomatis disesuaikan
// (dikurangi dari kondisi lama, ditambah sesuai kondisi baru) dalam satu transaksi.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const existing = await prisma.laporanSampah.findUnique({ where: { id: params.id }, include: { foto: true } });
  if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const body = await req.json();
  const parsed = adminLaporanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const data = parsed.data;

  const wilayah = await prisma.wilayah.findUnique({ where: { id: data.wilayahId } });
  if (!wilayah) return NextResponse.json({ error: "Wilayah tidak ditemukan" }, { status: 400 });
  if (wilayah.namaWilayah.toLowerCase() === "lainnya" && !data.asalSetoranLainnya?.trim()) {
    return NextResponse.json({ error: "Sebutkan asal setoran" }, { status: 400 });
  }
  if (data.status === "REJECTED" && !data.alasanPenolakan?.trim()) {
    return NextResponse.json({ error: "Alasan penolakan wajib diisi" }, { status: 400 });
  }

  const adminId = (session.user as any).id;
  const isApproved = data.status === "APPROVED";
  const isRejected = data.status === "REJECTED";
  const wasApproved = existing.status === "APPROVED";

  const fotoUrl: string | undefined = body.fotoUrl;
  let fotoWrite: any = undefined;
  if (fotoUrl && existing.foto) fotoWrite = { update: { url: fotoUrl } };
  else if (fotoUrl && !existing.foto) fotoWrite = { create: { url: fotoUrl } };

  const ops: any[] = [];

  // Lepaskan stok dari kondisi lama jika sebelumnya Approved
  if (wasApproved) {
    ops.push(
      prisma.stok.upsert({
        where: { jenisSampahId: existing.jenisSampahId },
        update: { totalJumlah: { decrement: existing.jumlah } },
        create: { jenisSampahId: existing.jenisSampahId, totalJumlah: 0 },
      })
    );
  }

  const laporanUpdateIndex = ops.length;
  ops.push(
    prisma.laporanSampah.update({
      where: { id: params.id },
      data: {
        userId: data.userId,
        jenisSampahId: data.jenisSampahId,
        wilayahId: data.wilayahId,
        asalSetoranLainnya: wilayah.namaWilayah.toLowerCase() === "lainnya" ? data.asalSetoranLainnya : null,
        jumlah: data.jumlah,
        satuan: data.satuan,
        status: data.status,
        alasanPenolakan: isRejected ? data.alasanPenolakan : null,
        approvedById: isApproved || isRejected ? adminId : null,
        approvedAt: isApproved || isRejected ? new Date() : null,
        tags: { set: data.tagIds.map((id) => ({ id })) },
        foto: fotoWrite,
      },
      include: { foto: true },
    })
  );

  // Terapkan stok baru jika status baru Approved
  if (isApproved) {
    ops.push(
      prisma.stok.upsert({
        where: { jenisSampahId: data.jenisSampahId },
        update: { totalJumlah: { increment: data.jumlah } },
        create: { jenisSampahId: data.jenisSampahId, totalJumlah: data.jumlah },
      })
    );
  }

  const results = await prisma.$transaction(ops);
  return NextResponse.json(results[laporanUpdateIndex]);
}

// DELETE: admin menghapus laporan. Kalau sebelumnya Approved, stok otomatis dikurangi.
// FotoSampah ikut terhapus otomatis lewat onDelete: Cascade.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const existing = await prisma.laporanSampah.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const ops: any[] = [];
  if (existing.status === "APPROVED") {
    ops.push(
      prisma.stok.upsert({
        where: { jenisSampahId: existing.jenisSampahId },
        update: { totalJumlah: { decrement: existing.jumlah } },
        create: { jenisSampahId: existing.jenisSampahId, totalJumlah: 0 },
      })
    );
  }
  ops.push(prisma.laporanSampah.delete({ where: { id: params.id } }));

  await prisma.$transaction(ops);
  return NextResponse.json({ ok: true });
}
