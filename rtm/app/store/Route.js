/**
 * Created by LBM on 2017/11/19.
 */
Ext.define('rtm.store.Route', {
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