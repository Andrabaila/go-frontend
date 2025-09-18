import './assets/styles/global.css';
import 'leaflet/dist/leaflet.css';
import MapComponent from './components/map/MapComponent';

import "./assets/styles/global.css";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <div>
      <h1>Walking Game</h1> 
      <div >
        <MapComponent />
      </div>
    </div>
  );
}

export default App;

