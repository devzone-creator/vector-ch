import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from '@/app/components/screens/HomeScreen';
import { MapScreen } from '@/app/components/screens/MapScreen';
import { ReportStep1 } from '@/app/components/screens/ReportStep1';
import { ReportStep2 } from '@/app/components/screens/ReportStep2';
import { ReportStep3 } from '@/app/components/screens/ReportStep3';
import { SuccessScreen } from '@/app/components/screens/SuccessScreen';
import { ProfileScreen } from '@/app/components/screens/ProfileScreen';
import { BottomNav } from '@/app/components/BottomNav';

export default function App() {
  return (
    <Router>
      <div className="h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<><HomeScreen /><BottomNav /></>} />
          <Route path="/map" element={<><MapScreen /><BottomNav /></>} />
          <Route path="/report" element={<ReportStep1 />} />
          <Route path="/report/step2" element={<ReportStep2 />} />
          <Route path="/report/step3" element={<ReportStep3 />} />
          <Route path="/report/success" element={<SuccessScreen />} />
          <Route path="/profile" element={<><ProfileScreen /><BottomNav /></>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
