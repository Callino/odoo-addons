# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import UserError
from suds.client import Client

session_wsdl = 'https://finanzonline.bmf.gv.at/fonws/ws/sessionService.wsdl'


class Company(models.Model):
    _name = 'res.company'
    _inherit = 'res.company'

    rksv_at = fields.Boolean('RKSV AT', default=True)
    bmf_tid = fields.Char('BMF TID', size=32, copy=False)

    bmf_benid = fields.Char('BMF Benutzer ID', size=32, copy=False)
    bmf_pin = fields.Char('BMF PIN', size=32, copy=False)
    bmf_hersteller_atu = fields.Char('BMF RK Hersteller ATU', size=32, copy=False)

    bmf_tax_number = fields.Char('RKSV Tax Identifier', size=10)
    bmf_vat_number = fields.Char('RKSV VAT Identifier', readonly=True, related='vat')
    signature_provider_ids = fields.One2many('signature.provider', 'company_id', string="Signaturen")


    def get_session_client(self):
        session_client = Client(session_wsdl)
        session_client.set_options(timeout=20)
        return session_client

    def fon_check(self):
        self.ensure_one()
        try:
            sessionClient = self.get_session_client()
            session = sessionClient.service.login(self.bmf_tid, self.bmf_benid, self.bmf_pin, self.bmf_hersteller_atu)
        except:
            # Login Failed - we do not get a reason from BMF - so create a dummy BMFException here
            raise UserError("Login bei Finanzonline ist fehlgeschlagen: Kommunikationsfehler mit FON SOAP Service")
        if session.rc < 0:
            raise UserError("Login bei Finanzonline ist fehlgeschlagen: %s" % session.msg)
        raise UserError("Login bei Finanzonline efolgreich")