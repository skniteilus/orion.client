/*******************************************************************************
 * @license
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global window document define login logout localStorage orion */
/*browser:true*/

define(['require'], 
        function(require){
	
	/**
	 * This class contains static utility methods. It is not intended to be instantiated.
	 * @class This class contains HTML fragments for the common banner, footer, toolbars
	 * @name orion.commonHTMLFragments
	 */

	// BEGIN TOP BANNER FRAGMENT
	var topHTMLFragment =
	//Top row:  Logo + discovery links + user
	'<div id="staticBanner" class="layoutBlock topRowBanner">' +
		'<a id="home" class="layoutLeft primaryNav" href="' + require.toUrl("index.html") + '"><img src="' + require.toUrl("images/orion-small-lightondark.gif") + '" alt="Orion Logo"/></a>' +
		'<div id="primaryNav" class="layoutLeft primaryNav"></div>' +
		'<div id="help" class="layoutRight help"><a id="help" href="' + require.toUrl("help/index.jsp") + '"><img src="' + require.toUrl("images/help.gif") + '" alt="Help"/></a></div>'+
		'<div id="userInfo" class="layoutRight primaryNav"></div>' +
		'<div class="layoutRight primaryNav">|</div>' +
	'</div>' +
	//Title area
	'<div id="titleArea" class="layoutBlock titleArea">' +
		'<div id="pageTitle" class="layoutLeft pageTitle"></div>' +
		'<input type="search" id="search" placeholder="Search root" title="Type a keyword or wild card to search in root" class="layoutRight searchbox">' +
		'<div id="relatedLinks" class="layoutRight pageNav"></div>' +
		'<div id="globalActions" class="layoutRight pageNav"></div>' +
		'<div id="dimension" class="layoutBlock dimension"></div>' +
		'<div id="location" class="layoutBlock currentLocation"></div>' +
	'</div>';
	// END TOP BANNER FRAGMENT
	
	// BEGIN BOTTOM BANNER FRAGMENT
	// styling of the surrounding div (text-align, etc) is in ide.css "footer"
	var bottomHTMLFragment = 
		'<div class="layoutBlock">' +
			'<div class="footerBlock">' +
				'Orion is in Beta. Please try it out but BEWARE your data may be lost.' +
			'</div>' +
			'<div class="footerRightBlock">' +
				'<a href="http://wiki.eclipse.org/Orion/FAQ" target="_blank">FAQ</a> | ' + 
				'<a href="https://bugs.eclipse.org/bugs/enter_bug.cgi?product=Orion&version=0.4" target="_blank">Report a Bug</a> | ' +
				'<a href="http://www.eclipse.org/legal/privacy.php" target="_blank">Privacy Policy</a> | ' + 
				'<a href="http://www.eclipse.org/legal/termsofuse.php" target="_blank">Terms of Use</a> | '+ 
				'<a href="http://www.eclipse.org/legal/copyright.php" target="_blank">Copyright Agent</a> | '+
				'<a href="' + require.toUrl("/operations/list.html") +'" target="_blank">Server Operations</a>' +
			'</div>' +
		'</div>';
	// END BOTTOM BANNER FRAGEMENT

	var toolbarHTMLFragment = 
		'<div class="layoutLeft pageActions" id="pageActions"></div>' +
		'<img class="layoutRight progressPane" src="'+ require.toUrl("images/none.png") +'" id="progressPane"></img>' +
		'<div class="layoutRight" id="statusPane"></div>' +
		'<div class="layoutRight pageActions" id="pageNavigationActions"></div>' +
		'<div id="notificationArea" class="layoutLeft layoutBlock slideContainer">' +
				'<div class="layoutLeft" id="notifications"></div>' +
		'</div>' +
		'<div id="parameterArea" class="layoutBlock slideContainer">' +
			'<span id="pageParameterArea" class="leftSlide">' +
				'<span id="pageCommandParameters" class="parameters"></span>' +
				'<span id="pageCommandDismiss" class="parameters"></span>' +
			'</span>' +
			'<span id="pageNavigationParameterArea" class="rightSlide">' +
				'<span id="pageNavigationCommandParameters" class="parameters"></span>' +
				'<span id="pageNavigationDismiss" class="parameters"></span>' +
			'</span>' +
		'</div>';
	
	//return the module exports
	return {
		topHTMLFragment: topHTMLFragment,
		bottomHTMLFragment: bottomHTMLFragment,
		toolbarHTMLFragment: toolbarHTMLFragment
	};
});
