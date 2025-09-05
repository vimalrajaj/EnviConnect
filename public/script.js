const passField = document.getElementById("password");
const eyeIcon = document.getElementById("toggleEye");

eyeIcon.addEventListener("mouseenter", () => {
  passField.type = "text";
  eyeIcon.src = "icons/eye-line.png"; // change to "closed eye" when showing password
});

eyeIcon.addEventListener("mouseleave", () => {
  passField.type = "password";
  eyeIcon.src = "icons/eye-off-line.png"; // revert to "open eye"
});



async function loginUser() {
  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password })
  });

  const data = await res.json();

  if (!res.ok) {
    showToast(data.message);
  } else {
    // Store user data for profile page
    if (data.user && data.user.id) {
      sessionStorage.setItem('userId', data.user.id);
      sessionStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', data.user.id); // Backup storage
      localStorage.setItem('username', data.user.username);
    }
    
    showToast("✅ Login successful!");
    setTimeout(() => window.location.href = "home.html", 1000);
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

async function checkUsername() {
  const username = document.getElementById("username").value;
  if (!username) return;
  const res = await fetch(`/api/auth/check-username/${username}`);
  const status = document.getElementById("usernameStatus");
  if (res.ok) {
    status.textContent = "✅ Available";
    status.style.color = "green";
  } else {
    const data = await res.json();
    status.textContent = `❌ ${data.message}`;
    status.style.color = "red";
  }
}

async function sendOtp() {
  const email = document.getElementById("email").value;
  const res = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  showToast(data.message);
}

async function verifyOtp() {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json();
  showToast(data.message);
}

async function registerUser() {
  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const age = document.getElementById("age").value;
  const sustainabilityFocus = document.getElementById("sustainabilityFocus").value;

  if (password !== confirmPassword) {
    showToast("Passwords do not match");
    return;
  }

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, email, password, age, sustainabilityFocus })
  });

  const data = await res.json();
  if (!res.ok) {
    showToast(data.message);
  } else {
    showToast("✅ Registered successfully!");
    setTimeout(() => window.location.href = "login.html", 2000);
  }
}
