import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/nav-bar';
import PageRoutes from './pages/page-routes';

import styled from '@emotion/styled';

import 'react-image-gallery/styles/css/image-gallery.css';

import { store } from './state/store'
import { Provider } from 'react-redux'

const Root = styled.div`
`

const Container = styled.div`
  padding: 10px;
`

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
          <Root>
            <NavBar />
            <Container>
              <PageRoutes />
            </Container>
          </Root>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
