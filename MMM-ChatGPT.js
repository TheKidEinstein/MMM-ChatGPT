/* Magic Mirror
 * Module: MMM-ChatGPT
 *
 * By YourName
 * MIT Licensed.
 */

Module.register("MMM-ChatGPT", {
    defaults: {
        openaiApiKey: "", // Add your OpenAI API key here
        placeholder: "Ask ChatGPT something...",
        updateInterval: 5000, // Time in milliseconds to update the display
    },

    start: function () {
        this.query = "";
        this.response = "Awaiting your question...";
        this.sendSocketNotification("SET_API_KEY", this.config.openaiApiKey);
    },

    getStyles: function () {
        return ["MMM-ChatGPT.css"];
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        // Input box
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = this.config.placeholder;
        input.className = "chatgpt-input";
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && input.value.trim() !== "") {
                this.query = input.value;
                this.sendSocketNotification("QUERY_CHATGPT", this.query);
                input.value = "";
            }
        });
        wrapper.appendChild(input);

        // Response display
        const responseDiv = document.createElement("div");
        responseDiv.className = "chatgpt-response";
        responseDiv.innerHTML = this.response;
        wrapper.appendChild(responseDiv);

        this.responseDiv = responseDiv;
        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "CHATGPT_RESPONSE") {
            this.response = payload;
            this.updateDom();
        }
    },
});