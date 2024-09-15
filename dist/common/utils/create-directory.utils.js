"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createSubdirectory", {
    enumerable: true,
    get: function() {
        return createSubdirectory;
    }
});
const _path = require("path");
const createSubdirectory = (date)=>{
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const subdirectory = (0, _path.join)(year.toString(), month);
    return subdirectory;
};

//# sourceMappingURL=create-directory.utils.js.map