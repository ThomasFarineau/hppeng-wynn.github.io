import { createSignal } from "solid-js";
import { createModal } from "./modal/Modal";
import './Equipment.sass';
import {storeItem} from "../../../store";

export function Equipment(props) {
    const { type, index } = props;
    const { Modal, openModal } = createModal();
    const [item, setItem] = createSignal(defaultItem);
    const [bonus, setBonus] = createSignal(0);
    const [level, setLevel] = createSignal(0);
    let input;

    const updateItem = (item) => {
        setItem(item);
        storeItem(`${type}${index !== -1 ? index : ''}`, item);
        setBonus(item.base?.health || item.base?.averageDPS || 0);
        setLevel(item.requirements?.level || 0);
    };

    return (
        <>
            <div class={`equipment ${item() ? item().type || item().accessoryType : type} ${item() ? item().tier : ""}`}>
                <div class="icon"></div>
                <div class="info">
                    <span class="bonus">{bonus()}</span>
                    <span class="level">{level()}</span>
                </div>
                <div class="item">
                    <input ref={(el) => (input = el)} type="text" onFocusIn={(e) => openModal(type, e.target.value)} />
                </div>
            </div>
            <Modal input={input} type={type} setItem={updateItem} />
        </>
    );
}
