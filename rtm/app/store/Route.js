/**
 * Created by LBM on 2017/11/19.
 */
Ext.define('jxxc.store.Route', {
    extend: 'Ext.data.Store',

    proxy: {
        type: 'ajax',
        url: 'resources/data/route.json',
        reader: {
            type: 'json'
        }
    },
    autoLoad: true
});