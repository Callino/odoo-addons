odoo.define('pos_rksv.RKSVReceiptPopup', function (require) {
    "use strict";

    const { onMounted, useState, useRef } = owl;
    const Registries = require('point_of_sale.Registries');
    const AbstractReceiptScreen = require('point_of_sale.AbstractReceiptScreen');

    /*
    RKSV Receipt Popup Widget
    - does print given special receipt
     */
    class RKSVReceiptPopup extends AbstractReceiptScreen {
        constructor() {
            super(...arguments);
            this.state = useState({
                'title': arguments[0].title,
            });
            this.currentReceipt = arguments[0].receipt;
        }
        setup() {
            super.setup();
            this.orderReceipt = useRef('order-receipt');
            setTimeout(async () => await this.handleAutoPrint(), 0);
        }
        cancel() {
            this.env.posbus.trigger('close-popup', {
                popupId: this.props.id,
                response: { confirmed: false, payload: null },
            });
        }
        async handleAutoPrint() {
            this._printReceipt();
        }

    }

    RKSVReceiptPopup.template = 'RKSVReceiptPopup';
    RKSVReceiptPopup.defaultProps = {
        'title': 'Spezial Beleg',
    };

    Registries.Component.add(RKSVReceiptPopup);

    return RKSVReceiptPopup;
});