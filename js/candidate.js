// ======================================
// UCPP CANDIDATE MODULE
// Version : 1.0.0
// ======================================

const Candidate = {

    // =================================
    // INITIALIZE
    // =================================

    init() {

        this.bindRegisterForm();

    },

    

    // =================================
    // REGISTER FORM
    // =================================

    bindRegisterForm() {

        const form = document.getElementById("candidateRegisterForm");

        if (!form) return;

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            this.register();

        });

    },



    // =================================
    // REGISTER
    // =================================

    async register() {

        const shaliniID =
            document.getElementById("shaliniId").value.trim();

        const fullName =
            document.getElementById("fullName").value.trim();

        const mobile =
            document.getElementById("mobile").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms =
            document.getElementById("terms").checked;



        // ==========================
        // VALIDATION
        // ==========================

        if (
            !shaliniID ||
            !fullName ||
            !mobile ||
            !email ||
            !password
        ) {

            alert("Please fill all required fields.");

            return;

        }

        if (mobile.length !== 10) {

            alert("Enter a valid 10 digit mobile number.");

            return;

        }

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        if (!terms) {

            alert("Please accept Terms & Conditions.");

            return;

        }



        // ==========================
        // BUTTON LOADING
        // ==========================

        const submitBtn =
            document.querySelector("#candidateRegisterForm button[type='submit']");

        const originalText =
            submitBtn.innerHTML;

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            "Creating Account...";



        // ==========================
        // API CALL
        // ==========================

        const response =
            await API.registerCandidate({

                shaliniID,

                fullName,

                mobile,

                email,

                password

            });



        submitBtn.disabled = false;

        submitBtn.innerHTML = originalText;



        // ==========================
        // RESPONSE
        // ==========================

        if (response.success) {

            alert(
                "Registration Successful!\n\nCandidate ID : " +
                response.candidateID
            );

            window.location.href =
                "candidate-login.html";

        }

        else {

            alert(response.message);

        }

    }

};


// ======================================
// CANDIDATE LOGIN
// ======================================


Candidate.bindLoginForm = function(){


    const form =
    document.getElementById("candidateLoginForm");


    if(!form) return;



    form.addEventListener(
        "submit",
        (e)=>{


            e.preventDefault();


            Candidate.login();


        }
    );


};





// ======================================
// LOGIN
// ======================================

Candidate.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {

        alert("Please enter Email and Password.");

        return;

    }

    const button =
        document.querySelector("#candidateLoginForm button[type='submit']");

    const oldText = button.innerHTML;

    button.disabled = true;
    button.innerHTML = "Logging In...";

    const response =
        await API.loginCandidate({

            email: email,
            password: password

        });

    button.disabled = false;
    button.innerHTML = oldText;

    if (!response.success) {

        alert(response.message);

        return;

    }

    // ==============================
    // SAVE COMPLETE SESSION
    // ==============================

    Storage.saveCandidate({

        candidateID: response.candidateID,
        shaliniID: response.shaliniID,
        fullName: response.fullName,
        email: email,

        profileStatus: response.profileStatus,
        accountStatus: response.accountStatus

    });

    alert("Login Successful");

    window.location.href =
        "candidate-dashboard.html";

};




// ======================================
// CHECK LOGIN
// ======================================


Candidate.checkLogin = function(){



    const currentPage =
    window.location.pathname;



    const protectedPages = [


        "candidate-dashboard.html",

        "candidate-profile.html",

        "my-applications.html"


    ];



    protectedPages.forEach(
        (page)=>{


            if(
                currentPage.includes(page)
            ){



                if(
                    !Storage.getCandidate()
                ){


                    window.location.href =
                    "candidate-login.html";


                }



            }



        }
    );


};





// ======================================
// LOGOUT
// ======================================


Candidate.logout = function(){



    Storage.removeCandidate();



    alert(
        "Logged out successfully."
    );



    window.location.href =
    "candidate-login.html";


};





// ======================================
// UPDATE INIT
// ======================================


const oldCandidateInit =
Candidate.init;

Candidate.init=function(){

 this.bindRegisterForm();

 this.bindLoginForm();

 this.checkLogin();

 this.initDashboard();

 this.initProfile();

 this.initJobs();

 this.initJobDetails();

};

// ======================================
// CANDIDATE DASHBOARD
// ======================================



