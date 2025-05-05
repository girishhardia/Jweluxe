const createResult = (err, data) => {
    const result = {};
    if (err) {
        result["status"] = "error";
        result["error"] = "error";
    } else {
        result["status"] = "success";
        result["data"] = data;
    }
    return result;
};
module.exports = { createResult };
