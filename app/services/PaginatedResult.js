
import CONSTANTS from '../config/constants';
export const PaginatedResult = function(pageNumber, pageSize) {

    this.pageNumber = parseInt(pageNumber) ? parseInt(pageNumber) : CONSTANTS.DEFAULT_PAGING.pageNumber;
    this.pageSize = parseInt(pageSize) ? parseInt(pageSize) : CONSTANTS.DEFAULT_PAGING.pageSize;
    this.items = null;
    this.nextPage = null;

    const haveNextPage = function (pageSize, items) {
        let check = false;
        if(items.length > pageSize) {
            check = true;
        }

        return check;
    }

    this.setItems = function(items) {
        this.items = items;
    }

    this.getResult = function () {

        const nextPageCheck = haveNextPage(this.pageSize, this.items);

        if(nextPageCheck) {
            this.items.splice(-1,1);
            this.nextPage = this.pageNumber + 1;
        }

        const result = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            nextPage:  this.nextPage,
            count:  this.items.length,
            items: this.items
        }

        return result;
    }


}