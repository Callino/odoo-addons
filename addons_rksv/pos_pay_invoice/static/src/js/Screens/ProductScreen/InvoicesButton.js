odoo.define('pos_pay_invoice.InvoicesButton', function(require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const ProductScreen = require('point_of_sale.ProductScreen');
	const { useBus } = require("@web/core/utils/hooks");
	const Registries = require('point_of_sale.Registries');

	class InvoicesButton extends PosComponent {
		constructor() {
			super(...arguments);
			useBus(this.env.posbus, 'click', this.onClick);
		}
		async onClick() {
			var order = this.env.pos.get_order();
			if (!order) {
				return;
			}
			this.showTempScreen('InvoiceListScreen');
		}
	}
	InvoicesButton.template = 'MySearchInvoicesButton';

	ProductScreen.addControlButton({
		component: InvoicesButton,
		condition: function() {
			return this.env.pos.config.search_invoices;
		},
	});

	Registries.Component.add(InvoicesButton);

	return InvoicesButton;
});
