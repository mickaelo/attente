import axios from "axios";
import React, { useState } from "react";

export default function Form() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [inputText, setInputText] = useState("");
    const [streamedChunks, setStreamedChunks] = useState([]);
    const [completeResponse, setCompleteResponse] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    console.log(completeResponse)
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleButtonClick = async () => {
        clearStreamedChunks();
        setInputText(inputText);
        incrementRequestCount();
        const newRequest = { id: requestCount, text: inputText, chunks: [] };
        await processInput(newRequest);
    };

    const processInput = async (request) => {
        const apiRequestBody = {
            "model": "gpt-4o",
            "messages": [
                { role: "system", content: request.text }
            ],
        };

        try {
            const runResponse = await axios.post(`https://api.openai.com/v1/chat/completions`, apiRequestBody );
            const content = runResponse.data.choices[0]?.message?.content;
            if (content) {
                const chatGPTResponse = {
                    message: content,
                    sender: "ChatGPT",
                };
                setCompleteResponse((prevMessages) => [...prevMessages, chatGPTResponse]);
            }
            // const reader = runResponse.body.getReader();
            // const decoder = new TextDecoder();

            // const handleStreamedResponse = (value) => {
            //     const lines = decoder.decode(value).split('\n');
            //     console.log(lines)
            //     for (const line of lines) {
            //         if (line.trim().startsWith('data:')) {
            //             const data = line.trim().slice(5);
            //             if (data === '[DONE]') {
            //                 console.log("done")
            //                 setIsLoading(false);
            //             } else {
            //                 try {
            //                     const event = JSON.parse(data);
            //                     handleStreamedEvent(event);
            //                 } catch (error) {
            //                     console.error('Error parsing streamed response:', error);
            //                 }
            //             }
            //         }
            //     }
            // };

            // const handleStreamedEvent = (event) => {
            //     console.log(event)
            //     switch (event.object) {
            //         case 'thread.message.delta':
            //             if (event.delta.content) {
            //                 const content = event.delta.content[0].text.value;
            //                 const formattedContent = content
            //                     .replace(/\n/g, '<br/>')
            //                     .replace(/\_\_(.+?)\_\_/g, '<strong>$1</strong>')
            //                     .replace(/\_(.+?)\_/g, '<em>$1</em>')
            //                     .replace(/\`(.+?)\`/g, '<code>$1</code>');

            //                 setStreamedChunks((prevChunks) => [...prevChunks, formattedContent]);
            //                 setIsLoading(false);
            //             }
            //             break;
            //         case 'thread.message.completed':
            //             const finalMessage = event.content[0].text.value;
            //             const formattedFinalMessage = finalMessage
            //                 .replace(/\n/g, '<br/>')
            //                 .replace(/\_\_(.+?)\_\_/g, '<strong>$1</strong>')
            //                 .replace(/\_(.+?)\_/g, '<em>$1</em>')
            //                 .replace(/\`(.+?)\`/g, '<code>$1</code>');
            //             console.log("test")
            //             console.log(formattedFinalMessage)
            //             setCompleteResponse(formattedFinalMessage);
            //             break;
            //         default:
            //             break;
            //     }
            // };

            // const readLoop = async () => {
            //     while (true) {
            //         const { done, value } = await reader.read();
            //         if (done) {
            //             break;
            //         }
            //         handleStreamedResponse(value);
            //     }
            // };

            // readLoop();
        } catch (error) {
            console.error("Error running thread:", error);
        }
    };
    const handleSuggestionClick = async (suggestion) => {
        clearStreamedChunks();
        incrementRequestCount();
        setInputText(suggestion);
        const newRequest = { id: requestCount, text: suggestion, chunks: [] };
        await processInput(newRequest);
    };

    const clearStreamedChunks = () => {
        setStreamedChunks([]);
        setIsVisible(false);
    };

    const incrementRequestCount = () => {
        setRequestCount((prevCount) => prevCount + 1);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter your question..."
                value={inputText}
                onChange={handleInputChange}
                onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                        handleButtonClick();
                    }
                }}
                style={{
                    fontFamily: 'DM Sans, sans-serif',
                    width: "80%",
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    marginLeft: "12px"
                }}
            />
            <button
                onClick={handleButtonClick}
                disabled={isLoading}
                className={isLoading ? "flipping-button" : ""}
                style={{
                    alignItems: "center",
                    animation: isLoading ? "flip 0.8s ease-in-out" : "none",
                    marginTop: "10px",
                    padding: "8px 12px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                    marginLeft: "15px",
                }}
            >
                &rarr;
            </button>
            {isLoading && <p>Loading...</p>}

            {isVisible && (
                <div
                    style={{
                        marginTop: "20px",
                        backgroundColor: "#f0f0f0",
                        padding: "5px",
                        borderRadius: "5px",
                        maxWidth: '650px',
                        minWidth: '320px',
                        marginLeft: "12px"
                    }}
                >
                    <h2 style={{ fontFamily: 'DM Sans, sans-serif' }}>{inputText}</h2>
                </div>)}
            {completeResponse.map((response) => <p>{response.message}</p>)}
        </div>
    )
}