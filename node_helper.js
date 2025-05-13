/* Magic Mirror
 * Node Helper: MMM-ChatGPT
 *
 * By YourName
 * MIT Licensed.
 */
const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
    start: function () {
        this.apiKey = "";
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SET_API_KEY") {
            this.apiKey = payload;
        } else if (notification === "QUERY_CHATGPT") {
            this.handleQuery(payload);
        }
    },

    async handleQuery(query) {
        if (!this.apiKey) {
            this.sendSocketNotification("CHATGPT_RESPONSE", "API key not set!");
            return;
        }

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: query }],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            );

            const chatResponse = response.data.choices[0].message.content;
            this.sendSocketNotification("CHATGPT_RESPONSE", chatResponse);
        } catch (error) {
            console.error("Error querying ChatGPT:", error);
            this.sendSocketNotification(
                "CHATGPT_RESPONSE",
                "Error communicating with ChatGPT."
            );
        }
    },
});