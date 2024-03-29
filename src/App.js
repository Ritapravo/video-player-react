import logo from './logo.svg';
import './App.css';
import { VideoPlayer } from './player1/VideoPlayer';
// import { VideoPlayer2 } from './player2/instructorPlayer';
import { VideoPlayerContainer } from './player2/playerContainer';
import Home from './home';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Link
} from "react-router-dom";



function App() {
  return (
      <Router>
        <Switch>

          <Route exact path='/' element={<Home/>}/>
            <Route exact path='/player1' element={<VideoPlayer />}></Route>
            {/* <Route exact path="/player2" element={<Inst />}></Route> */}
            <Route exact path="/instructor" element={<VideoPlayerContainer role="instructor"/>}></Route>
            <Route exact path="/student" element={<VideoPlayerContainer role="student"/>}></Route>
            <Route exact path='*' element={<div >Page Not Found</div>} />
          
        </Switch>
      </Router>

  );
}

export default App;
