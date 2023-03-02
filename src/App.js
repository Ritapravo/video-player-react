import logo from './logo.svg';
import './App.css';
import { VideoPlayer } from './player1/VideoPlayer';
import { VideoPlayer2 } from './player2/player2';
import { VideoPlayerContainer } from './player2/playerContainer';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className='container'>
      <Router>
        <Switch>

          <Route exact path='/' element={<>asdfas</>}/>
            <Route exact path='/player1' element={<VideoPlayer />}></Route>
            <Route exact path="/player2" element={<VideoPlayer2 />}></Route>
            <Route exact path="/player3" element={<VideoPlayerContainer />}></Route>
            <Route exact path='*' element={<div >Page Not Found</div>} />
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;
