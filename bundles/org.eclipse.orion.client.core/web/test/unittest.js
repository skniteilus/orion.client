/*******************************************************************************
 * @license
 * Copyright (c) 2010, 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
 /*global eclipse:true dojo document console define*/


define(['require', 'dojo', 'orion/serviceregistry', 'orion/pluginregistry', 'orion/bootstrap', 'orion/commands', 
		'orion/fileClient', 'orion/searchClient', 'orion/globalCommands', 'orion/treetable',
        'dojo/hash', 'dojo/parser'],
        function(require, dojo, mServiceRegistry, mPluginRegistry, mBootstrap, mCommands, mFileClient, mSearchClient, mGlobalCommands, mTreetable) {
	

function UnitTestModel(root) {
	this.root = root;
}
UnitTestModel.prototype = {
	destroy: function(){
	},
	getRoot: function(onItem){
		onItem(this.root);
	},
	getChildren: function(parentItem, /* function(items) */ onComplete){
		if (parentItem.children) {
			onComplete(parentItem.children);
		} else {
			onComplete([]);
		}
	},
	getId: function(/* item */ item){
		var result;
		if (item === this.root) {
			result = "treetable";
		} else {
			result = item.Name;
		} 
		return result;
	}
};


function UnitTestRenderer () {
}
UnitTestRenderer.prototype = {
	initTable: function (tableNode, tableTree) {
		this.tableTree = tableTree;
		
		dojo.addClass(tableNode, 'treetable');
	},
	
	render: function(item, tableRow) {
		tableRow.cellSpacing = "8px";
		dojo.style(tableRow, "verticalAlign", "baseline");
		dojo.addClass(tableRow, "treeTableRow");
		var col, div, link;
		if (item.Directory) {
			col = document.createElement('td');
			tableRow.appendChild(col);
			var nameId =  tableRow.id + "__expand";
			div = dojo.create("div", null, col, "only");
			var expandImg = dojo.create("img", {src: require.toUrl("images/collapsed-gray.png"), name: nameId}, div, "last");
			dojo.create("img", {src: require.toUrl("images/folder.gif")}, div, "last");
			link = dojo.create("a", {className: "navlinkonpage", href: "#" + item.ChildrenLocation}, div, "last");
			dojo.place(document.createTextNode(item.Name), link, "only");
			expandImg.onclick = dojo.hitch(this, function(evt) {
				this.tableTree.toggle(tableRow.id, nameId, require.toUrl("images/expanded-gray.png"), require.toUrl("images/collapsed-gray.png"));
			});
		} else {
			col = document.createElement('td');
			tableRow.appendChild(col);
			div = dojo.create("div", null, col, "only");
			dojo.create("img", {src: item.result?require.toUrl("images/unit_test/testok.gif"):require.toUrl("images/unit_test/testfail.gif")}, div, "first");
			dojo.place(document.createTextNode(item.Name + " (" + (item.millis / 1000) + "s)"), div, "last");
			if (!item.result && !item.logged) {
				console.log("[FAILURE][" + item.Name + "][" + item.message + "]\n" + ((item.stack !== undefined && item.stack) ? item.stack : ""));
				item.logged =true;
			}
		}
		
		var resultColumn = document.createElement('td');
		tableRow.appendChild(resultColumn);
	},
	rowsChanged: function() {
	}
};

dojo.addOnLoad(function() {
	mBootstrap.startup().then(function(core) {
		var serviceRegistry = core.serviceRegistry;
		var preferences = core.preferences;
		document.body.style.visibility = "visible";
		dojo.parser.parse();
		var commandService = new mCommands.CommandService({serviceRegistry: serviceRegistry});
		var fileClient = new mFileClient.FileClient(serviceRegistry);
		var searcher = new mSearchClient.Searcher({serviceRegistry: serviceRegistry, commandService: commandService, fileService: fileClient});
		
		// global banner
		mGlobalCommands.generateBanner("banner", serviceRegistry, commandService, preferences, searcher);
		
		function runTests(fileURI) {
			//console.log("installing non-persistent plugin: " + fileURI);
			var testOverview = dojo.byId("test-overview");
			dojo.empty(testOverview);
			var testTree = dojo.byId("test-tree");
			dojo.empty(testTree);
			
			dojo.place(document.createTextNode("Running tests from: "), testOverview, "last");
			var link = dojo.create("a", {className: "navlink", href: require.toUrl("edit/edit.html") + "#" + fileURI}, testOverview, "last");
			dojo.place(document.createTextNode(fileURI), link, "last");
			
			// these are isolated from the regular service and plugin registry
			var testServiceRegistry = new mServiceRegistry.ServiceRegistry();
			var testPluginRegistry = new mPluginRegistry.PluginRegistry(testServiceRegistry, {});
			
			testPluginRegistry.installPlugin(fileURI).then(function() {
				var service = testServiceRegistry.getService("orion.test.runner");
				//console.log("got service: " + service);

				var root = {children:[]};
	
				var myTree = new mTreetable.TableTree({
					model: new UnitTestModel(root),
					showRoot: false,
					parent: "test-tree",
					labelColumnIndex: 0,  // 1 if with checkboxes
					renderer: new UnitTestRenderer()
				});			
	
				var times = {};
				var testCount = 0;
				var _top;
				service.addEventListener("runStart", function(name) {
					var n = name ? name : "<top>";
					if (!_top) {
						_top = n;
					}
	//				console.log("[Test Run] - " + name + " start");
					times[n] = new Date().getTime();
				});
				service.addEventListener("runDone", function(name, obj) {
					var n = name ? name : "<top>";
	//				var result = [];
	//				result.push("[Test Run] - " + name + " done - ");
	//				result.push("[Failures:" + obj.failures + (name === top ? ", Test Count:" + testCount : "") +"] ");
	//				result.push("(" + (new Date().getTime() - times[name]) / 1000 + "s)");
					delete times[n];
	//				console.log(result.join(""));
				});
				service.addEventListener("testStart", function(name) {
					times[name] = new Date().getTime();
					testCount++;
				});
				service.addEventListener("testDone", function(name, obj) {
	//				var result = [];
	//				result.push(obj.result ? " [passed] " : " [failed] ");
	//				result.push(name);
					var millis = new Date().getTime() - times[name];
	//				result.push(" (" + (millis) / 1000 + "s)");
					delete times[name];
	//				if (!obj.result) {
	//					result.push("\n  " + obj.message);
	//				}
	//				console.log(result.join(""));
					root.children.push({"Name":name, result: obj.result, message: obj.message, stack: obj.stack, millis: millis});
					myTree.refresh(root, root.children);
				});	
				service.run().then(function(result) {
					testPluginRegistry.shutdown();
				});
			}, function(error) {
				dojo.create("img", {src: require.toUrl("images/unit_test/testfail.gif")}, testTree, "first");
				dojo.place(document.createTextNode(error), testTree, "last");
			});
		}
	
		dojo.subscribe("/dojo/hashchange", this, function() {
				runTests(dojo.hash());
		});
		runTests(dojo.hash());
	});
});

});
