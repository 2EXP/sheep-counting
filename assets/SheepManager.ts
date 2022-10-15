import {
  _decorator,
  Component,
  Node,
  instantiate,
  randomRangeInt,
  UITransform,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("SheepManager")
export class SheepManager extends Component {
  @property({ type: Node })
  private sheepPrototype: Node = null;
  private sheepCount: number = 0;
  private sheepList: Node[] = [];
  private maxOffsetX: number = 305;
  private maxOffsetY: number = 433;

  onLoad() {
    const sheepCount = randomRangeInt(1, 21);
    this.sheepCount = sheepCount;

    for (let i = 0; i < sheepCount; i++) {
      const sheep = instantiate(this.sheepPrototype);
      this.node.addChild(sheep);

      loopRandomOffset: while (true) {
        const offsetX = randomRangeInt(0, this.maxOffsetX);
        const offsetY = randomRangeInt(0, this.maxOffsetY);
        sheep.translate(new Vec3(offsetX, offsetY, 0));
        const sheepRect = sheep.getComponent(UITransform).getBoundingBox();

        for (const sheepA of this.sheepList) {
          const sheepARect = sheepA.getComponent(UITransform).getBoundingBox();
          if (sheepARect.intersects(sheepRect)) {
            sheep.translate(new Vec3(-offsetX, -offsetY, 0));
            continue loopRandomOffset;
          }
        }
        break;
      }

      this.sheepList.push(sheep);
      sheep.active = true;
      console.log(sheep.position);
    }
  }

  // update(deltaTime: number) {}
}
