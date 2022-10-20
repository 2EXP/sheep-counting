import { Event } from "cc";
import { TouchDirection } from "./Common";

export class SelectEvent extends Event {
  constructor(name: string, bubbles?: boolean, direction?: TouchDirection) {
    super(name, bubbles);
    this.selectedDirection = direction;
  }
  selectedDirection: TouchDirection = null;
}
