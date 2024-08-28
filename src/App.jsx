import './App.css'
import AppRoutes from "./routes"
import Toaster from "./components/Toaster"
import { useDeliveryApp } from './hooks'

function App() {
  const {
    launchToaster,
    toastType,
    toastMsg
  } = useDeliveryApp()
  return (
    <>
      {launchToaster &&
        <Toaster
          type={toastType}
          message={toastMsg}
        />
      }
      <AppRoutes />
    </>
  )
}

export default App
