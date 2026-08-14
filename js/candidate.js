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

this.initMyApplications();

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
// DASHBOARD CARDS
// ======================================

const total =
document.getElementById("totalApplications");

if(total){

total.innerHTML =
dashboard.totalApplications || 0;

}

const viewed =
document.getElementById("viewed");

if(viewed){

viewed.innerHTML =
dashboard.viewed || 0;

}

const shortlisted =
document.getElementById("shortlisted");

if(shortlisted){

shortlisted.innerHTML =
dashboard.shortlisted || 0;

}

const interview =
document.getElementById("interview");

if(interview){

interview.innerHTML =
dashboard.interview || 0;

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

window.location.href =
"job-details.html?id=" + jobID;

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
// MY APPLICATIONS INIT
// ======================================

initMyApplications(){

const page=

window.location.pathname;

if(page.includes("my-applications.html")){

this.loadMyApplications();

}

},

// ======================================
// LOAD MY APPLICATIONS
// ======================================

async loadMyApplications(){

const session=Storage.getCandidate();

if(!session) return;

const response=
await API.getCandidateApplications({

candidateID:session.candidateID

});

console.log(response);

if(!response.success){

alert(response.message);

return;

}

const applications=response.applications || [];

// ======================
// COUNTS
// ======================

let viewed=0;
let shortlisted=0;
let interview=0;
let rejected=0;

applications.forEach(app=>{

switch(app.applicationStatus){

case "Viewed":
viewed++;
break;

case "Shortlisted":
shortlisted++;
break;

case "Interview":
interview++;
break;

case "Rejected":
rejected++;
break;

}

});

// ======================
// UPDATE CARDS
// ======================

document.getElementById("totalApplications").innerHTML=
applications.length;

document.getElementById("viewedCount").innerHTML=
viewed;

document.getElementById("shortlistedCount").innerHTML=
shortlisted;

document.getElementById("interviewCount").innerHTML=
interview;

document.getElementById("rejectedCount").innerHTML=
rejected;

// ======================
// TABLE
// ======================

const tbody=
document.getElementById("applicationTable");

if(!tbody) return;

tbody.innerHTML="";

applications.forEach(app=>{

let statusClass="status-pending";

switch(app.applicationStatus){

case "Viewed":
statusClass="status-info";
break;

case "Shortlisted":
statusClass="status-approved";
break;

case "Interview":
statusClass="status-warning";
break;

case "Rejected":
statusClass="status-rejected";
break;

}

tbody.innerHTML+=`

<tr>

<td>${app.jobTitle}</td>

<td>${app.companyName}</td>

<td>${new Date(app.appliedDate).toLocaleDateString("en-GB")}</td>

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

// ======================
// EMPTY STATE
// ======================

const empty=
document.getElementById("noApplications");

if(empty){

empty.style.display=
applications.length==0 ? "block":"none";

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

// ======================================
// CANDIDATE WORK EXPERIENCE
// ======================================

document.addEventListener("DOMContentLoaded", function(){

    const addExperienceBtn =
        document.getElementById("addExperienceBtn");

    const cancelExperienceBtn =
        document.getElementById("cancelExperienceBtn");

    const saveExperienceBtn =
        document.getElementById("saveExperienceBtn");

    const experienceForm =
        document.getElementById("experienceForm");

    const experienceList =
        document.getElementById("experienceList");

    if(!addExperienceBtn || !experienceForm){

        return;

    }


    // ==================================
    // SHOW EXPERIENCE FORM
    // ==================================

    addExperienceBtn.addEventListener("click", function(){

        clearExperienceForm();

        experienceForm.style.display = "block";

        experienceForm.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

    });


    // ==================================
    // CANCEL EXPERIENCE
    // ==================================

    if(cancelExperienceBtn){

        cancelExperienceBtn.addEventListener("click", function(){

            experienceForm.style.display = "none";

            clearExperienceForm();

        });

    }


    // ==================================
// SAVE / UPDATE EXPERIENCE
// ==================================

if(saveExperienceBtn){

    saveExperienceBtn.addEventListener(
        "click",
        async function(){

            const candidate =
                Storage.getCandidate();

            if(!candidate || !candidate.candidateID){

                alert(
                    "Candidate session not found. Please login again."
                );

                return;

            }


            const companyName =
                document.getElementById(
                    "experienceCompanyName"
                ).value.trim();


            const jobTitle =
                document.getElementById(
                    "experienceJobTitle"
                ).value.trim();


            const employmentType =
                document.getElementById(
                    "experienceEmploymentType"
                ).value;


            const location =
                document.getElementById(
                    "experienceLocation"
                ).value.trim();


            const startDate =
                document.getElementById(
                    "experienceStartDate"
                ).value;


            const endDate =
                document.getElementById(
                    "experienceEndDate"
                ).value;


            const currentlyWorking =
                document.getElementById(
                    "experienceCurrentlyWorking"
                ).value;


            const responsibilities =
                document.getElementById(
                    "experienceResponsibilities"
                ).value.trim();


            // ==================================
            // VALIDATION
            // ==================================

            if(!companyName || !jobTitle || !startDate){

                alert(
                    "Company Name, Job Title and Start Date are required."
                );

                return;

            }


            // ==================================
            // CHECK EDIT MODE
            // ==================================

            const editingID =
                experienceForm.dataset.editingID || "";


            // ==================================
            // LOADING
            // ==================================

            saveExperienceBtn.disabled = true;

            saveExperienceBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';


            let result;


            // ==================================
            // UPDATE EXISTING EXPERIENCE
            // ==================================

            if(editingID){

                result =
                    await API.updateCandidateExperience({

                        experienceID:
                            editingID,

                        companyName:
                            companyName,

                        jobTitle:
                            jobTitle,

                        employmentType:
                            employmentType,

                        startDate:
                            startDate,

                        endDate:
                            endDate,

                        currentlyWorking:
                            currentlyWorking,

                        location:
                            location,

                        responsibilities:
                            responsibilities

                    });

            }


            // ==================================
            // ADD NEW EXPERIENCE
            // ==================================

            else{

                result =
                    await API.addCandidateExperience({

                        candidateID:
                            candidate.candidateID,

                        companyName:
                            companyName,

                        jobTitle:
                            jobTitle,

                        employmentType:
                            employmentType,

                        startDate:
                            startDate,

                        endDate:
                            endDate,

                        currentlyWorking:
                            currentlyWorking,

                        location:
                            location,

                        responsibilities:
                            responsibilities

                    });

            }


            // ==================================
            // RESET BUTTON
            // ==================================

            saveExperienceBtn.disabled = false;


            // ==================================
            // RESPONSE
            // ==================================

            if(result && result.success){

                alert(result.message);

                clearExperienceForm();

                experienceForm.style.display = "none";

                loadCandidateExperience();

            }
            else{

                alert(
                    result && result.message
                    ? result.message
                    : "Unable to save experience."
                );

            }

        }
    );

}

    // ==================================
    // LOAD EXPERIENCE
    // ==================================

    loadCandidateExperience();


    // ==================================
    // LOAD FUNCTION
    // ==================================

    async function loadCandidateExperience(){

    const candidate =
    Storage.getCandidate();

    console.log("CANDIDATE SESSION:", candidate);

    if(!candidate || !candidate.candidateID){

        console.log("NO CANDIDATE SESSION");

        return;

    }

    const result =
    await API.getCandidateExperience({

        candidateID:
        candidate.candidateID

    });

    console.log("EXPERIENCE API RESULT:", result);

    if(!result){

        console.log("NO API RESULT");

        return;

    }

    if(!result.success){

        console.log("EXPERIENCE API ERROR:", result.message);

        return;

    }

    console.log("EXPERIENCE DATA:", result.data);

    renderCandidateExperience(
        result.data || []
    );

}

    // ==================================
// RENDER EXPERIENCE
// ==================================

function renderCandidateExperience(experiences){

    if(!experienceList){

        return;

    }


    experienceList.innerHTML = "";


    if(experiences.length === 0){

        experienceList.innerHTML = `

            <div style="
                padding:20px;
                border:1px solid #e5e7eb;
                border-radius:10px;
                margin-bottom:20px;
            ">

                <p style="margin:0;">
                    No work experience added yet.
                </p>

            </div>

        `;

        return;

    }


    experiences.forEach(function(experience){

        const card =
            document.createElement("div");


        card.style.cssText = `
            padding:25px;
            border:1px solid #e5e7eb;
            border-radius:10px;
            margin-bottom:20px;
        `;


        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                gap:20px;
                flex-wrap:wrap;
            ">

                <div>

                    <h3 style="margin-bottom:5px;">
                        ${escapeHTML(
                            experience.jobTitle || ""
                        )}
                    </h3>

                    <strong>
                        ${escapeHTML(
                            experience.companyName || ""
                        )}
                    </strong>

                    <p style="margin-top:8px;">

                        ${escapeHTML(
                            experience.startDate || ""
                        )}

                        -

                        ${
                            experience.currentlyWorking === "Yes"
                            ? "Present"
                            : escapeHTML(
                                experience.endDate || ""
                            )
                        }

                    </p>

                </div>


                <div style="
                    display:flex;
                    gap:10px;
                    align-items:flex-start;
                ">

                    <button
                        type="button"
                        class="btn btn-outline edit-experience">

                        <i class="fa-solid fa-pen"></i>
                        Edit

                    </button>


                    <button
                        type="button"
                        class="btn delete-experience">

                        <i class="fa-solid fa-trash"></i>
                        Delete

                    </button>

                </div>

            </div>


            ${
                experience.location
                ?
                `<p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHTML(
                        experience.location
                    )}
                </p>`
                :
                ""
            }


            ${
                experience.employmentType
                ?
                `<p>
                    <strong>Employment Type:</strong>
                    ${escapeHTML(
                        experience.employmentType
                    )}
                </p>`
                :
                ""
            }


            ${
                experience.responsibilities
                ?
                `<p style="
                    white-space:pre-line;
                    margin-top:15px;
                ">
                    ${escapeHTML(
                        experience.responsibilities
                    )}
                </p>`
                :
                ""
            }

        `;


        // ==================================
        // EDIT BUTTON
        // ==================================

        card
        .querySelector(".edit-experience")
        .addEventListener(
            "click",
            function(){

                editExperience(experience);

            }
        );


        // ==================================
        // DELETE BUTTON
        // ==================================

        card
        .querySelector(".delete-experience")
        .addEventListener(
            "click",
            function(){

                deleteExperience(experience);

            }
        );


        experienceList.appendChild(card);

    });

}

    // ==================================
