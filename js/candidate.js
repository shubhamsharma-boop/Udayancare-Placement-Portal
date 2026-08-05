// ======================================
// UCPP CANDIDATE MODULE
// Version : 2.0.0
// ======================================

const Candidate={

// ======================================
// INIT
// ======================================

init(){

this.bindRegisterForm();

this.bindLoginForm();

this.checkLogin();

this.initDashboard();

this.initProfile();

this.initJobs();

this.initJobDetails();

},

// ======================================
// REGISTER FORM
// ======================================

bindRegisterForm(){

const form=

document.getElementById(

"candidateRegisterForm"

);

if(!form) return;

form.addEventListener(

"submit",

(e)=>{

e.preventDefault();

this.register();

}

);

},
    // ======================================
// REGISTER
// ======================================

async register(){

const shaliniID=

document.getElementById("shaliniId")
.value.trim();

const fullName=

document.getElementById("fullName")
.value.trim();

const mobile=

document.getElementById("mobile")
.value.trim();

const email=

document.getElementById("email")
.value.trim();

const password=

document.getElementById("password")
.value;

const confirmPassword=

document.getElementById("confirmPassword")
.value;

const terms=

document.getElementById("terms")
.checked;



// ======================================
// VALIDATION
// ======================================

if(

!shaliniID ||

!fullName ||

!mobile ||

!email ||

!password

){

alert("Please fill all required fields.");

return;

}

if(mobile.length!=10){

alert("Enter valid mobile number.");

return;

}

if(password!=confirmPassword){

alert("Passwords do not match.");

return;

}

if(!terms){

alert("Please accept Terms & Conditions.");

return;

}



// ======================================
// BUTTON LOADING
// ======================================

const button =
document.querySelector(
"#candidateRegisterForm button[type='submit']"
);

const oldText =
button.innerHTML;

button.disabled = true;

button.innerHTML =
'<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

    
    // ======================================
// API CALL
// ======================================

const response=

await API.registerCandidate({

shaliniID:shaliniID,

fullName:fullName,

mobile:mobile,

email:email,

password:password

});



// ======================================
// RESET BUTTON
// ======================================

button.disabled=false;

button.innerHTML=oldText;



// ======================================
// RESPONSE
// ======================================

if(response.success){

alert(

"Registration Successful!\n\n" +

"Candidate ID : " +

response.candidateID

);

window.location.href=

"candidate-login.html";

return;

}



alert(response.message);

},

    // ======================================
// LOGIN FORM
// ======================================

bindLoginForm(){

const form=

document.getElementById(

"candidateLoginForm"

);

if(!form) return;

form.addEventListener(

"submit",

(e)=>{

e.preventDefault();

this.login();

}

);

},

    // ======================================
// LOGIN
// ======================================

async login(){

const email=

document.getElementById("email")
.value.trim();

const password=

document.getElementById("password")
.value;



// ======================================
// VALIDATION
// ======================================

if(!email || !password){

alert("Please enter Email and Password.");

return;

}



// ======================================
// BUTTON LOADING
// ======================================

const button=

document.querySelector(

"#candidateLoginForm button[type='submit']"

);

const oldText=

button.innerHTML;

button.disabled=true;

button.innerHTML="Logging In...";



// ======================================
// API CALL
// ======================================

const response=

await API.loginCandidate({

email:email,

password:password

});

    // ======================================
// RESET BUTTON
// ======================================

button.disabled=false;

button.innerHTML=oldText;



// ======================================
// LOGIN FAILED
// ======================================

if(!response.success){

alert(response.message);

return;

}



// ======================================
// SAVE SESSION
// ======================================

Storage.saveCandidate({

candidateID:response.data.candidateID,

shaliniID:response.data.shaliniID,

fullName:response.data.fullName,

email:response.data.email,

profileStatus:response.data.profileStatus,

accountStatus:response.data.accountStatus

});



// ======================================
// SUCCESS
// ======================================

alert("Login Successful.");

window.location.href=

"candidate-dashboard.html";

},

    // ======================================
// CHECK LOGIN
// ======================================

checkLogin(){

const currentPage=
window.location.pathname;

const protectedPages=[

"candidate-dashboard.html",

"candidate-profile.html",

"available-jobs.html",

"job-details.html",

"my-applications.html"

];

for(let i=0;i<protectedPages.length;i++){

if(currentPage.includes(protectedPages[i])){

const session=
Storage.getCandidate();

if(!session){

window.location.href=
"candidate-login.html";

return;

}

}

}

},

// ======================================
// LOGOUT
// ======================================

logout(){

Storage.removeCandidate();

alert("Logged out successfully.");

window.location.href=
"candidate-login.html";

},

    // ======================================
// LOAD DASHBOARD
// ======================================

async loadDashboard(){

const session=
Storage.getCandidate();

if(!session){

window.location.href=
"candidate-login.html";

return;

}

const response=

await API.getCandidateDashboard({

candidateID:session.candidateID

});

if(!response.success){

alert(response.message);

return;

}

const dashboard=
response.data;



// ======================================
// WELCOME NAME
// ======================================

const name=

document.getElementById("candidateName");

if(name){

name.innerHTML=
session.fullName;

}



// ======================================
// TOTAL APPLICATIONS
// ======================================

const total=

document.getElementById("totalApplications");

if(total){

total.innerHTML=
dashboard.totalApplications || 0;

}



// ======================================
// SHORTLISTED
// ======================================

const shortlisted=

document.getElementById("shortlistedJobs");

if(shortlisted){

shortlisted.innerHTML=
dashboard.shortlistedJobs || 0;

}



// ======================================
// INTERVIEW
// ======================================

const interview=

document.getElementById("interviewCalls");

if(interview){

interview.innerHTML=
dashboard.interviewCalls || 0;

}



// ======================================
// SELECTED
// ======================================

const selected=

document.getElementById("selectedJobs");

if(selected){

selected.innerHTML=
dashboard.selectedJobs || 0;

}



// ======================================
// PROFILE STATUS
// ======================================

const profile=

document.getElementById("profileStatus");

if(profile){

profile.innerHTML=
session.profileStatus ||
"Profile Incomplete";

}

await this.loadRecentApplications();
    
},

// ======================================
// LOAD RECENT APPLICATIONS
// ======================================

async loadRecentApplications(){

const session=Storage.getCandidate();

if(!session) return;

const response=
await API.getCandidateApplications({

candidateID:session.candidateID

});

if(!response.success){

return;

}

const tbody=
document.getElementById("applicationTableBody");

if(!tbody) return;

tbody.innerHTML="";

response.applications
.slice(0,5)
.forEach(app=>{

let statusClass="status-pending";

if(app.applicationStatus=="Shortlisted"){

statusClass="status-approved";

}

else if(app.applicationStatus=="Rejected"){

statusClass="status-rejected";

}

tbody.innerHTML+=`

<tr>

<td>${app.jobTitle}</td>

<td>${app.companyName}</td>

<td>${new Date(app.appliedDate).toLocaleDateString("en-GB",{

day:"2-digit",

month:"short",

year:"numeric"

})}</td>

<td>

<span class="status ${statusClass}">

${app.applicationStatus}

</span>

</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="Candidate.viewJob('${app.jobID}')">

View

</button>

</td>

</tr>

`;

});

},
    
 // ======================================
// LOAD PROFILE
// ======================================

async loadProfile(){

const session=
Storage.getCandidate();

if(!session){

window.location.href=
"candidate-login.html";

return;

}

const response=

await API.getCandidateProfile({

candidateID:session.candidateID

});

if(!response.success){

alert(response.message);

return;

}

const profile=
response.data;

// ======================================
// UPDATE LOCAL STORAGE
// ======================================

Storage.saveCandidate({

...session,

...profile

});



// ======================================
// FILL FORM
// ======================================

this.fillField("candidateID",profile.candidateID);

this.fillField("shaliniID",profile.shaliniID);

this.fillField("fullName",profile.fullName);

this.fillField("gender",profile.gender);

this.fillField("dob",profile.dob);

this.fillField("currentCity",profile.currentCity);

this.fillField("mobile",profile.mobile);

this.fillField("email",profile.email);

this.fillField("education",profile.education);

this.fillField("qualification",profile.qualification);

this.fillField("passingYear",profile.passingYear);

this.fillField("skills",profile.skills);

this.fillField("experience",profile.experience);

this.fillField("employmentStatus",profile.employmentStatus);

this.fillField("preferredLocation",profile.preferredLocation);

this.fillField("expectedSalary",profile.expectedSalary);

this.fillField("aboutCandidate",profile.aboutCandidate);

this.updateProfileProgress();

},

    // ======================================
// FILL FIELD
// ======================================

fillField(id,value){

const element=

document.getElementById(id);

if(element){

element.value=value || "";

}

},


// ======================================
// UPDATE PROFILE
// ======================================

async updateProfile(){

const session=

Storage.getCandidate();

if(!session){

window.location.href=

"candidate-login.html";

return;

}
    // ======================================
// BUTTON LOADING
// ======================================

const button = document.querySelector(
"#candidateProfileForm button[type='submit']"
);

const oldText = button.innerHTML;

button.disabled = true;

button.innerHTML =
'<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

const data={

candidateID:session.candidateID,

fullName:document.getElementById("fullName").value,

gender:document.getElementById("gender").value,

dob:document.getElementById("dob").value,

currentCity:document.getElementById("currentCity").value,

mobile:document.getElementById("mobile").value,

education:document.getElementById("education").value,

qualification:document.getElementById("qualification").value,

passingYear:document.getElementById("passingYear").value,

skills:document.getElementById("skills").value,

experience:document.getElementById("experience").value,

employmentStatus:document.getElementById("employmentStatus").value,

preferredLocation:document.getElementById("preferredLocation").value,

expectedSalary:document.getElementById("expectedSalary").value,

aboutCandidate:document.getElementById("aboutCandidate").value

};

const response=

await API.updateCandidateProfile(data);
    
    // ======================================
// RESET BUTTON
// ======================================

button.disabled = false;

button.innerHTML = oldText;

if(!response.success){

    button.disabled = false;

button.innerHTML = oldText;

alert(response.message);

return;

}

Storage.saveCandidate({

...session,

...data,

profileStatus:"Profile Complete"

});

alert("Profile Updated Successfully.");

this.updateProfileProgress();

},

    // ======================================
// PROFILE PROGRESS
// ======================================

updateProfileProgress(){

const fields=[

"fullName",

"gender",

"dob",

"currentCity",

"mobile",

"education",

"qualification",

"passingYear",

"skills",

"experience",

"employmentStatus",

"preferredLocation",

"expectedSalary",

"aboutCandidate"

];

let filled=0;

fields.forEach(id=>{

const element=

document.getElementById(id);

if(element && element.value.trim()!=""){

filled++;

}

});

const percent=

Math.round(

(filled/fields.length)*100

);

const label=

document.getElementById(

"profilePercent"

);

if(label){

label.innerHTML=

percent+"%";

}

const bar=

document.getElementById(

"profileProgress"

);

if(bar){

bar.style.width=

percent+"%";

}

},


// ======================================
// PROFILE INIT
// ======================================

initProfile(){

const page=

window.location.pathname;

if(!page.includes(

"candidate-profile.html"

)) return;

this.loadProfile();

const form=

document.getElementById(

"candidateProfileForm"

);

if(form){

form.addEventListener(

"submit",

(e)=>{

e.preventDefault();

this.updateProfile();

}

);

}

const controls=

document.querySelectorAll(

"#candidateProfileForm input,#candidateProfileForm select,#candidateProfileForm textarea"

);

controls.forEach(control=>{

control.addEventListener(

"input",

()=>{

this.updateProfileProgress();

}

);

control.addEventListener(

"change",

()=>{

this.updateProfileProgress();

}

);

});

},

  // ======================================
// DASHBOARD INIT
// ======================================

initDashboard(){

const page=

window.location.pathname;

if(page.includes("candidate-dashboard.html")){

this.loadDashboard();

}

},


// ======================================
// LOAD JOBS
// ======================================

async loadJobs(){

const response=

await API.getAvailableJobs();

if(!response.success) return;

const container=

document.getElementById("jobsContainer");

if(!container) return;

container.innerHTML="";

response.data.forEach(job=>{

container.innerHTML+=`

<div class="job-card">

<h3>${job.jobTitle}</h3>

<h4>${job.companyName}</h4>

<p><b>Location :</b> ${job.location}</p>

<p><b>Salary :</b> ₹${job.salaryMin} - ₹${job.salaryMax}</p>

<p><b>Experience :</b> ${job.experience}</p>

<button
class="btn btn-primary"
onclick="Candidate.viewJob('${job.jobID}')">

View Details

</button>

</div>

`;

});

},


// ======================================
// VIEW JOB
// ======================================

async viewJob(jobID){

const response=

await API.getJobDetails({

jobID:jobID

});

if(!response.success){

alert(response.message);

return;

}

Storage.saveJob(response.data);

window.location.href="job-details.html";

},


// ======================================
// APPLY JOB
// ======================================

async applyJob(jobID){

const session=

Storage.getCandidate();

if(!session){

window.location.href="candidate-login.html";

return;

}

if(!confirm("Apply for this job?")) return;

const response=

await API.applyJob({

candidateID:session.candidateID,

jobID:jobID

});

if(response.success){

alert("Application submitted successfully.");

window.location.href="my-applications.html";

}

else{

alert(response.message);

}

},


// ======================================
// JOBS INIT
// ======================================

initJobs(){

const page=

window.location.pathname;

if(page.includes("available-jobs.html")){

this.loadJobs();

}

},


// ======================================
// JOB DETAILS INIT
// ======================================

initJobDetails(){

const page=

window.location.pathname;

if(!page.includes("job-details.html")) return;

const job=

Storage.getJob();

if(!job) return;

const map={

jobTitle:job.jobTitle,

companyName:job.companyName,

location:job.location,

salary:"₹"+job.salaryMin+" - ₹"+job.salaryMax,

description:job.jobDescription,

skills:job.skills

};

Object.keys(map).forEach(id=>{

const el=

document.getElementById(id);

if(el){

el.innerHTML=map[id];

}

});

}

};



// ======================================
// START MODULE
// ======================================

document.addEventListener(

"DOMContentLoaded",

()=>{

Candidate.init();

}

);  
