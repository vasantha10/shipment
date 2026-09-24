import { Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader.jsx';
import ShipmentListPage from './pages/ShipmentListPage.jsx';
import ShipmentFormPage from './pages/ShipmentFormPage.jsx';
import ShipmentDetailPage from './pages/ShipmentDetailPage.jsx';

export default function App() {
  return (
    <>
      <AppHeader />
      <div className="container">
        <Routes>
          <Route path="/" element={<ShipmentListPage />} />
          <Route path="/shipments/new" element={<ShipmentFormPage />} />
          <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
          <Route path="/shipments/:id/edit" element={<ShipmentFormPage />} />
        </Routes>
      </div>
    </>
  );
}
