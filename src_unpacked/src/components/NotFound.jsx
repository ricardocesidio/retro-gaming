import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="review-card not-found-card">
        <i className="fa-solid fa-compass-drafting" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for does not exist or has been moved. Head back to the market and keep hunting for rare gems.
        </p>
        <Link to="/" className="btn-elite primary">Back to Home</Link>
      </div>
    </div>
  );
}
