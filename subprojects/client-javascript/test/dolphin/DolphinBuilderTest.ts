/// <reference path="../../testsuite/tsUnit.ts"/>
/// <reference path="../../js/dolphin/DolphinBuilder.ts"/>

module opendolphin {
    export class DolphinBuilderTest extends tsUnit.TestClass {

        default_values() {
            var builder = new DolphinBuilder();
            this.areIdentical(builder.url_, undefined, "ERROR: url_ must be 'undefined'");
            this.areIdentical(builder.reset_, false, "ERROR: reset_ must be 'false'");
            this.areIdentical(builder.slackMS_, 300, "ERROR: slackMS_ must be '300'");
            this.areIdentical(builder.errorHandler_, undefined, "ERROR: errorHandler_ must be 'undefined'");
            this.areIdentical(builder.supportCORS_, false, "ERROR: supportCORS_ must be 'false'");
        }

        url() {
            var url = 'http:8080//mydolphinapp';
            var builder = new DolphinBuilder().url(url);
            this.areIdentical(builder.url_, url, "ERROR: url_ must be '" + url + "'");
        }
        reset() {
            var reset = true;
            var builder = new DolphinBuilder().reset(reset);
            this.areIdentical(builder.reset_, reset, "ERROR: reset_ must be '" + reset + "'");
        }
        supportCORS() {
            var supportCORS = true;
            var builder = new DolphinBuilder().supportCORS(supportCORS);
            this.areIdentical(builder.supportCORS_, supportCORS, "ERROR: supportCORS_ must be '" + supportCORS + "'");
        }
        errorHandler() {
            var errorHandler = function(evt) { };
            var builder = new DolphinBuilder().errorHandler(errorHandler);
            this.areIdentical(builder.errorHandler_, errorHandler, "ERROR: errorHandler_ must be '" + errorHandler + "'");
        }

        built_clientDolphin() {
            var dolphin:ClientDolphin = new DolphinBuilder().build();
            this.areNotIdentical(dolphin.getClientConnector(), undefined, "ERROR: dolphin.clientConnector must be initialized");
            this.areNotIdentical(dolphin.getClientModelStore(), undefined, "ERROR: dolphin.clientModelStore must be initialized");
            // TODO: how to test if 'HttpTransmitter' or 'NoTransmitter' is created when 'ClientTransmitter.transmitter' is private ?
        }
    }

}