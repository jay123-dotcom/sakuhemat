
/* =========================
   DATA TRANSAKSI
========================= */

let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

const rupiah = function(jumlah) {
    return "Rp" + Number(jumlah || 0).toLocaleString("id-ID");
};

/* Membaca tanggal transaksi */
function ambilTanggal(nilai) {
    if (!nilai) return null;

    const teks = String(nilai).trim();
    let tahun, bulan, hari;

    // Format YYYY-MM-DD
    let cocok = teks.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

    if (cocok) {
        tahun = Number(cocok[1]);
        bulan = Number(cocok[2]);
        hari = Number(cocok[3]);
    } else {
        // Format DD/MM/YYYY atau DD-MM-YYYY
        cocok = teks.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);

        if (!cocok) return null;

        hari = Number(cocok[1]);
        bulan = Number(cocok[2]);
        tahun = Number(cocok[3]);
    }

    const tanggalValid = new Date(tahun, bulan - 1, hari);

    if (
        tahun < 1 ||
        bulan < 1 || bulan > 12 ||
        hari < 1 ||
        tanggalValid.getFullYear() !== tahun ||
        tanggalValid.getMonth() !== bulan - 1 ||
        tanggalValid.getDate() !== hari
    ) {
        return null;
    }

    return {
        tahun: tahun,
        bulan: bulan - 1,
        hari: hari
    };
}

/* =========================
   HITUNG TRANSAKSI
========================= */

function hitungTransaksi(filter = null) {
    let pemasukan = 0;
    let pengeluaran = 0;

    transaksi.forEach(function(data) {
        const tanggal = ambilTanggal(data.tanggal);

        if (!tanggal) return;

        if (filter) {
            if (
                tanggal.tahun !== filter.tahun ||
                tanggal.bulan !== filter.bulan
            ) {
                return;
            }

            if (
                filter.hari !== null &&
                filter.hari !== undefined &&
                tanggal.hari !== filter.hari
            ) {
                return;
            }
        }

        if (data.jenis === "pemasukan") {
            pemasukan += Number(data.jumlah) || 0;
        }

        if (data.jenis === "pengeluaran") {
            pengeluaran += Number(data.jumlah) || 0;
        }
    });

    return {
        pemasukan: pemasukan,
        pengeluaran: pengeluaran
    };
}

/* =========================
   SALDO SEKARANG
========================= */

function tampilkanSaldoSekarang() {
    const total = hitungTransaksi();
    const saldo = total.pemasukan - total.pengeluaran;

    document.getElementById("saldoSekarang").textContent =
        rupiah(saldo);
}

/* =========================
   TOTAL TABUNGAN
========================= */

function tampilkanTotalTabungan() {
    const tabungan =
        JSON.parse(localStorage.getItem("tabungan")) || [];

    let total = 0;

    tabungan.forEach(function(tujuan) {
        total += Number(tujuan.jumlah) || 0;
    });

    document.getElementById("totalTabungan").textContent =
        rupiah(total);
}

/* =========================
   STATUS KEUANGAN
========================= */

function updateStatusKeuangan(pemasukan, pengeluaran) {
    const status = document.getElementById("statusKeuangan");
    const pesan = document.getElementById("pesanStatus");
    const statusBox = document.querySelector(".status-box");

    statusBox.classList.remove(
        "aman",
        "waspada",
        "kritis",
        "belum-data"
    );

    if (pemasukan <= 0) {
        status.textContent = "BELUM ADA DATA";
        pesan.textContent =
            "Belum ada pemasukan pada tanggal/periode ini.";

        statusBox.classList.add("belum-data");
        return;
    }

    const sisaSaldo = pemasukan - pengeluaran;

    if (sisaSaldo < 30000) {
        status.textContent = "KRITIS";
        pesan.textContent =
            "Saldo kamu hampir habis. Yuk mulai lebih hemat!";

        statusBox.classList.add("kritis");
    } else if (sisaSaldo < 80000) {
        status.textContent = "WASPADA";
        pesan.textContent =
            "Saldo kamu mulai menipis. Yuk lebih hemat!";

        statusBox.classList.add("waspada");
    } else {
        status.textContent = "AMAN";
        pesan.textContent =
            "Saldo kamu masih aman! Keep it up!";

        statusBox.classList.add("aman");
    }
}

