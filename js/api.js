// ======================================
// UCPP API SERVICE
// Version: 1.0.0
// ======================================

const API = {

    // ===============================
    // COMMON API CALL
    // ===============================

    async call(action, data = {}) {

        try {

            const response = await fetch(CONFIG.API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "text/plain;charset=utf-8"

                },

                body: JSON.stringify({

                    action: action,

                    data: data

                })

            });

            const result = await response.json();

            return result;

        }

        catch (error) {

            return {

                success: false,

                message: error.message

            };

        }

    },



    // ======================================
    // CANDIDATE
    // ======================================

    registerCandidate(data) {

        return this.call("registerCandidate", data);

    },



    loginCandidate(data) {

        return this.call("loginCandidate", data);

    },



    updateCandidateProfile(data) {

        return this.call("updateCandidateProfile", data);

    },



    getCandidateDashboard(data) {

        return this.call("getCandidateDashboard", data);

    },



    // ======================================
    // EMPLOYER
    // ======================================

    registerEmployer(data) {

        return this.call("registerEmployer", data);

    },



    loginEmployer(data) {

        return this.call("loginEmployer", data);

    },



    updateEmployerProfile(data) {

        return this.call("updateEmployerProfile", data);

    },



    getEmployerDashboard(data) {

        return this.call("getEmployerDashboard", data);

    },



    // ======================================
    // JOBS
    // ======================================

    postJob(data) {

        return this.call("postJob", data);

    },



    getEmployerJobs(data) {

        return this.call("getEmployerJobs", data);

    },



    getAvailableJobs() {

        return this.call("getAvailableJobs");

    },



    getJobDetails(data) {

        return this.call("getJobDetails", data);

    },



    closeJob(data) {

        return this.call("closeJob", data);

    },



    deleteJob(data) {

        return this.call("deleteJob", data);

    },



    // ======================================
    // APPLICATIONS
    // ======================================

    applyJob(data) {

        return this.call("applyJob", data);

    },



    getCandidateApplications(data) {

        return this.call("getCandidateApplications", data);

    },



    getEmployerApplications(data) {

        return this.call("getEmployerApplications", data);

    },



    updateApplicationStatus(data) {

        return this.call("updateApplicationStatus", data);

    }

};

Object.freeze(API);
