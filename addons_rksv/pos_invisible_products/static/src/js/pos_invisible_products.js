odoo.define('pos_invisible_products.db', function (require) {
    "use strict";

    var PosDB = require("point_of_sale.DB");
    var utils = require('web.utils');

    PosDB.include({
        invisible_filtered: function(products) {
            if (products instanceof Array) {
                var list = [];
                if (products) {
                    for (var i = 0, len = Math.min(products.length, this.limit); i < len; i++) {
                        const product = this.product_by_id[products[i].id];
                        if (!(product.active && product.available_in_pos && !product.pos_product_invisible)) continue;
                        list.push(product);
                    }
                }
                return list;
            } else {
                if (products === undefined || products['pos_product_invisible'] === true) {
                    return undefined;
                } else {
                    return products;
                }
            }
        },
        // Filter out products which should be invisible
        get_product_by_category: function(category_id) {
            var product_ids  = this.product_by_category_id[category_id];
            var list = [];
            if (product_ids) {
                for (var i = 0, len = Math.min(product_ids.length, this.limit); i < len; i++) {
                    const product = this.product_by_id[product_ids[i]];
                    if (!(product.active && product.available_in_pos && !product.pos_product_invisible)) continue;
                    list.push(product);
                }
            }
            return list;
         },
        search_product_in_category: function(category_id, query){
            // as soon as a super call is made in here it will lead to a endless loop crashing the pos and the browser with it
            // despite the results being in the exact same format and in some cases with the exact amount of products
            try {
                query = query.replace(/[\[\]\(\)\+\*\?\.\-\!\&\^\$\|\~\_\{\}\:\,\\\/]/g,'.');
                query = query.replace(/ /g,'.+');
                var re = RegExp("([0-9]+):.*?"+utils.unaccent(query),"gi");
            }catch(_e){
                return [];
            }
            var results = [];
            for(var i = 0; i < this.limit; i++){
                var r = re.exec(this.category_search_string[category_id]);
                if(r){
                    var id = Number(r[1]);
                    const product = this.get_product_by_id(id);
                    if (!(product.active && product.available_in_pos && !product.pos_product_invisible)) continue;
                    results.push(product);
                }else{
                    break;
                }
            }
            return results;
        },
        get_product_by_barcode: function(barcode){
            var products = this._super.apply(this, arguments);
            var products_filtered = this.invisible_filtered(products);
            return products_filtered
        }
    });

    return PosDB;
});