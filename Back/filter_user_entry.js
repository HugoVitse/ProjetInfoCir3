function filter_user_entry (entry){
    const regex = /['"`\\>#<]/g;

    return(regex.test(entry));
}

module.exports = filter_user_entry;