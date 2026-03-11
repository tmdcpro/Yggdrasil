import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CaptureReview } from './components/CaptureReview';
import { GraphView } from './components/GraphView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="capture" element={<CaptureReview />} />
        <Route path="graph" element={<GraphView />} />
      </Route>
    </Routes>
  );
}

export default App;
