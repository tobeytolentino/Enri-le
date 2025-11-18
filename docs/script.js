// ===== ENSURE ADMIN ACCOUNT EXISTS ON EVERY DEVICE =====
function ensureAdminAccount() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    // Create admin account if it doesn't exist
    if (!users['admin']) {
        users['admin'] = {
            fullName: 'Administrator',
            email: 'admin@enri-le.com',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Admin account created on this device');
    }
}

// ===== DATA EXPORT/IMPORT FUNCTIONALITY =====
function exportUserData() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const data = {
        users: users,
        products: products,
        cart: cart,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'enri-le-data.json';
    link.click();
    
    showAdminToast('Data exported successfully!', 'success');
}

function importUserData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.users) {
                localStorage.setItem('users', JSON.stringify(data.users));
            }
            if (data.products) {
                localStorage.setItem('products', JSON.stringify(data.products));
            }
            if (data.cart) {
                localStorage.setItem('cart', JSON.stringify(data.cart));
            }
            
            showAdminToast('Data imported successfully! Page will reload.', 'success');
            setTimeout(() => {
                location.reload();
            }, 2000);
        } catch (error) {
            showAdminToast('Error importing data: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// ===== LOGIN PAGE SPECIFIC JAVASCRIPT =====
function initLoginPage() {
    // Ensure admin account exists on this device
    ensureAdminAccount();
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerModal = document.getElementById('registerModal');
    const openRegister = document.getElementById('openRegister');
    const closeRegister = document.getElementById('closeRegister');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

    // Initialize user data if not exists - ONLY ONE ADMIN ACCOUNT
    if (!localStorage.getItem('users')) {
        console.log('Initializing users for the first time...');
        const defaultUsers = {
            'admin': {
                fullName: 'Administrator',
                email: 'admin@enri-le.com',
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        };
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('Admin account created:', defaultUsers.admin);
    } else {
        console.log('Users already exist in localStorage');
        const existingUsers = JSON.parse(localStorage.getItem('users'));
        console.log('Existing users:', Object.keys(existingUsers));
    }

    // Initialize products if not exists - USING YOUR SPECIFIC PRODUCTS
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: '1',
                name: 'Vintage Watch',
                price: 89.00,
                stock: 15,
                description: 'Classic timepiece with leather strap. Perfect for adding a touch of elegance to any outfit.',
                image: 'https://ae01.alicdn.com/kf/S23ce2ca642dc4e8cabe3e9f5d15765a1p.jpg_640x640q90.jpg',
                category: 'accessories'
            },
            {
                id: '2',
                name: 'Vintage Gold Ring',
                price: 35.00,
                stock: 8,
                description: 'Elegant gold ring with intricate detailing. A timeless piece that complements any style.',
                image: 'https://th.bing.com/th/id/OIP.-ThdQECcR3aeyZnTya1WNwHaFT?w=206&h=150&c=6&o=7&dpr=1.3&pid=1.7&rm=3',
                category: 'jewelry'
            },
            {
                id: '3',
                name: 'Stussy Vintage Jacket',
                price: 70.00,
                stock: 5,
                description: 'Authentic vintage denim jacket with iconic Stussy branding. A collector\'s item.',
                image: 'https://beamhill.fi/wp-content/uploads/2023/11/Stussy-WASHED-CANVAS-SHOP-JACKET-Black.jpg',
                category: 'clothing'
            },
            {
                id: '4',
                name: 'Kangol Beret Hat',
                price: 20.00,
                stock: 0,
                description: 'Classic Kangol beret in black. The perfect accessory to complete any vintage look.',
                image: 'https://th.bing.com/th/id/OIP.abc123example.jpg',
                category: 'accessories'
            },
            {
                id: '5',
                name: 'Vintage Floral Dress',
                price: 65.00,
                stock: 12,
                description: 'Beautiful floral print dress with a flattering silhouette. Perfect for special occasions.',
                image: 'https://ae01.alicdn.com/kf/S23ce2ca642dc4e8cabe3e9f5d15765a1p.jpg_640x640q90.jpg',
                category: 'clothing'
            },
            {
                id: '6',
                name: 'Retro Leather Bag',
                price: 45.00,
                stock: 7,
                description: 'Genuine leather bag with vintage charm. Spacious interior with multiple compartments.',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0v2yS5Mw51D77Ar1XkAGG8x-lVS6ZU0APzg&s',
                category: 'accessories'
            },
            {
                id: '7',
                name: 'Round Frame Glasses',
                price: 25.00,
                stock: 20,
                description: 'Vintage-inspired round frame glasses. Lightweight and comfortable for everyday wear.',
                image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
                category: 'accessories'
            },
            {
                id: '8',
                name: 'Vintage Wool Coat (Prada)',
                price: 120.00,
                stock: 3,
                description: 'Luxurious wool coat from Prada\'s vintage collection. Timeless design and premium quality.',
                image: 'https://th.bing.com/th/id/OIP.rG8t3H_Q1wO83zEOMIRX6wHaJ4?w=186&h=248&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
                category: 'clothing'
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
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

    // Register Form Submission - ALL NEW ACCOUNTS ARE REGULAR USERS
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('users'));
            const username = document.getElementById('newUsername').value.trim();

            // Prevent creating another admin account
            if (username.toLowerCase() === 'admin') {
                alert('Admin username is reserved. Please choose a different username.');
                return;
            }

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

            // ALL NEW ACCOUNTS ARE REGULAR USERS
            users[username] = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                username: username,
                password: document.getElementById('newPassword').value,
                role: 'user', // All new accounts are regular users
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('users', JSON.stringify(users));
            successMessage.style.display = 'block';
            registerForm.reset();
            
            setTimeout(() => {
                successMessage.style.display = 'none';
                registerModal.style.display = 'none';
                alert('Account created successfully! You can now log in.');
            }, 2000);
        });
    }

    // Login Form Submission - FIXED VERSION
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            const usernameValue = document.getElementById('username').value.trim();
            const passwordValue = document.getElementById('password').value;

            console.log('Login attempt for username:', usernameValue);
            console.log('Available users:', Object.keys(users));

            if (!users[usernameValue]) {
                console.log('Username not found:', usernameValue);
                loginError.textContent = 'Username not found';
                loginError.style.display = 'block';
                return;
            }

            console.log('User found, checking password...');
            if (users[usernameValue].password !== passwordValue) {
                console.log('Invalid password for user:', usernameValue);
                loginError.textContent = 'Invalid password';
                loginError.style.display = 'block';
                return;
            }

            console.log('Login successful for:', usernameValue);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(users[usernameValue]));
            
            // Redirect to admin panel ONLY if user is admin
            if (users[usernameValue].role === 'admin') {
                console.log('Redirecting to admin panel...');
                window.location.href = 'admin.html';
            } else {
                console.log('Redirecting to main site...');
                window.location.href = 'index.html';
            }
        });
    }
}

