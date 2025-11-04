// Login Page Specific JavaScript
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerModal = document.getElementById('registerModal');
    const openRegister = document.getElementById('openRegister');
    const closeRegister = document.getElementById('closeRegister');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

    // Initialize user data if not exists
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }

    // Show/Hide Register Modal
    if (openRegister) {
        openRegister.onclick = () => registerModal.style.display = 'flex';
    }
    if (closeRegister) {
        closeRegister.onclick = () => registerModal.style.display = 'none';
    }
    
    window.onclick = (e) => { 
        if (e.target === registerModal) registerModal.style.display = 'none'; 
    };

    // Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('users'));
            const username = document.getElementById('newUsername').value.trim();

            if (users[username]) {
                alert('Username already exists!');
                return;
            }

            if (document.getElementById('newPassword').value !== document.getElementById('confirmPassword').value) {
                passwordError.style.display = 'block';
                return;
            }

            passwordError.style.display = 'none';

            // Check terms checkbox
            if (!document.getElementById('agreeTerms').checked) {
                alert('You must agree to the Privacy Policy and Terms of Service.');
                return;
            }

            users[username] = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                username: username,
                password: document.getElementById('newPassword').value
            };
            localStorage.setItem('users', JSON.stringify(users));
            successMessage.style.display = 'block';
            registerForm.reset();
            setTimeout(() => {
                successMessage.style.display = 'none';
                registerModal.style.display = 'none';
            }, 2000);
        });
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('users'));
            const usernameValue = document.getElementById('username').value.trim();
            const passwordValue = document.getElementById('password').value;

            if (!users[usernameValue]) {
                loginError.textContent = 'Username not found';
                loginError.style.display = 'block';
                return;
            }

            if (users[usernameValue].password !== passwordValue) {
                loginError.textContent = 'Invalid password';
                loginError.style.display = 'block';
                return;
            }

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(users[usernameValue]));
            window.location.href = 'index.html';
        });
    }
}

// Initialize login page when DOM is loaded
if (document.getElementById('loginForm')) {
    document.addEventListener('DOMContentLoaded', initLoginPage);
}
// Common JavaScript for all pages
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const userWelcome = document.getElementById('userWelcome');
    const welcomeUsername = document.getElementById('welcomeUsername');
    const navLogin = document.getElementById('navLogin');
    const profileItem = document.getElementById('profileItem');
    const logoutLink = document.getElementById('logoutLink');

    if (isLoggedIn === 'true' && currentUser) {
        // Show welcome bar
        if (userWelcome) userWelcome.style.display = 'block';
        if (welcomeUsername) welcomeUsername.textContent = currentUser.username || currentUser.fullName;

        // Hide Login and show Profile
        if (navLogin) navLogin.classList.add('d-none');
        if (profileItem) profileItem.classList.remove('d-none');
    } else {
        // Hide welcome bar and profile when not logged in
        if (userWelcome) userWelcome.style.display = 'none';
        if (profileItem) profileItem.classList.add('d-none');
        if (navLogin) navLogin.classList.remove('d-none');
    }

    // Logout functionality
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});

// Common JavaScript for all pages
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const userWelcome = document.getElementById('userWelcome');
    const welcomeUsername = document.getElementById('welcomeUsername');
    const navLogin = document.getElementById('navLogin');
    const profileItem = document.getElementById('profileItem');
    const logoutLink = document.getElementById('logoutLink');

    if (isLoggedIn === 'true' && currentUser) {
        // Show welcome bar
        if (userWelcome) userWelcome.style.display = 'block';
        if (welcomeUsername) welcomeUsername.textContent = currentUser.username || currentUser.fullName;

        // Hide Login and show Profile
        if (navLogin) navLogin.classList.add('d-none');
        if (profileItem) profileItem.classList.remove('d-none');
    } else {
        // Hide welcome bar and profile when not logged in
        if (userWelcome) userWelcome.style.display = 'none';
        if (profileItem) profileItem.classList.add('d-none');
        if (navLogin) navLogin.classList.remove('d-none');
    }

    // Logout functionality
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});

// Profile Page Specific JavaScript
function initProfilePage() {
    const profileFullName = document.getElementById('profileFullName');
    const profileUsername = document.getElementById('profileUsername');
    const infoFullName = document.getElementById('infoFullName');
    const infoUsername = document.getElementById('infoUsername');
    const infoEmail = document.getElementById('infoEmail');
    const infoMemberSince = document.getElementById('infoMemberSince');
    
    // Edit form elements
    const editFullName = document.getElementById('editFullName');
    const editEmail = document.getElementById('editEmail');
    const editUsername = document.getElementById('editUsername');
    const editPassword = document.getElementById('editPassword');
    const saveProfileChanges = document.getElementById('saveProfileChanges');

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (currentUser) {
        // Populate profile data
        profileFullName.textContent = currentUser.fullName || 'User';
        profileUsername.textContent = `@${currentUser.username}`;
        infoFullName.textContent = currentUser.fullName || 'Not set';
        infoUsername.textContent = currentUser.username || 'Not set';
        infoEmail.textContent = currentUser.email || 'Not set';
        infoMemberSince.textContent = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Recently';
        
        // Populate edit form
        if (editFullName) editFullName.value = currentUser.fullName || '';
        if (editEmail) editEmail.value = currentUser.email || '';
        if (editUsername) editUsername.value = currentUser.username || '';
    } else {
        // User is not logged in, redirect to login
        window.location.href = 'login.html';
        return;
    }

    // Save profile changes
    if (saveProfileChanges) {
        saveProfileChanges.addEventListener('click', function() {
            // Get updated values
            const updatedFullName = editFullName.value;
            const updatedEmail = editEmail.value;
            const updatedUsername = editUsername.value;
            const updatedPassword = editPassword.value;
            
            // Update user data
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            const currentUsername = currentUser.username;
            
            if (users[currentUsername]) {
                // Update user data
                users[currentUsername].fullName = updatedFullName;
                users[currentUsername].email = updatedEmail;
                
                // If username changed, create new entry and remove old one
                if (updatedUsername !== currentUsername) {
                    users[updatedUsername] = users[currentUsername];
                    users[updatedUsername].username = updatedUsername;
                    delete users[currentUsername];
                }
                
                // Update password if provided
                if (updatedPassword) {
                    users[updatedUsername].password = updatedPassword;
                }
                
                // Save updated users to localStorage
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user in localStorage
                const updatedUser = users[updatedUsername];
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                // Update displayed data
                profileFullName.textContent = updatedFullName;
                profileUsername.textContent = `@${updatedUsername}`;
                infoFullName.textContent = updatedFullName;
                infoUsername.textContent = updatedUsername;
                infoEmail.textContent = updatedEmail;
                
                // Update welcome username if element exists
                const welcomeUsername = document.getElementById('welcomeUsername');
                if (welcomeUsername) {
                    welcomeUsername.textContent = updatedUsername;
                }
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
                if (modal) modal.hide();
                
                // Show success message
                alert('Profile updated successfully!');
            }
        });
    }

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-actions .btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('i').className;
            const item = this.closest('.wishlist-item');
            
            if (action.includes('fa-shopping-cart')) {
                alert('Item added to cart!');
            } else if (action.includes('fa-trash')) {
                if (confirm('Are you sure you want to remove this item from your wishlist?')) {
                    item.remove();
                }
            }
        });
    });

    // Order history functionality
    const orderButtons = document.querySelectorAll('.order-card .btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Viewing all orders...');
        });
    });
}

// Initialize profile page when DOM is loaded
if (document.getElementById('profileFullName')) {
    document.addEventListener('DOMContentLoaded', initProfilePage);
}