import { Link, NavLink, Outlet } from 'react-router-dom';

export const Layout = () => (
  <div className="app-shell">
    <header>
      <h1>
        <Link to="/">AnyList Vocab Games</Link>
      </h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/teacher">Teacher Area</NavLink>
      </nav>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
);
