odoo.define('pos_rksv.RKSVStatusWidget', function(require) {
    'use strict';

    const { onMounted, onWillUnmount, useState } = owl;
    const { useBus } = require("@web/core/utils/hooks");
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    // Previously ProxyStatusWidget
    class RKSVStatusWidget extends PosComponent {
        constructor() {
            super(...arguments);
            var self = this;
            // Possible status values
            this.status = ['connected','connecting','disconnected','warning','failure','setup','inactive'];
            this.state = useState({
                status: 'setup',
                msg: '',
            });
            this.env.proxy.on('change:status', this, this._onChangeStatus);
            this.scheduled_update = false;
            setInterval(() => {
                self.scheduled_update = true;
            }, 5000);
        }
        async onClick() {
            this.showScreen('RKSVStatusScreen', {
                    stay_open: true
            });
        }
        _onChangeStatus(posProxy, statusChange) {
            var self = this;
            if ((statusChange.oldValue.status != statusChange.newValue.status) || self.scheduled_update) {
                self.scheduled_update = false;
                this._set_smart_status(statusChange.newValue);
                // We do forward the posProxy status change here to the RKSV handler with a reference to this
                // So the RKSV Handler is able to open screens
                this.env.pos.rksv.proxy_status_change(posProxy, statusChange, this);
            }
        }
        set_status(status, message) {
            this.state.status = status;
            this.state.msg = message;
        }
        _set_smart_status(status) {
            var self = this;
            var mode = self.env.proxy.get('cashbox_mode');
            if (status.status === 'connected' && (!(self.env.pos.config.state === "setup" || self.env.pos.config.state === "failure" || self.env.pos.config.state === "inactive")) && status.drivers.rksv) {
                var rksvstatus = status.drivers.rksv ? status.drivers.rksv.status : false;
                var cashbox_mode = status.drivers.rksv.cashbox_mode;
                if (cashbox_mode !== 'active') {
                    if (cashbox_mode === 'signature_failed') {
                        this.set_status('failure', 'Ausfall SE');
                    } else if (mode === 'posbox_failed') {
                        this.set_status('failure', 'Ausfall PosBox');
                    }
                } else if (!rksvstatus) {
                    this.set_status('disconnected', '');
                } else if (rksvstatus === 'connected') {
                    this.set_status('connected', '');
                } else {
                    this.set_status(rksvstatus, '');
                }
            } else if (status.status === 'connected' && (self.env.pos.config.state === "setup")) {
                this.set_status('setup', 'Setup');
            } else if (status.status === 'connected' && (self.env.pos.config.state === "failure")) {
                this.set_status('failure', 'Ausfall');
            } else if (status.status === 'connected' && (self.env.pos.config.state === "inactive")) {
                this.set_status('inactive', 'Deaktiviert');
            } else {
                this.set_status(status.status, '');
            }
        }
    }
    RKSVStatusWidget.template = 'RKSVStatusWidget';

    Registries.Component.add(RKSVStatusWidget);

    return RKSVStatusWidget;
});
