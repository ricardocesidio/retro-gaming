import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The page you're looking for doesn't exist or has been moved.
        Head back to the marketplace and keep hunting for retro gems.
      </p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}