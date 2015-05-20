var App = App || {
    init: function(){
        var start = (new Date()).getTime();
        this.Error.registerErrorEventHandler();
        this.StorageManager.init();

        this.SectionManager.init();
        this.NavigationManager.init();
        App.Event.trigger("onSectionLoadComplete");
        App.SectionManager.loadArticleByIndex(0);
        var end = (new Date()).getTime();

        App.Log.log("Application build in "+ (end - start)+" millis");
    }
};

/**
 * Stores some informations about the users browser
 * @type {Object}
 */
App.BrowserManager = {

    isOnline : navigator.onLine,
    browserVersion : navigator.appVersion,
    browserName : navigator.appName,
    browserCodeName : navigator.appCodeName

};

/**
 * Event manager to manage and fire custom events
 * @type {Object}
 */
App.Event = {

    /**
     * stores all events
     * @type {Object}
     */
    events : {},

    /**
     * registers an event with its name and an anonym function that gets executed after the event is fired
     * @param  {String}   event the event name. This name is used to fire the event
     * @param  {Function} fn    The functions that gets executed when an event is fired
     */
    register : function(event, fn){
        // check if the event is already registered
        if(this.events.hasOwnProperty(event)){
            throw new Error("The event \""+event+"\" is already registered!");
        }

        this.events[event] = {
            eventName : event,
            fn : fn
        };
    },

    /**
     * Fires an event and executes the event function
     * @param  {String} eventName The name of the event that should be fired
     */
    trigger : function(eventName){
        // check if the event is registered
        if(!this.eventExists(eventName)){
            throw new Error("The event \""+eventName+"\" does not exist!");
        }
        // execute the function
        this.events[eventName].fn();
    },

    triggerArg : function(eventName, args){
        // check if the event is registered
        if(!this.eventExists(eventName)){
            throw new Error("The event \""+eventName+"\" does not exist!");
        }
        // execute the function
        this.events[eventName].fn(args);
    },

    eventExists : function(eventName){
        return this.events.hasOwnProperty(eventName);
    },

    remove : function(eventName){
        if(!this.eventExists(eventName)){
            throw new Error("The event \""+eventName+"\" does not exist!");
        }
        delete this.events[eventName];
    }
}

