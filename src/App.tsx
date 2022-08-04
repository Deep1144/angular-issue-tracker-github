import IssueList from './pages/IssueList'
import { ToastContainer } from 'react-toastify'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import 'antd/dist/antd.css'
import IssueDetails from './pages/IssueDetails';

function App() {
  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<IssueList repoUrl={'angular/angular'} />} />
          <Route path="/issue/:id" element={<IssueDetails repoUrl={'angular/angular'} />} />
        </Routes>
      </Router>


      <ToastContainer />
    </div>
  )
}

export default App
