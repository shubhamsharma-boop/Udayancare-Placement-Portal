// ======================================
// UCPP AUTH SERVICE
// Version: 1.0.0
// ======================================

const Auth = {

    // ============================
    // CANDIDATE
    // ============================

    isCandidateLoggedIn() {

        return Storage.getCandidate() !== null;

    },

    requireCandidateLogin(loginPage = "../candidate/candidate-login.html") {

        if (!this.isCandidateLoggedIn()) {

            window.location.href = loginPage;

        }

    },

    logoutCandidate(loginPage = "../candidate/candidate-login.html") {

        Storage.removeCandidate();

        window.location.href = loginPage;

    },



    // ============================
    // EMPLOYER
    // ============================

    isEmployerLoggedIn() {

        return Storage.getEmployer() !== null;

    },

    requireEmployerLogin(loginPage = "../employer/employer-login.html") {

        if (!this.isEmployerLoggedIn()) {

            window.location.href = loginPage;

        }

    },

    logoutEmployer(loginPage = "../employer/employer-login.html") {

        Storage.removeEmployer();

        window.location.href = loginPage;

    },



    // ============================
    // ADMIN
    // ============================

    isAdminLoggedIn() {

        return Storage.getAdmin() !== null;

    },

    requireAdminLogin(loginPage = "../admin/admin-login.html") {

        if (!this.isAdminLoggedIn()) {

            window.location.href = loginPage;

        }

    },

    logoutAdmin(loginPage = "../admin/admin-login.html") {

        Storage.removeAdmin();

        window.location.href = loginPage;

    },



    // ============================
    // LOGOUT ALL
    // ============================

    logoutAll(homePage = "../index.html") {

        Storage.clearAll();

        window.location.href = homePage;

    }

};

Object.freeze(Auth);
