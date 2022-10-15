import { _decorator, Component, Event, Node, Button, EventHandler } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ClickEventHandler")
export class ClickEventHandler extends Component {
  onLoad() {
    const clickEventHandler = new EventHandler();
    clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
    clickEventHandler.component = "ClickEventHandler"; // 这个是脚本类名
    clickEventHandler.handler = "callback";
    clickEventHandler.customEventData = "foobar";

    const button = this.node.getComponent(Button);
    button.clickEvents.push(clickEventHandler);
  }

  callback(event: Event, customEventData: string) {
    // 这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
    const node = event.target as Node;
    const button = node.getComponent(Button);
    console.log(customEventData); // foobar

    const startPanelNode = this.node.parent;
    startPanelNode.active = false;
  }
}
