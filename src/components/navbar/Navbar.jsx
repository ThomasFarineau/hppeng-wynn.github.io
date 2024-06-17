import './Navbar.sass';

import builderIcon from "../../assets/images/icons/default/builder.png";
import crafterIcon from "../../assets/images/icons/default/crafter.png";
import atlasIcon from "../../assets/images/icons/default/atlas.png";
import devlogIcon from "../../assets/images/icons/default/devlog.png";

function handleMouseEnter(event) {
    const nav = event.target.closest('nav');
    nav.classList.add('open');
}

function handleMouseLeave(event) {
    const nav = event.target.closest('nav');
    nav.classList.remove('open');
}

export default function Navbar(props) {
    const {base} = props
    return (<nav onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <ul>
            <li>
                <a href="builder">
                    <img src={builderIcon} alt=""/>
                    <p>Builder</p>
                </a>
            </li>
            <li>
                <a href="crafter">
                    <img src={crafterIcon} alt=""/>

                    <p>Crafter</p>
                </a>
            </li>
            <li>
                <a href="atlas">
                    <img src={atlasIcon} alt=""/>

                    <p>Atlas</p>
                </a>
            </li>
            <li>
                <a href="devlog">
                    <img src={devlogIcon} alt=""/>

                    <p>Devlog</p>
                </a>
            </li>
            <li class={"bottom"}>
                <a href="https://discord.com/invite/CGavnAnerv" target={"_blank"}>
                    <img src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg" alt=""/>
                    <p>Discord</p>
                </a>
            </li>
        </ul>
    </nav>);
}
