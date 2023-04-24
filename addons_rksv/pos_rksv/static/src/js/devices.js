odoo.define('pos_rksv.devices', function (require) {
    "use strict";

    var ProxyDevice = require('point_of_sale.devices').ProxyDevice;
    const Registries = require('point_of_sale.Registries');
    var core = require('web.core');

    //var QWeb = core.qweb;
    var _t = core._t;

    ProxyDevice.include({
        // sorry - we have to complete overwrite this function
        keepalive() {
            var self = this;
            if (!self.pos.config.iface_rksv) {
                return self._super();
            }

            function status(){
                var always = function () {
                    setTimeout(status, 3000);
                };
                self.connection.rpc('/hw_proxy/status_json_rksv', {
                    'rksv': {
                        'kassenidentifikationsnummer': self.pos.config.cashregisterid
                    }
                }, {shadow: true, timeout: 5000})
                    .then(function (driver_status) {
                        self.set_connection_status('connected',driver_status);
                    }, function () {
                        if(self.get('status').status !== 'connecting'){
                            self.set_connection_status('disconnected');
                        }
                    }).then(always, always);
            }
            if (!this.keptalive) {
                this.keptalive = true;
                status();
            }
        }
    });

    // Registries.Model.extend(ProxyDevice, RKSVProxyDevice);
});