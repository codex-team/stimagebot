const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const qs = require('qs');

const apiRequest = async (methodName, options = {}) => {
    return (await axios({
        method: 'post',
        url: `https://api.telegra.ph/${methodName}`,
        data: qs.stringify(options)
    })).data;
};

module.exports = async (filepath, type = 'photo') => {
    const form = new FormData();

    form.append('file', fs.createReadStream(filepath));

    const uploadedFile = (await axios({
        method: 'post',
        url: `https://telegra.ph/upload`,
        data: form,
        headers: {
            ...form.getHeaders()
        }
    })).data[0].src;

    const access_token = (await apiRequest('createAccount', {
        short_name: 'stimagebot'
    })).result.access_token;

    let content;

    if (type === 'photo') {
        content = `[{"tag":"figure","children":[{"tag":"div","attrs":{"class":"figure_wrapper"},"children":[{"tag":"img","attrs":{"src":"${uploadedFile}"}}]},{"tag":"figcaption","children":[""]}]}]`;
    } else {
        content = `[{"tag":"figure","children":[{"tag":"div","attrs":{"class":"figure_wrapper"},"children":[{"tag":"video","attrs":{"src":"${uploadedFile}","preload":"auto","autoplay":"autoplay","loop":"loop","muted":"muted"}}]},{"tag":"figcaption","children":[""]}]}]`;
    }

    const page = (await apiRequest('createPage', {
        access_token,
        title: 'Save image',
        content
    })).result;

    return `https://telegra.ph${uploadedFile}`;
};
