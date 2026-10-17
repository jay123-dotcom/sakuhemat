// ==========================================
// CUSTOM POPUP
// ==========================================

function tampilkanPopup(judul, pesan, icon, tujuan = null) {

    const popupOverlay = document.getElementById("popupOverlay");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");
    const popupIcon = document.getElementById("popupIcon");
    const popupButton = document.getElementById("popupButton");

    popupTitle.textContent = judul;
    popupMessage.textContent = pesan;
    popupIcon.textContent = icon;

    popupOverlay.classList.add("active");


    // ==================================
    // TOMBOL OKE
    // ==================================

    popupButton.onclick = function(event) {

        event.preventDefault();

        // Tutup popup
        popupOverlay.classList.remove("active");

        // Kalau ada tujuan → pindah halaman
        if (tujuan) {

            window.location.href = tujuan;

        }

    };

}


// ==========================================
// TOMBOL PEMASUKAN
// ==========================================

const tombolPemasukan =
    document.getElementById("simpanPemasukan");

if (tombolPemasukan) {

    tombolPemasukan.addEventListener("click", function(event) {

        event.preventDefault();


        // ==================================
        // AMBIL DATA PEMASUKAN
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
            document.getElementById(
                "input-tanggal-pemasukan"
            ).value;


        // ==================================
        // AMBIL DATA TABUNGAN
        // ==================================

        let jumlahTabungan = Number(
            document
                .getElementById("inputJumlah")
                .value
                .replace(/\./g, "")
        );

        let tujuanTabungan =
            document.getElementById("selectTujuan").value;


        // ==================================
        // CEK JUMLAH PEMASUKAN
        // ==================================

        if (jumlah <= 0) {

            tampilkanPopup(
                "Jumlah Belum Diisi!",
                "Masukkan jumlah pemasukan terlebih dahulu.",
                "⚠️"
            );

            return;
        }


        // ==================================
        // CEK JUMLAH TABUNGAN
        // ==================================

        if (jumlahTabungan < 0) {

            tampilkanPopup(
                "Jumlah Tabungan Tidak Valid!",
                "Jumlah yang ditabung tidak boleh negatif.",
                "⚠️"
            );

            return;
        }


        // ==================================
        // CEK TABUNGAN TIDAK BOLEH
        // LEBIH BESAR DARI PEMASUKAN
        // ==================================

        if (jumlahTabungan > jumlah) {

            tampilkanPopup(
                "Tabungan Terlalu Besar!",
                "Jumlah yang disisihkan tidak boleh lebih besar dari pemasukan.",
                "⚠️"
            );

            return;
        }


        // ==================================
        // CEK TUJUAN TABUNGAN
        // ==================================

        if (jumlahTabungan > 0 && tujuanTabungan === "") {

            tampilkanPopup(
                "Pilih Tujuan Tabungan!",
                "Pilih tujuan tabungan sebelum menyisihkan uang.",
                "⚠️"
            );

            return;
        }


        // ==================================
        // BUAT DATA PEMASUKAN
        // ==================================

        let dataBaru = {

            id: Date.now(),

            jenis: "pemasukan",

            jumlah: jumlah,

            kategori: kategori,

            keterangan: keterangan,

            tanggal: tanggal,

            jumlahTabungan: jumlahTabungan,

            tujuanTabunganId: tujuanTabungan

        };


        // ==================================
        // SIMPAN TRANSAKSI
        // ==================================

        simpanTransaksi(dataBaru);


        // ==================================
        // TAMBAHKAN UANG KE TUJUAN TABUNGAN
        // ==================================

        if (jumlahTabungan > 0) {

            let tabungan =
                JSON.parse(
                    localStorage.getItem("tabungan")
                ) || [];


            let tujuan =
                tabungan.find(function(item) {

                    return String(item.id) ===
                        String(tujuanTabungan);

                });


            if (tujuan) {

                tujuan.jumlah =
                    Number(tujuan.jumlah || 0) +
                    jumlahTabungan;


                // ==================================
                // JANGAN LEWATI TARGET
                // ==================================

                if (tujuan.jumlah > Number(tujuan.target)) {

                    tujuan.jumlah =
                        Number(tujuan.target);

                }


                localStorage.setItem(
                    "tabungan",
                    JSON.stringify(tabungan)
                );

            }

        }


        // ==================================
        // POPUP BERHASIL
        // ==================================

        let pesan =
            "Pemasukan sebesar Rp" +
            jumlah.toLocaleString("id-ID") +
            " berhasil disimpan.";


        if (jumlahTabungan > 0) {

            pesan +=
                " Rp" +
                jumlahTabungan.toLocaleString("id-ID") +
                " masuk ke tabungan.";

        }


        tampilkanPopup(

            "Pemasukan Berhasil!",

            pesan,

            "✅",

            "Saldo.html"

        );

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


// =====================================================
// FORMAT RUPIAH PEMASUKAN
// =====================================================

const inputRupiah =
    document.getElementById("rupiah");


if (inputRupiah) {

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

}


// ==========================================
// AMBIL TUJUAN TABUNGAN
// ==========================================

function ambilTabungan() {

    return JSON.parse(
        localStorage.getItem("tabungan")
    ) || [];

}


// ==========================================
// TAMPILKAN TUJUAN KE DROPDOWN
// ==========================================

function tampilkanPilihanTabungan() {

    const selectTujuan =
        document.getElementById("selectTujuan");


    if (!selectTujuan) {

        return;

    }


    const tabungan =
        ambilTabungan();


    selectTujuan.innerHTML =
        '<option value="">— Pilih tujuan tabungan —</option>';


    tabungan.forEach(function(tujuan) {

        const option =
            document.createElement("option");


        option.value =
            tujuan.id;


        option.textContent =
            tujuan.nama +
            " — Rp" +
            Number(tujuan.jumlah)
                .toLocaleString("id-ID") +
            " / Rp" +
            Number(tujuan.target)
                .toLocaleString("id-ID");


        selectTujuan.appendChild(option);

    });

}


tampilkanPilihanTabungan();


// =====================================================
// FORMAT RUPIAH JUMLAH TABUNGAN
// =====================================================

const inputJumlah =
    document.getElementById("inputJumlah");


if (inputJumlah) {

    inputJumlah.addEventListener("input", function() {

        let angka =
            this.value.replace(/\D/g, "");


        if (angka === "") {

            this.value = "";

            return;

        }


        this.value =
            Number(angka).toLocaleString("id-ID");

    });

}