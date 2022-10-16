import { _decorator, Component, Node, Touch, Vec2, EventTouch } from "cc";
const { ccclass, property } = _decorator;

enum TouchDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

@ccclass("CardController")
export class CardController extends Component {
  // @property({ type: Node })
  // private cardRotateAnchor: Node = null;

  private touchDown: boolean = false;
  private touchDirection: TouchDirection = null;
  private originPosition: Vec2 = null;
  private willFallOut: boolean = false;

  onLoad() {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  update(deltaTime: number) {}

  onTouchStart(event: EventTouch) {
    this.node.setScale(1.1, 1.1, 1);
    this.touchDown = true;
    this.touchDirection = this.getTouchDirection(event.touch);
  }

  onTouchMove(event: EventTouch) {
    const touch = event.touch;

    if (this.touchDown) {
      switch (this.touchDirection) {
        case TouchDirection.UP:
        case TouchDirection.DOWN:
          this.node.setPosition(
            this.node.position.x,
            this.node.position.y + touch.getDelta().y
          );
          break;
        case TouchDirection.LEFT:
        case TouchDirection.RIGHT:
          const angle = touch.getLocation().angle(touch.getPreviousLocation());
          this.node.setPosition(
            this.node.position.x,
            this.node.position.y,
            this.node.position.z + angle
          );
          break;
      }
    }
  }

  onTouchEnd(event: EventTouch) {
    this.node.setScale(1, 1, 1);
    this.touchDown = false;
    this.touchDirection = null;

    if (!this.calculateFallOut(event.touch)) {
      this.node.setPosition(0, 0, 0);
    }
  }

  private getTouchDirection(touch: Touch) {
    const offset = touch.getDelta();
    if (offset.equals(Vec2.ZERO)) return null;

    const angle = offset.angle(Vec2.UNIT_X);

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

  private calculateFallOut(touch: Touch) {
    switch (this.touchDirection) {
      case TouchDirection.UP:
      case TouchDirection.DOWN:
        if (Math.abs(touch.getLocationY() - touch.getStartLocation().y) > 100) {
          return true;
        }
        break;
      case TouchDirection.LEFT:
      case TouchDirection.RIGHT:
        if (Math.abs(touch.getLocationX() - touch.getStartLocation().x) > 100) {
          return true;
        }
        break;
    }
    return false;
  }
}
