import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <h1>📚 BeyondChats Article Manager</h1>
            <p>View and manage articles - original and optimized versions</p>
            <nav className="nav">
              <Link to="/" className="nav-link">All Articles</Link>
              <Link to="/original" className="nav-link">Original Articles</Link>
              <Link to="/optimized" className="nav-link">Optimized Articles</Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<ArticleList filter="all" />} />
            <Route path="/original" element={<ArticleList filter="original" />} />
            <Route path="/optimized" element={<ArticleList filter="optimized" />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
