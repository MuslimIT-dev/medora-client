import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

/* CONTEXT */
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import DoctorRoute from "./context/DoctorRoute.js";

/* STATE */
import ErrorPage from './components/pages/ErrorPage.js';
import Loading from './components/pages/Loading.js';
import OnlineSetup from "./components/pages/doctor/OnlineSetup.js";

/* ------------------ AUTH ------------------ */

const SignIn = lazy(() => import('./components/pages/auth/SignIn.js'));
const SignUp = lazy(() => import('./components/pages/auth/SignUp.js'));

/* ------------------ GENERAL PAGES ------------------ */

const Chats = lazy(() => import('./components/pages/Chats.js'));
const ChangeProfile = lazy(() => import('./components/pages/ChangeProfile.js'));
const Notif = lazy(() => import('./components/pages/Notifications.js'));
const AI = lazy(() => import('./components/pages/AI.js'));

/* ------------------ USER CABINET ------------------ */

const MainLayout = lazy(() => import('./components/layouts/MainLayout.js'));

/* MAIN */
const Home = lazy(() => import('./components/pages/user/Dashboard.js'));

const Settings = lazy(() => import('./components/pages/Settings.js'));

/* APPOINTMENT */
const MakeAppoint = lazy(() => import('./components/pages/user/MakeAppoint.js'));
const Doctors = lazy(() => import('./components/pages/user/appointment/Doctors.js'));
const Analyzes = lazy(() => import('./components/pages/user/appointment/Analyzes.js'));
const Procs = lazy(() => import('./components/pages/user/appointment/Procedures.js'));
const Hospitals = lazy(() => import('./components/pages/user/appointment/Hospitals.js'));
const Appointment = lazy(() => import('./components/pages/user/appointment/Appointment.js'));

/* INFO */
const DoctorPage = lazy(() => import('./components/pages/user/info/DoctorPage.js'));

/* MEDCARD */
const MedCard = lazy(() => import('./components/pages/user/MedCard.js'));
const Diagnoses = lazy(() => import('./components/pages/user/medcard/Diagnoses.js'));
const MedAnalyses = lazy(() => import('./components/pages/user/medcard/Analyses.js'));
const Medications = lazy(() => import('./components/pages/user/medcard/Medications.js'));
const Visits = lazy(() => import('./components/pages/user/medcard/Visits.js'));
const Documents = lazy(() => import('./components/pages/user/medcard/Documents.js'));
const Allergies = lazy(() => import('./components/pages/user/medcard/Allergies.js'));

/* ------------------ DOCTOR CABINET ------------------ */

/* MAIN */
const DoctorHome = lazy(() => import('./components/pages/doctor/Dashboard.js'));
const MyPatients = lazy(() => import('./components/pages/doctor/Patients.js'));
const DocSchedule = lazy(() => import('./components/pages/doctor/Schedule.js'));
const DocSettings = lazy(() => import('./components/pages/doctor/Settings.js'));
const VerBid = lazy(() => import('./components/pages/doctor/VerificationBid.js'));
const SetupShed = lazy(() => import(`./components/pages/doctor/OnlineSetup.js`));
const PatientMedcardView = lazy(() => import(`./components/pages/doctor/PatientMedcardView.js`));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>

            {/* AUTH */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* PROTECTED */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >

              <Route index element={<Home />} />

              <Route path="appointment" element={<MakeAppoint />} />
              <Route path="appointment/doctors" element={<Doctors />} />
              <Route path="appointment/analyzes" element={<Analyzes />} />
              <Route path="appointment/procedures" element={<Procs />} />
              <Route path="appointment/hospitals" element={<Hospitals />} />
              <Route path="appointment/:type/:id" element={<Appointment />} />

              <Route path="doctors/:id" element={<DoctorPage />}/>

              <Route path="medcard" element={<MedCard />} />
              <Route path="medcard/diagnoses" element={<Diagnoses />} />
              <Route path="medcard/analyses" element={<MedAnalyses />} />
              <Route path="medcard/medications" element={<Medications />} />
              <Route path="medcard/visits" element={<Visits />} />
              <Route path="medcard/documents" element={<Documents />} />
              <Route path="medcard/allergies" element={<Allergies />} />

              <Route path="AI" element={<AI />} />
              <Route path="chats" element={<Chats />} />
              <Route path="notifications" element={<Notif />} />
              <Route path="settings" element={<Settings />} />
              <Route path="changeProfile" element={<ChangeProfile />} />

              <Route path="*" element={<ErrorPage />} />

            </Route>

            <Route path="/doctor" element={
              <DoctorRoute>
                 <MainLayout />
              </DoctorRoute>
            }>
              <Route index element={<DoctorHome />} />
              <Route path="patients" element={<MyPatients />} />
              <Route path="schedule" element={<DocSchedule />} />
              <Route path="chats" element={<Chats />} />
              <Route path="AI" element={<AI />} />
              <Route path="notifications" element={<Notif />} />
              <Route path="settings" element={<DocSettings />} />
              <Route path="changeProfile" element={<ChangeProfile />} />
              <Route path="verification-bid" element={<VerBid />}/>
              <Route path="schedule/online-setup" element={<OnlineSetup />}/>
              <Route path="/doctor/patients/:id/medcard" element={<PatientMedcardView />} />

              <Route path="*" element={<ErrorPage />} />
            </Route>

          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;