Candidate.loadDashboard = async function(){


    const candidate =
    Storage.getCandidate();



    if(!candidate){

        window.location.href =
        "candidate-login.html";

        return;

    }




    const response =
    await API.getCandidateDashboard({


        candidateID:
        candidate.candidateID



    });




    if(response.success){



        const dashboard =
        response.data;



        // ==========================
        // Welcome Name
        // ==========================


        const nameElement =
        document.getElementById(
            "candidateName"
        );


        if(nameElement){


            nameElement.innerHTML =
            candidate.fullName;


        }





        // ==========================
        // Statistics
        // ==========================



        const applications =
        document.getElementById(
            "totalApplications"
        );


        if(applications){


            applications.innerHTML =
            dashboard.totalApplications || 0;


        }





        const shortlisted =
        document.getElementById(
            "shortlistedCandidates"
        );


        if(shortlisted){


            shortlisted.innerHTML =
            dashboard.shortlistedCandidates || 0;


        }






        const selected =
        document.getElementById(
            "selectedCandidates"
        );


        if(selected){


            selected.innerHTML =
            dashboard.selectedCandidates || 0;


        }






        // ==========================
        // Profile Status
        // ==========================



        const profileStatus =
        document.getElementById(
            "profileStatus"
        );



        if(profileStatus){



            profileStatus.innerHTML =

            candidate.profileStatus ||

            "Profile Incomplete";



        }





    }

    else{


        console.log(
            response.message
        );


    }


};






// ======================================
// DASHBOARD INIT
// ======================================


Candidate.initDashboard = function(){



    const page =
    window.location.pathname;



    if(
        page.includes(
            "candidate-dashboard.html"
        )
    ){


        this.loadDashboard();


    }



};

// ======================================
// CANDIDATE PROFILE MODULE
// ======================================



// ======================================
// LOAD PROFILE
// ======================================

Candidate.loadProfile = async function () {

    const session = Storage.getCandidate();

    if (!session) {

        window.location.href = "candidate-login.html";
        return;

    }

    const response =
        await API.getCandidateProfile({

            candidateID: session.candidateID

        });

    if (!response.success) {

        alert(response.message);
        return;

    }

    const profile = response.data;

    // ==============================
    // UPDATE LOCAL STORAGE
    // ==============================

    Storage.saveCandidate({

        ...session,

        ...profile

    });

    // ==============================
    // AUTO FILL FORM
    // ==============================

    this.fillProfileField("candidateID", profile.Candidate_ID);
    this.fillProfileField("shaliniID", profile.Shalini_ID);

    this.fillProfileField("fullName", profile.Full_Name);

    this.fillProfileField("gender", profile.Gender);

    this.fillProfileField("dob", profile.DOB);

    this.fillProfileField("currentCity", profile.Current_City);

    this.fillProfileField("mobile", profile.Mobile);

    this.fillProfileField("email", profile.Email);

    this.fillProfileField("education", profile.Education);

    this.fillProfileField("qualification", profile.Qualification);

    this.fillProfileField("passingYear", profile.Passing_Year);

    this.fillProfileField("skills", profile.Skills);

    this.fillProfileField("experience", profile.Experience);

    this.fillProfileField("employmentStatus", profile.Employment_Status);

    this.fillProfileField("preferredLocation", profile.Preferred_Location);

    this.fillProfileField("expectedSalary", profile.Expected_Salary);

    this.fillProfileField("aboutCandidate", profile.About_Candidate);

    this.updateProfileProgress();

};




// ======================================
// FILL FIELD
// ======================================

Candidate.fillProfileField = function (id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.value = value || "";

    }

};




// ======================================
// UPDATE PROFILE
// ======================================

Candidate.updateProfile = async function () {

    const session = Storage.getCandidate();

    if (!session) {

        window.location.href = "candidate-login.html";
        return;

    }

    const data = {

        candidateID: session.candidateID,

        fullName: document.getElementById("fullName").value,

        gender: document.getElementById("gender").value,

        dob: document.getElementById("dob").value,

        currentCity: document.getElementById("currentCity").value,

        mobile: document.getElementById("mobile").value,

        email: document.getElementById("email").value,

        education: document.getElementById("education").value,

        qualification: document.getElementById("qualification").value,

        passingYear: document.getElementById("passingYear").value,

        skills: document.getElementById("skills").value,

        experience: document.getElementById("experience").value,

        employmentStatus: document.getElementById("employmentStatus").value,

        preferredLocation: document.getElementById("preferredLocation").value,

        expectedSalary: document.getElementById("expectedSalary").value,

        aboutCandidate: document.getElementById("aboutCandidate").value

    };

    const response =
        await API.updateCandidateProfile(data);

    if (!response.success) {

        alert(response.message);
        return;

    }

    // ==========================
    // UPDATE LOCAL STORAGE
    // ==========================

    Storage.saveCandidate({

        ...session,

        Candidate_ID: session.candidateID,

        Shalini_ID: session.shaliniID,

        Full_Name: data.fullName,

        Gender: data.gender,

        DOB: data.dob,

        Current_City: data.currentCity,

        Mobile: data.mobile,

        Email: data.email,

        Education: data.education,

        Qualification: data.qualification,

        Passing_Year: data.passingYear,

        Skills: data.skills,

        Experience: data.experience,

        Employment_Status: data.employmentStatus,

        Preferred_Location: data.preferredLocation,

        Expected_Salary: data.expectedSalary,

        About_Candidate: data.aboutCandidate,

        Profile_Status: "Profile Complete"

    });

    this.updateProfileProgress();

    alert("Profile Updated Successfully.");

};




