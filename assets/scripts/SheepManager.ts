import {
  _decorator,
  Component,
  Node,
  instantiate,
  randomRangeInt,
  UITransform,
  Vec3,
  CCInteger,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("SheepManager")
export class SheepManager extends Component {
  @property({ type: Node })
  private sheepPrototype: Node = null;

  @property({ type: CCInteger })
  private maxCollision: number = 20;

  private maxOffsetX: number = 361;
  private maxOffsetY: number = 513;
  private sheepPool: Node[] = [];
  private oldSheepCount: number = 0;

  onLoad() {
    for (let i = 0; i < 20; i++) {
      const sheep = instantiate(this.sheepPrototype);
      this.sheepPool.push(sheep);
      this.node.addChild(sheep);
    }
  }

  regenerateSheep(sheepCount: number): number {
    const oldSheepCount = this.oldSheepCount;
    this.oldSheepCount = sheepCount;

    for (let i = sheepCount; i < oldSheepCount; i++) {
      this.sheepPool[i].active = false;
    }

    const maxCollision = this.maxCollision;
    let currentSheepCount = 0;
    for (let i = 0; i < sheepCount; i++) {
      const sheep = this.sheepPool[i];
      sheep.setPosition(this.sheepPrototype.getPosition());
      sheep.setRotation(this.sheepPrototype.getRotation());
      sheep.setScale(this.sheepPrototype.getScale());
      sheep.active = true;

      let collisionCount = 0;
      loopRandomOffset: while (true) {
        const offsetX = randomRangeInt(0, this.maxOffsetX);
        const offsetY = randomRangeInt(0, this.maxOffsetY);
        sheep.translate(new Vec3(offsetX, offsetY, 0));
        const sheepRect = sheep.getComponent(UITransform).getBoundingBox();

        for (let j = 0; j < i; j++) {
          const sheepA = this.sheepPool[j];
          const sheepARect = sheepA.getComponent(UITransform).getBoundingBox();
          if (sheepARect.intersects(sheepRect)) {
            sheep.translate(new Vec3(-offsetX, -offsetY, 0));
            collisionCount++;
            if (collisionCount > maxCollision) {
              sheep.active = false;
              return currentSheepCount;
            }

            continue loopRandomOffset;
          }
        }
        break;
      }
      currentSheepCount++;
    }

    return currentSheepCount;
  }
}
