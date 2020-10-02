import moment from 'moment';

class Order {
    constructor(id, ownerId, items, totalAmount, date) {
        this.id = id;
        this.ownerId = ownerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.date = moment(date).format('MMMM Do YYYY, hh:mm');
    }

    get  readableDate() {
        // return this.date.toLocaleDateString('en-EN', {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric',
        //     hour: '2-digit',
        //     minute: '2-digit'
        // })
        return moment(this.date).format('MMMM Do YYYY, hh:mm');
    }
}

export default Order;