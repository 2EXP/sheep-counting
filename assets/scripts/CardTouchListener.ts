import { _decorator, Component, Node } from "cc";
const { ccclass } = _decorator;

@ccclass("CardTouchListener")
export class CardTouchListener extends Component {
  onLoad() {
    this.node.on(Node.EventType.TOUCH_START, () => {}, this);
    this.node.on(Node.EventType.TOUCH_MOVE, () => {}, this);
    this.node.on(Node.EventType.TOUCH_END, () => {}, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, () => {}, this);
  }
}
