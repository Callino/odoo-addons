odoo.define('pos_rksv_iot.devices', function (require) {
    "use strict";

    var RKSV = require('pos_rksv.rksv');
    var ProxyDevice = require('point_of_sale.devices').ProxyDevice;
    var rpc = require('web.rpc');
    var core = require('web.core');

    //var QWeb = core.qweb;
    var _t = core._t;

    ProxyDevice.include({
        status_loop: function () {
            var self = this;
            self._super();
            rpc.query({
                model: 'iot.device',
                method: 'search_read',
                fields: ['iot_id'],
                domain: [['id', 'in', this.pos.config.iot_device_ids], ['type', '=', 'fiscal_data_module']],
            }).then(function (box_ids) {
                var drivers_status = {};
                _.each(box_ids, function(box_id) {
                    _.each(self.iot_boxes, function (iot_box) {
                        if ((iot_box.rksv_box) && (iot_box.id == box_id.iot_id[0])) {
                            self.connect(iot_box.ip_url);
                            self.keepalive();
                        }
                    });
                });
            });
        },
    });
});