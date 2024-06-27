import IWebhook from "./interface/IWebHook";

const sendNotifyWebhooks = (webHooks: IWebhook[], publicationResponse: Object) => {
    webHooks.forEach((webhookDoc) => {
        const url = webhookDoc.webHook; 
        if (!url) {
            console.error('Error: URL is undefined or null');
            return; 
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(publicationResponse)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    });
};

export default sendNotifyWebhooks;