App.ModuleManager = {

    /**
     * contains every module wrapper objects
     * @type {Object}
     */
    modules : {},

    /**
     * every module which has been transformed by a module wrapper is saved here for later using purposes.
     * @type {Object}
     */
    registeredModules : {},

    /**
     * an array which contains the needed properties.
     * A module which gets extended must contain these properties.
     *
     * It's like an module interface.
     * 
     * @type {Array}
     */
    requiredModuleProperties : ["wrapperFunction","wrapperClass"],

    /**
     * this contains optional properties a module could have
     * @type {Array}
     */
    optionalModuleProperties : ["validatingFunction"],

    /**
     * Adds a single module to the runtime environment to be used as a wrapper.
     *
     * Checks if the given module implements the requiredModuleProperties and adds it to the modules object.
     * 
     * @param  {String} name   The modules name. It's used to identify the modul in the runtime environment.
     * @param  {Object} module This is the module objects that contains the properties given in requiredModulePrperties
     * @return {null}
     */
    extend : function(name,module){

        // check if module contains the requiredModuleProperties.
        // if not, throw an exception.
        for(var i = 0; i < this.requiredModuleProperties.length; i++){
            if(!module.hasOwnProperty(this.requiredModuleProperties[i])){
                throw new Error("Missing property \""+this.requiredModuleProperties[i]+"\" in module \""+name+"\"!");
            }
        }

        // the wrapperFunction property must be a function
        if(typeof module.wrapperFunction !== "function"){
            throw new Error("The property \"wrapperFunction\" is not a function!");
        }

        // check if the module is already registered
        if(this.modules.hasOwnProperty(name)){
            throw new Error("The module \""+name+"\" is already registered!");
        }

        // add it to modules list
        this.modules[name] = module;

    },

    /**
     * testing function to build a module
     * @param  {String} name the modules name
     * @return {null}
     * @deprecated Just for test cases
     */
    buildModule : function(name){
        // check if the given modul exists
        if(!this.modules.hasOwnProperty(name)){
            throw new Error("The module \""+name+"\" does not exist!");
        }
        // call it's wrapper function
        //App.Log.log(App.SectionManager.currentSection.selector);
        this.modules[name].wrapperFunction(App.SectionManager.currentSection.selector);
    },

    /**
     * registers a module that has been transformed by the modules wrapper function
     * @param  {String} id           the unique id that represents this module in the system
     * @param  {jQuery} jQueryObject the jquery object that contains the module
     * @return {null}
     */
    registerPreparedModule : function(key,moduleObject){
        // check if the module is already registered
        if(this.registeredModules.hasOwnProperty(key)){
            throw new Error("Runtime Exception!\nA module with the unique ID \""+id+"\" does already exist!");
        }
        // add it to the register
        this.registeredModules[key] = moduleObject;

        App.SectionManager.registerModuleForArticle(key, this.registeredModules[key].parentArticle);
    },

    /**
     * returns a module that has been aded to the module register
     * @param  {String} id the modules id
     * @return {jQuery}    [description]
     */
    getRegisteredModuleByID : function(id){
        // check ith the module exists
        if(!this.registeredModules.hasOwnProperty(id)){
            throw new Error("The module with the unique ID \""+id+"\" does not exist!");
        }
        // return the module
        return this.registeredModules[id];
    },


    /**
     * Iterates through all articles and calls the building functions of each module
     * @return {[type]} [description]
     */
    buildAllModules : function(){
        for(section in App.SectionManager.sections){
            for(module in this.modules){
                this.modules[module].wrapperFunction(App.SectionManager.sections[section].selector);
            }
        }
    }

};


