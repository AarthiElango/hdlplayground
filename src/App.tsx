
import './App.css'
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from './store/auth'
import { useEffect } from 'react'
import api from './lib/axios'
import { get, isEmpty } from 'lodash'
import Header from './includes/Header'
import Secondary from './includes/Secondary'
import Main from './includes/Main'
import { useMainStore } from './store/main'
import { GuestDialog } from './includes/GuestDialog'

function App() {

  const { showGuestDialog, login, logout } = useAuthStore();

  const { setProject } = useMainStore();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return;
    }
    api.get('/me').then((response: any) => {
      const username = get(response, 'data.user.username', null);
      if (!username) {
        logout();
        localStorage.clear();
        return;
      }
      login(response.data.user);
    })
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.substring(1) || null;
    if (slug) {
      async function getProject() {
        const response = await api.get(`projects/${slug}`);
        if (isEmpty(response?.data?.project)) {
          return;
        }
        
        setProject(response?.data.project);
      }
      getProject();
    }


  }, [])

  return (
    <>
      <div className='h-screen flex flex-col bg-background'>
        <Header />
        <Secondary />
        <Main />
      </div>

      <Toaster position="top-right" richColors />

      {
        showGuestDialog ? <GuestDialog /> : ''
      }
    </>
  )
}

export default App
