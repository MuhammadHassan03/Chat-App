import { ChakraProvider } from '@chakra-ui/react'
import './App.css'
import {createBrowserRouter , RouterProvider, Route} from 'react-router-dom';
import { ChatPage } from './Pages/ChatPage';
import { HomePage } from './Pages/HomePage';
import store from './Store/Store';
import {Provider} from 'react-redux';

const router = createBrowserRouter([
  {
    path : "/",
    element: (<HomePage></HomePage>)
  },
  {
    path : "/chats",
    element: (<ChatPage></ChatPage>)
  }
])

function App() {
  return (
    <>
      <Provider store={store}>
      <ChakraProvider>
        <RouterProvider router={router}/>
      </ChakraProvider>
      </Provider>
    </>
  )
}

export default App
