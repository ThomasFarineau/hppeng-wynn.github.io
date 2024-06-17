import './Navbar.sass';

import builderIcon from '../../assets/images/icons/default/builder.png';
import crafterIcon from '../../assets/images/icons/default/crafter.png';
import atlasIcon from '../../assets/images/icons/default/atlas.png';
import devlogIcon from '../../assets/images/icons/default/devlog.png';
import {A} from '@solidjs/router';

function handleMouseEnter(event) {
  const nav = event.target.closest('nav');
  nav.classList.add('open');
}

function handleMouseLeave(event) {
  const nav = event.target.closest('nav');
  nav.classList.remove('open');
}

export default function Navbar() {
  return <nav onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    <ul>
      <li>
        <A href="builder">
          <img src={builderIcon} alt="" />
          <p>Builder</p>
        </A>
      </li>
      <li>
        <A href="crafter">
          <img src={crafterIcon} alt="" />
          <p>Crafter</p>
        </A>
      </li>
      <li>
        <A href="atlas">
          <img src={atlasIcon} alt="" />
          <p>Atlas</p>
        </A>
      </li>
      <li>
        <A href="devlog">
          <img src={devlogIcon} alt="" />
          <p>Devlog</p>
        </A>
      </li>
      <li class={'bottom'}>
        <a href="https://discord.com/invite/CGavnAnerv" target={'_blank'}>
          <img
            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg"
            alt="" />
          <p>Discord</p>
        </a>
      </li>
    </ul>
  </nav>;
}
