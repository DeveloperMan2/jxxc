/**
 * Created by LBM on 2017/11/19.
 */
Ext.define('jxxc.store.RealTime', {
    extend: 'Ext.data.Store',

    alias: 'store.realtime',

    proxy: {
        type: 'ajax',
        url: 'resources/data/realtime.json',
        reader: {
            type: 'json',
            rootProperty: 'rtData'
        }
    },
    autoLoad: true
});