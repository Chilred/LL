App.ModuleManager.extend("Modulname",
    {
        wrapperClass : "modulklasse",

        wrapperFunction : function(section){
            // check if there are modules of this module type in the current given section
            // stop this function if not
            var moduleObject = section.find("."+this.wrapperClass);
            if(moduleObject.length < 1) return;

            // generate a copy of this.wrapperClass because jQuery uses the this-context in its way so we cannot acces this.wrapperClass inside a jQuery each function
            var wrapperClassCopy = this.wrapperClass;

            var objectID;

            // prepare every module in the current article
            moduleObject.each(function(index){

            });
        }
    }
);