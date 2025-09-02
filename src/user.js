// user.js - User dropdown functionality

let isUserDropdownOpen = false;

// Create user dropdown menu
function createUserDropdown() {
    const userDropdown = document.createElement('div');
    userDropdown.className = 'user-dropdown';
    userDropdown.innerHTML = `
        <div class="user-dropdown-content">
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fa-solid fa-user-circle"></i>
                </div>
                <div class="user-details">
                    <h4>Invité</h4>
                    <p>Non connecté</p>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <ul class="user-menu">
                <li><a href="#" onclick="handleLogin()"><i class="fa-solid fa-sign-in-alt"></i> Se connecter</a></li>
                <li><a href="#" onclick="handleSignUp()"><i class="fa-solid fa-user-plus"></i> S'inscrire</a></li>
                <li class="divider"></li>
                <li><a href="#" onclick="showProfile()"><i class="fa-solid fa-user"></i> Mon profil</a></li>
                <li><a href="#" onclick="showOrders()"><i class="fa-solid fa-box"></i> Mes commandes</a></li>
                <li><a href="#" onclick="showSettings()"><i class="fa-solid fa-cog"></i> Paramètres</a></li>
                <li class="divider"></li>
                <li><a href="#" onclick="showHelp()"><i class="fa-solid fa-question-circle"></i> Aide</a></li>
                <li><a href="#" onclick="handleLogout()"><i class="fa-solid fa-sign-out-alt"></i> Déconnexion</a></li>
            </ul>
        </div>
    `;
    
    return userDropdown;
}

// Toggle user dropdown
function toggleUserDropdown() {
    const existingDropdown = document.querySelector('.user-dropdown');
    
    if (existingDropdown) {
        closeUserDropdown();
    } else {
        openUserDropdown();
    }
}

// Open user dropdown
function openUserDropdown() {
    if (isUserDropdownOpen) return;
    
    const userIcon = document.getElementById('user');
    const dropdown = createUserDropdown();
    
    // Position dropdown below user icon
    const rect = userIcon.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 10}px`;
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    
    document.body.appendChild(dropdown);
    
    // Add animation class
    setTimeout(() => {
        dropdown.classList.add('show');
    }, 10);
    
    isUserDropdownOpen = true;
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
    }, 100);
}

// Close user dropdown
function closeUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        setTimeout(() => {
            dropdown.remove();
        }, 300);
    }
    
    isUserDropdownOpen = false;
    document.removeEventListener('click', handleOutsideClick);
}

// Handle clicks outside dropdown
function handleOutsideClick(event) {
    const dropdown = document.querySelector('.user-dropdown');
    const userIcon = document.getElementById('user');
    
    if (dropdown && !dropdown.contains(event.target) && !userIcon.contains(event.target)) {
        closeUserDropdown();
    }
}

// User menu action handlers
function handleLogin() {
    closeUserDropdown();
    // Redirect to login page or show login modal
    console.log('Redirecting to login...');
    // You can implement your login logic here
    alert('Redirection vers la page de connexion...');
}

function handleSignUp() {
    closeUserDropdown();
    // Redirect to signup page or show signup modal
    console.log('Redirecting to signup...');
    alert('Redirection vers la page d\'inscription...');
}

function showProfile() {
    closeUserDropdown();
    console.log('Showing user profile...');
    alert('Affichage du profil utilisateur...');
}

function showOrders() {
    closeUserDropdown();
    console.log('Showing user orders...');
    alert('Affichage des commandes...');
}

function showSettings() {
    closeUserDropdown();
    console.log('Showing user settings...');
    alert('Affichage des paramètres...');
}

function showHelp() {
    closeUserDropdown();
    console.log('Showing help...');
    alert('Affichage de l\'aide...');
}

function handleLogout() {
    closeUserDropdown();
    console.log('Logging out...');
    alert('Déconnexion...');
}

// Initialize user functionality
function initUserFunctionality() {
    const userIcon = document.getElementById('user');
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserDropdown();
        });
        
        // Add hover effect
        userIcon.addEventListener('mouseenter', () => {
            userIcon.style.transform = 'scale(1.1)';
        });
        
        userIcon.addEventListener('mouseleave', () => {
            userIcon.style.transform = 'scale(1)';
        });
    }
}

// Make functions globally available
window.toggleUserDropdown = toggleUserDropdown;
window.handleLogin = handleLogin;
window.handleSignUp = handleSignUp;
window.showProfile = showProfile;
window.showOrders = showOrders;
window.showSettings = showSettings;
window.showHelp = showHelp;
window.handleLogout = handleLogout;

export { initUserFunctionality };