import { _decorator, Component, Label, Vec3 } from "cc";
const { ccclass } = _decorator;

@ccclass("ArrowController")
export class ArrowController extends Component {
  private moveSpeed: number = 1000;
  private label: Label = null;
  private directionMultiplier: number = 0;

  onLoad() {
    this.label = this.node.getChildByName("Label").getComponent(Label);
  }

  update(deltaTime: number) {
    if (this.directionMultiplier) {
      this.node.setPosition(
        this.node.position.x +
          this.directionMultiplier * this.moveSpeed * deltaTime,
        this.node.position.y,
        this.node.position.z
      );

      if (this.node.position.x > 280) {
        this.node.setPosition(280, this.node.position.y, this.node.position.z);
        this.directionMultiplier = 0;
        this.enabled = false;
        return;
      }

      if (this.node.position.x < 0) {
        this.node.setPosition(Vec3.ZERO);
        this.directionMultiplier = 0;
        return;
      }
    }
  }

  moveOut() {
    this.directionMultiplier = 1;
  }

  moveIn() {
    this.enabled = true;
    this.directionMultiplier = -1;
  }

  setValue(value: number) {
    this.label.string = value.toString();
  }

  getValue(): number {
    return Number(this.label.string);
  }
}