/* =========================
   TAMPILKAN DATA
========================= */

function tampilkanData(filter = null) {
    const total = hitungTransaksi(filter);

    document.getElementById("totalPemasukan").textContent =
        rupiah(total.pemasukan);

    document.getElementById("totalPengeluaran").textContent =
        rupiah(total.pengeluaran);

    updateStatusKeuangan(
        total.pemasukan,
        total.pengeluaran
    );
}

/* =========================
   ELEMEN HTML
========================= */

const tombolPilihBulan =
    document.getElementById("tombolPilihBulan");

const popupBulan =
    document.getElementById("popupBulan");

const tutupPopupBulan =
    document.getElementById("tutupPopupBulan");

const judulPopup =
    document.getElementById("judulPopup");

const bagianTahun =
    document.getElementById("bagianTahun");

const tahunTerpilih =
    document.getElementById("tahunTerpilih");

const daftarBulan =
    document.getElementById("daftarBulan");

const tahunSebelumnya =
    document.getElementById("tahunSebelumnya");

const tahunBerikutnya =
    document.getElementById("tahunBerikutnya");

const kalenderTanggal =
    document.getElementById("kalenderTanggal");

const daftarTanggal =
    document.getElementById("daftarTanggal");

const bulanKalender =
    document.getElementById("bulanKalender");

const kembaliBulan =
    document.getElementById("kembaliBulan");

const infoTanggal =
    document.getElementById("tanggalTerpilih");

const resetTanggal =
    document.getElementById("resetTanggal");

/* =========================
   BULAN DAN TAHUN
========================= */

const namaBulan = [
    "JAN", "FEB", "MAR", "APR",
    "MEI", "JUN", "JUL", "AGU",
    "SEP", "OKT", "NOV", "DES"
];

const namaBulanLengkap = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL",
    "MEI", "JUNI", "JULI", "AGUSTUS",
    "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
];

const sekarang = new Date();

let tahunDipilih = sekarang.getFullYear();
let bulanDipilih = sekarang.getMonth();
let tanggalDipilih = null;

/* Memperbarui tulisan tombol utama */
function formatLabelBulan() {
    if (tanggalDipilih !== null) {
        tombolPilihBulan.textContent =
            tanggalDipilih + " " +
            namaBulanLengkap[bulanDipilih] + " " +
            tahunDipilih;
    } else {
        tombolPilihBulan.textContent =
            namaBulanLengkap[bulanDipilih] + " " +
            tahunDipilih;
    }
}

/* =========================
   TAMPILKAN PILIHAN BULAN
========================= */

function tampilkanPilihanBulan() {
    judulPopup.textContent = "PILIH BULAN";

    bagianTahun.hidden = false;
    daftarBulan.hidden = false;
    kalenderTanggal.hidden = true;

    tahunTerpilih.textContent = tahunDipilih;
    daftarBulan.innerHTML = "";

    namaBulan.forEach(function(nama, index) {
        const tombol = document.createElement("button");

        tombol.type = "button";
        tombol.className = "tombol-bulan";
        tombol.textContent = nama;

        if (index === bulanDipilih) {
            tombol.style.backgroundColor = "#69d875";
        }

        tombol.addEventListener("click", function() {
            bulanDipilih = index;
            tanggalDipilih = null;

            formatLabelBulan();

            // Saat bulan dipilih, tampilkan data bulanan
            tampilkanData({
                tahun: tahunDipilih,
                bulan: bulanDipilih
            });

            tampilkanKalender();
        });

        daftarBulan.appendChild(tombol);
    });
}

/* =========================
   TAMPILKAN KALENDER
========================= */

