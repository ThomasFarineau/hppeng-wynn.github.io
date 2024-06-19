import './index.sass';
import {createSignal} from 'solid-js';
import {render} from 'solid-js/web';
import {Navigate, Route, Router} from '@solidjs/router';
import Navbar from './components/navbar/Navbar';
import Builder from './pages/builder/Builder';
import Crafter from './pages/Crafter';
import Atlas from './pages/Atlas';
import Devlog from './pages/Devlog';
import {load} from './utils';

const base = `/${process.env.BASE_URL || ''}`;

const App = (props) => (
  <>
    <Navbar />
    <main>{props.children}</main>
  </>
);

const Loader = () => <div class="loader">Loader</div>;

render(() => {
  const [loading, setLoading] = createSignal(true);

  load().then(() => {
    console.log(`Loaded and running on ${base}`);
    setLoading(false);
  });

  return (
    <>
      {loading() ? (
        <Loader />
      ) : (
        <Router root={App} base={base}>
          <Route path="/" component={() => <Navigate href="builder" />} />
          <Route path="/builder" component={Builder} />
          <Route path="/crafter" component={Crafter} />
          <Route path="/atlas" component={Atlas} />
          <Route path="/devlog" component={Devlog} />
        </Router>
      )}
    </>
  );
}, document.getElementById('root'));
