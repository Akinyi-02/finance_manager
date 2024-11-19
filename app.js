// toggle between registration and login forms
function toggleForms() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
  
    // Toggle visibility of the forms
    if (registerForm.style.display === 'none') {
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
    } else {
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    }
  }
  
  // Function to handle user registration
  function register(event) {
    event.preventDefault();
  
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
  
    // Check if the username already exists
    if (localStorage.getItem(username) !== null) {
      alert('Username already exists! Please login.');
      return;
    }
  
    // Save the credentials and initial financial data in localStorage
    const userData = {
      password: password,
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0
    };
  
    localStorage.setItem(username, JSON.stringify(userData));
  
    alert('Registration successful! Please log in.');
  
    // After registration, show the login form
    toggleForms();
  }
  
  // Function to handle user login
  function login(event) {
    event.preventDefault();
  
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    // Retrieve stored user data from localStorage
    const storedUserData = JSON.parse(localStorage.getItem(username));
  
    if (storedUserData && storedUserData.password === password) {
      alert('Login successful!');
  
      // Hide login form and show the dashboard
      document.getElementById('login-form').style.display = 'none';
      showDashboard(username);
    } else {
      alert('Invalid credentials, please try again.');
    }
  }
  
  // Function to show the dashboard with logged-in user's details
  function showDashboard(username) {
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('dashboard-username').innerText = username;
  
    // Retrieve the user's financial data from localStorage
    const userData = JSON.parse(localStorage.getItem(username));
  
    // Display user-specific financial data
    document.getElementById('total-income').innerText = `$${userData.totalIncome}`;
    document.getElementById('total-expenses').innerText = `$${userData.totalExpenses}`;
    document.getElementById('balance').innerText = `$${userData.balance}`;
  }
  
  // Function to log out the user and show the login form again
  function logout() {
    document.getElementById('dashboard').style.display = 'none';
    toggleForms();
  }
  
  // Function to add transaction and update the user's data
  function addTransaction(username, type, amount) {
    const userData = JSON.parse(localStorage.getItem(username));
  
    // Check the transaction type and update income or expenses
    if (type === 'income') {
      userData.totalIncome += amount;
    } else if (type === 'expense') {
      userData.totalExpenses += amount;
    }
  
    // Recalculate balance
    userData.balance = userData.totalIncome - userData.totalExpenses;
  
    // Save the updated user data in localStorage
    localStorage.setItem(username, JSON.stringify(userData));
  
    // Update the dashboard after adding the transaction
    showDashboard(username);
  }
  
  // Function to handle the transaction form submission
  function addTransactionForm(event) {
    event.preventDefault();
  
    const transactionType = document.getElementById('transaction-type').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    
    // Get the logged-in username
    const username = document.getElementById('dashboard-username').innerText;
  
    if (transactionAmount > 0) {
      // Call the addTransaction function to update the data
      addTransaction(username, transactionType, transactionAmount);
    } else {
      alert("Please enter a valid amount.");
    }
  }