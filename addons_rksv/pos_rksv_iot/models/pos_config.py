from odoo import api, fields, models


class POSConfig(models.Model):
    _inherit = 'pos.config'

    iface_rksv_proxy = fields.Many2one('iot.device', string="RKSV", domain="[('type', '=', 'fiscal_data_module'), '|', ('company_id', '=', False), ('company_id', '=', company_id)]")

    @api.depends('iface_printer_id', 'iface_display_id', 'iface_scanner_ids', 'iface_scale_id')
    def _compute_iot_device_ids(self):
        super(POSConfig, self)._compute_iot_device_ids()
        for config in self:
            if config.is_posbox:
                config.iot_device_ids += config.iface_rksv_proxy
