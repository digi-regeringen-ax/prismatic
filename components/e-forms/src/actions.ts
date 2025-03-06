import {action, input} from "@prismatic-io/spectral";
import {eFormClient} from "./client";
import {AxiosInstance} from "axios";

const eFormConnectionInput = input({
    label: "E-Form-Service Connection",
    required: true,
    type: "connection",
});

const form_id_input = input({
    label: "Form ID",
    type: "string",
    required: true,
});

const response_id_input = input({
    label: "Response ID",
    type: "string",
    required: true,
});

const dropdown_input = ((label: string, options: string[]) => input({
    label: label,
    type: "string",
    required: true,
    model: options.map(item => ({label: item, value: item})),
}));

const get_attachments_for_response = async (responseItem: any, client: AxiosInstance) => {
    const download_list = [];
    if (responseItem._attachments && Array.isArray(responseItem._attachments)) {
        for (const attachment of responseItem._attachments) {
            if (attachment.question_id in responseItem) {

                download_list.push({
                    question_id: attachment.question_id,
                    name: attachment.name,
                    url: `/response_export/response/${responseItem._id}/attachment/${attachment.ix}`,
                    mime_type: attachment.mime_type
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
                } catch (e: any) {
                    console.error(`Error fetching file for ${attachment.name}:`, e);
                    return {
                        ...attachment,
                        content: null,
                        error: e.message
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
                            content: attachment.content,
                            mime_type: attachment.mime_type
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

const response_export = action({
    display: {
        label: "Export form responses to a specified format",
        description: "Returns a single file containing all selected responses. Default selection is all.",
    },
    inputs: {
        eFormConnection: eFormConnectionInput,
        form_id: form_id_input,
        type: dropdown_input("Type", ['csv', 'xml', 'json']),
        selection: dropdown_input("Selection", ['all', 'new']),
        include_attachments: input({
            label: "Include attachments",
            type: "boolean",
            required: false,
            comments: "Include attachments in the export",
            clean: (value) => value === true || value === "true"
        })
    },
    perform: async (context, {eFormConnection, form_id, type, selection, include_attachments}) => {
        const client = await eFormClient(eFormConnection);
        const response = await client.get(`/response_export/form/${form_id}/${type}`, {
            params: {selection},
        });

        if (include_attachments) {
            response.data = await Promise.all(response.data.map(async (responseItem: any) => {
                return await get_attachments_for_response(responseItem, client);
            }));

        }

        return {data: response.data};
    },
});

const list_new = action({
    display: {
        label: "List new responses",
        description: "Returns a list of unfetched responses from all forms.",
    },
    inputs: {
        eFormConnection: eFormConnectionInput,
        include_attachments: input({
            label: "Include attachments",
            type: "boolean",
            required: false,
            comments: "Include attachments in the export",
            clean: (value) => value === true || value === "true"
        })
    },
    perform: async (context, {eFormConnection, include_attachments}) => {
        const client = await eFormClient(eFormConnection);
        const response = await client.get('/response_export/list_new');
        if (include_attachments) {
            response.data = await Promise.all(response.data.map(async (responseItem: any) => {
                return await get_attachments_for_response(responseItem, client);
            }));
        }
        return {data: response.data};
    },
});

const list = action({
    display: {
        label: "List responses for a specific form",
        description: "Return a list of responses for a specific form.",
    },
    inputs: {
        eFormConnection: eFormConnectionInput,
        form_id: form_id_input,
        response_id: response_id_input,
        selection: dropdown_input("Selection", ['all', 'new']),
        include_attachments: input({
            label: "Include attachments",
            type: "boolean",
            required: false,
            comments: "Include attachments in the export",
            clean: (value) => value === true || value === "true"
        })
    },
    perform: async (context, {eFormConnection, form_id, response_id, selection, include_attachments}) => {
        const client = await eFormClient(eFormConnection);
        const response = await client.get('/response_export/list', {
            params: {form_id, response_id, selection},
        });
        if (include_attachments) {
            response.data = await Promise.all(response.data.map(async (responseItem: any) => {
                return await get_attachments_for_response(responseItem, client);
            }));
        }
        return {data: response.data};
    },
});

const get_response_attachment = action({
    display: {
        label: "Get a response attachment",
        description: "Returns an attachment file of any kind.",
    },
    inputs: {
        eFormConnection: eFormConnectionInput,
        response_id: response_id_input,
        index: input({
            label: "Index",
            type: "string",
            required: true,
        }),
    },
    perform: async (context, {eFormConnection, response_id, index}) => {
        const client = await eFormClient(eFormConnection);
        const response = await client.get(`/response_export/response/${response_id}/attachment/${index}`);
        return {data: response.data};
    },
});

const get_response = action({
    display: {
        label: "Receive a single response",
        description: "Returns a single response.",
    },
    inputs: {
        eFormConnection: eFormConnectionInput,
        response_id: response_id_input,
        type: dropdown_input("Type", ['csv', 'xml', 'json', 'pdf']),
        include_attachments: input({
            label: "Include attachments",
            type: "boolean",
            required: false,
            comments: "Include attachments in the export",
            clean: (value) => value === true || value === "true"
        })
    },
    perform: async (context, {eFormConnection, response_id, type, include_attachments}) => {
        const client = await eFormClient(eFormConnection);
        const response = await client.get(`/response_export/response/${response_id}/${type}`);
        if (include_attachments) {
            if (Array.isArray(response.data)) {
                response.data = response.data[0];
            }

            response.data = await get_attachments_for_response(response.data, client);

        }
        return {data: response.data};
    },
});

export default {
    response_export,
    list_new,
    list,
    get_response_attachment,
    get_response
};