// EDIT EXPERIENCE
// ==================================

function editExperience(experience){

    document.getElementById(
        "experienceCompanyName"
    ).value =
        experience.companyName || "";


    document.getElementById(
        "experienceJobTitle"
    ).value =
        experience.jobTitle || "";


    document.getElementById(
        "experienceEmploymentType"
    ).value =
        experience.employmentType || "";


    document.getElementById(
        "experienceLocation"
    ).value =
        experience.location || "";


    document.getElementById(
        "experienceStartDate"
    ).value =
        experience.startDate || "";


    document.getElementById(
        "experienceEndDate"
    ).value =
        experience.endDate || "";


    document.getElementById(
        "experienceCurrentlyWorking"
    ).value =
        experience.currentlyWorking || "No";


    document.getElementById(
        "experienceResponsibilities"
    ).value =
        experience.responsibilities || "";


    experienceForm.style.display = "block";


    experienceForm.dataset.editingID =
        experience.experienceID;


    const saveButton =
        document.getElementById(
            "saveExperienceBtn"
        );


    if(saveButton){

        saveButton.innerHTML =
            '<i class="fa-solid fa-pen"></i> Update Experience';

    }


    experienceForm.scrollIntoView({

        behavior:"smooth",
        block:"start"

    });

}


// ==================================
// DELETE EXPERIENCE
// ==================================

