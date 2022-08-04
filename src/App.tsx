import IssueList from './pages/IssueList'
import { ToastContainer } from 'react-toastify'
import { Button } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css'
import './index.css'

function App() {
  return (
    <div>
      <IssueList repoUrl={'angular/angular'} />
      <ToastContainer />
    </div>
  )
}

export default App
