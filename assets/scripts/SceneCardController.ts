import { _decorator, Node, EventTouch, Vec3, CCInteger } from "cc";
import { CardController } from "./CardController";
import { TouchDirection } from "./Common";
import { SelectEvent } from "./SelectEvent";
import { SheepManager } from "./SheepManager";
const { ccclass, property } = _decorator;

@ccclass("SceneCardController")
export class SceneCardController extends CardController {
  @property({ type: Node })
  private sceneCard: Node = null;

  @property({ type: CCInteger })
  private order: number = 0;

  private sheepManager: SheepManager = null;
  private sheepCount: number = 0;

  private orderScale: Vec3[] = [
    new Vec3(1, 1, 1),
    new Vec3(0.95, 0.95, 1),
    new Vec3(0.9, 0.9, 1),
  ];
  private isRelease: boolean = false;
  private touchDirection: TouchDirection = null;
  private originPosition: Vec3 = null;
  private isOutOfScreen: boolean = false;

  private releaseMoveSpeed: number = 2000;
  private releaseRotateSpeed: number = 90;

  onLoad() {
    this.sheepManager = this.sceneCard.getComponent(SheepManager);

    this.originPosition = this.node.getPosition();
    this.orderScale = [
      new Vec3(1, 1, 1),
      new Vec3(0.95, 0.95, 1),
      new Vec3(0.9, 0.9, 1),
    ];
  }

  update(deltaTime: number) {
    if (this.isOutOfScreen) return;

    if (this.isRelease) {
      if (this.touchDirection === TouchDirection.UP) {
        this.node.setPosition(
          this.node.position.x,
          this.node.position.y + this.releaseMoveSpeed * deltaTime
        );
      } else if (this.touchDirection === TouchDirection.DOWN) {
        this.node.setPosition(
          this.node.position.x,
          this.node.position.y - this.releaseMoveSpeed * deltaTime
        );
      } else if (this.touchDirection === TouchDirection.LEFT) {
        this.node.setRotationFromEuler(
          0,
          0,
          this.node.eulerAngles.z + this.releaseRotateSpeed * deltaTime
        );
      } else {
        this.node.setRotationFromEuler(
          0,
          0,
          this.node.eulerAngles.z - this.releaseRotateSpeed * deltaTime
        );
      }

      if (
        Math.abs(this.node.position.y - this.originPosition.y) > 1000 ||
        Math.abs(this.node.eulerAngles.z) > 45
      ) {
        this.isOutOfScreen = true;
        this.order = 3;
        this.disableTouchListener();
        this.node.dispatchEvent(
          new SelectEvent("direction-select", true, this.touchDirection)
        );
      }
    }
  }

  onDisable() {
    this.order = 3;
    this.node.dispatchEvent(
      new SelectEvent("direction-select", true, this.touchDirection)
    );
  }

  onTouchStart(event: EventTouch) {
    if (this.isRelease) return;

    this.sceneCard.setScale(1.2, 1.2, 1);
  }

  onTouchMove(event: EventTouch) {
    if (this.isRelease) return;

    const touch = event.touch;
    if (this.touchDirection === null) {
      this.touchDirection = this.getTouchDirection(touch);
    }

    if (this.node.position.y - this.originPosition.y > 100) {
      this.isRelease = true;
      this.touchDirection = TouchDirection.UP;
      return;
    } else if (this.node.position.y - this.originPosition.y < -100) {
      this.isRelease = true;
      this.touchDirection = TouchDirection.DOWN;
      return;
    } else if (this.node.eulerAngles.z > 12) {
      this.isRelease = true;
      this.touchDirection = TouchDirection.LEFT;
      return;
    } else if (this.node.eulerAngles.z < -12) {
      this.isRelease = true;
      this.touchDirection = TouchDirection.RIGHT;
      return;
    }

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
        const angle =
          (touch.getPreviousLocation().signAngle(touch.getLocation()) * 180) /
          Math.PI;
        this.node.setRotationFromEuler(0, 0, this.node.eulerAngles.z + angle);
        break;
    }
  }

  onTouchEnd(event: EventTouch) {
    if (this.isRelease) return;

    this.node.setRotationFromEuler(0, 0, 0);
    this.sceneCard.setScale(1, 1, 1);
    this.touchDirection = null;

    this.node.setPosition(this.originPosition);
  }

  toNextState() {
    this.order -= 1;
    this.node.setSiblingIndex(2 - this.order);
    this.node.setScale(this.orderScale[this.order]);
  }

  initTransformation() {
    this.order = 3;
    this.node.setSiblingIndex(0);
    this.isOutOfScreen = false;
    this.sceneCard.setScale(1, 1, 1);
    this.node.setScale(this.orderScale[2]);
    this.node.setPosition(this.originPosition);
    this.node.setRotationFromEuler(0, 0, 0);
    this.isRelease = false;
    this.touchDirection = null;
  }

  regenerateSheep(expectSheepCount: number) {
    this.sheepCount = this.sheepManager.regenerateSheep(expectSheepCount);
  }

  getSheepCount(): number {
    return this.sheepCount;
  }
}
