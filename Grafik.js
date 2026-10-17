
/* =========================
   DATA TRANSAKSI
========================= */

let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

const warnaKategori = [
    "#ffdf00",
    "#2475f5",
    "#f20b58",
    "#ff9b45",
    "#69d875",
    "#9b72cf",
    "#42c9c9",
    "#ff8fa3"
];

const namaBulan = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
];

const namaBulanPendek = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const rupiah = function(nilai) {
    return "Rp" + Math.round(nilai).toLocaleString("id-ID");
};

/* Membaca tanggal tanpa menggeser hari karena zona waktu */
function bacaTanggal(nilai) {
    if (!nilai) return null;

    const teks = String(nilai).trim();
    let cocok = teks.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

    let tahun, bulan, hari;

    if (cocok) {
        tahun = Number(cocok[1]);
        bulan = Number(cocok[2]);
        hari = Number(cocok[3]);
    } else {
        cocok = teks.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);

        if (!cocok) return null;

        hari = Number(cocok[1]);
        bulan = Number(cocok[2]);
        tahun = Number(cocok[3]);
    }

    const tanggal = new Date(tahun, bulan - 1, hari);

    if (
        !tahun ||
        bulan < 1 || bulan > 12 ||
        hari < 1 ||
        tanggal.getFullYear() !== tahun ||
        tanggal.getMonth() !== bulan - 1 ||
        tanggal.getDate() !== hari
    ) {
        return null;
    }

    return { tahun, bulan: bulan - 1, hari };
}

/* Menangani beberapa variasi nama kategori */
function ambilKategori(data) {
    const kategori =
        data.kategori ||
        data.kategoriPengeluaran ||
        data.category ||
        data.namaKategori;

    return kategori ? String(kategori).trim() : "Lainnya";
}

function ambilJenis(data) {
    return String(data.jenis || data.tipe || "").toLowerCase();
}

/* =========================
   ELEMEN
========================= */

const labelBulan = document.getElementById("labelBulan");
const pieChart = document.getElementById("pieChart");
const totalPie = document.getElementById("totalPie");
const daftarKategori = document.getElementById("daftarKategori");
const pesanPie = document.getElementById("pesanPie");
const pesanBatang = document.getElementById("pesanBatang");
const canvas = document.getElementById("grafikBatang");
const ctx = canvas.getContext("2d");

const bulanSebelumnya = document.getElementById("bulanSebelumnya");
const bulanBerikutnya = document.getElementById("bulanBerikutnya");

const hariIni = new Date();
let tahunDipilih = hariIni.getFullYear();
let bulanDipilih = hariIni.getMonth();

/* =========================
   PILIH BULAN
========================= */

function perbaruiLabelBulan() {
    labelBulan.textContent =
        namaBulan[bulanDipilih].toUpperCase() + " " + tahunDipilih;
}

bulanSebelumnya.addEventListener("click", function() {
    bulanDipilih--;

    if (bulanDipilih < 0) {
        bulanDipilih = 11;
        tahunDipilih--;
    }

    tampilkanSemuaGrafik();
});

bulanBerikutnya.addEventListener("click", function() {
    bulanDipilih++;

    if (bulanDipilih > 11) {
        bulanDipilih = 0;
        tahunDipilih++;
    }

    tampilkanSemuaGrafik();
});

/* =========================
   PIE CHART KATEGORI
========================= */

function ambilPengeluaranBulanan() {
    const hasil = {};

    transaksi.forEach(function(data) {
        const tanggal = bacaTanggal(data.tanggal);
        if (!tanggal) return;

        if (
            tanggal.tahun !== tahunDipilih ||
            tanggal.bulan !== bulanDipilih
        ) return;

        if (ambilJenis(data) !== "pengeluaran") return;

        const jumlah = Number(data.jumlah) || 0;
        if (jumlah <= 0) return;

        const kategori = ambilKategori(data);
        hasil[kategori] = (hasil[kategori] || 0) + jumlah;
    });

    return hasil;
}