App.SectionManager = {

    /**
     * stores the current active section
     * @type {jQuery}
     */
    currentSection : null,

    /**
     * stores the current active article
     * @type {jQuery}
     */
    currentArticle : null,

    /**
     * stores the index of the current opened article
     * @type {Number}
     */
    currentArticleIndex : 0,

    /**
     * stores all sections in the wbt
     * @type {Object}
     */
    sections : {},

    /**
     * stores all articles in the wbt
     * @type {Object}
     */
    articles : {},

    firstRun : true,

   
    /**
     * initializes the Section manager and sets up the main article
     */
    init : function(){
        // import all sections and their articles
        // generate a unique id for every section and article
        var sections = $("section");

        if(sections.length < 1){
            throw new Error("The WBT must contain at least one section!");
        }

        // this pointer copy
        var thisHelper = this;

        // walk through every section in the document
        sections.each(function(index){

            // short connection variable to acces the current section
            var t = $(this);

            // verfify whether the section is linear or not
            var isLinear = (parseInt(t.attr("data-linear"),10) || 0) == 1;

            // check if the section contains a h1 headline
            var headline = t.find("h1:first-child");

            // if not, throw an structural error
            if(headline.length == 0){
                throw new Error("The section at index "+index+" does not have a h1 headline!");
            }

            // generate a unique id for every section and set it
            var sectionID = App.Helper.generateUniqueID();
            t.attr("id",sectionID);

            // find every article in the section
            var articles = t.find("article");

            // cehck if the section contains at least one article, if not, throw an structural error
            if(articles.length == 0){
                throw new Error("The section at index "+index+" (headline: \""+headline.text()+"\") must contain at least one article!");
            }

            // variable to save every article id in a section
            var articleList = [];

            // walk through every article in the current section
            articles.each(function(index){

                // short connection variable to access the current article
                var _t = $(this);

                // find the articles headline
                var articleHeadline = _t.find("h2:first-child");

                // throw a structural error if the is no h2 headline
                if(articleHeadline.length == 0){
                    throw new Error("The article at index "+index+" in section \""+headline.text()+"\" does not have a h2 headline!")
                }

                // generate a unique id for this article
                var articleID = App.Helper.generateUniqueID();
                _t.attr("id",articleID);

                // push it into the sections article array
                articleList.push(articleID);

                // generate a new object with article relating properties
                thisHelper.articles[articleID] = {
                    id : articleID,
                    selector : $("#"+articleID),
                    parentSection : sectionID,
                    visited : false,
                    modules: []
                };

                // if this is the first article in the whole document, this is the main article that is displayed
                if(index === 0){
                    thisHelper.currentArticle = thisHelper.articles[articleID].id;
                }

            });

            // generate a new object with section relating properties
            thisHelper.sections[sectionID] = {
                id : sectionID,
                selector : $("#"+sectionID),
                isLinear : isLinear,
                articleList : articleList,
                finished : false
            };
            // if this is the first section in the whole document, this is the main section that is displayed
            if(index === 0){
                thisHelper.currentSection = thisHelper.sections[sectionID].id;
            }

        });

        // making all sections invisible
        for(section in this.sections){
            this.sections[section].selector.hide();
        }

        // making all articles invisible
        for(article in this.articles){
            this.articles[article].selector.hide();
        }

        // prev and next buttons to every article
        for(section in this.sections){
            var articleArray = this.sections[section].articleList;

            for(var i = 0, len = articleArray.length; i < len; i++){
                var row = $("<div class=\"container-fluid footer\"></div>");
                var id;
                if(i > 0){
                    id = articleArray[i-1];
                    row.append("<a href=\"#walk\" data-id=\""+id+"\" class=\"btn btn-default pull-left walkingButton\" role=\"button\">Zurück</a>");
                }

                if(i < len){
                    id = (i < len - 1) ? articleArray[i + 1] : this.sections[section].id;
                    row.append("<a href=\"#"+(i == len - 1 ? "finish" : "walk")+"\" data-id=\""+id+"\" class=\"btn btn-primary pull-right walkingButton\" role=\"button\">"+(i == len - 1 ? "Abschließen" : "Weiter")+"</a>");
                }

                this.articles[articleArray[i]].selector.append(row);
            }
        }

        // bind walking events on every walking button
        this.walkingController();

        // register event that's triggered after all sections have been build
        App.Event.register("onSectionLoadComplete", function(){ App.ModuleManager.buildAllModules(); });
    },

    /**
     * displays an article in the document --> make it visible
     * @param  {String} articleName This is the ID of every article. The ID is given by the navigation link manager
     */
    showArticle : function(articleName){
        // check if the article id exists        
        if(!this.articles.hasOwnProperty(articleName)){
            throw new Error("The article \""+articleName+"\" does not exist!");
        }

        // pointer to the upcoming article
        var thisArticle = this.articles[articleName];

        // pointer to the new articles parent section
        var parentSection = this.sections[thisArticle.parentSection];

        var arg, canProceed = true;

        if(!this.firstRun){
            
            if(this.currentSection === parentSection.id){
                // validate if we have any validator modules in this article
                for(var i = 0, modules = this.articles[this.currentArticle].modules, validatorResult = false; i < modules.length; i++){
                    var currentModule = App.ModuleManager.registeredModules[modules[i]];
                    if(currentModule.isValidator && !currentModule.finished){
                        validatorResult = currentModule.validate(currentModule)
                        canProceed = canProceed && validatorResult;

                        currentModule.finished = validatorResult;
                    } else {
                        canProceed = canProceed && true;
                    }
                }
            }

            if(!canProceed && this.currentSection === parentSection.id){
                alert("bitte alle sachen richtig machen!");
                return;
            }
        }

        this.firstRun = false;

        // check if we can go to this article
        if(parentSection.isLinear){
            // the next article we want to visit is located in a linear section
            // test if the user has already visited the previous section
            var allArticles = parentSection.articleList;

            // get the index of the next article
            var nextIndex = allArticles.indexOf(articleName);
            //alert(nextIndex-1);

            // do we have a previous page?
            if(nextIndex > 0){
                // did we visit the previous article?
                if(!this.articles[allArticles[nextIndex-1]].visited){
                    // NO!!
                    return;
                }

                // did we finished all validator modules on this page?
                for(var i = 0, modules = this.articles[allArticles[nextIndex-1]].modules; i < modules.length; i++){
                    var currentModule = App.ModuleManager.registeredModules[modules[i]];
                    if(currentModule.isValidator && !currentModule.finished){
                        alert("erst sachen davor machen!");
                        return;
                    }
                }
            }

            // activate the next item
            if(nextIndex + 1 < allArticles.length){
                App.NavigationManager.enableLink(allArticles[nextIndex+1]);
                if(App.NavigationManager.hasSubNavigation){
                    arg = allArticles[nextIndex+1];
                    App.Event.register("onSubNavigationBuild", function(arg){App.NavigationManager.enableSubLink(arg);})
                }
            }
            
        }

        // if the next section is not the current section:
        // hide the current section
        if(this.currentSection !== parentSection.id){
            this.sections[this.currentSection].selector.hide();
            this.currentSection = parentSection.id;
            App.NavigationManager.buildSubNavigation();
        }

        if(App.Event.eventExists("onSubNavigationBuild")){
            App.Event.triggerArg("onSubNavigationBuild",arg);
        }
        App.NavigationManager.inactiveLink(this.articles[this.currentArticle].id);

        if(App.NavigationManager.hasSubNavigation){
            //alert(this.articles[this.currentArticle].id);
            App.NavigationManager.inactiveSubLink(this.articles[this.currentArticle].id);
        }


        // if the current article is not the next article
        if(this.currentArticle !== thisArticle.id){
            this.articles[this.currentArticle].selector.hide();
            this.currentArticle = thisArticle.id;
        }
        // make the new section and article visible
        parentSection.selector.show();
        thisArticle.selector.show();

        // "visit" the article in our structure
        this.articles[this.currentArticle].visited = true;

        // activate menu item

        // mark the link in the navigation as active
        App.NavigationManager.activeLink(articleName);

        if(App.NavigationManager.hasSubNavigation){
            App.NavigationManager.activeSubLink(articleName);
        }

        if(App.Event.eventExists("onSubNavigationBuild")){
            App.Event.remove("onSubNavigationBuild");
        }
    },

    registerModuleForArticle : function(key, article){
        this.articles[article].modules.push(key);
    },

    /**
     * Loads an article by the Index.
     * The index respresents the article in the "articles" object.
     *
     * If the article at the index exists, get its ID  and call showArticle().
     * @param  {Number} index the index
     */
    loadArticleByIndex : function(index){
        
        // temporary counter to compare the indexes
        var indexCounter = 0;

        // walk through every article as long as the indexCounter < index
        for(article in this.articles){
            if(index == indexCounter){
                this.showArticle(this.articles[article].id);
                return;
            }
            indexCounter++;
        }

        // if the functions goes to this part, the index does not exist...
        throw new Error("The article index "+index+" does not exist!");
    },


    walkingController : function(){
        var thisHelper = this;
        $(".walkingButton").click(function(e){
            e.preventDefault();

            var t = $(this);

            if(t.attr("href") === "#walk"){
                thisHelper.showArticle(t.attr("data-id"));
            } else {
                thisHelper.finishSection(t.attr("data-id"));
            }
        });
    },

    finishSection : function(sectionID){
        App.SectionManager.sections[sectionID].finished = true;
    }

};


