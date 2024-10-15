import { createElement, Component } from "react";

export class ChatWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: { text: "", type: "" }, // Only for OpenAI response
            isStreaming: false
        };
    }

    // Automatically send the input message when the component is mounted
    componentDidMount() {
        if (this.props.inputMessage?.value) {
            this.handleSendMessage();
        }
    }

    componentDidUpdate(prevProps) {
        // Send message again only if the input has changed
        if (prevProps.inputMessage?.value !== this.props.inputMessage?.value && this.props.inputMessage?.value) {
            this.handleSendMessage();
        }
    }

    handleSendMessage = async () => {
        const { inputMessage, openaiURL } = this.props;
    
        // Ensure inputMessage is a string and has content
        if (typeof inputMessage?.value !== "string" || !inputMessage.value.trim()) return;
    
        // Set streaming state to true
        this.setState({ isStreaming: true });

        // API call
        const response = await fetch(openaiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: inputMessage.value })
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let responseText = "";

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                responseText += decoder.decode(value);

                // Update the message with the OpenAI response, not showing the input
                this.setState({
                    message: { text: responseText, type: "primary" } // Only showing the response
                });

                // Store the new response message in the Mendix string attribute (responseMessage)
                if (this.props.responseMessage) {
                    this.props.responseMessage.setValue(responseText);
                }
            }
        }

        if (this.props.onFinishAction) {
            this.props.onFinishAction.execute();
        }

        this.setState({ isStreaming: false });
    };

    render() {
        const { message } = this.state;

        return (
            <div className="chat-module-container">
                <div className="messages">
                    {/* Only the OpenAI response is shown */}
                    <div className={`message-item ${message.type === "primary" ? "item-primary" : ""}`}>
                        {message.text}
                    </div>
                </div>
            </div>
        );
    }
}