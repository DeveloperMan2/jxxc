/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('historyline.Application', {
    extend: 'Ext.app.Application',

    name: 'historyline',


    controllers: ["Global"],
    stores: [
        // TODO: add global / shared stores here
    ],
    requires: [
        'historyline.conf.SystemConfig'
    ],

    launch: function () {
        // TODO - Launch the application
        var load = Ext.get('loading');
        if (load) {
            load.remove();//清除启动mask
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
