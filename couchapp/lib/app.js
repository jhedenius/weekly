exports.views = {
    tasknames: {
        map: function (doc) {
            emit(doc.name, null);
        }
    }
};

