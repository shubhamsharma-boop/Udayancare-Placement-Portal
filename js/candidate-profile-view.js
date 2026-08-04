// ======================================
// CANDIDATE DIGITAL PROFILE
// ======================================

let applicationID = "";

let profile = {};

document.addEventListener("DOMContentLoaded", async () => {

    // ===============================
    // Read URL
    // ===============================

    const params = new URLSearchParams(window.location.search);

    applicationID = params.get("applicationID");

    if (!applicationID) {

        alert("Invalid Application.");

        window.close();

        return;

    }

    loadProfile();

});

// ======================================
// LOAD PROFILE
// ======================================

async function loadProfile() {

    const response = await API.getCandidateDigitalProfile({

        applicationID: applicationID

    });

    if (!response.success) {

        alert(response.message);

        return;

    }

    profile = response.profile;

    fillProfile();

}

// ======================================
// FILL PROFILE
// ======================================

function fillProfile() {

    document.getElementById("fullName").textContent =
        profile.fullName;

    document.getElementById("candidateID").textContent =
        profile.candidateID;

    document.getElementById("shaliniID").textContent =
        profile.shaliniID;

    document.getElementById("profileStatus").textContent =
        profile.profileStatus;

    document.getElementById("pFullName").textContent =
        profile.fullName;

    document.getElementById("gender").textContent =
        profile.gender;

    document.getElementById("dob").textContent =
        profile.dob;

    document.getElementById("currentCity").textContent =
        profile.currentCity;

    document.getElementById("mobile").textContent =
        profile.mobile;

    document.getElementById("email").textContent =
        profile.email;

    document.getElementById("education").textContent =
        profile.education;

    document.getElementById("qualification").textContent =
        profile.qualification;

    document.getElementById("passingYear").textContent =
        profile.passingYear;

    document.getElementById("employmentStatus").textContent =
        profile.employmentStatus;

    document.getElementById("experience").textContent =
        profile.experience;

    document.getElementById("preferredLocation").textContent =
        profile.preferredLocation;

    document.getElementById("expectedSalary").textContent =
        profile.expectedSalary;

    document.getElementById("accProfileStatus").textContent =
        profile.profileStatus;

    document.getElementById("registrationDate").textContent =
        profile.registrationDate;

    document.getElementById("lastLogin").textContent =
        profile.lastLogin;

    document.getElementById("accountStatus").textContent =
        profile.accountStatus;

    // ===============================
    // Skills
    // ===============================

    const skillsBox =
        document.getElementById("skillsContainer");

    skillsBox.innerHTML = "";

    if (profile.skills) {

        profile.skills.split(",").forEach(skill => {

            const chip =
                document.createElement("span");

            chip.className = "skill-chip";

            chip.textContent = skill.trim();

            skillsBox.appendChild(chip);

        });

    }

}

// ======================================
// PRINT
// ======================================

document.getElementById("printResume").onclick = function () {

    window.print();

};

// ======================================
// DOWNLOAD PDF
// ======================================

document.getElementById("downloadPDF").onclick = function () {

    window.print();

};

// ======================================
// STATUS UPDATE
// ======================================

async function updateStatus(status) {

    const response = await API.updateApplicationStatus({

        applicationID: applicationID,

        status: status,

        remarks: ""

    });

    if (response.success) {

        alert("Status Updated Successfully.");

        location.reload();

    } else {

        alert(response.message);

    }

}

document.getElementById("btnViewed").onclick = () => {

    updateStatus("Viewed");

};

document.getElementById("btnShortlist").onclick = () => {

    updateStatus("Shortlisted");

};

document.getElementById("btnInterview").onclick = () => {

    updateStatus("Interview");

};

document.getElementById("btnReject").onclick = () => {

    updateStatus("Rejected");

};
