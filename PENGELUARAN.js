// ==========================================
// CUSTOM POPUP
// ==========================================

function tampilkanPopup(judul, pesan, icon) {

    const popupOverlay = document.getElementById("popupOverlay");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");
    const popupIcon = document.getElementById("popupIcon");

    popupTitle.textContent = judul;
    popupMessage.textContent = pesan;
    popupIcon.textContent = icon;

    popupOverlay.classList.add("active");
}


// ==========================================
// TUTUP POPUP
// ==========================================

const popupButton = document.getElementById("popupButton");

if (popupButton) {

    popupButton.addEventListener("click", function () {

        document.getElementById("popupOverlay").classList.remove("active");

    });

}


// ==========================================
// AMBIL DATA TRANSAKSI
// ==========================================

function ambilTransaksi() {

    return JSON.parse(localStorage.getItem("transaksi")) || [];

}


// ==========================================
// SIMPAN TRANSAKSI
// ==========================================

function simpanTransaksi(dataBaru) {

    let transaksi = ambilTransaksi();

    transaksi.push(dataBaru);

    localStorage.setItem(
        "transaksi",
        JSON.stringify(transaksi)
    );

}


// ==========================================
// HITUNG SALDO
// ==========================================

function hitungSaldo() {

    let transaksi = ambilTransaksi();

    let pemasukan = 0;
    let pengeluaran = 0;

    transaksi.forEach(function(data) {

        if (data.jenis === "pemasukan") {

            pemasukan += Number(data.jumlah);

        }

        if (data.jenis === "pengeluaran") {

            pengeluaran += Number(data.jumlah);

        }

    });

    return pemasukan - pengeluaran;

}


// ==========================================
// TOMBOL SIMPAN PENGELUARAN
// ==========================================

const tombolSimpan = document.getElementById("tombolSimpan");

if (tombolSimpan) {

    tombolSimpan.addEventListener("click", function(event) {

        event.preventDefault();


        // ==================================
        // AMBIL DATA DARI HTML
        // ==================================

        let jumlah = Number(
            document
                .getElementById("rupiah")
                .value
                .replace(/\./g, "")
        );

        let kategori =
            document.getElementById("kategori").value;

        let keterangan =
            document.getElementById("keterangan").value;

        let tanggal =
            document.getElementById("input-tanggal-pemasukan").value;


        // ==================================
        // CEK JUMLAH
        // ==================================

        if (jumlah <= 0) {

            tampilkanPopup(
                "Jumlah Belum Diisi!",
                "Masukkan jumlah pengeluaran terlebih dahulu.",
                "⚠️"
            );

            return;
        }


        // ==================================
        // HITUNG SALDO
        // ==================================

        let saldoSekarang = hitungSaldo();


        // ==================================
        // CEK SALDO
        // ==================================

        if (jumlah > saldoSekarang) {

            tampilkanPopup(
                "Saldo Tidak Cukup!",
                "Saldo kamu hanya Rp" +
                saldoSekarang.toLocaleString("id-ID") +
                ". Pengeluaran tidak dapat disimpan.",
                "⚠️"
            );

            return;
        }


        // ==================================
        // BUAT DATA PENGELUARAN
        // ==================================

        let dataBaru = {

            id: Date.now(),

            jenis: "pengeluaran",

            jumlah: jumlah,

            kategori: kategori,

            keterangan: keterangan,

            tanggal: tanggal

        };


        // ==================================
        // SIMPAN
        // ==================================

        simpanTransaksi(dataBaru);


        // ==================================
        // POPUP BERHASIL
        // ==================================

        tampilkanPopup(
            "Pengeluaran Berhasil!",
            "Pengeluaran sebesar Rp" +
            jumlah.toLocaleString("id-ID") +
            " berhasil disimpan.",
            "✅"
        );


        // ==================================
        // PINDAH DASHBOARD
        // ==================================

        document.getElementById("popupButton").onclick = function() {

            window.location.href = "Saldo.html";

        };

    });

}


// ==========================================
// FORM TABUNGAN
// ==========================================

function aktifkanTabungan() {

    const formTabungan =
        document.getElementById("formFormulir");

    const tombol =
        document.getElementById("tombolTabungan");


    if (!formTabungan) {

        return;

    }


    if (formTabungan.style.display === "block") {

        // Tutup

        formTabungan.style.display = "none";

        tombol.classList.remove("active");

    } else {

        // Buka

        formTabungan.style.display = "block";

        tombol.classList.add("active");


        // Jalankan animasi

        formTabungan.classList.remove("popup-animation");

        void formTabungan.offsetWidth;

        formTabungan.classList.add("popup-animation");

    }

}


// ======================================================
// FORMAT RUPIAH
// ======================================================

const inputRupiah =
    document.getElementById("rupiah");


inputRupiah.addEventListener("input", function() {

    let angka =
        this.value.replace(/\D/g, "");


    if (angka === "") {

        this.value = "";

        return;

    }


    this.value =
        Number(angka).toLocaleString("id-ID");

});


// ======================================================