import { Component, createElement } from "react";

import { ChatWidget } from "./components/AzureOpenAI";
import "./ui/Stream.css";

export class Stream extends Component {
    render() {
        return <ChatWidget
        openaiURL={this.props.openaiURL.value}
        inputMessage={this.props.inputMessage}
        responseMessage={this.props.responseMessage}
        onFinishAction={this.props.onFinishAction} />;
    }
}