async function deleteExperience(experience){

    if(!experience.experienceID){

        return;

    }


    if(!confirm(
        "Are you sure you want to delete this experience?"
    )){

        return;

    }


    const candidate =
        Storage.getCandidate();


    if(!candidate || !candidate.candidateID){

        alert(
            "Candidate session not found. Please login again."
        );

        return;

    }


    const result =
        await API.deleteCandidateExperience({

            experienceID:
                experience.experienceID

        });


    if(result && result.success){

        alert(result.message);

        loadCandidateExperience();

    }
    else{

        alert(
            result && result.message
            ? result.message
            : "Unable to delete experience."
        );

    }

}


    // ==================================
    // CLEAR EXPERIENCE FORM
    // ==================================

    function clearExperienceForm(){

        document.getElementById(
            "experienceCompanyName"
        ).value = "";

        document.getElementById(
            "experienceJobTitle"
        ).value = "";

        document.getElementById(
            "experienceEmploymentType"
        ).value = "";

        document.getElementById(
            "experienceLocation"
        ).value = "";

        document.getElementById(
            "experienceStartDate"
        ).value = "";

        document.getElementById(
            "experienceEndDate"
        ).value = "";

        document.getElementById(
            "experienceCurrentlyWorking"
        ).value = "No";

        document.getElementById(
            "experienceResponsibilities"
        ).value = "";

    }

    experienceForm.dataset.editingID = "";


