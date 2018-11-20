import axios from 'axios';

const backendInstance = axios.create({
    baseURL: 'http://localhost:9002/index.php/api/'
});

export default backendInstance;