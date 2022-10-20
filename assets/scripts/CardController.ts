import { _decorator, Component, Node, Vec2, Touch, EventTouch } from "cc";
const { ccclass } = _decorator;
import { TouchDirection } from "./Common";

@ccclass("CardController")
export class CardController extends Component {
  enableTouchListener() {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  disableTouchListener() {
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  protected onTouchStart(event: EventTouch) {}

  protected onTouchMove(event: EventTouch) {}

  protected onTouchEnd(event: EventTouch) {}

  protected onTouchCancel(event: EventTouch) {}

  protected getTouchDirection(touch: Touch): TouchDirection {
    const offset = touch.getDelta();
    if (offset.equals(Vec2.ZERO)) return null;

    const angle = (Vec2.UNIT_X.angle(offset) * 180) / Math.PI;

    if (angle < 45) {
      return TouchDirection.RIGHT;
    } else if (angle < 135) {
      return TouchDirection.UP;
    } else if (angle < 225) {
      return TouchDirection.LEFT;
    } else if (angle < 315) {
      return TouchDirection.DOWN;
    } else {
      return TouchDirection.RIGHT;
    }
  }
}