App.StorageManager = {

    storageEnabled : typeof Storage  !== "undefined",

    storage : null,

    currentSession : null,

    init : function(){
        if(!this.storageEnabled){
            throw new Error("Your browser "+App.BrowserManager.browserName+"\" v."+App.BrowserManager.browserVersion+" does not support LocalStorage! Please update to a new browser!");
        }

    }


};

App.Helper = {
    /**
     * returns wether a given jQuery object has a given attribute or not
     * @param  {jQuery}  object        The jQuery object which that should be checked
     * @param  {String}  attributeName The attribute name
     * @return {Boolean}               true if the attribute exists, false if not
     */
    hasAttribute : function(object,attributeName){
        return !!object.attr(attributeName);
    },

    /**
     * returns the file type of a given file / path
     * @param  {String} path Filename or Path
     * @return {String}      the extension without the dot
     */
    getFileType : function(path){
        return path.substring(path.lastIndexOf(".")+1, path.length);
    },

    /**
     * checks if a given extension
     * @param  {String}  extension         The extension which should be checked
     * @param  {Array}   allowedExtensions All allowed extensions
     * @return {Boolean}                   true if the extension array contains the given extension
     */
    isValidExtension : function(extension, allowedExtensions){
        return allowedExtensions.indexOf(extension) > -1;
    },

    /**
     * generates an unique id for the id system.
     * the user does not need to create own ids.
     * @return {String} a unique id with a given length
     */
    generateUniqueID : function(){
        var s = "ABCDEFGHIJKLMNOPQRSTEUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        var idLength = 15;
        var newID = "";
        // create idLength random chars
        for(var i = 0, len = s.length; i < idLength; i++){
            newID += s.charAt(Math.round(Math.random()*len));
        }
        // return it
        return newID;
    },

    /**
     * shuffles the array in the argument
     * @param  {Array} objects the array to shuffle
     * @return {Array}         The array values in a new order
     */
    shuffleElements : function(objects){
        return objects.sort(
            function(a,b){
                // returns 1 or 0
                return Math.round(Math.random());
            }
        );
    }

};


