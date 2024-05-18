import { Link } from "react-router-dom";

export default function Access() {
  return (
    <div>
      <div>
        <h1>Reuse, Vandy!</h1>
      </div>
      <div>
        <h3>Campus Marketplace</h3>
      </div>
      <div>
        <h2>Total users:</h2>
        <h2>Newly registered users:</h2>
        <ul></ul>
      </div>
      <div>
        <button>
          <Link to="/register">
            <span>Create an account</span>
          </Link>
        </button>
      </div>
      <div>
        <button>
          <Link to="/login">
            <span>Log in</span>
          </Link>
        </button>
      </div>
    </div>
  );
}
