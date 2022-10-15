import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CardController")
export class CardController extends Component {
  onLoad() {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
  }

  update(deltaTime: number) {}

  public onTouchStart(event: Event) {
    this;
  }
}
