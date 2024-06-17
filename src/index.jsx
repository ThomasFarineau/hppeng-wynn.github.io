import './index.sass';
import {render} from 'solid-js/web';
import {Navigate, Route, Router} from '@solidjs/router';
import Navbar from './components/navbar/Navbar';
import Builder from './pages/builder/Builder';
import Crafter from './pages/Crafter';
import Atlas from './pages/Atlas';
import Devlog from './pages/Devlog';
import {load} from './utils';

const base = '/wynnbuilder';

const App = (props) => <>
  <Navbar />
  <main>
    {props.children}
  </main>
</>;

render(() => {
  load().then(() => console.log(`Loaded and running on ${base}`));

  return <Router root={App} base={base}>
    <Route path="/" component={() => <Navigate href="builder" />} />
    <Route path="/builder" component={Builder} />
    <Route path="/crafter" component={Crafter} />
    <Route path="/atlas" component={Atlas} />
    <Route path="/devlog" component={Devlog} />
  </Router>;
}, document.getElementById('root'));