App.NavigationManager = {

    /**
     * do we have a main navigation or not?
     * @type {Boolean}
     */
    hasNavigation : null,

    /**
     * do we have a sub navigation?
     * @type {Boolean}
     */
    hasSubNavigation : null,

    /**
     * Stores the navigations jQuery object
     * @type {jQuery}
     */
    mainNavigation : null,

    /**
     * Stores the subnavigation jQuery object
     * @type {jQuery}
     */
    subNavigation  : null,

    /**
     * searches for a navigation bars in the document and calls the building functions
     */
    init : function(){
        // check if main and sub navigation exist
        this.hasNavigation = $("nav.mainNavigation").length > 0;
        this.hasSubNavigation = $("nav.subNavigation").length > 0;

        // call the buildMainNavigation method
        if(this.hasNavigation){
            this.buildMainNavigation();
        }

        if(this.hasSubNavigation){
            this.buildSubNavigation();
        }

    },

    /**
     * constructs the main navigation in bootstrap style
     * @return {[type]} [description]
     */
    buildMainNavigation : function(){

        // select the navigation element
        var navigation = $("nav.mainNavigation");
        this.mainNavigation = navigation;

        // add some important attributes
        navigation.addClass("navbar navbar-default");
        navigation.attr("role","navigation");

        // generate an ID for this navbar
        var navBarID = App.Helper.generateUniqueID();

        // start with the html content
        var HTMLcontent = "<div class=\"container-fluid\">";

        // add the navbar header
        HTMLcontent += '<div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#'+navBarID+'"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button></div>'

        // first part of the collapsable navbar
        HTMLcontent += '<div class="collapse navbar-collapse" id="'+navBarID+'"><ul class="nav navbar-nav">';

        // walk through every registered section in the section manager, get its articles and adds the dropdown code for every article
        for(section in App.SectionManager.sections){
            var workingSection = App.SectionManager.sections[section];

            HTMLcontent += "<li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">"+workingSection.selector.find("h1:first-child").text()+" <span class=\"caret\"></span></a>";

            HTMLcontent += "<ul class=\"dropdown-menu\" role=\"menu\">";

            // walk throgh every article in the article list array
            for(var i = 0, article, len = workingSection.articleList.length; i < len; i++){

                article = workingSection.articleList[i];

                //App.Log.log(App.SectionManager.articles[article].selector.find("h2:first-child").text());

                HTMLcontent += "<li class=\""+((i > 0 && workingSection.isLinear) ? "disabled" : "")+"\" data-target=\""+App.SectionManager.articles[article].id+"\">"+
                "<a class=\"\" data-target=\""+App.SectionManager.articles[article].id+"\" href=\"#"+App.SectionManager.articles[article].id+"\">"+App.SectionManager.articles[article].selector.find("h2:first-child").text()+"</a></li>";
            }

            HTMLcontent += "</ul>";
            HTMLcontent += "</li>";
        }

        // hmlt end snippets for navigation code
        HTMLcontent += "</ul></div></div>";

        // insert the navigation code into the navigation container
        navigation.append(HTMLcontent);
        // call the link listener
        this.linkController();

    },

    buildSubNavigation : function(){
        // select the navigation element
        var navigation = $("nav.subNavigation");
        navigation.empty();
        this.subNavigation = navigation;

        // add some important attributes
        navigation.addClass("list-group");
        navigation.addClass("hidden-xs");

        // get the current section
        var section = App.SectionManager.currentSection;
        var articles = App.SectionManager.sections[section].articleList;

        navigation.append("<h3 class=\"list-group-item list-group-item-"+(App.SectionManager.sections[section].finished ? "success" : "info")+"\">"+App.SectionManager.sections[section].selector.find("h1:first-child").text()+""+(App.SectionManager.sections[section].finished ? "<span class=\"glyphicon glyphicon-ok pull-right\" title=\"Kapitel abgeschlossen\"></span>" : "")+"</h3>");

        for(var i = 0, article; i < articles.length; i++){
            article = articles[i];
            navigation.append("<a href=\"#"+article+"\" class=\"sidebarItem list-group-item"+((i > 0 && App.SectionManager.sections[section].isLinear && !App.SectionManager.articles[article].visited) ? " disabled" : "")+"\" data-target=\""+article+"\" class=\"list-group-item\">"+App.SectionManager.articles[article].selector.find("h2:first-child").text()+"</a>");
        }

        this.sidebarController();

    },

    sidebarController : function(){
        $("nav.subNavigation > a").click(function(e){
            var t = $(this);
            // if the LI is disabled, stop here
            if(t.hasClass("disabled")){
                e.preventDefault();
                return;
            }
            // call the SectionManagers showArticle method
            App.SectionManager.showArticle(t.attr("data-target"));
        })
    },

    /**
     * this function binds a click event on every navigation link.
     * checks if the user can access this element.
     * If not, stop and prevent the browsers default event bubbling.
     * if it's allowed, call showArticle from the SectionManager.
     */
    linkController : function(){
        // bind the click event
        $(".nav .dropdown-menu > li > a").click(function(e){
            
            var t = $(this);

            var parentLI = t.parent("li");
            // if the LI is disabled, stop here
            if(parentLI.hasClass("disabled")){
                e.preventDefault();
                return;
            }
            // call the SectionManagers showArticle method
            App.SectionManager.showArticle(t.attr("data-target"));

        });
    },

    /**
     * adds the class "active" to the LI which got clicked
     * @param  {String} linkTarget the id of the article
     */
    activeLink : function(linkTarget){
        this.getNavigationElement(linkTarget).addClass("active");
    },

    /**
     * removes the class "active" from the last LI in the navigation
     * @param  {String} linkTarget the id of the last article
     */
    inactiveLink : function(linkTarget){
        this.getNavigationElement(linkTarget).removeClass("active");
    },

    /**
     * adds the class "active" to the LI which got clicked
     * @param  {String} linkTarget the id of the article
     */
    activeSubLink : function(linkTarget){
        this.getSubNavigationElement(linkTarget).addClass("active");
        
    },

    /**
     * removes the class "active" from the last LI in the navigation
     * @param  {String} linkTarget the id of the last article
     */
    inactiveSubLink : function(linkTarget){
        this.getSubNavigationElement(linkTarget).removeClass("active");
        
    },

    /**
     * returns an jQuery object that contains the data-target attribute with the given target
     * @param  {String} target The value of the data-target attribute
     * @return {jQuery} The jQuery object that contains the element
     */
    getNavigationElement : function(target){
        var obj = this.mainNavigation.find(".nav .dropdown-menu > li[data-target=\""+target+"\"]");

        // if there is no LI, throw a runtime error
        if(obj.length === 0){
            throw new Error("Runtime Error!\nThe navigation element targeting \""+target+"\" does not exist!");
        }

        return obj;
    },

    getSubNavigationElement : function(target){
        if(this.hasSubNavigation){
            var obj = this.subNavigation.find("a[data-target=\""+target+"\"]");

            // if there is no LI, throw a runtime error
            if(obj.length === 0){
                return $("<span></span>");
                //throw new Error("Runtime Error!\nThe navigation element targeting \""+target+"\" does not exist!");
            }

            return obj;
        } else {
            return $("<span></span>");
        }
    },

    /**
     * adds the class disabled to an target element
     * @param  {String} target The element with the data-target attribute
     */
    enableLink : function(target){
        this.getNavigationElement(target).removeClass("disabled");
    },

    /**
     * removes the class disabled to an target element
     * @param  {String} target The element with the data-target attribute
     */
    disableLink : function(target){
        this.getNavigationElement(target).addClass("disabled");
    },


    enableSubLink : function(target){
        this.getSubNavigationElement(target).removeClass("disabled");
    },

    disableSubLink : function(target){
        this.getSubNavigationElement(target).addClass("disabled");
    }


};

