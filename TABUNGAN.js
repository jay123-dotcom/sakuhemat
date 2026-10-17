// ==========================================
// DATA TABUNGAN
// ==========================================

function ambilTabungan() {

    return JSON.parse(
        localStorage.getItem("tabungan")
    ) || [];

}


function simpanTabungan(data) {

    localStorage.setItem(
        "tabungan",
        JSON.stringify(data)
    );

}


// ==========================================
// DATA TRANSAKSI
// ==========================================

function simpanTransaksi(dataBaru) {

    let transaksi = ambilTransaksi();

    // TANGGAL MULAI DITENTUKAN DARI
    // PEMASUKAN / PENGELUARAN PERTAMA
    if (
        transaksi.filter(function(data) {
            return (
                data.jenis === "pemasukan" ||
                data.jenis === "pengeluaran"
            );
        }).length === 0
        &&
        (
            dataBaru.jenis === "pemasukan" ||
            dataBaru.jenis === "pengeluaran"
        )
    ) {

        localStorage.setItem(
            "tanggalMulai",
            dataBaru.tanggal
        );

    }

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

    let saldo = 0;

    transaksi.forEach(function(data) {

        if (data.jenis === "pemasukan") {

            saldo += Number(data.jumlah);

        }

        if (data.jenis === "pengeluaran") {

            saldo -= Number(data.jumlah);

        }

        // Uang yang disisihkan ke tabungan
        // juga mengurangi saldo utama

        if (data.jenis === "tabungan") {

            saldo -= Number(data.jumlah);

        }

    });

    return saldo;

}


// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(angka) {

    return Number(angka).toLocaleString("id-ID");

}


function ambilAngka(nilai) {

    return Number(
        nilai.replace(/\D/g, "")
    ) || 0;

}


// ==========================================
// POPUP
// ==========================================

function tampilkanPopup(judul, pesan, icon) {

    document.getElementById("popupIcon").textContent = icon;

    document.getElementById("popupJudul").textContent = judul;

    document.getElementById("popupPesan").textContent = pesan;

    document
        .getElementById("popup")
        .classList.add("active");

}


// ==========================================
// TUTUP POPUP
// ==========================================

document
    .getElementById("popupButton")
    .addEventListener("click", function() {

        document
            .getElementById("popup")
            .classList.remove("active");

    });


// ==========================================
// BUKA / TUTUP FORM TUJUAN
// ==========================================

const tombolTujuan =
    document.getElementById("tombolTujuan");

const formTujuan =
    document.getElementById("formTujuan");


tombolTujuan.addEventListener("click", function() {

    formTujuan.classList.toggle("active");

    if (formTujuan.classList.contains("active")) {

        tombolTujuan.textContent =
            "− TUTUP FORM";

    } else {

        tombolTujuan.textContent =
            "＋ BUAT TUJUAN BARU";

    }

});


// ==========================================
// FORMAT INPUT TARGET
// ==========================================

const inputTarget =
    document.getElementById("targetTabungan");


inputTarget.addEventListener("input", function() {

    let angka = this.value.replace(/\D/g, "");

    if (angka === "") {

        this.value = "";

        return;

    }

    this.value =
        Number(angka).toLocaleString("id-ID");

});


// ==========================================
// SIMPAN TUJUAN BARU
// ==========================================

document
    .getElementById("simpanTujuan")
    .addEventListener("click", function() {

        const nama =
            document.getElementById("namaTujuan").value.trim();

        const target =
            ambilAngka(
                document.getElementById("targetTabungan").value
            );


        // CEK NAMA

        if (nama === "") {

            tampilkanPopup(
                "Nama Belum Diisi!",
                "Masukkan nama tujuan tabungan terlebih dahulu.",
                "⚠️"
            );

            return;

        }


        // CEK TARGET

        if (target <= 0) {

            tampilkanPopup(
                "Target Belum Diisi!",
                "Masukkan target tabungan terlebih dahulu.",
                "⚠️"
            );

            return;

        }


        // AMBIL DATA LAMA

        let tabungan = ambilTabungan();


        // BUAT TUJUAN

        let tujuanBaru = {

            id: Date.now(),

            nama: nama,

            target: target,

            jumlah: 0

        };


        // TAMBAHKAN

        tabungan.push(tujuanBaru);


        // SIMPAN

        simpanTabungan(tabungan);


        // KOSONGKAN FORM

        document.getElementById("namaTujuan").value = "";

        document.getElementById("targetTabungan").value = "";


        // TUTUP FORM

        formTujuan.classList.remove("active");

        tombolTujuan.textContent =
            "＋ BUAT TUJUAN BARU";


        // TAMPILKAN

        tampilkanTabungan();


        tampilkanPopup(
            "Tujuan Berhasil!",
            "Tujuan tabungan berhasil dibuat.",
            "✅"
        );

    });


// ==========================================
// TAMPILKAN TABUNGAN
// ==========================================

