import React from 'react';
import HealthBackground from './pages/onboarding/HealthBackground';
import SymptomProfile from './pages/onboarding/SymptomProfile';
import CycleHistory from './pages/onboarding/CycleHistory';
import Goals from './pages/onboarding/Goals';
import MeetSakhi from './pages/onboarding/MeetSakhi';
import AllSet from './pages/onboarding/AllSet';
import CycleTracker from './pages/app/CycleTracker';
import Sakhi from './pages/app/Sakhi';
import DailyCheckIn from './pages/app/DailyCheckIn';
import DoctorPrep from './pages/app/DoctorPrep';
import Education from './pages/app/Education';
import Community from './pages/app/Community';
import Profile from './pages/app/Profile';
import Settings from './pages/app/Settings';
import ScreeningLanding from './pages/screening/ScreeningLanding';
import ScreeningQuestion from './pages/screening/ScreeningQuestion';
import ScreeningResult from './pages/screening/ScreeningResult';
import Welcome from './pages/auth/Welcome';
import Splash from './pages/auth/Splash';
import WellnessDashboard from './pages/app/WellnessDashboard';
import WellnessSetup from './pages/app/WellnessSetup';
import EditProfile from './pages/app/EditProfile';
import ScreeningPDF from './pages/screening/ScreeningPDF';



import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import {
  onAuthStateChanged
} from 'firebase/auth';

import { auth } from './firebase/config';

// Auth Pages
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';

// Onboarding Pages
import PersonalDetails from './pages/onboarding/PersonalDetails';

// App Pages
import Home from './pages/Home';

function App() {

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {

        setUser(currentUser);
        setLoading(false);

      }
    );

    return unsubscribe;

  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (

    <BrowserRouter>

      <Routes>

        {/* Auth */}

        <Route path="/" element={<Splash />} />

<Route
  path="/welcome"
  element={<Welcome />}
/>
        

        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/home" />
              : <Login />
          }
        />

        {/* Onboarding */}

        <Route
          path="/onboarding/personal"
          element={
            user
              ? <PersonalDetails />
              : <Navigate to="/login" />
          }
        />

        {/* Home */}

        <Route
          path="/home"
          element={
            user
              ? <Home />
              : <Navigate to="/login" />
          }
        />
        <Route
  path="/cycle"
  element={
    user
      ? <CycleTracker />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/sakhi"
  element={
    user
      ? <Sakhi />
      : <Navigate to="/login" />
  }
/>
<Route
  path="/profile/edit"
  element={user ? <EditProfile /> : <Navigate to="/login" />}
/>

<Route
  path="/screening/report"
  element={<ScreeningPDF />}
/>
        <Route
  path="/onboarding/health"
  element={
    user
      ? <HealthBackground />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/onboarding/symptoms"
  element={
    user
      ? <SymptomProfile />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/onboarding/cycle"
  element={
    user
      ? <CycleHistory />
      : <Navigate to="/login" />
  }
/>
<Route
  path="/onboarding/goals"
  element={
    user
      ? <Goals />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/onboarding/meet-sakhi"
  element={
    user
      ? <MeetSakhi />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/onboarding/all-set"
  element={
    user
      ? <AllSet />
      : <Navigate to="/login" />
  }
/>
<Route
  path="/checkin"
  element={
    user
      ? <DailyCheckIn />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/doctor-prep"
  element={
    user
      ? <DoctorPrep />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/education"
  element={
    user
      ? <Education />
      : <Navigate to="/login" />
  }
/>
<Route
  path="/community"
  element={
    user
      ? <Community />
      : <Navigate to="/login" />
  }
/>

<Route
  path="/profile"
  element={
    user
      ? <Profile />
      : <Navigate to="/login" />
  }
/>
<Route
  path="/wellness"
  element={user ? <WellnessDashboard /> : <Navigate to="/login" />}
/>
<Route
  path="/wellness-setup"
  element={user ? <WellnessSetup /> : <Navigate to="/login" />}
/>

<Route
  path="/settings"
  element={
    user
      ? <Settings />
      : <Navigate to="/login" />
  }
/>
<Route path="/screening" element={<ScreeningLanding />} />
<Route path="/screening/questions" element={<ScreeningQuestion />} />
<Route path="/screening/result" element={<ScreeningResult />} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;