/**
 * Logging class - logs errors and messages in the console
 * @type {Object}
 */
App.Log = {
    /**
     * logs an error in the developement console
     * @param  {Object} message Could be an object or a String. this is the data which is displayed in the console
     */
    error : function(message){
        console.error(message);
    },

    /**
     * Simple console loging function
     * @param  {Object} message Object or String to be displayed in the console
     */
    log : function(message){
        console.log(message);
    }
};

/**
 * Error handling class.
 * Registers a function to the window.oneror event.
 * Routes errors to the console or into an alert window.
 * @type {Object}
 */
App.Error = {

    /**
     * if true, all errors are displayed in alert message boxes, if false, they are displayed in the console.
     * @type {Boolean}
     */
    debugAlert : true,

    /**
     * routes messages to the alert function or the logging function
     * @param  {Object} message Object or String - the message which should be displayed
     */
    log : function(message){
        this.debugAlert ? alert(message) : App.Log.error(message);
    },

    /**
     * registers a function to the window error event handler.
     * This function builds an error message and returns it
     * @return {String} The error message
     */
    registerErrorEventHandler : function(){
        window.onerror = function(msg, url, line, col, error) {
           // Note that col & error are new to the HTML 5 spec and may not be 
           // supported in every browser.  It worked for me in Chrome.
           var extra = !col ? '' : '\ncolumn: ' + col;
           extra += !error ? '' : '\nerror: ' + error;

           // You can view the information in an alert to see things working like this:
           App.Error.log(msg + "\n\nurl: " + url + "\nline: " + line + extra);

           var suppressErrorAlert = true;
           // If you return true, then error alerts (like in older versions of 
           // Internet Explorer) will be suppressed.
           return suppressErrorAlert;
        };
    }
};



$(document).ready(function(){ App.init(); /*SessionController.init();*/ });