// Initialize login page when DOM is loaded
if (document.getElementById('loginForm')) {
    document.addEventListener('DOMContentLoaded', initLoginPage);
}

// ===== COMMON JAVASCRIPT FOR ALL PAGES =====
document.addEventListener('DOMContentLoaded', function() {
    // Ensure admin account exists on every page load
    ensureAdminAccount();
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const userWelcome = document.getElementById('userWelcome');
    const welcomeUsername = document.getElementById('welcomeUsername');
    const navLogin = document.getElementById('navLogin');
    const profileItem = document.getElementById('profileItem');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink');

    if (isLoggedIn === 'true' && currentUser) {
        // Show welcome bar
        if (userWelcome) userWelcome.style.display = 'block';
        if (welcomeUsername) welcomeUsername.textContent = currentUser.username || currentUser.fullName;

        // Hide Login and show Profile
        if (navLogin) navLogin.classList.add('d-none');
        if (profileItem) profileItem.classList.remove('d-none');
        
        // Show admin link ONLY if user is admin
        if (adminLink && currentUser.role === 'admin') {
            adminLink.classList.remove('d-none');
        }
    } else {
        // Hide welcome bar and profile when not logged in
        if (userWelcome) userWelcome.style.display = 'none';
        if (profileItem) profileItem.classList.add('d-none');
        if (navLogin) navLogin.classList.remove('d-none');
        if (adminLink) adminLink.classList.add('d-none');
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

    // Initialize shopping cart if on shop page
    if (document.querySelector('.add-to-cart')) {
        console.log('Shop page detected, initializing cart...');
        setTimeout(() => {
            initShoppingCart();
        }, 100);
    }

    // Initialize admin page if on admin page
    if (document.getElementById('adminDashboard')) {
        initAdminPage();
    }

    // Initialize profile page if on profile page
    if (document.getElementById('profileFullName')) {
        initProfilePage();
    }
});

// ===== PROFILE PAGE SPECIFIC JAVASCRIPT =====
function initProfilePage() {
    console.log('Initializing profile page...');
    
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
        console.log('Current user found:', currentUser);
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
        console.log('No user logged in, redirecting to login...');
        // User is not logged in, redirect to login
        window.location.href = 'login.html';
        return;
    }

    // Save profile changes - FIXED FUNCTIONALITY
    if (saveProfileChanges) {
        saveProfileChanges.addEventListener('click', function() {
            console.log('Save profile button clicked!');
            
            // Get updated values
            const updatedFullName = editFullName.value.trim();
            const updatedEmail = editEmail.value.trim();
            const updatedUsername = editUsername.value.trim();
            const updatedPassword = editPassword.value;
            
            // Basic validation
            if (!updatedFullName || !updatedEmail || !updatedUsername) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Update user data
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            const currentUsername = currentUser.username;
            
            // Check if new username is already taken (if changed)
            if (updatedUsername !== currentUsername && users[updatedUsername]) {
                alert('Username already exists! Please choose a different one.');
                return;
            }
            
            if (users[currentUsername]) {
                console.log('Updating user data...');
                
                // Update user data
                users[currentUsername].fullName = updatedFullName;
                users[currentUsername].email = updatedEmail;
                
                // If username changed, create new entry and remove old one
                if (updatedUsername !== currentUsername) {
                    console.log('Username changed from', currentUsername, 'to', updatedUsername);
                    users[updatedUsername] = {...users[currentUsername]};
                    users[updatedUsername].username = updatedUsername;
                    delete users[currentUsername];
                }
                
                // Update password if provided
                if (updatedPassword) {
                    users[updatedUsername || currentUsername].password = updatedPassword;
                }
                
                // Save updated users to localStorage
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user in localStorage
                const finalUsername = updatedUsername !== currentUsername ? updatedUsername : currentUsername;
                const updatedUser = users[finalUsername];
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                console.log('User data saved:', updatedUser);
                
                // Update displayed data
                profileFullName.textContent = updatedFullName;
                profileUsername.textContent = `@${finalUsername}`;
                infoFullName.textContent = updatedFullName;
                infoUsername.textContent = finalUsername;
                infoEmail.textContent = updatedEmail;
                
                // Update welcome username if element exists
                const welcomeUsername = document.getElementById('welcomeUsername');
                if (welcomeUsername) {
                    welcomeUsername.textContent = finalUsername;
                }
                
                // Close modal using Bootstrap's method
                const editProfileModal = document.getElementById('editProfileModal');
                const modal = bootstrap.Modal.getInstance(editProfileModal);
                if (modal) {
                    modal.hide();
                    console.log('Modal closed successfully');
                }
                
                // Clear password field
                editPassword.value = '';
                
                // Show success message
                alert('Profile updated successfully!');
                
            } else {
                alert('Error: User not found in database.');
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

// ===== ADMIN PAGE FUNCTIONALITY =====
function initAdminPage() {
    console.log('Initializing admin page...');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // STRICT ADMIN CHECK - Only username 'admin' can access
    if (!currentUser || currentUser.username !== 'admin') {
        alert('Access denied. Administrator privileges required.');
        window.location.href = 'login.html';
        return;
    }
    
    // Load admin data
    loadAdminDashboard();
    loadUsersTable();
    loadProductsTable();
    
    // Setup event listeners
    setupAdminEventListeners();
}

function loadAdminDashboard() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Calculate stats
    const totalUsers = Object.keys(users).length;
    const totalProducts = products.length;
    const totalOrders = 0; // You can implement orders later
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    
    // Update dashboard stats
    document.getElementById('userCount').textContent = totalUsers;
    document.getElementById('productCount').textContent = totalProducts;
    document.getElementById('orderCount').textContent = totalOrders;
    document.getElementById('lowStockCount').textContent = lowStockProducts;
}

function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const tbody = document.getElementById('usersTableBody');
    
    let html = '';
    Object.values(users).forEach(user => {
        html += `
            <tr>
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="user-role role-${user.role}">${user.role}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn-admin btn-edit me-1" onclick="editUser('${user.username}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.username !== 'admin' ? `
                    <button class="btn-admin btn-delete" onclick="deleteUser('${user.username}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function loadProductsTable() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const tbody = document.getElementById('productsTableBody');
    
    let html = '';
    products.forEach(product => {
        const stockStatus = product.stock === 0 ? 'out-of-stock' : 
                           product.stock <= 5 ? 'low-stock' : 'in-stock';
        const statusText = product.stock === 0 ? 'Out of Stock' : 
                          product.stock <= 5 ? 'Low Stock' : 'In Stock';
        
        html += `
            <tr>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <span class="stock-status ${stockStatus}">${statusText}</span>
                </td>
                <td>
                    <div class="stock-controls">
                        <button class="stock-btn" onclick="updateStock('${product.id}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="stock-input" value="${product.stock}" 
                               onchange="setStock('${product.id}', this.value)" min="0">
                        <button class="stock-btn" onclick="updateStock('${product.id}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <button class="btn-admin btn-edit me-1" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-admin btn-delete" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function setupAdminEventListeners() {
    // Add User Button
    document.getElementById('addUserBtn').addEventListener('click', () => {
        showAddUserModal();
    });
    
    // Add Product Button
    document.getElementById('addProductBtn').addEventListener('click', () => {
        showAddProductModal();
    });
    
    // Save User Button
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);
    
    // Save Product Button
    document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
}

// User Management Functions
function showAddUserModal() {
    document.getElementById('userModalLabel').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('userUsername').removeAttribute('readonly');
    document.getElementById('userModal').style.display = 'block';
}

function editUser(username) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    
    if (user) {
        document.getElementById('userModalLabel').textContent = 'Edit User';
        document.getElementById('userUsername').value = user.username;
        document.getElementById('userUsername').setAttribute('readonly', 'true');
        document.getElementById('userFullName').value = user.fullName;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userModal').style.display = 'block';
    }
}

function saveUser() {
    const username = document.getElementById('userUsername').value.trim();
    const fullName = document.getElementById('userFullName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    
    if (!username || !fullName || !email) {
        showAdminToast('Please fill in all required fields.', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const isEdit = document.getElementById('userUsername').hasAttribute('readonly');
    
    // PREVENT CREATING NEW ADMIN ACCOUNTS
    if (!isEdit && username.toLowerCase() === 'admin') {
        showAdminToast('Admin username is reserved. Please choose a different username.', 'error');
        return;
    }
    
    if (!isEdit && users[username]) {
        showAdminToast('Username already exists!', 'error');
        return;
    }
    
    if (isEdit) {
        // Editing existing user
        const originalUsername = document.getElementById('userUsername').value;
        
        // PREVENT CHANGING ADMIN USERNAME OR ROLE
        if (originalUsername === 'admin') {
            if (username !== 'admin') {
                showAdminToast('Cannot change admin username.', 'error');
                return;
            }
            if (role !== 'admin') {
                showAdminToast('Cannot change admin role.', 'error');
                return;
            }
        }
        
        users[originalUsername].fullName = fullName;
        users[originalUsername].email = email;
        users[originalUsername].role = role;
        
        if (password) {
            users[originalUsername].password = password;
        }
    } else {
        // Adding new user - ALL NEW USERS ARE REGULAR USERS
        users[username] = {
            username: username,
            fullName: fullName,
            email: email,
            role: 'user', // Force all new users to be regular users
            password: password || 'default123',
            createdAt: new Date().toISOString()
        };
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    closeModal('userModal');
    loadUsersTable();
    loadAdminDashboard();
    showAdminToast(`User ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
}

function deleteUser(username) {
    // PREVENT DELETING THE MAIN ADMIN ACCOUNT
    if (username === 'admin') {
        showAdminToast('Cannot delete the main administrator account.', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        delete users[username];
        localStorage.setItem('users', JSON.stringify(users));
        loadUsersTable();
        loadAdminDashboard();
        showAdminToast('User deleted successfully!', 'success');
    }
}

// Product Management Functions
function showAddProductModal() {
    document.getElementById('productModalLabel').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').style.display = 'block';
}

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('productModalLabel').textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productModal').style.display = 'block';
    }
}

function saveProduct() {
    const id = document.getElementById('productId').value || generateId();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const description = document.getElementById('productDescription').value.trim();
    const category = document.getElementById('productCategory').value;
    
    if (!name || !price || isNaN(price) || isNaN(stock)) {
        showAdminToast('Please fill in all required fields with valid values.', 'error');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const isEdit = document.getElementById('productId').value !== '';
    
    if (isEdit) {
        // Update existing product
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                stock,
                description,
                category
            };
        }
    } else {
        // Add new product
        products.push({
            id,
            name,
            price,
            stock,
            description,
            category,
            image: getProductImageByCategory(category)
        });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    closeModal('productModal');
    loadProductsTable();
    loadAdminDashboard();
    showAdminToast(`Product ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadProductsTable();
        loadAdminDashboard();
        showAdminToast('Product deleted successfully!', 'success');
    }
}

// Stock Management Functions
function updateStock(productId, change) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (product) {
        product.stock = Math.max(0, product.stock + change);
        localStorage.setItem('products', JSON.stringify(products));
        loadProductsTable();
        loadAdminDashboard();
        showAdminToast('Stock updated successfully!', 'success');
    }
}

function setStock(productId, newStock) {
    const stock = parseInt(newStock);
    if (isNaN(stock) || stock < 0) return;
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (product) {
        product.stock = stock;
        localStorage.setItem('products', JSON.stringify(products));
        loadProductsTable();
        loadAdminDashboard();
        showAdminToast('Stock updated successfully!', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function generateId() {
    return Date.now().toString();
}

function getProductImageByCategory(category) {
    // Default images based on category
    const defaultImages = {
        'accessories': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        'jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };
    return defaultImages[category] || defaultImages.accessories;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAdminToast(message, type) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container
    const container = document.getElementById('adminToastContainer') || createToastContainer();
    container.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after hide
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.className = 'admin-toast';
    document.body.appendChild(container);
    return container;
}

// ===== SHOPPING CART FUNCTIONALITY =====
window.initShoppingCart = function() {
    console.log('Initializing shopping cart...');
    
    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Update cart display
    updateCartDisplay();

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Found add to cart buttons:', addToCartButtons.length);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Add to cart clicked');
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                image: this.getAttribute('data-image'),
                quantity: 1
            };
            addToCart(product);
        });
    });

    // View cart button
    const viewCartBtn = document.getElementById('viewCartBtn');
    console.log('View cart button:', viewCartBtn);
    
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('View cart clicked');
            updateCartModal();
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });
    }

    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    console.log('Cart icon:', cartIcon);
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cart icon clicked');
            updateCartModal();
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart'));
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Thank you for your purchase! This is a demo store.');
            clearCart();
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            cartModal.hide();
        });
    }
}

// Make all cart functions globally accessible
window.addToCart = function(product) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Show success message
    showCartMessage(`${product.name} added to cart!`, 'success');
}

window.removeFromCart = function(productId) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartModal();
}

window.updateQuantity = function(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartModal();
    }
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    console.log('Updating cart display, items:', cart.length);
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        console.log('Cart count updated:', totalItems);
    }
    
    if (cartTotal) {
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Cart Total: $${totalAmount.toFixed(2)}`;
        console.log('Cart total updated:', totalAmount);
    }
}

function updateCartModal() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartItems = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    
    console.log('Updating cart modal, items:', cart.length);
    
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartItems) cartItems.innerHTML = '';
    } else {
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            itemsHTML += `
                <div class="cart-item d-flex align-items-center border-bottom pb-3 mb-3">
                    <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="mb-1 text-muted">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', 1)">+</button>
                        <span class="ms-3 fw-bold">$${itemTotal.toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        if (cartItems) cartItems.innerHTML = itemsHTML;
    }
    
    const shipping = 10.00;
    const total = subtotal + shipping;
    
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalAmount) cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartDisplay();
    updateCartModal();
}

function showCartMessage(message, type) {
    // Create toast message
    const toast = document.createElement('div');
    toast.className = `position-fixed top-0 end-0 p-3`;
    toast.style.zIndex = '9999';
    
    toast.innerHTML = `
        <div class="toast show align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== GLOBAL FUNCTION EXPORTS =====
window.editUser = editUser;
window.deleteUser = deleteUser;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateStock = updateStock;
window.setStock = setStock;
window.closeModal = closeModal;
window.exportUserData = exportUserData;
window.importUserData = importUserData;

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}