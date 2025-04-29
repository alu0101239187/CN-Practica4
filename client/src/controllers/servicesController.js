import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchServices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/services`);
        const data = await response.data;
        return data;
    } catch (error) {
        throw new Error(`Error ${error.status}`);
    }
};

export const fetchServiceByName = async (name) => {
    try {
        const response = await axios.get(`${BASE_URL}/services/${name}`);
        const data = await response.data;
        return data;
    } catch (error) {
        throw new Error(`Error ${error.status}`);
    }
};

export const sendServiceData = async (name, formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/services/${name}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: 'arraybuffer',
        });
        const contentType = response.headers['content-type'];
        if (contentType.includes('application/json')) {
            const decoder = new TextDecoder('utf-8');
            const jsonText = decoder.decode(response.data);
            const jsonData = JSON.parse(jsonText);
            return jsonData;
        } else {
            const blob = new Blob([response.data], { type: contentType });
            return blob;
        }
    } catch (error) {
        throw new Error(`Error ${error.status}`);
    }
};
