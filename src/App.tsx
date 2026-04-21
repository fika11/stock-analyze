import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ChartPage } from './pages/ChartPage';
import { NewsPage } from './pages/NewsPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ValuationPage } from './pages/ValuationPage';
import { TutorialsPage } from './pages/TutorialsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/valuation" element={<ValuationPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
