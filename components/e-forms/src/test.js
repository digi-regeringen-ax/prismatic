const axios = require('axios');

const connection = {
    fields: {
        username: 'Intergrations',
        password: 'PinkFloyd1!',
        endpoint: 'https://stage-api.e-tjanster.ax'
    }
}

const eFormClient = async (connection) => {
    const {username, password, endpoint} = connection.fields;

    const instance = axios.create({
        baseURL: endpoint
    });

    const response = await instance.post(`/token`, {
        user: username,
        password: password,
    });
    const apiKey = response.data.data;
    instance.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;

    return instance;
};

const get_attachments_for_response = async (responseItem, client) => {
    const download_list = [];
    if (responseItem._attachments && Array.isArray(responseItem._attachments)) {
        for (const attachment of responseItem._attachments) {
            if (attachment.question_id in responseItem) {

                download_list.push({
                    question_id: attachment.question_id,
                    name: attachment.name,
                    url: `/response_export/response/${responseItem._id}/attachment/${attachment.ix}`,
                });
            }
        }
    }

    if (download_list.length > 0) {
        try {
            // Create an array of promises for file fetches
            const filePromises = download_list.map(async (attachment) => {
                try {
                    // Check if the question_id exists in responseItem
                    if (!(attachment.question_id in responseItem)) {
                        console.warn(`Question ID ${attachment.question_id} not found in responseItem`);
                        return null;
                    }

                    // Fetch file with Axios
                    const response = await client.get(attachment.url, {
                        responseType: 'arraybuffer'
                    });

                    // Convert to base64
                    const base64Content = Buffer.from(response.data, 'binary').toString('base64');

                    // Return attachment with content
                    return {
                        ...attachment,
                        content: base64Content
                    };
                } catch (error) {
                    console.error(`Error fetching file for ${attachment.name}:`, error);
                    return {
                        ...attachment,
                        content: null,
                        error: error.message
                    };
                }
            });

            // Wait for all file fetches to complete
            const fetchedAttachments = await Promise.all(filePromises);

            // Process each fetched attachment
            fetchedAttachments.forEach((attachment) => {
                if (!attachment) return;

                // Find the current value in responseItem for the question_id
                const currentValue = responseItem[attachment.question_id];

                // If currentValue is an array, find and replace the matching name
                if (Array.isArray(currentValue)) {
                    const index = currentValue.findIndex(item =>
                        typeof item === 'string' && item === attachment.name
                    );

                    if (index !== -1) {
                        // Replace the name with its content
                        responseItem[attachment.question_id][index] = {
                            name: attachment.name,
                            content: attachment.content
                        };
                    }
                }

            });

        } catch (error) {
            console.error('Global error in file processing:', error);
            throw error;
        }
    }
    return responseItem;


}

const main = async () => {
    const client = await eFormClient(connection);

    const inputData = {
        type: 'json',
        form_id: 3268,
        selection: 'all',
        include_attachments: true
    }

    const {type, form_id, selection, include_attachments} = inputData;

    const response = await client.get(`/response_export/form/${form_id}/${type}`, {
        params: {selection},
    });

    if (include_attachments) {
        response.data = await Promise.all(response.data.map(async (responseItem) => {
            return await get_attachments_for_response(responseItem, client);
        }));
    }

    console.log('Result', response.data);
}

main();