function gambarPieChart(dataKategori) {
    const entri = Object.entries(dataKategori)
        .sort(function(a, b) {
            return b[1] - a[1];
        });

    const total = entri.reduce(function(total, item) {
        return total + item[1];
    }, 0);

    totalPie.textContent = rupiah(total);
    daftarKategori.innerHTML = "";

    if (total === 0) {
        pieChart.style.background = "#e8e8e8";
        pesanPie.hidden = false;
        return;
    }

    pesanPie.hidden = true;

    let sudut = 0;
    const bagianWarna = [];

    entri.forEach(function(item, index) {
        const kategori = item[0];
        const jumlah = item[1];
        const persen = jumlah / total * 100;
        const sudutAkhir = sudut + persen * 3.6;
        const warna = warnaKategori[index % warnaKategori.length];

        bagianWarna.push(
            warna + " " + sudut + "deg " + sudutAkhir + "deg"
        );

        sudut = sudutAkhir;

        const baris = document.createElement("div");
        baris.className = "item-kategori";

        const kiri = document.createElement("div");
        kiri.className = "kategori-kiri";

        const kotakWarna = document.createElement("span");
        kotakWarna.className = "warna-kategori";
        kotakWarna.style.backgroundColor = warna;

        const nama = document.createElement("span");
        nama.className = "nama-kategori";
        nama.textContent = kategori;

        const kanan = document.createElement("div");
        kanan.className = "nominal-kategori";
        kanan.textContent = rupiah(jumlah);

        const persentase = document.createElement("span");
        persentase.className = "persen-kategori";
        persentase.textContent =
            persen.toLocaleString("id-ID", {
                maximumFractionDigits: 1
            }) + "%";

        kanan.appendChild(persentase);
        kiri.append(kotakWarna, nama);
        baris.append(kiri, kanan);
        daftarKategori.appendChild(baris);
    });

    pieChart.style.background =
        "conic-gradient(" + bagianWarna.join(", ") + ")";
}

/* =========================
   GRAFIK BATANG 6 BULAN
========================= */

function ambilDataEnamBulan() {
    const daftar = [];

    for (let mundur = 5; mundur >= 0; mundur--) {
        const tanggal = new Date(
            tahunDipilih,
            bulanDipilih - mundur,
            1
        );

        daftar.push({
            tahun: tanggal.getFullYear(),
            bulan: tanggal.getMonth(),
            label: namaBulanPendek[tanggal.getMonth()] +
                " " + tanggal.getFullYear(),
            pemasukan: 0,
            pengeluaran: 0
        });
    }

    transaksi.forEach(function(data) {
        const tanggal = bacaTanggal(data.tanggal);
        if (!tanggal) return;

        const item = daftar.find(function(bulan) {
            return bulan.tahun === tanggal.tahun &&
                bulan.bulan === tanggal.bulan;
        });

        if (!item) return;

        const jumlah = Number(data.jumlah) || 0;

        if (ambilJenis(data) === "pemasukan") {
            item.pemasukan += jumlah;
        }

        if (ambilJenis(data) === "pengeluaran") {
            item.pengeluaran += jumlah;
        }
    });

    return daftar;
}

