/* ===== SIGNUP page behaviour — validation, password toggles, close, social demo ===== */
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const signupClose = document.getElementById("signupClose");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // ===============================
    // Social Buttons (Demo)
    // ===============================
    document.querySelectorAll(".social-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            alert("This is a demo signup page.\nSocial signup is currently unavailable.");
        });
    });

    // ===============================
    // Password Toggle
    // ===============================
    function toggle(input, button) {
        const icon = button.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }

    togglePassword.addEventListener("click", () => {
        toggle(password, togglePassword);
    });

    toggleConfirmPassword.addEventListener("click", () => {
        toggle(confirmPassword, toggleConfirmPassword);
    });

    // ===============================
    // Strong Password Regex
    // ===============================
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

    // ===============================
    // Create Message Box
    // ===============================
    function showMessage(message, success = false) {
        let box = document.getElementById("signupMessage");
        if (!box) {
            box = document.createElement("div");
            box.id = "signupMessage";
            form.appendChild(box);
        }
        box.textContent = message;
        box.style.marginTop = "18px";
        box.style.padding = "14px";
        box.style.borderRadius = "12px";
        box.style.fontWeight = "600";
        if (success) {
            box.style.background = "rgba(34,197,94,.12)";
            box.style.border = "1px solid rgba(34,197,94,.35)";
            box.style.color = "#4ade80";
        } else {
            box.style.background = "rgba(251,113,133,.12)";
            box.style.border = "1px solid rgba(251,113,133,.35)";
            box.style.color = "#fb7185";
        }
    }

    // ===============================
    // Form Submit
    // ===============================
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const terms = document.querySelector(
            '.check-row input[type="checkbox"]'
        );

        // Name
        if (name.value.trim().length < 3) {
            showMessage("Enter your full name.");
            name.focus();
            return;
        }

        // Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showMessage("Enter a valid email address.");
            email.focus();
            return;
        }

        // Password
        if (!passwordRegex.test(password.value)) {
            showMessage(
                "Password must contain at least 8 characters, uppercase, lowercase, number and special character."
            );
            password.focus();
            return;
        }

        // Confirm Password
        if (password.value !== confirmPassword.value) {
            showMessage("Passwords do not match.");
            confirmPassword.focus();
            return;
        }

        // Terms
        if (terms && !terms.checked) {
            showMessage("Please accept the Terms & Privacy Policy.");
            return;
        }

        // Button Loading
        const button = form.querySelector(".submit-btn");
        const label = button.querySelector("span");
        button.disabled = true;
        label.textContent = "Creating Account...";

        setTimeout(() => {
            button.disabled = false;
            label.textContent = "Create Account";
            showMessage(
                "✓ Account created successfully! Redirecting to Login...",
                true
            );
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1800);
        }, 1800);
    });

    // ===============================
    // Close Signup Page
    // ===============================
    if (signupClose) {
        signupClose.addEventListener("click", () => {
            const card = document.querySelector(".su-card");
            card.style.transition = "transform .35s ease, opacity .35s ease";
            card.style.transform = "scale(.9)";
            card.style.opacity = "0";
            setTimeout(() => {
                if (document.referrer && document.referrer.indexOf(location.host) > -1) {
                    history.back();
                } else {
                    window.location.href = "index.html";
                }
            }, 320);
        });
    }

    // Escape closes signup panel
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && signupClose && !document.getElementById("drawer").classList.contains("open")) {
            signupClose.click();
        }
    });
});
