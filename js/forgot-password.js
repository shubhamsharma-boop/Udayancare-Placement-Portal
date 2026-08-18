```javascript
// ======================================
// UCPP FORGOT PASSWORD
// Version: 2.0.0
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("forgotPasswordForm");

    if (!form) return;

    const emailInput =
        document.getElementById("email");

    const submitButton =
        form.querySelector("button[type='submit']");


    // ======================================
    // RESET STATE
    // ======================================

    let resetEmail = "";
    let otpVerified = false;


    // ======================================
    // SEND OTP
    // ======================================

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (otpVerified) return;


        const email =
            emailInput.value.trim();


        if (!email) {

            alert(
                "Please enter your registered email address."
            );

            return;

        }


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }


        const originalText =
            submitButton.innerHTML;


        submitButton.disabled = true;

        submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Sending OTP...';


        try {

            const response =
                await API.requestPasswordReset({

                    email: email

                });


            if (response && response.success) {

                resetEmail = email;

                showOTPSection();

                alert(
                    response.message ||
                    "OTP has been sent to your registered email address."
                );

            }

            else {

                alert(
                    response &&
                    response.message
                    ?
                    response.message
                    :
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


    // ======================================
    // SHOW OTP SECTION
    // ======================================

    function showOTPSection() {

        const formContainer =
            document.getElementById(
                "forgotPasswordForm"
            );


        formContainer.innerHTML = `

            <div class="form-group">

                <label for="resetOTP">

                    Enter OTP

                </label>

                <input
                    type="text"
                    id="resetOTP"
                    class="form-control"
                    placeholder="Enter 6-digit OTP"
                    maxlength="6"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                >

                <small
                    style="
                        display:block;
                        margin-top:8px;
                        color:#6b7280;
                    "
                >

                    Enter the 6-digit OTP sent to your email address.

                </small>

            </div>


            <button
                type="button"
                id="verifyOTPButton"
                class="btn btn-primary"
                style="width:100%;"
            >

                <i class="fa-solid fa-shield-halved"></i>

                Verify OTP

            </button>


            <button
                type="button"
                id="resendOTPButton"
                class="btn"
                style="
                    width:100%;
                    margin-top:12px;
                "
            >

                <i class="fa-solid fa-rotate-right"></i>

                Resend OTP

            </button>


            <p
                class="text-center mt-30"
            >

                <a href="candidate-login.html">

                    Back to Login

                </a>

            </p>

        `;


        const otpInput =
            document.getElementById("resetOTP");


        otpInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /\D/g,
                        ""
                    );

            }
        );


        document
            .getElementById("verifyOTPButton")
            .addEventListener(
                "click",
                verifyOTP
            );


        document
            .getElementById("resendOTPButton")
            .addEventListener(
                "click",
                resendOTP
            );

    }


    // ======================================
    // VERIFY OTP
    // ======================================

    async function verifyOTP() {

        const otpInput =
            document.getElementById("resetOTP");

        const verifyButton =
            document.getElementById("verifyOTPButton");


        if (!otpInput) return;


        const otp =
            otpInput.value.trim();


        if (!/^\d{6}$/.test(otp)) {

            alert(
                "Please enter a valid 6-digit OTP."
            );

            return;

        }


        verifyButton.disabled = true;

        verifyButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';


        try {

            const response =
                await API.verifyPasswordResetOTP({

                    email: resetEmail,

                    otp: otp

                });


            if (
                response &&
                response.success
            ) {

                otpVerified = true;

                showResetPasswordSection();

            }

            else {

                alert(
                    response &&
                    response.message
                    ?
                    response.message
                    :
                    "Invalid OTP."
                );

            }

        }

        catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            alert(
                "Unable to verify OTP. Please try again."
            );

        }

        finally {

            verifyButton.disabled = false;

            verifyButton.innerHTML =
                '<i class="fa-solid fa-shield-halved"></i> Verify OTP';

        }

    }


    // ======================================
    // RESEND OTP
    // ======================================

    async function resendOTP() {

        if (!resetEmail) return;


        const resendButton =
            document.getElementById(
                "resendOTPButton"
            );


        resendButton.disabled = true;

        resendButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';


        try {

            const response =
                await API.requestPasswordReset({

                    email: resetEmail

                });


            if (
                response &&
                response.success
            ) {

                alert(
                    response.message ||
                    "A new OTP has been sent."
                );

            }

            else {

                alert(
                    response &&
                    response.message
                    ?
                    response.message
                    :
                    "Unable to resend OTP."
                );

            }

        }

        catch (error) {

            console.error(
                "Resend OTP error:",
                error
            );

            alert(
                "Unable to resend OTP. Please try again."
            );

        }

        finally {

            resendButton.disabled = false;

            resendButton.innerHTML =
                '<i class="fa-solid fa-rotate-right"></i> Resend OTP';

        }

    }


    // ======================================
    // SHOW RESET PASSWORD SECTION
    // ======================================

    function showResetPasswordSection() {

        const formContainer =
            document.getElementById(
                "forgotPasswordForm"
            );


        formContainer.innerHTML = `

            <div class="form-group">

                <label for="newPassword">

                    New Password

                </label>

                <input
                    type="password"
                    id="newPassword"
                    class="form-control"
                    placeholder="Enter new password"
                    minlength="8"
                    autocomplete="new-password"
                >

            </div>


            <div class="form-group">

                <label for="confirmPassword">

                    Confirm Password

                </label>

                <input
                    type="password"
                    id="confirmPassword"
                    class="form-control"
                    placeholder="Confirm new password"
                    minlength="8"
                    autocomplete="new-password"
                >

            </div>


            <button
                type="button"
                id="resetPasswordButton"
                class="btn btn-primary"
                style="width:100%;"
            >

                <i class="fa-solid fa-key"></i>

                Reset Password

            </button>


            <p
                class="text-center mt-30"
            >

                <a href="candidate-login.html">

                    Back to Login

                </a>

            </p>

        `;


        document
            .getElementById("resetPasswordButton")
            .addEventListener(
                "click",
                resetPassword
            );

    }


    // ======================================
    // RESET PASSWORD
    // ======================================

    async function resetPassword() {

        const newPassword =
            document
                .getElementById("newPassword")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        const resetButton =
            document.getElementById(
                "resetPasswordButton"
            );


        if (!newPassword) {

            alert(
                "Please enter your new password."
            );

            return;

        }


        if (newPassword.length < 8) {

            alert(
                "Password must be at least 8 characters long."
            );

            return;

        }


        if (newPassword !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;

        }


        resetButton.disabled = true;

        resetButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Resetting...';


        try {

            const response =
                await API.resetPassword({

                    email: resetEmail,

                    newPassword: newPassword

                });


            if (
                response &&
                response.success
            ) {

                alert(
                    response.message ||
                    "Password reset successfully."
                );


                window.location.href =
                    "candidate-login.html";

            }

            else {

                alert(
                    response &&
                    response.message
                    ?
                    response.message
                    :
                    "Unable to reset password."
                );

            }

        }

        catch (error) {

            console.error(
                "Password reset error:",
                error
            );

            alert(
                "Unable to reset password. Please try again."
            );

        }

        finally {

            resetButton.disabled = false;

            resetButton.innerHTML =
                '<i class="fa-solid fa-key"></i> Reset Password';

        }

    }

});
```
