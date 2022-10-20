import { _decorator, Node, EventTouch, Vec3, CCInteger, Event } from "cc";
import { CardController } from "./CardController";
const { ccclass, property } = _decorator;
import { TouchDirection } from "./Common";

@ccclass("StartCardController")
export class StartCardController extends CardController {
  @property({ type: Node })
  private sceneCard: Node = null;

  @property({ type: CCInteger })
  private enterSceneSpeedMultiplier: number = 1;

  private isEnterScene: boolean = false;
  private isRelease: boolean = false;
  private touchDirection: TouchDirection = null;
  private originPosition: Vec3 = null;

  private enterRotateSpeed: number = 90;
  private releaseMoveSpeed: number = 1000;
  private releaseRotateSpeed: number = 90;

  onLoad() {
    this.originPosition = this.node.getPosition();
    this.enterRotateSpeed =
      this.enterSceneSpeedMultiplier * this.releaseMoveSpeed;
  }

  update(deltaTime: number) {
    if (this.isEnterScene) {
      const angleZOrigin = this.node.eulerAngles.z;
      const angleZ = angleZOrigin + this.enterRotateSpeed * deltaTime;
      if (
        (angleZ > 0 && angleZOrigin < 0) ||
        (angleZ < 0 && angleZOrigin > 0)
      ) {
        this.node.setRotationFromEuler(Vec3.ZERO);
        this.enableTouchListener();
        this.isEnterScene = false;
        return;
      }

      this.node.setRotationFromEuler(
        0,
        0,
        this.node.eulerAngles.z + this.enterRotateSpeed * deltaTime
      );
    }

    if (!this.node.active) return;

    if (this.isRelease) {
      if (
        this.touchDirection === TouchDirection.LEFT ||
        this.touchDirection === TouchDirection.RIGHT
      ) {
        this.node.setRotationFromEuler(
          0,
          0,
          this.node.eulerAngles.z + this.enterRotateSpeed * deltaTime
        );
      }

      if (Math.abs(this.node.eulerAngles.z) > 45) {
        this.node.active = false;
        this.disableTouchListener();
        this.node.setRotationFromEuler(
          0,
          0,
          -45 * this.enterSceneSpeedMultiplier
        );
        this.isRelease = false;
        this.node.dispatchEvent(new Event("game-start", true));
      }
    }
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

    if (this.node.eulerAngles.z > 12) {
      this.isRelease = true;
      this.touchDirection = TouchDirection.LEFT;
      return;
    } else if (this.node.eulerAngles.z < -12) {
      this.isRelease = true;
      this.touchDirection = TouchDirection.RIGHT;
      return;
    }

    if (
      this.touchDirection === TouchDirection.LEFT ||
      this.touchDirection === TouchDirection.RIGHT
    ) {
      if (this.enterSceneSpeedMultiplier > 0) {
        const angle =
          (touch.getPreviousLocation().signAngle(touch.getLocation()) * 180) /
          Math.PI;
        const angleZ = this.node.eulerAngles.z + angle;

        if (angleZ <= 0) {
          this.node.setRotationFromEuler(Vec3.ZERO);
          return;
        }

        this.node.setRotationFromEuler(0, 0, angleZ);
      } else {
        const angle =
          (touch.getPreviousLocation().signAngle(touch.getLocation()) * 180) /
          Math.PI;
        const angleZ = this.node.eulerAngles.z + angle;

        if (angleZ >= 0) {
          this.node.setRotationFromEuler(Vec3.ZERO);
          return;
        }

        this.node.setRotationFromEuler(0, 0, angleZ);
      }
    }
  }

  onTouchEnd(event: EventTouch) {
    if (this.isRelease) return;

    this.node.setRotationFromEuler(0, 0, 0);
    this.sceneCard.setScale(1, 1, 1);
    this.touchDirection = null;

    this.node.setPosition(this.originPosition);
  }

  enterScene() {
    this.sceneCard.setScale(Vec3.ONE);
    this.node.setRotationFromEuler(0, 0, -45 * this.enterSceneSpeedMultiplier);
    this.enterRotateSpeed =
      this.releaseRotateSpeed * this.enterSceneSpeedMultiplier;
    this.isEnterScene = true;
    this.isRelease = false;
    this.node.active = true;
  }
}
