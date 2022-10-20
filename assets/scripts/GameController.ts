import { _decorator, Component, Node, randomRangeInt } from "cc";
import { ArrowController } from "./ArrowController";
import { SceneCardController } from "./SceneCardController";
import { StartCardController } from "./StartCardController";
import { TouchDirection } from "./Common";
import { SelectEvent } from "./SelectEvent";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: Node })
  private arrowUp: Node = null;

  @property({ type: Node })
  private arrowDown: Node = null;

  @property({ type: Node })
  private arrowLeft: Node = null;

  @property({ type: Node })
  private arrowRight: Node = null;

  private startCard: Node = null;
  private replayCard: Node = null;
  private cardAnchor1: Node = null;
  private cardAnchor2: Node = null;
  private cardAnchor3: Node = null;

  private invisibleCard: Node = null;
  private arrowMap: Map<TouchDirection, ArrowController> = new Map();

  private cards: Node[] = [];

  onLoad() {
    this.initChildren();
    this.node.on("direction-select", this.onSelectEvent, this);
    this.node.on("game-start", this.onGameStart, this);

    this.cards.push(this.cardAnchor1, this.cardAnchor2);
  }

  start() {
    this.regenerateSheep(this.cardAnchor1.getComponent(SceneCardController));
    this.regenerateSheep(this.cardAnchor2.getComponent(SceneCardController));
    this.regenerateSheep(this.cardAnchor3.getComponent(SceneCardController));
  }

  private initChildren() {
    this.startCard = this.node.getChildByName("StartCard");
    this.startCard.getComponent(StartCardController).enableTouchListener();
    this.replayCard = this.node.getChildByName("ReplayCard");
    this.cardAnchor1 = this.node.getChildByName("CardAnchor1");
    this.cardAnchor2 = this.node.getChildByName("CardAnchor2");
    this.cardAnchor3 = this.node.getChildByName("CardAnchor3");
    this.invisibleCard = this.cardAnchor3;

    this.arrowMap.set(
      TouchDirection.UP,
      this.arrowUp.getComponent(ArrowController)
    );
    this.arrowMap.set(
      TouchDirection.DOWN,
      this.arrowDown.getComponent(ArrowController)
    );
    this.arrowMap.set(
      TouchDirection.LEFT,
      this.arrowLeft.getComponent(ArrowController)
    );
    this.arrowMap.set(
      TouchDirection.RIGHT,
      this.arrowRight.getComponent(ArrowController)
    );
  }

  private onSelectEvent(event: SelectEvent) {
    const cardController = this.cards[0].getComponent(SceneCardController);
    if (
      cardController.getSheepCount() !==
      this.arrowMap.get(event.selectedDirection).getValue()
    ) {
      this.invisibleCard = this.cards.shift();
      this.invisibleCard.getComponent(SceneCardController).initTransformation();
      this.regenerateSheep(
        this.invisibleCard.getComponent(SceneCardController)
      );
      this.arrowMap.forEach((arrow) => arrow.moveOut());
      this.replayCard.getComponent(StartCardController).enterScene();
      return;
    }

    const invisibleCard = this.cards.shift();
    this.cards.push(invisibleCard);
    invisibleCard.getComponent(SceneCardController).initTransformation();
    this.invisibleCard = invisibleCard;
    this.regenerateSheep(this.invisibleCard.getComponent(SceneCardController));

    const newFirstController = this.cards[0].getComponent(SceneCardController);
    newFirstController.enableTouchListener();
    this.initArrows(newFirstController.getSheepCount());

    this.cards.forEach((card) =>
      card.getComponent(SceneCardController).toNextState()
    );
  }

  private initArrows(targetValue: number) {
    const arrowCount = 4;
    let min = targetValue - (arrowCount - 1);
    if (min < 1) min = 1;
    let lo = randomRangeInt(min, targetValue + 1);
    let hi = lo + arrowCount;

    const range = this.numberRange(lo, hi);
    const randomRange = this.shuffleArray(range);

    this.arrowMap.forEach((arrow, direction) =>
      arrow.setValue(randomRange[direction])
    );
  }

  private shuffleArray(arr: number[]) {
    const length = arr.length;
    for (let index = length - 1; index > 0; index--) {
      const random = Math.floor(Math.random() * index);
      const temp = arr[index];
      arr[index] = arr[random];
      arr[random] = temp;
    }

    return arr;
  }

  private numberRange(start: number, end: number): number[] {
    return new Array(end - start).fill(1).map((_, i) => i + start);
  }

  private onGameStart(event: Event) {
    this.cards.push(this.invisibleCard);
    const cardController = this.cards[0].getComponent(SceneCardController);
    cardController.enableTouchListener();

    this.initArrows(cardController.getSheepCount());
    this.arrowMap.forEach((arrow) => arrow.moveIn());

    this.cards.forEach((card) =>
      card.getComponent(SceneCardController).toNextState()
    );
  }

  private regenerateSheep(cardController: SceneCardController) {
    const sheepCount = randomRangeInt(1, 21);
    cardController.regenerateSheep(sheepCount);
  }
}
