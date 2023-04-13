# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.osv.expression import AND, OR
import logging

_logger = logging.getLogger(__name__)


class POSSession(models.Model):
    _name = 'pos.session'
    _inherit = 'pos.session'

    def _loader_params_iot_box(self):
        params = super(POSSession, self)._loader_params_iot_box()
        params['search_params']['fields'].extend(["rksv_box"])
        return params
