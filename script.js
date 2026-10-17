function ambilTransaksi() {
    return JSON.parse(localStorage.getItem("transaksi")) || [];
}

function simpanTransaksi(dataBaru) {
    let transaksi = ambilTransaksi();

    transaksi.push(dataBaru);

    localStorage.setItem(
        "transaksi",
        JSON.stringify(transaksi)
    );
}

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