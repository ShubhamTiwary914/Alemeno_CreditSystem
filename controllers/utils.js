//*Holds all Utilitiues & Helper Functions to be used by the controllers



//*bool: Check if all parameters exists[for processing request' body]
function validateReqParams(reqBody, requiredParams){
    const sortReq = Object.keys(reqBody).slice().sort();
    const sortParams = requiredParams.slice().sort();

    return JSON.stringify(sortReq) === JSON.stringify(sortParams);
}

function keysRemover(oldObj, blackListKeys){
    let newObj = {...oldObj}
    blackListKeys.forEach(key => {
        delete newObj[key]
    });
    return newObj
}



module.exports = {
    validateReqParams,
    keysRemover
}