// ======================================
// PROFILE PROGRESS
// ======================================

Candidate.updateProfileProgress = function () {

    const fields = [

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

    let filled = 0;

    fields.forEach(id => {

        const element = document.getElementById(id);

        if (element && element.value.trim() !== "") {

            filled++;

        }

    });

    const percent =
        Math.round((filled / fields.length) * 100);

    const percentLabel =
        document.getElementById("profilePercent");

    if (percentLabel) {

        percentLabel.innerHTML = percent + "%";

    }

    const bar =
        document.getElementById("profileProgress");

    if (bar) {

        bar.style.width = percent + "%";

    }

};




// ======================================
// PROFILE INIT
// ======================================

Candidate.initProfile = function () {

    const page = window.location.pathname;

    if (!page.includes("candidate-profile.html")) return;

    // Load profile from Google Sheet
    this.loadProfile();

    // Save Profile Form
    const form = document.getElementById("candidateProfileForm");

    if (form) {

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            Candidate.updateProfile();

        });

    }

    // Live Progress Bar
    const controls = document.querySelectorAll(

        "#candidateProfileForm input, \
         #candidateProfileForm select, \
         #candidateProfileForm textarea"

    );

    controls.forEach(control => {

        control.addEventListener("input", () => {

            Candidate.updateProfileProgress();

        });

        control.addEventListener("change", () => {

            Candidate.updateProfileProgress();

        });

    });

};

// ======================================
// REFRESH PROFILE FORM
// ======================================

Candidate.refreshProfile = function () {

    this.loadProfile();

    this.updateProfileProgress();

};


// ======================================
// CANDIDATE JOB MODULE
// ======================================


Candidate.loadJobs=async function(){

 const response=await API.getAvailableJobs();

 if(response.success){

   const container=document.getElementById("jobsContainer");

   if(!container) return;

   container.innerHTML="";


   response.jobs.forEach(job=>{

    container.innerHTML+=`

    <div class="job-card">

        <h3>${job.jobTitle}</h3>

        <h4>${job.companyName}</h4>

        <p>
        <b>Location:</b> ${job.location}
        </p>

        <p>
        <b>Salary:</b>
        ${job.salaryMin} -
        ${job.salaryMax}
        </p>

        <p>
        <b>Experience:</b>
        ${job.experience}
        </p>

        <button 
        class="btn btn-primary"
        onclick="Candidate.viewJob('${job.jobID}')">

        View Details

        </button>

    </div>

    `;

   });

 }

};




// ======================================
// JOB DETAILS
// ======================================


Candidate.viewJob=async function(jobID){


 const response=
 await API.getJobDetails(jobID);


 if(response.success){


  Storage.saveJob(response.job);


  window.location.href=
  "job-details.html";


 }

 else{

  alert(response.message);

 }

};




// ======================================
// APPLY JOB
// ======================================


Candidate.applyJob=async function(jobID){


 const candidate=
 Storage.getCandidate();


 if(!candidate){

   window.location.href=
   "candidate-login.html";

   return;

 }



 const confirmApply=
 confirm(
 "Are you sure you want to apply for this job?"
 );


 if(!confirmApply)
 return;



 const response=
 await API.applyJob({

   candidateID:
   candidate.candidateID,

   jobID:
   jobID

 });



 if(response.success){


   alert(
   "Job application submitted successfully."
   );


   window.location.href=
   "my-applications.html";


 }

 else{


   alert(response.message);


 }


};




// ======================================
// LOAD JOB PAGE
// ======================================


Candidate.initJobs=function(){


 const page=
 window.location.pathname;


 if(
 page.includes("available-jobs.html")
 ){

   this.loadJobs();

 }


};




// ======================================
// JOB DETAILS PAGE
// ======================================


Candidate.initJobDetails=function(){


 const page=
 window.location.pathname;


 if(
 page.includes("job-details.html")
 ){


   const job=
   Storage.getJob();


   if(!job) return;



   const fields={

   jobTitle:job.jobTitle,

   companyName:job.companyName,

   location:job.location,

   salary:job.salaryMin+
   " - "+
   job.salaryMax,

   description:job.jobDescription,

   skills:job.skills

   };



   Object.keys(fields).forEach(id=>{


    const el=
    document.getElementById(id);


    if(el){

     el.innerHTML=
     fields[id];

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
});
