// gardio_helper.js
import { Client } from '@gradio/client';

async function predictWithGradio(input, onProgress) {
    try {
        const app = await Client.connect("Het01/black-forest-labs-FLUX.1-schnell-AuraMatrix1");

        const job = app.submit("/predict", [input], {
            on_status: (status) => {
                if (onProgress) {
                    onProgress(status); // Send status updates to the callback
                }
            },
        });

        let finalResult = null;
        for await (const message of job) {
            if (message.type === "data") {
                const data = message.data;
                if (data.length > 0) {
                    finalResult = data[0].url;
                }
                break;
            }
        }

        if (!finalResult) {
            throw new Error("Failed to fetch image from Gradio API.");
        }

        return finalResult;
    } catch (error) {
        console.error("Error in Gradio API call:", error);
        throw new Error("Failed to fetch image from Gradio API.");
    }
}

export { predictWithGradio }; // Correct export