function tampilkanKalender() {
    judulPopup.textContent = "PILIH TANGGAL";

    bagianTahun.hidden = true;
    daftarBulan.hidden = true;
    kalenderTanggal.hidden = false;

    bulanKalender.textContent =
        namaBulanLengkap[bulanDipilih] + " " +
        tahunDipilih;

    daftarTanggal.innerHTML = "";

    // Hari pada tanggal 1: Minggu = 0, Senin = 1, dst.
    const hariPertama = new Date(
        tahunDipilih,
        bulanDipilih,
        1
    ).getDay();

    // Jumlah hari pada bulan yang dipilih
    const jumlahHari = new Date(
        tahunDipilih,
        bulanDipilih + 1,
        0
    ).getDate();

    // Kotak kosong sebelum tanggal 1
    for (let i = 0; i < hariPertama; i++) {
        const kosong = document.createElement("button");

        kosong.type = "button";
        kosong.className = "tanggal-kosong";
        kosong.disabled = true;
        kosong.tabIndex = -1;
        kosong.setAttribute("aria-hidden", "true");

        daftarTanggal.appendChild(kosong);
    }

    // Membuat tanggal sesuai kalender asli
    for (let hari = 1; hari <= jumlahHari; hari++) {
        const tombol = document.createElement("button");

        tombol.type = "button";
        tombol.textContent = hari;
        tombol.setAttribute("aria-label", "Tanggal " + hari);

        if (tanggalDipilih === hari) {
            tombol.classList.add("tanggal-terpilih");
        }

        tombol.addEventListener("click", function() {
            tanggalDipilih = hari;

            formatLabelBulan();

            infoTanggal.textContent =
                "Data tanggal " + hari + " " +
                namaBulanLengkap[bulanDipilih] + " " +
                tahunDipilih;

            // Filter transaksi sesuai tanggal yang diklik
            tampilkanData({
                tahun: tahunDipilih,
                bulan: bulanDipilih,
                hari: tanggalDipilih
            });

            // Perbarui warna tanggal terpilih
            tampilkanKalender();
        });

        daftarTanggal.appendChild(tombol);
    }

    if (tanggalDipilih === null) {
        infoTanggal.textContent =
            "Pilih tanggal untuk melihat data.";
    } else {
        infoTanggal.textContent =
            "Data tanggal " + tanggalDipilih + " " +
            namaBulanLengkap[bulanDipilih] + " " +
            tahunDipilih;
    }
}

/* =========================
   EVENT TOMBOL POPUP
========================= */

// Buka popup bulan
tombolPilihBulan.addEventListener("click", function() {
    popupBulan.classList.add("active");
    tampilkanPilihanBulan();
});

// Tutup dengan tombol X
tutupPopupBulan.addEventListener("click", function() {
    popupBulan.classList.remove("active");
});

// Tutup saat area gelap diklik
popupBulan.addEventListener("click", function(event) {
    if (event.target === popupBulan) {
        popupBulan.classList.remove("active");
    }
});

// Tahun sebelumnya
tahunSebelumnya.addEventListener("click", function() {
    tahunDipilih--;
    tampilkanPilihanBulan();
});

// Tahun berikutnya
tahunBerikutnya.addEventListener("click", function() {
    tahunDipilih++;
    tampilkanPilihanBulan();
});

// Kembali dari kalender ke pilihan bulan
kembaliBulan.addEventListener("click", function() {
    tampilkanPilihanBulan();
});

// Kembali melihat semua transaksi di bulan terpilih
resetTanggal.addEventListener("click", function() {
    tanggalDipilih = null;

    formatLabelBulan();

    tampilkanData({
        tahun: tahunDipilih,
        bulan: bulanDipilih
    });

    tampilkanPilihanBulan();
});

/* =========================
   TAMPILAN AWAL
========================= */

formatLabelBulan();
tampilkanSaldoSekarang();
tampilkanTotalTabungan();

tampilkanData({
    tahun: tahunDipilih,
    bulan: bulanDipilih
});
