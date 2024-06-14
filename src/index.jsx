import './index.sass';
import {render} from 'solid-js/web';
import {Navigate, Route, Router} from '@solidjs/router';
import Navbar from './components/navbar/Navbar';
import Builder from "./pages/Builder";
import Crafter from "./pages/Crafter";
import Atlas from "./pages/Atlas";
import Devlog from "./pages/Devlog";

const App = () => <>
    <Navbar/>
    <main>
        <Router>
            <Route path="/" component={() => <Navigate href={"/builder"} />} />
            <Route path="/builder" component={Builder}/>
            <Route path="/crafter" component={Crafter}/>
            <Route path="/atlas" component={Atlas}/>
            <Route path="/devlog" component={Devlog}/>
        </Router>
    </main>
</>;

render(() => (<App/>), document.getElementById('root'));
