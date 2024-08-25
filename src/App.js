import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('wss://bajaj-0jzl.onrender.com');

function App() {
    const [inputData, setInputData] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [visibleSections, setVisibleSections] = useState({
        fullResponse: true
    });

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = (message) => {
            console.log(message.data);
        };
    }, []);

    const isValidJSON = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!isValidJSON(inputData)) {
            setError('Invalid JSON format');
            return;
        }

        try {
            const response = await axios.post('https://bajaj-0jzl.onrender.com/bfhl', JSON.parse(inputData));
            setResponseData(response.data);
            setError('');
        } catch (error) {
            console.error('Error submitting data:', error);
            setError('Error submitting data');
        }
    };

    const handleVisibilityChange = () => {
        setVisibleSections({
            ...visibleSections,
            fullResponse: !visibleSections.fullResponse
        });
    };

    return (
        <div>
            <h1>21BAI1091</h1>
            <textarea
                rows="10"
                cols="50"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder='Enter JSON here...'
            />
            <br />
            <button onClick={handleSubmit}>Submit</button>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {responseData && (
                <div>
                    <h2>Response:</h2>
                    <label>
                        <input
                            type="checkbox"
                            checked={visibleSections.fullResponse}
                            onChange={handleVisibilityChange}
                        />
                        Full Response
                    </label>
                    {visibleSections.fullResponse && (
                        <div>
                            <pre>{JSON.stringify(responseData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default App;
