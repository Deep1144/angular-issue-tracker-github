import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Text } from '@chakra-ui/react'
import IssueList from './pages/IssueList'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    <div className="App">


      <IssueList repoUrl={'https://github.com/angular/angular'} />
      <ToastContainer />


    </div>
  )
}

export default App
