exports.views = {
    tasks: {
        map: function (doc) {
            emit(doc.name, null);
        }
    }
};