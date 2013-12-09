import tsUnit = require("../../testsuite/tsUnit")
import ca     = require("../../js/dolphin/ClientAttribute")
import pm     = require("../../js/dolphin/ClientPresentationModel")


export module dolphin {
    export class ClientAttributeTests extends tsUnit.tsUnit.TestClass {

        attributesShouldGetUniqueIds() {
            var ca1 = new ca.dolphin.ClientAttribute("prop","qual","tag");
            var ca2 = new ca.dolphin.ClientAttribute("prop","qual","tag");
            this.areNotIdentical(ca1.id, ca2.id);
        }

        valueListenersAreCalled() {
            var attr = new ca.dolphin.ClientAttribute("prop", "qual");

            attr.setValue(0);

            var spoofedOld = -1;
            var spoofedNew = -1;
            attr.onValueChange( (evt: ca.dolphin.ValueChangedEvent) => {
                spoofedOld = evt.oldValue;
                spoofedNew = evt.newValue;
            } )

            attr.setValue(1);

            this.areIdentical(spoofedOld, 0)
            this.areIdentical(spoofedNew, 1)

        }

        attributeListenersAreCalled() {
            var attr = new ca.dolphin.ClientAttribute("prop", "qual");

            var spoofedOldQfr;
            var spoofedNewQfr;
            attr.onQualifierChange((evt:ca.dolphin.ValueChangedEvent) => {
                spoofedOldQfr = evt.oldValue;
                spoofedNewQfr = evt.newValue;
            })
            attr.setQualifier("qual_change");

            this.areIdentical(spoofedOldQfr, "qual")
            this.areIdentical(spoofedNewQfr, "qual_change")
        }

        valueListenersDoNotInterfere() {
            var attr1 = new ca.dolphin.ClientAttribute("prop", "qual1");
            var attr2 = new ca.dolphin.ClientAttribute("prop", "qual2");

            var spoofedNew1 = -1;
            attr1.onValueChange( (evt: ca.dolphin.ValueChangedEvent) => {
                spoofedNew1 = evt.newValue;
            } )
            attr1.setValue(1);

            var spoofedNew2 = -1;
            attr2.onValueChange( (evt: ca.dolphin.ValueChangedEvent) => {
                spoofedNew2 = evt.newValue;
            } )
            attr2.setValue(2);

            this.areIdentical(spoofedNew1, 1)
            this.areIdentical(spoofedNew2, 2)

        }

        checkDirtyWhenValueAndBaseValueAreUndefinedOrNull() {
            var attr = new ca.dolphin.ClientAttribute("prop", "qual1");

            var dirtyValue = false;
            attr.onDirty((evt:ca.dolphin.ValueChangedEvent) => {
                dirtyValue = evt.newValue;
            });
            // value and baseValue are undefined
            this.isFalse(attr.isDirty());

            // value and baseValue are null
            attr.setValue(null);
            this.isFalse(attr.isDirty());
            this.areIdentical(false, dirtyValue);
        }

        checkDirtyWhenValueAndBaseValueAreDifferent() {
            var attr = new ca.dolphin.ClientAttribute("prop", "qual1");

            var dirtyValue = false;
            attr.onDirty((evt:ca.dolphin.ValueChangedEvent) => {
                dirtyValue = evt.newValue;
            });
            // value and baseValue are different
            attr.setValue(5);
            this.isTrue(attr.isDirty());
            this.areIdentical(true, dirtyValue);

        }

        checkDirtyAfterRebase() {
            var attr = new ca.dolphin.ClientAttribute("prop", "qual1");
            attr.setValue(5);
            attr.rebase();// Make base value 5
            this.isFalse(attr.isDirty());
        }

        checkValue() {
            //valid values
            this.areIdentical(5, ca.dolphin.ClientAttribute.checkValue(5));
            this.areIdentical(0, ca.dolphin.ClientAttribute.checkValue(0));
            this.areIdentical("test", ca.dolphin.ClientAttribute.checkValue("test"));

            var date = new Date();
            this.areIdentical(date,ca.dolphin.ClientAttribute.checkValue(date));

            var attr = new ca.dolphin.ClientAttribute("prop", "qual1");
            attr.setValue(15);
            this.areIdentical(15, ca.dolphin.ClientAttribute.checkValue(attr));

            //Wrapper classes
            this.areIdentical("test", ca.dolphin.ClientAttribute.checkValue(new String("test")));
            this.areIdentical(false, ca.dolphin.ClientAttribute.checkValue(new Boolean(false)));
            this.areIdentical(15, ca.dolphin.ClientAttribute.checkValue(new Number(15)));

            //invalid values
            this.areIdentical(null, ca.dolphin.ClientAttribute.checkValue(null));
            this.areIdentical(null, ca.dolphin.ClientAttribute.checkValue(undefined)); // null is treated as undefined
            try {
                ca.dolphin.ClientAttribute.checkValue(new pm.dolphin.ClientPresentationModel(undefined, "type"))
                this.fail()
            } catch (error) {
                this.isTrue(error instanceof Error);
            }
        }


    }
}