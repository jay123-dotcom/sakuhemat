
// ==========================================
// SISTEM PROTEKSI HALAMAN SAKUHEMAT
// ==========================================

// Gunakan key baru agar status login lama
// tidak otomatis memberikan akses.
const statusLogin = localStorage.getItem("statusLoginV2");

// Ambil nama halaman yang sedang dibuka.
const halamanSekarang = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

// Halaman yang boleh dibuka tanpa login.
const halamanPublik = [
    "",
    "index.html",
    "login.html",
    "daftar.html",
    "lupa-password.html",
    "lupa-pasword.html"
];

// Jika halaman bukan halaman publik dan
// pengguna belum login, arahkan ke Login.
if (
    !halamanPublik.includes(halamanSekarang) &&
    statusLogin !== "true"
) {
    window.location.replace("login.html");
}



// ==========================================
// CUSTOM POPUP
// ==========================================

function tampilkanPopup(
    judul,
    pesan,
    icon,
    tujuan = null
) {

    const popupOverlay =
        document.getElementById("popupOverlay");

    const popupTitle =
        document.getElementById("popupTitle");

    const popupMessage =
        document.getElementById("popupMessage");

    const popupIcon =
        document.getElementById("popupIcon");

    const popupButton =
        document.getElementById("popupButton");


    if (!popupOverlay) {
        return;
    }


    popupTitle.textContent = judul;

    popupMessage.textContent = pesan;

    popupIcon.textContent = icon;


    popupOverlay.classList.add("active");


    popupButton.onclick = function () {

        popupOverlay.classList.remove("active");


        if (tujuan) {

            window.location.href = tujuan;

        }

    };

}



// ==========================================
// DAFTAR AKUN
// ==========================================

const tombolDaftar = document.getElementById("tombolDaftar");

if (tombolDaftar) {

    tombolDaftar.addEventListener("click", function (event) {

        event.preventDefault();

        const inputEmail = document.getElementById("emailDaftar") ||
                           document.getElementById("email");

        const inputPassword = document.getElementById("passwordDaftar") ||
                              document.getElementById("password");

        const email = inputEmail.value.trim().toLowerCase();
        const password = inputPassword.value;

        // CEK EMAIL
        if (email === "") {
            tampilkanPopup(
                "Email Belum Diisi!",
                "Masukkan email terlebih dahulu.",
                "⚠️"
            );
            return;
        }

        // CEK PASSWORD
        if (password === "") {
            tampilkanPopup(
                "Password Belum Diisi!",
                "Masukkan password terlebih dahulu.",
                "⚠️"
            );
            return;
        }

       // CEK EMAIL YANG SUDAH TERDAFTAR
const daftarAkun = ambilDaftarAkun();

const akunLama = daftarAkun.find(
    akun => akun.email === email
);

if (akunLama) {
    tampilkanPopup(
        "Email Sudah Terdaftar!",
        "Email ini sudah digunakan. Silakan gunakan email lain.",
        "⚠️"
    );

    return;
}

        // BUAT AKUN
        const akunBaru = {
            email: email,
            password: password
        };

        // SIMPAN AKUN
        localStorage.setItem(
            "akunSakuHemat",
            JSON.stringify(akunBaru)
        );

        // RESET PERCOBAAN
        localStorage.removeItem("percobaanLogin");

        // BERHASIL
        tampilkanPopup(
            "Akun Berhasil Dibuat!",
            "Akun kamu berhasil dibuat. Jangan lupa email dan password kamu!",
            "✅",
            "login.html"
        );

    });

}


// ==========================================
// LOGIN
// ==========================================

const tombolLogin =
    document.getElementById("tombolLogin");


