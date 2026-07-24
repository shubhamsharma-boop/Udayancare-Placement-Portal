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


Candidate.login = async function(){


    const email =
    document.getElementById("email").value.trim();



    const password =
    document.getElementById("password").value;



    if(!email || !password){


        alert(
            "Please enter email and password."
        );


        return;


    }



    const button =
    document.querySelector(
        "#candidateLoginForm button[type='submit']"
    );



    const oldText =
    button.innerHTML;



    button.disabled = true;


    button.innerHTML =
    "Logging in...";




    const response =
    await API.loginCandidate({


        email,

        password


    });





    button.disabled = false;


    button.innerHTML =
    oldText;




    if(response.success){



        // SAVE SESSION

        Storage.saveCandidate(
            response.data
        );



        alert(
            "Login Successful!"
        );



        window.location.href =
        "candidate-dashboard.html";



    }

    else{


        alert(
            response.message
        );


    }


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

Candidate.init = function(){

    this.bindRegisterForm();

    this.bindLoginForm();

    this.checkLogin();

    this.initDashboard();

    this.initProfile();

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


Candidate.loadProfile = async function(){


    const candidate =
    Storage.getCandidate();



    if(!candidate){


        window.location.href =
        "candidate-login.html";


        return;


    }





    const response =
    await API.getCandidateProfile({


        candidateID:
        candidate.candidateID


    });





    if(response.success){



        const profile =
        response.data;




        // Save latest profile

        Storage.saveCandidate(profile);





        // ==========================
        // Fill Profile Fields
        // ==========================



        this.fillProfileField(
            "profileShaliniID",
            profile.shaliniID
        );



        this.fillProfileField(
            "profileFullName",
            profile.fullName
        );



        this.fillProfileField(
            "profileMobile",
            profile.mobile
        );



        this.fillProfileField(
            "profileEmail",
            profile.email
        );



        this.fillProfileField(
            "education",
            profile.education
        );



        this.fillProfileField(
            "qualification",
            profile.qualification
        );



        this.fillProfileField(
            "passingYear",
            profile.passingYear
        );



        this.fillProfileField(
            "skills",
            profile.skills
        );



        this.fillProfileField(
            "experience",
            profile.experience
        );



        this.fillProfileField(
            "preferredLocation",
            profile.preferredLocation
        );



        this.fillProfileField(
            "expectedSalary",
            profile.expectedSalary
        );



        this.fillProfileField(
            "aboutCandidate",
            profile.aboutCandidate
        );



        // Profile Status


        const status =
        document.getElementById(
            "profileStatus"
        );


        if(status){


            status.innerHTML =
            profile.profileStatus ||
            "Profile Incomplete";


        }



    }


};





// ======================================
// FILL INPUT HELPER
// ======================================


Candidate.fillProfileField = function(
    id,
    value
){



    const element =
    document.getElementById(id);



    if(element){


        element.value =
        value || "";


    }


};





// ======================================
// UPDATE PROFILE
// ======================================


Candidate.updateProfile = async function(){



    const candidate =
    Storage.getCandidate();



    if(!candidate){


        return;


    }





    const data = {


        candidateID:
        candidate.candidateID,



        fullName:
        document.getElementById(
            "profileFullName"
        ).value,



        mobile:
        document.getElementById(
            "profileMobile"
        ).value,



        education:
        document.getElementById(
            "education"
        ).value,



        qualification:
        document.getElementById(
            "qualification"
        ).value,



        passingYear:
        document.getElementById(
            "passingYear"
        ).value,



        skills:
        document.getElementById(
            "skills"
        ).value,



        experience:
        document.getElementById(
            "experience"
        ).value,



        preferredLocation:
        document.getElementById(
            "preferredLocation"
        ).value,



        expectedSalary:
        document.getElementById(
            "expectedSalary"
        ).value,



        aboutCandidate:
        document.getElementById(
            "aboutCandidate"
        ).value



    };





    const response =
    await API.updateCandidateProfile(
        data
    );





    if(response.success){



        alert(
            "Profile updated successfully."
        );



        Storage.saveCandidate(
            response.data
        );



        this.updateProfileStatus();



    }

    else{


        alert(
            response.message
        );


    }



};





// ======================================
// PROFILE STATUS
// ======================================


Candidate.updateProfileStatus = function(){



    const candidate =
    Storage.getCandidate();



    if(!candidate)
    return;




    let completed = 0;



    const fields = [


        candidate.fullName,

        candidate.education,

        candidate.qualification,

        candidate.skills,

        candidate.experience,

        candidate.preferredLocation,

        candidate.aboutCandidate


    ];




    fields.forEach(
        field => {


            if(field)
            completed++;


        }
    );




    const percentage =
    Math.round(
        (completed / fields.length) * 100
    );




    const status =
    document.getElementById(
        "profileCompletion"
    );



    if(status){


        status.innerHTML =
        percentage + "% Complete";


    }



};





// ======================================
// PROFILE INIT
// ======================================


Candidate.initProfile = function(){



    const page =
    window.location.pathname;



    if(
        page.includes(
            "candidate-profile.html"
        )
    ){



        this.loadProfile();




        const form =
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
