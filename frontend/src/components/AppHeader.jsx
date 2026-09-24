import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__logo">
          <span className="app-header__mark">
            <Package size={16} />
          </span>
          <span className="app-header__name">Shipment Tracker</span>
        </Link>
      </div>
    </header>
  );
}