function tampilkanTabungan() {

    const container =
        document.getElementById("daftarTabungan");

    container.innerHTML = "";


    let tabungan = ambilTabungan();


    if (tabungan.length === 0) {

        container.innerHTML = `
            <div class="card-tabungan">
                <p>Belum ada tujuan tabungan.</p>
                <br>
                <p>Yuk buat tujuan pertamamu! 💰</p>
            </div>
        `;

        return;

    }


    tabungan.forEach(function(tujuan) {

        let persen =
            (tujuan.jumlah / tujuan.target) * 100;


        // Maksimal 100%

        if (persen > 100) {
            persen = 100;
        }


        container.innerHTML += `

            <div class="card-tabungan">

                <div class="card-header">

                    <div class="nama-tujuan">
                        ${tujuan.nama}
                    </div>

                    <button
                        class="hapus"
                        onclick="hapusTujuan(${tujuan.id})"
                    >
                        🗑
                    </button>

                </div>


                <div class="nominal">

                    Rp${formatRupiah(tujuan.jumlah)}

                    <span>
                        / Rp${formatRupiah(tujuan.target)}
                    </span>

                </div>


                <div class="progress-container">

                    <div
                        class="progress-bar"
                        style="width: ${persen}%"
                    ></div>

                </div>


                <div class="progress-text">

                    ${persen.toFixed(0)}%

                </div>


                <button
                    class="tombol-sisihkan"
                    onclick="bukaSisihkan(${tujuan.id})"
                >

                    ＋ SISIHKAN KE TABUNGAN

                </button>


                <div
                    id="formSisihkan-${tujuan.id}"
                    class="form-sisihkan"
                >

                    <input
                        type="text"
                        id="inputSisihkan-${tujuan.id}"
                        placeholder="Masukkan jumlah"
                        oninput="formatInputSisihkan(this)"
                    >

                    <button
                        type="button"
                        class="btn-konfirmasi"
                        onclick="sisihkanUang(${tujuan.id})"
                        >

                        SIMPAN UANG

                    </button>

                </div>

            </div>

        `;

    });

}


// ==========================================
// BUKA FORM SISihkan
// ==========================================

function bukaSisihkan(id) {

    const form =
        document.getElementById(
            `formSisihkan-${id}`
        );

    form.classList.toggle("active");

}


// ==========================================
// FORMAT INPUT SISihkan
// ==========================================

function formatInputSisihkan(input) {

    let angka =
        input.value.replace(/\D/g, "");


    if (angka === "") {

        input.value = "";

        return;

    }


    input.value =
        Number(angka).toLocaleString("id-ID");

}


// ==========================================
// SISihkan UANG
// ==========================================

function sisihkanUang(id) {

    let tabungan =
        ambilTabungan();


    let tujuan =
        tabungan.find(function(data) {

            return String(data.id) === String(id);

        });


    if (!tujuan) {
        return;
    }


    const input =
        document.getElementById(
            `inputSisihkan-${id}`
        );


    let jumlah =
        ambilAngka(input.value);


    // CEK JUMLAH

    if (jumlah <= 0) {

        tampilkanPopup(
            "Jumlah Belum Diisi!",
            "Masukkan jumlah uang yang ingin ditabung.",
            "⚠️"
        );

        return;

    }


    // HITUNG SALDO

    let saldo =
        hitungSaldo();


    // CEK SALDO

    if (jumlah > saldo) {

        tampilkanPopup(
            "Saldo Tidak Cukup!",
            "Saldo kamu hanya Rp" +
            formatRupiah(saldo) +
            ".",
            "⚠️"
        );

        return;

    }


    // CEK TARGET

    let sisaTarget =
        tujuan.target - tujuan.jumlah;


    if (jumlah > sisaTarget) {

        tampilkanPopup(
            "Melebihi Target!",
            "Uang yang dimasukkan melebihi sisa target tabungan.",
            "⚠️"
        );

        return;

    }


    // TAMBAHKAN KE TABUNGAN

    tujuan.jumlah += jumlah;


    // SIMPAN DATA TABUNGAN

    simpanTabungan(tabungan);


    // CATAT SEBAGAI TRANSAKSI

    simpanTransaksi({

        id: Date.now(),

        jenis: "tabungan",

        jumlah: jumlah,

        tujuanId: id,

        tanggal: new Date().toISOString()

    });


    // UPDATE TAMPILAN

    tampilkanTabungan();


    tampilkanPopup(
        "Berhasil Menabung! 🎉",
        "Rp" +
        formatRupiah(jumlah) +
        " berhasil disisihkan ke tabungan.",
        "💰"
    );

}


// ==========================================
// HAPUS TUJUAN
// ==========================================

function hapusTujuan(id) {

    let tabungan =
        ambilTabungan();


    let tujuan =
        tabungan.find(function(data) {

            return data.id === id;

        });


    if (!tujuan) {
        return;
    }


    // Jangan izinkan hapus kalau masih ada uang

    if (tujuan.jumlah > 0) {

        tampilkanPopup(
            "Tidak Bisa Dihapus!",
            "Tujuan ini masih memiliki tabungan. Gunakan tabungan tersebut terlebih dahulu.",
            "⚠️"
        );

        return;

    }


    tabungan =
        tabungan.filter(function(data) {

            return data.id !== id;

        });


    simpanTabungan(tabungan);


    tampilkanTabungan();

}


// ==========================================
// JALANKAN SAAT HALAMAN DIBUKA
// ==========================================

tampilkanTabungan();