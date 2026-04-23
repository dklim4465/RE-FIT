import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="not-found-page">
      <h1>404</h1>
      <p>없는 페이지입니다.</p>
      <Link to="/">홈으로 이동</Link>
    </section>
  );
}
