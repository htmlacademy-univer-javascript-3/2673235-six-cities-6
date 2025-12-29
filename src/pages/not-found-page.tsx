import { Link } from 'react-router-dom';
import Header from '../components/header';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <Header />
      <main className="page__main" style={{ padding: '40px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>404 Not Found</h1>
          <Link to="/">Back to main</Link>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
