function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Student Task Tracker</h1>
        <p>Simplify your study stream.</p>

        <h2>Welcome Back</h2>
        <p>Access your workspace and tasks.</p>

        <input
          type="email"
          placeholder="student@university.edu"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Login;