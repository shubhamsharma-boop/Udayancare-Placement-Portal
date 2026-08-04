// ======================================
// UCPP CANDIDATE DASHBOARD
// Version : 1.0.0
// ======================================

const CandidateDashboard = {

init() {

const page = window.location.pathname;

if (!page.includes("candidate-dashboard.html")) return;

this.checkSession();

this.loadDashboard();

},

// ======================================
// CHECK LOGIN
// ======================================

checkSession() {

const session = Storage.getCandidate();

if (!session) {

window.location.href = "candidate-login.html";

return;

}

},

// ======================================
// LOAD DASHBOARD
// ======================================

async loadDashboard() {

const session = Storage.getCandidate();

const response = await API.getCandidateDashboard({

candidateID: session.candidateID

});

if (!response.success) {

alert(response.message);

return;

}

const dashboard = response.data;

// ==============================
// Welcome
// ==============================

document.getElementById("candidateName").innerHTML =
session.fullName || "-";

document.getElementById("candidateID").innerHTML =
session.candidateID || "-";

document.getElementById("lastLogin").innerHTML =
dashboard.lastLogin || "Today";

// ==============================
// Profile Progress
// ==============================

const percent = dashboard.profileCompletion || 0;

document.getElementById("profilePercent").innerHTML =
percent + "%";

document.getElementById("profileProgress").style.width =
percent + "%";

// ==============================
// Statistics
// ==============================

document.getElementById("totalJobs").innerHTML =
dashboard.totalJobs || 0;

document.getElementById("totalApplications").innerHTML =
dashboard.totalApplications || 0;

document.getElementById("shortlistedJobs").innerHTML =
dashboard.shortlistedJobs || 0;

document.getElementById("interviewCalls").innerHTML =
dashboard.interviewCalls || 0;

// ==============================
// Applications Table
// ==============================

this.loadRecentApplications(

dashboard.recentApplications || []

);

},

    // ======================================
// LOAD RECENT APPLICATIONS
// ======================================

loadRecentApplications(applications) {

const tbody =
document.getElementById("recentApplicationsTable");

if (!tbody) return;

tbody.innerHTML = "";

if (applications.length === 0) {

tbody.innerHTML = `

<tr>

<td colspan="4"
style="text-align:center;padding:40px;">

No Applications Found

</td>

</tr>

`;

return;

}

applications.forEach(application => {

tbody.innerHTML += `

<tr>

<td>

<strong>

${application.jobTitle}

</strong>

</td>

<td>

${application.companyName}

</td>

<td>

${application.appliedDate}

</td>

<td>

${this.getStatusBadge(

application.applicationStatus

)}

</td>

</tr>

`;

});

},

// ======================================
// STATUS BADGE
// ======================================

getStatusBadge(status) {

switch (status) {

case "Applied":

return `

<span class="status applied">

🟢 Applied

</span>

`;

case "Shortlisted":

return `

<span class="status shortlisted">

🔵 Shortlisted

</span>

`;

case "Interview":

return `

<span class="status interview">

🟠 Interview

</span>

`;

case "Rejected":

return `

<span class="status rejected">

🔴 Rejected

</span>

`;

default:

return `

<span class="status">

${status}

</span>

`;

}

}

};

// ======================================
// START
// ======================================

document.addEventListener(

"DOMContentLoaded",

() => {

CandidateDashboard.init();

}

);
