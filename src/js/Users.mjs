class Users {
    constructor() {
        this.userDBKey = 'registeredUsers'; // Key to store users
        this.tokenKey = 'authToken';        // Key to store JWT token
    }

    /**
     * Save all users to localStorage
     */
    saveUsers(users) {
        localStorage.setItem(this.userDBKey, JSON.stringify(users));
    }

    /**
     * Get all registered users from localStorage
     */
    getUsers() {
        const users = localStorage.getItem(this.userDBKey);
        return users ? JSON.parse(users) : [];
    }

    /**
     * Hash password using a simple method
     */
    async hashPassword(password) {
        // Simple hash function using SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        return crypto.subtle.digest('SHA-256', data)
            .then(hash => {
                const hashArray = Array.from(new Uint8Array(hash));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            });
    }

    /**
     * Register a new user
     * @param {{ name: string, email: string, password: string }}
     */
    async registerUser(userInfo) {
        const users = this.getUsers();

        // Validate fields
        const requiredFields = ['fname', 'lname', 'email', 'phone', 'password'];
        const missingFields = requiredFields.filter(field => !userInfo[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Simple email format check
        const isValidEmail = /\S+@\S+\.\S+/.test(userInfo.email);
        if (!isValidEmail) throw new Error("Invalid email format.");

        // Prevent duplicate registration
        if (users.some(u => u.email === userInfo.email)) {
            throw new Error("Email already registered.");
        }

        // Hash the password
        const hashedPassword = await this.hashPassword(userInfo.password);

        // Format the user data before saving
        const newUser = {
            firstName: userInfo.fname,
            lastName: userInfo.lname,
            email: userInfo.email,
            phone: userInfo.phone,
            password: hashedPassword
        };

        users.push(newUser);
        this.saveUsers(users);
    }

    /**
     * Log in a user with email/password and return a fake JWT token
     */
    async loginUser(credentials) {
        const users = this.getUsers();
        const hashedPassword = await this.hashPassword(credentials.password);
        const foundUser = users.find(
            u => u.email === credentials.email && u.password === hashedPassword
        );

        if (!foundUser) {
            throw new Error("Invalid email or password.");
        }

        // Create mock JWT payload with only email and password
        const token = this.generateFakeJWT({
            email: foundUser.email,
            exp: Math.floor(Date.now() / 1000) + 3600 // expires in 1 hour
        });

        localStorage.setItem(this.tokenKey, token);
        return token;
    }

    /**
     * Generate a fake JWT-like token (non-signed)
     */
    generateFakeJWT(payload) {
        const base64 = (obj) =>
            btoa(JSON.stringify(obj))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');

        const header = base64({ alg: 'HS256', typ: 'JWT' });
        const body = base64(payload);
        const signature = 'mocked-signature'; // not used in frontend

        return `${header}.${body}.${signature}`;
    }

    /**
     * Decode JWT token
     */
    decodeToken(token) {
        try {
            // Split token into parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }

            // Decode payload
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            return payload;
        } catch (err) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Get current logged-in user's info from token
     */
    getCurrentUser() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return null;

        try {
            const user = this.decodeToken(token);

            // Check for expiration
            if (user.exp && user.exp < Date.now() / 1000) {
                this.logoutUser();
                return null;
            }

            return user;
        } catch (err) {
            console.error("Invalid token", err);
            return null;
        }
    }

    userAppointment(appointment) {
        // Check if user is logged in
        const token = localStorage.getItem(this.tokenKey);
        if (!token) {
            // Save the appointment data temporarily
            localStorage.setItem('pendingAppointment', JSON.stringify(appointment));
            
            // Redirect to login page with return URL
            const returnUrl = encodeURIComponent(window.location.href);
            window.location.href = '../account/login.html?returnUrl=' + returnUrl;
            return;
        }

        try {
            const users = this.getUsers();
            const currentUser = this.getCurrentUser();
            
            if (!currentUser || !currentUser.email) {
                throw new Error('No logged-in user found');
            }

            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            if (userIndex === -1) {
                throw new Error('User not found in database');
            }

            // Initialize appointments array if it doesn't exist
            if (!users[userIndex].appointments) {
                users[userIndex].appointments = [];
            }
            
            users[userIndex].appointments.push(appointment);
            this.saveUsers(users);
            return true;
        } catch (error) {
            console.error('Error saving appointment:', error);
            return false;
        }
    }

    /**
     * Remove token from storage (logout)
     */
    logout() {
        // Remove token from localStorage
        localStorage.removeItem(this.tokenKey);
        
        // Also remove user data from localStorage
        const usersList = this.getUsers();
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
            const decodedToken = this.decodeToken(token);
            const userIndex = usersList.findIndex(user => user.email === decodedToken.email);
            if (userIndex !== -1) {
                usersList[userIndex].token = null;
                this.saveUsers(usersList);
            }
        }
    }
}

export default Users;
