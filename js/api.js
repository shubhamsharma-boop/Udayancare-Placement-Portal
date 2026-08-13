// ======================================
// UCPP API SERVICE
// Version: 1.1.0
// ======================================

const API = {

    // ======================================
    // COMMON API CALL
    // ======================================

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

            return await response.json();

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

    getCandidateProfile(data) {

        return this.call("getCandidateProfile", data);

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

    updateJob(data) {

        return this.call("updateJob", data);

    },

    duplicateJob(data) {

        return this.call("duplicateJob", data);

    },

    updateJobStatus(data) {

        return this.call("updateJobStatus", data);

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

    },

    getCandidateDigitalProfile(data){

    return this.call(
        "getCandidateDigitalProfile",
        data
    );

},

    // ======================================
// CERTIFICATIONS
// ======================================

saveCandidateCertification(data) {

    return this.call("saveCandidateCertification", data);

},

getCandidateCertifications(data) {

    return this.call("getCandidateCertifications", data);

},

updateCandidateCertification(data) {

    return this.call("updateCandidateCertification", data);

},

deleteCandidateCertification(data) {

    return this.call("deleteCandidateCertification", data);

},
    

    // ======================================
// CANDIDATE PROFILE DETAILS
// ======================================

addCandidateExperience(data) {

    return this.call("addCandidateExperience", data);

},

getCandidateExperience(data) {

    return this.call("getCandidateExperience", data);

},

updateCandidateExperience(data) {

    return this.call("updateCandidateExperience", data);

},

deleteCandidateExperience(data) {

    return this.call("deleteCandidateExperience", data);

},

addCandidateCertification(data) {

    return this.call("addCandidateCertification", data);

},

getCandidateCertifications(data) {

    return this.call("getCandidateCertifications", data);

},

deleteCandidateCertification(data) {

    return this.call("deleteCandidateCertification", data);

},

addCandidateLanguage(data) {

    return this.call("addCandidateLanguage", data);

},

getCandidateLanguages(data) {

    return this.call("getCandidateLanguages", data);

},

deleteCandidateLanguage(data) {

    return this.call("deleteCandidateLanguage", data);

},

updateCandidateLinks(data) {

    return this.call("updateCandidateLinks", data);

},

getCandidateLinks(data) {

    return this.call("getCandidateLinks", data);

},

// ===============================
// Candidate Social Links
// ===============================

case "saveCandidateSocialLinks":

return saveCandidateSocialLinks(requestData.data);


case "getCandidateSocialLinks":

return getCandidateSocialLinks(requestData.data);


case "updateCandidateSocialLinks":

return updateCandidateSocialLinks(requestData.data);


case "deleteCandidateSocialLinks":

return deleteCandidateSocialLinks(requestData.data);


    // ======================================
    // CONTACT
    // ======================================

    submitEnquiry(data) {

        return this.call("submitEnquiry", data);

    }

};

Object.freeze(API);
