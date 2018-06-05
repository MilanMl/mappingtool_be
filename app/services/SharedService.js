import CONSTANTS from '../config/constants'
export const SharedService = (function () {

    return {

        getPaging: function (pageNumber, pageSize) {
            const pNumber = parseInt(pageNumber);
            const pSize = parseInt(pageSize);
            if(pNumber && pSize) {
                return {
                    pageNumber: pNumber,
                    pageSize: pSize
                }
            } else {
                return CONSTANTS.DEFAULT_PAGING;
            }
        }
    }

})();