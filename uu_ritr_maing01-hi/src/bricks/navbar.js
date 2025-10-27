import "../styles/navbar.css";

export default function Navbar() {

    return (
    <div className="page">
      <div className="panel">
        <header className="panel-header">
          <div className="logo">LOGO</div>
          <nav className="nav">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </nav>
        </header>

        <main className="panel-content">
          <h1>HEADING</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <button>READ MORE</button>
        </main>
      </div>
    </div>
  );
}