function gambarGrafikBatang(data) {
    const area = canvas.parentElement;
    const lebarCSS = area.clientWidth;
    const tinggiCSS = area.clientHeight;

    if (!lebarCSS || !tinggiCSS) return;

    const rasio = window.devicePixelRatio || 1;

    canvas.width = Math.round(lebarCSS * rasio);
    canvas.height = Math.round(tinggiCSS * rasio);

    ctx.setTransform(rasio, 0, 0, rasio, 0, 0);
    ctx.clearRect(0, 0, lebarCSS, tinggiCSS);

    const kiri = 48;
    const kanan = 10;
    const atas = 15;
    const bawah = 42;

    const lebarGrafik = lebarCSS - kiri - kanan;
    const tinggiGrafik = tinggiCSS - atas - bawah;

    const nilaiTertinggi = Math.max(
        0,
        ...data.map(function(item) {
            return Math.max(item.pemasukan, item.pengeluaran);
        })
    );

    if (nilaiTertinggi === 0) {
        ctx.fillStyle = "#666666";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "Belum ada transaksi",
            lebarCSS / 2,
            tinggiCSS / 2
        );

        pesanBatang.hidden = true;
        return;
    }

    pesanBatang.hidden = true;

    const skalaAtas = nilaiTertinggi * 1.15;
    const langkah = skalaAtas / 4;

    function formatSumbu(nilai) {
        if (nilai >= 1000000) {
            return (nilai / 1000000).toLocaleString("id-ID", {
                maximumFractionDigits: 1
            }) + "jt";
        }

        if (nilai >= 1000) {
            return (nilai / 1000).toLocaleString("id-ID", {
                maximumFractionDigits: 1
            }) + "k";
        }

        return Math.round(nilai).toString();
    }

    // Garis dan angka sumbu Y
    ctx.lineWidth = 1;
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= 4; i++) {
        const nilai = langkah * i;
        const y = atas + tinggiGrafik -
            (nilai / skalaAtas) * tinggiGrafik;

        ctx.beginPath();
        ctx.strokeStyle = "#d0ccc3";
        ctx.setLineDash([3, 3]);
        ctx.moveTo(kiri, y);
        ctx.lineTo(lebarCSS - kanan, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#555555";
        ctx.fillText(formatSumbu(nilai), kiri - 7, y);
    }

    const lebarKelompok = lebarGrafik / data.length;
    const lebarBatang = Math.min(22, lebarKelompok * 0.29);

    data.forEach(function(item, index) {
        const tengah = kiri + lebarKelompok * (index + 0.5);

        const tinggiMasuk =
            item.pemasukan / skalaAtas * tinggiGrafik;

        const tinggiKeluar =
            item.pengeluaran / skalaAtas * tinggiGrafik;

        // Batang pemasukan
        ctx.fillStyle = "#2475f5";
        ctx.fillRect(
            tengah - lebarBatang,
            atas + tinggiGrafik - tinggiMasuk,
            lebarBatang - 1,
            tinggiMasuk
        );

        // Batang pengeluaran
        ctx.fillStyle = "#f20b58";
        ctx.fillRect(
            tengah + 1,
            atas + tinggiGrafik - tinggiKeluar,
            lebarBatang - 1,
            tinggiKeluar
        );

        // Garis tepi batang
        ctx.strokeStyle = "#171717";
        ctx.lineWidth = 0.8;

        ctx.strokeRect(
            tengah - lebarBatang,
            atas + tinggiGrafik - tinggiMasuk,
            lebarBatang - 1,
            tinggiMasuk
        );

        ctx.strokeRect(
            tengah + 1,
            atas + tinggiGrafik - tinggiKeluar,
            lebarBatang - 1,
            tinggiKeluar
        );

        // Label bulan
        ctx.fillStyle = "#333333";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        ctx.fillText(
            namaBulanPendek[item.bulan] + " " +
                String(item.tahun).slice(-2),
            tengah,
            atas + tinggiGrafik + 10
        );
    });

    // Garis sumbu
    ctx.beginPath();
    ctx.strokeStyle = "#171717";
    ctx.lineWidth = 1;
    ctx.moveTo(kiri, atas);
    ctx.lineTo(kiri, atas + tinggiGrafik);
    ctx.lineTo(lebarCSS - kanan, atas + tinggiGrafik);
    ctx.stroke();
}

/* =========================
   REFRESH SEMUA GRAFIK
========================= */

function tampilkanSemuaGrafik() {
    perbaruiLabelBulan();

    // Baca ulang agar perubahan transaksi terbaru ikut masuk
    transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

    gambarPieChart(ambilPengeluaranBulanan());
    gambarGrafikBatang(ambilDataEnamBulan());
}

window.addEventListener("resize", function() {
    gambarGrafikBatang(ambilDataEnamBulan());
});

window.addEventListener("storage", function(event) {
    if (event.key === "transaksi") {
        transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
        tampilkanSemuaGrafik();
    }
});

tampilkanSemuaGrafik();
