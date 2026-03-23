import { Link } from 'react-router-dom';


export default function Home() {
  return (
    <>
      <section id="inteiro">
        <div className="search-wrapper">
          <div className="search-container">
            <input type="text" placeholder="Search for retro games, consoles, gear..." id="site-search" />
            <button type="submit" className="search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      <div className="banner-outer-wrapper">
        <div className="banner-wrapper">
          <div className="banner-slider">
            <div className="banner-slides">
              <img src="/images/mainpic0.jpg" alt="Slide 1" />
              <img src="/images/mainpic2.jpg" alt="Slide 2" />
              <img src="/images/mainpic3.jpg" alt="Slide 3" />
            </div>
            <Link to="/sell" className="banner-click-area">
              START SELLING HERE
            </Link>
          </div>
        </div>
      </div>

      <section className="hero">
        <h1>SELL YOUR <span className="highlight">GEEK STUFF</span></h1>
        <p>The marketplace for retro games, consoles, and nerd gear.</p>
      </section>

      <main className="container">
        <h2 style={{ margin: '20px 5%', color: 'var(--text-main)' }}>Market</h2>
        <div className="product-grid">
          <p>Loading products... (fetch soon)</p>
        </div>

      </main>
    </>
  );
}