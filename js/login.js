document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const loginForm = document.getElementById("loginForm");

    const email = document.getElementById("lMail");
    const password = document.getElementById("lPass");

    const eye = document.getElementById("eye");

    const rememberMe = document.getElementById("lRem");

    const roles = document.querySelectorAll(".role");

    const roleHint = document.getElementById("roleHint");
    const roleOut = document.getElementById("roleOut");

    const emailError = document.getElementById("e1");
    const passwordError = document.getElementById("e2");

    const okMessage = document.getElementById("okmsg");

    const submitBtn = document.getElementById("submitBtn");

    const closeBtn = document.getElementById("closeBtn");


    if (!loginForm) return;


    /* =========================================
       DEFAULT ROLE
    ========================================= */

    let selectedRole = "Customer";


    /* =========================================
       CLEAR MESSAGES & ERRORS
    ========================================= */

    function clearErrors() {

        if (emailError) {
            emailError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        if (okMessage) {
            okMessage.textContent = "";
            okMessage.classList.remove("show");
        }

        if (email) {
            email.classList.remove("invalid");
        }

        if (password) {
            password.classList.remove("invalid");
        }

    }


    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================= */

    if (eye && password) {

        eye.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";

                eye.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

                eye.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                password.type = "password";

                eye.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

                eye.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        });

    }


    /* =========================================
       ROLE SELECTOR
    ========================================= */

    roles.forEach(role => {

        role.addEventListener("click", () => {

            roles.forEach(item => {
                item.classList.remove("active");
            });

            role.classList.add("active");

            selectedRole =
                role.dataset.role || "Customer";


            /* Update button */

            if (roleOut) {
                roleOut.textContent = selectedRole;
            }


            /* Update role description */

            if (roleHint) {

                roleHint.textContent =
                    role.dataset.hint || "";

            }


            clearErrors();

        });

    });


    /* =========================================
       EMAIL / WORKSPACE VALIDATION
    ========================================= */

    function validateEmailOrWorkspace(value) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const workspacePattern =
            /^[A-Za-z0-9_-]{4,}$/;

        return (
            emailPattern.test(value) ||
            workspacePattern.test(value)
        );

    }


    /* =========================================
       PASSWORD VALIDATION
    ========================================= */

    function validatePassword(value) {

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

        return passwordRegex.test(value);

    }


    /* =========================================
       EMAIL INPUT
    ========================================= */

    if (email) {

        email.addEventListener("input", () => {

            email.classList.remove("invalid");

            if (emailError) {
                emailError.textContent = "";
            }

            if (okMessage) {
                okMessage.textContent = "";
                okMessage.classList.remove("show");
            }

        });

    }


    /* =========================================
       PASSWORD INPUT
    ========================================= */

    if (password) {

        password.addEventListener("input", () => {

            password.classList.remove("invalid");

            if (passwordError) {
                passwordError.textContent = "";
            }

            if (okMessage) {
                okMessage.textContent = "";
                okMessage.classList.remove("show");
            }

        });

    }


    /* =========================================
       FORM SUBMIT
    ========================================= */

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        clearErrors();


        const emailValue =
            email.value.trim();

        const passwordValue =
            password.value;

        let valid = true;


        /* =====================================
           EMAIL / WORKSPACE
        ===================================== */

        if (emailValue === "") {

            if (emailError) {

                emailError.textContent =
                    "Please enter your email or workspace ID.";

            }

            email.classList.add("invalid");

            valid = false;

        } else if (!validateEmailOrWorkspace(emailValue)) {

            if (emailError) {

                emailError.textContent =
                    "Enter a valid email or workspace ID.";

            }

            email.classList.add("invalid");

            valid = false;

        }


        /* =====================================
           PASSWORD
        ===================================== */

        if (passwordValue === "") {

            if (passwordError) {

                passwordError.textContent =
                    "Please enter your password.";

            }

            password.classList.add("invalid");

            valid = false;

        } else if (!validatePassword(passwordValue)) {

            if (passwordError) {

                passwordError.textContent =
                    "Password must contain 8+ characters, uppercase, lowercase, number and special character.";

            }

            password.classList.add("invalid");

            valid = false;

        }


        /* =====================================
           STOP IF INVALID
        ===================================== */

        if (!valid) {
            return;
        }


        /* =====================================
           BUTTON LOADING
        ===================================== */

        const originalHTML =
            submitBtn.innerHTML;

        submitBtn.disabled = true;

        submitBtn.classList.add("loading");

        submitBtn.innerHTML = `
            <span>Signing in...</span>
            <strong class="login-spinner"></strong>
        `;


        /* =====================================
           LOGIN PROCESS
        ===================================== */

        setTimeout(() => {


            /* =================================
               CREATE USER DATA
            ================================= */

            const currentUser = {

                name: emailValue.includes("@")
                    ? emailValue.split("@")[0]
                    : emailValue,

                email: emailValue,

                role: selectedRole

            };


            /* =================================
               SESSION STORAGE ONLY
            ================================= */

            sessionStorage.setItem(
                "swiftTrailUser",
                JSON.stringify(currentUser)
            );


            /* =================================
               REMEMBER STATE
               SESSION STORAGE ONLY
            ================================= */

            if (rememberMe && rememberMe.checked) {

                sessionStorage.setItem(
                    "swiftTrailRemember",
                    "true"
                );

            } else {

                sessionStorage.removeItem(
                    "swiftTrailRemember"
                );

            }


            /* =================================
               SUCCESS MESSAGE
            ================================= */

            if (okMessage) {

                okMessage.textContent =
                    `✓ Welcome back! Signed in as ${selectedRole}.`;

                okMessage.classList.add("show");

            }


            /* =================================
               RESTORE BUTTON
            ================================= */

            submitBtn.classList.remove("loading");

            submitBtn.innerHTML =
                originalHTML;

            submitBtn.disabled = false;


            /* =================================
               REDIRECT
            ================================= */

            setTimeout(() => {

                switch (selectedRole) {

                    case "Customer":

                        window.location.href =
                            "customer-dashboard.html";

                        break;


                    case "Shipper":

                        window.location.href =
                            "shipper-dashboard.html";

                        break;


                    default:

                        window.location.href =
                            "index.html";

                }

            }, 900);


        }, 1000);

    });


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    const forgotLink =
        document.querySelector(".forgot");

    if (forgotLink) {

        forgotLink.addEventListener("click", (e) => {

            e.preventDefault();

            clearErrors();

            if (okMessage) {

                okMessage.textContent =
                    "Password reset instructions will be sent to your registered email.";

                okMessage.classList.add("show");

            }

        });

    }


    /* =========================================
       SOCIAL LOGIN BUTTONS
    ========================================= */

    const socialButtons =
        document.querySelectorAll(".soc");

    socialButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (okMessage) {

                okMessage.textContent =
                    `${button.textContent.trim()} sign-in is currently unavailable.`;

                okMessage.classList.add("show");

            }

        });

    });


    /* =========================================
       CLOSE BUTTON
    ========================================= */

    if (closeBtn) {

        closeBtn.addEventListener("click", () => {

            clearLoginForm();

            window.location.href =
                "index.html";

        });

    }


    /* =========================================
       CLEAR LOGIN FORM
    ========================================= */

    function clearLoginForm() {

        loginForm.reset();


        if (email) {
            email.value = "";
        }

        if (password) {

            password.value = "";

            password.type = "password";

        }


        /* Reset eye icon */

        if (eye) {

            eye.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

            eye.setAttribute(
                "aria-label",
                "Show password"
            );

        }


        /* Clear errors */

        clearErrors();


        /* Reset remember checkbox */

        if (rememberMe) {
            rememberMe.checked = false;
        }


        /* Reset role */

        selectedRole = "Customer";

        roles.forEach(role => {

            role.classList.toggle(
                "active",
                role.dataset.role === "Customer"
            );

        });


        const customerRole =
            document.querySelector(
                '.role[data-role="Customer"]'
            );


        if (customerRole) {

            if (roleHint) {

                roleHint.textContent =
                    customerRole.dataset.hint || "";

            }

            if (roleOut) {

                roleOut.textContent =
                    "Customer";

            }

        }

    }


    /* =========================================
       CLEAR FORM WHEN PAGE OPENS
    ========================================= */

    window.addEventListener("pageshow", () => {

        clearLoginForm();

    });


    /* =========================================
       CLEAR FORM ON INITIAL LOAD
    ========================================= */

    clearLoginForm();

});