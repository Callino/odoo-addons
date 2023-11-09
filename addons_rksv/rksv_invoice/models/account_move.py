from odoo import api, fields, models


class AccountMove(models.Model):
    _inherit = 'account.move'

    def _get_rksv_payments(self):
        self.ensure_one()
        payments = []
        for entry in self._get_reconciled_invoices_partials():
            if entry and len(entry[0]) == 3:
                counterpart_line = entry[0][2]
                if counterpart_line.payment_id.receipt_id > 0:
                    payments.append(counterpart_line.payment_id)
        return payments
