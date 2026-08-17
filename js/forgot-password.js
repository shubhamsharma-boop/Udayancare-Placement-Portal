// ======================================
// UCPP FORGOT PASSWORD
// Version: 1.0.0
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("forgotPasswordForm");

    if (!form) return;


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();


        if (!email) {

            alert("Please enter your registered email address.");

            return;

        }


        const submitButton =
            form.querySelector("button[type='submit']");


        const originalText =
            submitButton.innerHTML;


        submitButton.disabled = true;

        submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Sending OTP...';


        try {

            /*
             * PASSWORD RESET API
             *
             * Backend implementation will be
             * added in the next steps.
             */

            const response =
                await API.requestPasswordReset({

                    email: email

                });


            if (response.success) {

                alert(
                    response.message ||
                    "OTP has been sent to your registered email."
                );

            }
            else {

                alert(
                    response.message ||
                    "Unable to process password reset request."
                );

            }

        }

        catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            alert(
                "Something went wrong. Please try again later."
            );

        }


        finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalText;

        }

    });

});
