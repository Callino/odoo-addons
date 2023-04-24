from odoo import api, fields, models


class IOTBox(models.Model):
    _inherit = 'iot.box'

    rksv_box = fields.Boolean('RKSV AT Enabled', default=False)

    def ensure_rksv_device(self):
        for record in self:
            if record.rksv_box and not any(device.type == 'fiscal_data_module' for device in record.device_ids):
                self.env['iot.device'].sudo().create({
                    'iot_id': record.id,
                    'name': "RKSV Dummy",
                    'identifier': 'rksv_dummy_%i' % record.id,
                    'type': 'fiscal_data_module',
                    'manufacturer': '',
                    'connection': 'network',
                })

    def create(self, vals_list):
        records = super(IOTBox, self).create(vals_list)
        records.ensure_rksv_device()
        return records

    def write(self, vals):
        res = super(IOTBox, self).write(vals)
        self.ensure_rksv_device()
        return res