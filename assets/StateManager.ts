import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("StateManager")
export class StateManager extends Component {
  private score: number = 0;
  private sheepCount: number = 0;

  /**
   * getScore - 获取分数
   */
  public getScore() {
    return this.score;
  }

  /**
   * addScore - 增加分数
   */
  public addScore() {
    this.score += 1;
  }

  /**
   * getSheepCount - 获取羊的数量
   */
  public getSheepCount() {
    return this.sheepCount;
  }

  /**
   * setSheepCount
   */
  public setSheepCount(sheepCount: number) {
    this.sheepCount = sheepCount;
  }
}