if (tombolLogin) {

    tombolLogin.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            let email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            let password =
                document
                    .getElementById("password")
                    .value;


            // ==============================
            // CEK INPUT KOSONG
            // ==============================

            if (
                email === "" ||
                password === ""
            ) {

                tampilkanPopup(
                    "Data Belum Lengkap!",
                    "Masukkan email dan password terlebih dahulu.",
                    "⚠️"
                );

                return;
            }


            // ==============================
            // AMBIL AKUN
            // ==============================

            const akun =
                JSON.parse(
                    localStorage.getItem(
                        "akunSakuHemat"
                    )
                );


            // ==============================
            // BELUM ADA AKUN
            // ==============================

            if (!akun) {

                tampilkanPopup(
                    "Akun Belum Ada!",
                    "Kamu belum memiliki akun. Silakan buat akun terlebih dahulu.",
                    "⚠️",
                    "daftar.html"
                );

                return;
            }


            // ==============================
            // CEK EMAIL
            // ==============================

            if (email !== akun.email) {

                tampilkanPopup(
                    "Email Salah!",
                    "Maaf, email yang kamu masukkan salah atau tidak terdaftar.",
                    "❌"
                );

                return;
            }


            // ==============================
            // AMBIL JUMLAH PERCOBAAN
            // ==============================

            let percobaan =
                Number(
                    localStorage.getItem(
                        "percobaanLogin"
                    )
                ) || 0;


            // ==============================
            // CEK PASSWORD
            // ==============================

            if (password !== akun.password) {

                percobaan++;

                localStorage.setItem(
                    "percobaanLogin",
                    percobaan
                );


                // ==========================
                // SUDAH 5 KALI
                // ==========================

                if (percobaan >= 5) {

                    document.getElementById(
                        "linkLupaPassword"
                    ).style.display = "block";


                    tampilkanPopup(
                        "Terlalu Banyak Percobaan!",
                        "Kamu sudah 5 kali memasukkan password yang salah. Gunakan fitur Lupa Password untuk membuat password baru.",
                        "🔒"
                    );

                    return;
                }


                // ==========================
                // MASIH ADA PERCOBAAN
                // ==========================

                let sisa =
                    5 - percobaan;


                tampilkanPopup(
                    "Password Salah!",
                    "Maaf, password yang kamu masukkan salah. Percobaan tersisa: " + sisa,
                    "❌"
                );

                return;
            }


            // ==================================
            // LOGIN BERHASIL
            // ==================================

           localStorage.setItem(
            "statusLoginV2",
            "true"
            );


            // Reset percobaan
            localStorage.removeItem(
                "percobaanLogin"
            );


            tampilkanPopup(
                "Login Berhasil!",
                "Selamat datang kembali di SakuHemat.",
                "✅",
                "1.html"
            );

        }
    );

}


// ==========================================
// RESET PASSWORD
// ==========================================

const tombolReset =
    document.getElementById("tombolReset");


if (tombolReset) {

    tombolReset.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            let email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            let passwordBaru =
                document
                    .getElementById("passwordBaru")
                    .value;


            // ==============================
            // CEK INPUT
            // ==============================

            if (
                email === "" ||
                passwordBaru === ""
            ) {

                tampilkanPopup(
                    "Data Belum Lengkap!",
                    "Masukkan email dan password baru terlebih dahulu.",
                    "⚠️"
                );

                return;
            }


            // ==============================
            // AMBIL AKUN
            // ==============================

            const akun =
                JSON.parse(
                    localStorage.getItem(
                        "akunSakuHemat"
                    )
                );


            if (!akun) {

                tampilkanPopup(
                    "Akun Tidak Ditemukan!",
                    "Belum ada akun SakuHemat yang terdaftar.",
                    "❌",
                    "daftar.html"
                );

                return;
            }


            // ==============================
            // CEK EMAIL
            // ==============================

            if (email !== akun.email) {

                tampilkanPopup(
                    "Email Tidak Terdaftar!",
                    "Email tersebut tidak cocok dengan akun SakuHemat.",
                    "❌"
                );

                return;
            }


            // ==============================
            // GANTI PASSWORD
            // ==============================

            akun.password =
                passwordBaru;


            localStorage.setItem(
                "akunSakuHemat",
                JSON.stringify(akun)
            );


            // Reset percobaan
            localStorage.removeItem(
                "percobaanLogin"
            );


            tampilkanPopup(
                "Password Berhasil Diubah!",
                "Password baru kamu sudah tersimpan. Silakan login kembali.",
                "✅",
                "login.html"
            );

        }
    );

}


/* ==========================================
   LOGOUT SAKUHEMAT
========================================== */

const tombolLogout = document.getElementById("tombolLogout");

if (tombolLogout) {

    tombolLogout.addEventListener("click", function(event) {

        event.preventDefault();

        const yakin = confirm("Apakah kamu yakin ingin logout?");

        if (yakin) {

            localStorage.removeItem("statusLoginV2");

            window.location.href = "login.html";

        }

    });

}