saveExperienceBtn.innerHTML =
    '<i class="fa-solid fa-floppy-disk"></i> Save Experience';


    // ==================================
    // HTML SECURITY
    // ==================================

    function escapeHTML(value){

        return String(value)
            .replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;")
            .replace(/'/g,"&#039;");

    }

});

// ======================================
// CANDIDATE CERTIFICATIONS
// ======================================

document.addEventListener("DOMContentLoaded",function(){

    const container =
    document.getElementById("certificationContainer");

    const addButton =
    document.getElementById("addCertificationBtn");

    if(!container || !addButton){

        return;

    }


    // ==================================
    // LOAD CERTIFICATIONS
    // ==================================

    loadCandidateCertifications();


    // ==================================
    // ADD CERTIFICATION
    // ==================================

    addButton.addEventListener(
        "click",
        function(){

            addCertificationForm();

        }
    );


    // ==================================
    // ADD / EDIT CERTIFICATION FORM
    // ==================================

    function addCertificationForm(data = {}){

        const card =
        document.createElement("div");

        card.className =
        "form-container certification-item";

        card.style.marginTop =
        "25px";


        const certificationID =
        data.certificationID || "";


        card.innerHTML = `

            <div class="dashboard-grid">

                <div class="form-group">

                    <label>
                        Certification / Course Name *
                    </label>

                    <input
                        type="text"
                        class="form-control certificationName"
                        value="${escapeHTML(
                            data.certificationName || ""
                        )}"
                        required>

                </div>


                <div class="form-group">

                    <label>
                        Issuing Organization *
                    </label>

                    <input
                        type="text"
                        class="form-control issuingOrganization"
                        value="${escapeHTML(
                            data.issuingOrganization || ""
                        )}"
                        required>

                </div>


                <div class="form-group">

                    <label>
                        Issue Date
                    </label>

                    <input
                        type="date"
                        class="form-control issueDate"
                        value="${escapeHTML(
                            formatDateForInput(
                                data.issueDate || ""
                            )
                        )}">

                </div>


                <div class="form-group">

                    <label>
                        Expiry Date
                    </label>

                    <input
                        type="date"
                        class="form-control expiryDate"
                        value="${escapeHTML(
                            formatDateForInput(
                                data.expiryDate || ""
                            )
                        )}">

                </div>


                <div class="form-group">

                    <label>
                        Credential ID
                    </label>

                    <input
                        type="text"
                        class="form-control credentialID"
                        value="${escapeHTML(
                            data.credentialID || ""
                        )}"
                        placeholder="Optional">

                </div>


                <div class="form-group">

                    <label>
                        Credential URL
                    </label>

                    <input
                        type="url"
                        class="form-control credentialURL"
                        value="${escapeHTML(
                            data.credentialURL || ""
                        )}"
                        placeholder="https://...">

                </div>


                <div class="form-group full-width">

                    <label>
                        Description
                    </label>

                    <textarea
                        class="form-control description"
                        rows="4"
                        placeholder="Briefly describe this certification or course.">${escapeHTML(
                            data.description || ""
                        )}</textarea>

                </div>

            </div>


            <div
                style="
                    display:flex;
                    gap:15px;
                    flex-wrap:wrap;
                    margin-top:20px;
                "
            >

                <button
                    type="button"
                    class="btn btn-primary save-certification">

                    <i class="fa-solid fa-floppy-disk"></i>

                    ${certificationID
                        ? "Update Certification"
                        : "Save Certification"
                    }

                </button>


                <button
                    type="button"
                    class="btn cancel-certification">

                    <i class="fa-solid fa-xmark"></i>

                    Cancel

                </button>


                ${
                    certificationID
                    ?
                    `
                    <button
                        type="button"
                        class="btn delete-certification">

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>
                    `
                    :
                    ""
                }

            </div>

        `;


        container.appendChild(card);


        // ==================================
        // SAVE / UPDATE
        // ==================================

        card
        .querySelector(".save-certification")
        .addEventListener(
            "click",
            async function(){

                const candidate =
                Storage.getCandidate();


                if(
                    !candidate ||
                    !candidate.candidateID
                ){

                    alert(
                        "Candidate session not found. Please login again."
                    );

                    return;

                }


                const certificationData = {

                    candidateID:
                    candidate.candidateID,

                    certificationID:
                    certificationID,

                    certificationName:
                    card
                    .querySelector(
                        ".certificationName"
                    )
                    .value
                    .trim(),

                    issuingOrganization:
                    card
                    .querySelector(
                        ".issuingOrganization"
                    )
                    .value
                    .trim(),

                    issueDate:
                    card
                    .querySelector(
                        ".issueDate"
                    )
                    .value,

                    expiryDate:
                    card
                    .querySelector(
                        ".expiryDate"
                    )
                    .value,

                    credentialID:
                    card
                    .querySelector(
                        ".credentialID"
                    )
                    .value
                    .trim(),

                    credentialURL:
                    card
                    .querySelector(
                        ".credentialURL"
                    )
                    .value
                    .trim(),

                    description:
                    card
                    .querySelector(
                        ".description"
                    )
                    .value
                    .trim()

                };


                // ==============================
                // VALIDATION
                // ==============================

                if(
                    !certificationData.certificationName
                ){

                    alert(
                        "Certification / Course Name is required."
                    );

                    return;

                }


                if(
                    !certificationData.issuingOrganization
                ){

                    alert(
                        "Issuing Organization is required."
                    );

                    return;

                }


                // ==============================
                // BUTTON LOADING
                // ==============================

                const saveButton =
                card.querySelector(
                    ".save-certification"
                );


                const oldText =
                saveButton.innerHTML;


                saveButton.disabled =
                true;


                saveButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';


                let result;


                // ==============================
                // UPDATE EXISTING
                // ==============================

                if(certificationID){

                    result =
                    await API.updateCandidateCertification(
                        certificationData
                    );

                }


                // ==============================
                // CREATE NEW
                // ==============================

                else{

                    result =
                    await API.saveCandidateCertification(
                        certificationData
                    );

                }


                // ==============================
                // RESET BUTTON
                // ==============================

                saveButton.disabled =
                false;

                saveButton.innerHTML =
                oldText;


                // ==============================
                // RESPONSE
                // ==============================

                if(
                    result &&
                    result.success
                ){

                    alert(
                        result.message ||
                        (
                            certificationID
                            ?
                            "Certification updated successfully."
                            :
                            "Certification saved successfully."
                        )
                    );


                    loadCandidateCertifications();

                }

                else{

                    alert(
                        result &&
                        result.message
                        ?
                        result.message
                        :
                        "Unable to save certification."
                    );

                }

            }
        );


        // ==================================
        // CANCEL
        // ==================================

        card
        .querySelector(".cancel-certification")
        .addEventListener(
            "click",
            function(){

                card.remove();

            }
        );


        // ==================================
        // DELETE
        // ==================================

        const deleteButton =
        card.querySelector(
            ".delete-certification"
        );


        if(deleteButton){

            deleteButton.addEventListener(
                "click",
                async function(){

                    if(
                        !confirm(
                            "Are you sure you want to delete this certification?"
                        )
                    ){

                        return;

                    }


                    const result =
                    await API.deleteCandidateCertification({

                        certificationID:
                        certificationID

                    });


                    if(
                        result &&
                        result.success
                    ){

                        alert(
                            result.message ||
                            "Certification deleted successfully."
                        );


                        loadCandidateCertifications();

                    }

                    else{

                        alert(
                            result &&
                            result.message
                            ?
                            result.message
                            :
                            "Unable to delete certification."
                        );

                    }

                }
            );

        }

    }


    // ==================================
    // LOAD CERTIFICATIONS
    // ==================================

    async function loadCandidateCertifications(){

        const candidate =
        Storage.getCandidate();


        if(
            !candidate ||
            !candidate.candidateID
        ){

            return;

        }


        container.innerHTML = "";


        const result =
        await API.getCandidateCertifications({

            candidateID:
            candidate.candidateID

        });


        console.log(
            "Certification Response:",
            result
        );


        if(
            !result ||
            !result.success
        ){

            console.error(
                result &&
                result.message
                ?
                result.message
                :
                "Unable to load certifications."
            );

            return;

        }


        const certifications =
        result.data || [];


        if(
            certifications.length === 0
        ){

            container.innerHTML = `

                <div
                    style="
                        padding:20px;
                        border:1px solid #e5e7eb;
                        border-radius:10px;
                        margin-bottom:20px;
                    "
                >

                    <p style="margin:0;">

                        No certifications added yet.

                    </p>

                </div>

            `;

            return;

        }


        certifications.forEach(
            function(certification){

                addCertificationForm(
                    certification
                );

            }
        );

    }


    // ==================================
    // FORMAT DATE
    // ==================================

    function formatDateForInput(value){

        if(!value){

            return "";

        }


        const date =
        new Date(value);


        if(
            isNaN(date.getTime())
        ){

            return String(value)
            .substring(0,10);

        }


        return date
        .toISOString()
        .substring(0,10);

    }


    // ==================================
    // HTML SECURITY
    // ==================================

    function escapeHTML(value){

        return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

    }

});

