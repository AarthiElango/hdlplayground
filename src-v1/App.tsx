
import './App.css'
import Header from './components/Header'
import { VerticalNav } from './components/VerticalNav'
import Workspace from './components/Workspace'
import { NewProjectDialog } from './components/NewProjectDialog'
import { GuestDialog } from './components/GuestDialog'
import { useAuthStore } from './store/auth'
import { useWorkspaceStore } from './store/workspace'
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from 'react'
import api from './lib/axios'
import { get } from 'lodash'
import { useProjectSidebarStore } from './store/projectSidebar'

function App() {

  const { showGuestDialog, login, logout } = useAuthStore();
  const { showProjectDialog } = useWorkspaceStore();
  const { getUserProjects} = useProjectSidebarStore();

  useEffect(()=>{

    const token = localStorage.getItem('token');
    if(!token){
        logout();
        return;
    }
    api.get('/me').then((response:any)=>{
      const username = get(response, 'data.user.username', null);
      if(!username){
        logout();
        localStorage.clear();
        return;
      }
      login(response.data.user);
      getUserProjects(true);
    })
  },[]);

  return (
    <>
      <div className='h-screen flex flex-col bg-background'>
        <Header />
        <div className="flex-1 flex min-h-0">
          <VerticalNav />
          <Workspace />
        </div>
      </div>
      {
        showProjectDialog ? <NewProjectDialog /> : ''
      }

      {
        showGuestDialog ? <GuestDialog /> : ''
      }
      <Toaster position="top-right" richColors   />

    </>
  )
}

export default App
