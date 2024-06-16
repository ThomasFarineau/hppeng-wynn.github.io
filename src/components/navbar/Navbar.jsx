import './Navbar.sass';

function handleMouseEnter(event) {
    const nav = event.target.closest('nav');
    nav.classList.add('open');
}

function handleMouseLeave(event) {
    const nav = event.target.closest('nav');
    nav.classList.remove('open');
}

export default function Navbar() {
    return (<nav onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <ul>
            <li>
                <a href="/builder">
                    <img src="/images/icons/default/builder.png" alt=""/>
                    <p>Builder</p>
                </a>
            </li>
            <li>
                <a href="/crafter">
                    <img src="/images/icons/default/crafter.png" alt=""/>

                    <p>Crafter</p>
                </a>
            </li>
            <li>
                <a href="/atlas">
                    <img src="/images/icons/default/atlas.png" alt=""/>

                    <p>Atlas</p>
                </a>
            </li>
            <li>
                <a href="/devlog">
                    <img src="/images/icons/default/devlog.png" alt=""/>
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