// ======================================
// CANDIDATE SOCIAL PROFILES
// ======================================

document.addEventListener("DOMContentLoaded", function(){

    const linkedinURL =
    document.getElementById("linkedinURL");

    const naukriURL =
    document.getElementById("naukriURL");

    const otherProfileURL =
    document.getElementById("otherProfileURL");


    // ==================================
    // LOAD SOCIAL PROFILES
    // ==================================

    loadCandidateSocialProfiles();


    async function loadCandidateSocialProfiles(){

        const candidate =
        Storage.getCandidate();

        if(!candidate || !candidate.candidateID){

            return;

        }


        const result =
        await API.getCandidateSocialProfiles({

            candidateID:
            candidate.candidateID

        });


        if(!result || !result.success){

            return;

        }


        const social =
        result.data || {};


        if(linkedinURL){

            linkedinURL.value =
            social.linkedinURL || "";

        }


        if(naukriURL){

            naukriURL.value =
            social.naukriURL || "";

        }


        if(otherProfileURL){

            otherProfileURL.value =
            social.otherProfileURL || "";

        }

    }


    // ==================================
    // SAVE SOCIAL PROFILES
    // ==================================

    const saveProfileButton =
    document.querySelector(
        "#candidateProfileForm button[type='submit']"
    );


    if(saveProfileButton){

        saveProfileButton.addEventListener(
            "click",
            async function(){

                const candidate =
                Storage.getCandidate();

                if(!candidate || !candidate.candidateID){

                    return;

                }


                const socialData = {

                    candidateID:
                    candidate.candidateID,

                    linkedinURL:
                    linkedinURL
                    ? linkedinURL.value.trim()
                    : "",

                    naukriURL:
                    naukriURL
                    ? naukriURL.value.trim()
                    : "",

                    otherProfileURL:
                    otherProfileURL
                    ? otherProfileURL.value.trim()
                    : ""

                };


                const result =
                await API.saveCandidateSocialProfiles(
                    socialData
                );


                if(!result || !result.success){

                    console.error(
                        result?.message ||
                        "Unable to save social profiles."
                    );

                }

            }
        );

    }

});
