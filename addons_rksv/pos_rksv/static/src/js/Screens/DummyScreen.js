odoo.define('pos_rksv.DummyScreen', function(require) {
    'use strict';

    const { useState, useExternalListener } = owl.hooks;
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class DummyScreen extends PosComponent {
        /**
         * @param {Object} props
         * @param {Object} props.product The product to weight.
         */
        constructor() {
            super(...arguments);
        }
        mounted() {
            this.confirm();
        }
        back() {
            this.props.resolve({ confirmed: true, payload: true });
            this.trigger('close-temp-screen');
            var props = {forceClose: true};
            this.showScreen("ReceiptScreen", props);
        }
        confirm() {
            this.props.resolve({
                confirmed: true,
                payload: true,
            });
            this.trigger('close-temp-screen');
            var props = {forceClose: true};
            this.showScreen("ReceiptScreen", props);
        }
    }
    DummyScreen.template = 'DummyScreen';

    Registries.Component.add(DummyScreen);

    return DummyScreen;
});
