import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <h1>404 Not Found</h1>
      <Link to="/">Back</Link>
    </div>
  );
}
