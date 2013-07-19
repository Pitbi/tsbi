/* This part have to out of closure to ensure it's available for other scripts (gmap) */
var merix_search_results = null;

var MerixTranslation = new Class({
	dictionary : null,
	language : null,
	initialize : function(language, dictionary) {
		this.dictionary = dictionary;
		this.language = language;
	},
	get : function(identifier) {
		return this.dictionary[identifier] || '';
	},
	getLocale : function(){
		return this.language+'_'+this.language.toUpperCase();
	},
	getCalendarOptions : function(){
		return this.dictionary.calendarOptions || [];
	}	
});

/* start of closure */
(function() {
	
	var dict;
	var PROJECT_URL = 'http://www.merixstudio.com/';
	var PROJECT_URL_PL = 'http://pl.merixstudio.com/';
	var STATIC_URL = 'http://static.merixstudio.com/';
	/* Add class to body to flag active JavaScript */
	$E('body').addClass('js');
	
	var DictionaryEn = {
		"calendarOptions" : { 
				"startDay" : 7, 
				"dayNames" : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
				"monthNames" : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], 
				"dayChars" : 2, 
				"yearRange": 3,
				"format":"mm/dd/yyyy" 
		},
		"emptyName" : "Please, fill in your name",
		"emptyEmail" : "Please, fill in your email",
		"invalidEmail" : "Provided email is invalid",
		"emptyMessage" : "Please, fill in your message",
		"emptyComment" : "Please, fill in your comment",
		"emptyTerms" : "You have to accept terms &amp; conditions",
		"prev": "Previous Project",
		"next": "Next Project",
		"close" : "close",
		"more_results" : "more results",
		"no_results_found" : "no results found...",
		"visit" : "Visit",
		"overview" : "Overview",
		"view_code" : "View code",
		"view_project" : "View project",
		"added": "Added",
		"add":"add",
		"externalLink" : "[external link]",
		"zoomLayout" : "High contrast",
		"normalLayout" : "Normal contrast"
	};
	
	var DictionaryPl = {
		"calendarOptions" : { 
				"startDay" : 1, 
				"dayNames" : ['Niedziela', 'PoniedziaÅ?ek', 'Wtorek', 'Å?roda', 'Czwartek', 'PiÄ?tek', 'Sobota'], 
				"monthNames" : ['StyczeÅ?', 'Luty', 'Marzec', 'KwiecieÅ?', 'Maj', 'Czerwiec', 'Lipiec', 'SierpieÅ?', 'WrzesieÅ?', 'PaÅºdziernik', 'Listopad', 'GrudzieÅ?'], 
				"dayChars" : 2, 
				"yearRange": 3,
				"format":"yyyy/mm/dd" 
		},		
		"emptyName" : "ProszÄ? podaÄ? imiÄ? i nazwisko",
		"emptyEmail" : "Prosze podaÄ? adres e-mail",
		"invalidEmail" : "Podany e-mail jest nieprawidÅ?owy",
		"emptyMessage" : "ProszÄ? wpisaÄ? wiadomoÅ?Ä?",
		"emptyComment" : "ProszÄ? wpisaÄ? komentarz",
		"emptyTerms" : "WiadomoÅ?Ä? nie moÅŸe zostaÄ? wysÅ?ana bez zaakceptowania powyÅŸszych warunkÃ³w",
		"prev": "Poprzedni projekt",
		"next": "NastÄ?pny projekt",
		"close" : "zamknij",
		"more_results" : "wiÄ?cej wynikÃ³w",
		"no_results_found" : "nie znaleziono wynikÃ³w...",
		"visit" : "Strona",
		"overview" : "Podsumowanie",
		"view_code" : "Kod",
		"view_project" : "Projekt",	
		"added": "Dodany",
		"add":"Dodaj",
		"externalLink" : "[link zewnÄ?trzny]",
		"zoomLayout" : "ZwiÄ?ksz kontrast",
		"normalLayout" : "Normalny kontrast"		
	};

	var language = $E('html').getAttribute('lang').substr(0,2);
	switch (language) {
		case 'pl':
			dict = new MerixTranslation('pl',DictionaryPl);
			break;
		case 'en':
			dict = new MerixTranslation('pl',DictionaryEn);
			break;			
		default:
			throw "Unsupported language";
	}
	/* \\dictionary */
	
	/* Layout Switcher */
	var LayoutSwitcher = new Class({
		
		initialize : function(switcher){
			this.stylesheet = {
				'href' : STATIC_URL+'css/zoom.css',
				'id' : 'zoom-layout'
			};
			
			this.switcher = switcher;
			
			this.bound = [];
			this.bound.click = this.execute.bindWithEvent(this);
			switcher.addEvent('click',this.bound.click);
		},
		execute : function(event) {
			event = new Event(event).stop();
			
			/* check if link exists - if so, remove it */
			if ( $E('body').hasClass('hc')) {
				this.switchToNormal();
			}
			/* otherwise create new element */
			else {
				this.switchToHighContrast();
			}
		},
		switchToNormal : function() {
				$E('body').removeClass('hc');
				this.switcher.setText(dict.get('zoomLayout'));
				Cookie.remove('alternate_view', { path : '/', domain : 'merixstudio.com' } );
		},
		switchToHighContrast : function(){
				$E('body').addClass('hc');
				this.switcher.setText(dict.get('normalLayout'));
				Cookie.set('alternate_view',1,{ duration: 30 , path : '/', domain : 'merixstudio.com' });
		}
	});
	
	var laysw = $('switch-layout');
	
	if (typeof laysw !== 'undefined') {
		var layswitch = new LayoutSwitcher(laysw);
	}
	/* \\Layout Switcher */
	
	
	/* Slideshow*/
	var SlideShow = new Class({
		links : [],
		list : null,
		bound : [],
		baseimg : null,
		imgclone : null,
		current : null,
		processing : false,
		loader : null,
		initialize : function(list, viewport) {
			var styler;
			this.links = $ES('a.slide',list); 
			this.list = list;
			this.baseimg = $E('img',viewport);
			
			/* create image clone */
			this.imgclone = this.baseimg.clone(true);
			this.imgclone.setAttribute('id','viewport-clone');
			viewport.appendChild(this.imgclone);
			styler = new Fx.Style(this.imgclone,'opacity').set(0);
			
			/* create loader */
			this.loader = new Element('div',{
				'id' : 'viewport-loader'
			});
			
			styler = new Fx.Style(this.loader,'opacity').set(0);
			viewport.appendChild(this.loader);
			
			this.request(this.extractProjectName(list.className));
	
		},
		//request list of other images
		request : function(project_name){
			var self = this;
			var t = new Ajax('/screenshots/'+project_name, {
				method : 'post',
				onComplete: function(data){
					var images = Json.evaluate(data);
					self.links.map(function(item,index){
						item.slide = images[index];
						item.index = index;
						
						/* set index to current image */
						if (this.baseimg.getAttribute('src') == item.slide) {
							this.current = index;
						}
						this.bound.click = this.onClick.bindWithEvent(this);
						item.addEvent('click',this.bound.click);		
					},self);					

					self.bound.next = self.next.bindWithEvent(self);
					$ES('.next a').each(function(item){
						item.addEvent('click',self.bound.next);
					});
					
					self.bound.previous = self.previous.bindWithEvent(self);
					$ES('.prev a').each(function(item){
						item.addEvent('click',self.bound.previous);
					});										
				}
			}).request();					
		},
		onClick : function(e) {
			e = new Event(e).stop();
			var target = (e.target.nodeName.toLowerCase() == 'span') ? $(e.target).getParent() : e.target;  
			this.switchImg(target);
		},
		next : function(e) {
			e = new Event(e).stop();
			var next = this.links[this.current + 1] || this.links[0];
			this.switchImg(next);
		},
		previous : function(e) {
			e = new Event(e).stop();
			var prev = this.links[this.current -1] || this.links[this.links.length-1];
			this.switchImg(prev);			
		},
		/* this is a precaution if we ever have to parse the passed value */
		extractProjectName : function(str) {
			return str.replace('index ','');
		},
		switchImg : function(/* list link */ el){
			/* this prevents flickering when user clicks too fast */			
			if (this.processing) {
				return;
			}
			else {
				this.current = el.index;
				this.processing = true;
				
				var self = this;
				/* perform switch after image has been loaded */
				var onLoad = function(event) {
					self.imgclone.src = el.slide;
					$ES('a.active',self.list).each(function(item){
						item.removeClass('active');
					});
					
					el.addClass('active');
					var styler = new Fx.Style(self.imgclone,'opacity',{
						onComplete : function(){
							var styler2 = new Fx.Style(self.loader,'opacity').set(0);
							self.baseimg.src = el.slide;
							styler.set(0);
							self.processing = false;
						}
					}).start(0,1);							
				};
				
				var img = new Image();
			
				img.onload = onLoad;
				/* src must be changed only after the onload event has been defined - Praise IE! >:] */
				img.src = el.slide;
				
				if (img.complete === false) {
					var styler = new Fx.Style(this.loader, 'opacity', { duration: 200 }).start(0,1);
				}
				
			}
		}
	});	
	
	var slide_list = $('screen-list');
	if (typeof slide_list !== 'undefined') {
		var slideshow = new SlideShow(slide_list, $('viewport'));
	}
	
	/* \\Slideshow */
	
	/* FormValidator */
	

	var FormValidator = new Class({
		bound : {},
		is_valid : true,
		error_container : null,
		rules : [],
		form : null,
		validators : [],
		initialize: function(form){
			this.bound = {};
			this.validators = [];
			this.rules = [];
			
			/* create initial error container for cloning */
			this.error_container = new Element('strong');
			
			if (form === null) {
				throw "Unspecified form";
			}
			
			this.form = $(form);
			
			/* initialize default validators */
			this.validators.MANDATORY = this.validateMandatory;
			this.validators.EMAIL = this.validateEmail;
			
			this.bound.submit = this.onSubmit.bindWithEvent(this);
			this.form.addEvent('submit',this.bound.submit);		
		},
		addRule : function(field, msg, validator) {
			this.rules[this.rules.length] = { 'field' : $(field), 'msg' : msg, 'validator' : validator };
		},
		onSubmit : function(event) {
			event = new Event(event).stop();

			/* remove previous errors */ 
			this.clearErrors();
			
			this.rules.each(function(item){
				var field = $(item.field);
				if (item.validator(field.getValue()) === false) {
					this.showError(field, item.msg);
					this.is_valid = false;
				}
			},this);
			
			if (this.is_valid) {
				this.form.submit();
			}
		},
		showError : function(field, msg) {
			var container = this.error_container.clone();
			container.setHTML(msg);
			
			var parent = $(field).getParent();
			parent.addClass('error');
			container.injectInside(parent);
			
		},
		clearErrors : function() {
			this.is_valid = true;
			$ES('p.error',this.form).each(function(item){
				$E('strong',item).remove();
				item.removeClass('error');
			});
		},
		validateMandatory : function(value) {
			/* trim whitespace and check if field is filled in */ 
			value = value+''; /* converts to string */
			value = value.replace(/^\s+|\s+$/g, '');
			return (value !== '' && value !== false);
		},
		validateEmail : function(value) {
			if (value) {
				return /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,6}$/i.test(value);
			}
			return true;
		}	
	});
	
		/* \\FormValidator */
		
	/* Contact form */
	var ContactForm = new Class({
		initialize : function(form){
			var options = dict.getCalendarOptions();
			
			$ES('input.date',form).each(function(item){
				item.addClass('DatePicker');
				var dp = new DatePicker(item, options);
			});
		}
	});
	
	var contact_form = document.getElementById('c-form');
	
	if (typeof contact_form !== 'undefined') {
		var contactform = new FormValidator(contact_form);
		contactform.addRule('f-name',dict.get('emptyName'),contactform.validators.MANDATORY);
		contactform.addRule('f-email',dict.get('emptyEmail'),contactform.validators.MANDATORY);
		contactform.addRule('f-email',dict.get('invalidEmail'),contactform.validators.EMAIL);
		contactform.addRule('f-message',dict.get('emptyMessage'),contactform.validators.MANDATORY);
		contactform.addRule('f-terms',dict.get('emptyTerms'),contactform.validators.MANDATORY);
		
		var cf2 = new ContactForm(contact_form);
	}
	
	/* \\Contact form */

	
	/* Homepage project viewer */
	var ProjectViewer = new Class({
		
		viewer : null,
		overlay : null,
		loader : null,
		next : null,
		prev : null,
		bound : [],
		projects : [],
		current : null,
		initialize : function(viewer) {
			this.viewer = viewer;

			var self = this;
			var t = new Ajax('/homepage/projects', {
				method : 'post',
				onComplete: function(data){
					self.projects = Json.evaluate(data);
					self.current = 0;
					self.createOverlay();					
					self.createControls();
				}
			}).request();		
		},
		createControls : function(){
			var styler, li;
			/* create next/prev controls */
			var controls = new Element('ul',{
				'class' : 'controls'
			});
			
			controls.injectInside(this.viewer);
			styler = new Fx.Style(controls,'opacity').set(0);
			
			/* prev button */
			li = new Element('li',{
				'class':'prev'
			});
			li.injectInside(controls);

			this.bound.prev = this.previousProject.bindWithEvent(this);
			var prev = new Element('a',{
				'href' : '#',
				'events' : {
					'click' : this.bound.prev
				}
			});
			prev.setText(dict.get('prev'));			
			prev.injectInside(li);
			this.prev = prev;	
		
			/* next button */
			li = new Element('li',{
				'class':'next'
			});
			li.injectInside(controls);			
			this.bound.next = this.nextProject.bindWithEvent(this);
			var next = new Element('a',{
				'href' : '#',
				'events' : {
					'click' : this.bound.next
				}
			});
			next.setText(dict.get('next'));
			next.injectInside(li);
			this.next = next;
			
			styler = new Fx.Style(controls,'opacity').start(0,1);
		},
		createOverlay : function(){
			var styler;
			/* create overlay */
			var overlay = new Element('div',{
				'id' : 'homepage-overlay'
			});
			
			styler = new Fx.Style(overlay,'opacity').set(0);
			overlay.injectInside(this.viewer);
			this.overlay = overlay;
									
			/* loading image */
			var loader = new Element('div',{
				'id' : 'homepage-loader'
			});			
			
			styler = new Fx.Style(loader,'opacity').set(0);
			loader.injectInside(this.viewer);
			this.loader = loader;			
		},
		nextProject : function(e) {
			var index;
			/* prevent default */
			e = new Event(e).stop();
			e.target.blur();
			
			/* set index to next project or to first if that was the last one */
			if (typeof this.projects[this.current+1] !== 'undefined') {
				index = this.current+1;
			}
			else {
				index = 0;
			}
			
			this.showProject(index);
		},
		previousProject : function(e){
			var index;
			/* prevent default */
			e = new Event(e).stop();
			e.target.blur();
						
			/* set index to previous project or to last if that was the first one */
			if (typeof this.projects[this.current-1] !== 'undefined') {
				index = this.current-1;
			}
			else {
				index = this.projects.length-1;
			}
			
			this.showProject(index);
		},
		showProject : function(index) {
			var li;
			var project = this.projects[index];
			this.current = index;
			var self = this;
			
  		this.startTransition(function(){
				$E('h1',this.viewer).setHTML(project.homepage_title);
				$E('div.details',this.viewer).setHTML(project.description);
				
				var d = project.added_date.split('-');
				
				/* $E('p.date', this.viewer).setHTML(dict.get('added')+': '+d[2]+'<span>/</span>'+d[1]+'<span>/</span>'+d[0]); */
				$E('p.date', this.viewer).setHTML(project.title);
				
				var tabs = $E('ul.tabs',this.viewer).empty();
				
				if (project.url) {
					li = new Element('li',{
						'class':'visit'
					});
					li.setHTML('<a href="'+project.url+'"><span>'+dict.get('visit')+'</span></a>');
					li.injectInside(tabs);
				}
				
				li = new Element('li');
				li.setHTML('<strong><span>'+dict.get('overview')+'</span></strong>');
				li.injectInside(tabs);

				/* checks if design image has a three letter expression */
				if (project.design_url) {
					li = new Element('li');
					
					var a = new Element('a',{
						'href' : project.design_url
					});
					
					a.setHTML('<span>'+dict.get('view_project')+'</span>');
					a.injectInside(li);
					li.injectInside(tabs);
				}
				if (project.code_url) {
					li = new Element('li');
					li.setHTML('<a href="'+project.code_url+'"><span>'+dict.get('view_code')+'</span></a>');
					li.injectInside(tabs);
				}
				var exl = new ExternalLinks($ES('a',self.viewer));
				
				var img = new Image();
				
				$E('p.image img',self.viewer).setProperty('alt',project.title);
				
				img.onload = function(e){
					$E('p.image img', self.viewer).src = this.src;
					/* end transition after document is loaded */
					self.endTransition();
				};
				img.src = project.image;
			});

		},		
		startTransition : function(/* function changing project data */ rebuildFunction){
			var self = this;
			var styler = new Fx.Style(this.overlay, 'opacity',{
				onComplete : function(){
					var styler = new Fx.Style(self.loader, 'opacity',{
						duration : 200,
						onComplete : rebuildFunction
					}).start(0,1);		
				}
			}).start(0,1);
		},
		endTransition : function() {
			var self = this;
			var styler = new Fx.Style(this.loader, 'opacity',{
				onComplete : function(){
					var styler = new Fx.Style(self.overlay, 'opacity').start(1,0);		
				},
				duration : 200	
			}).start(1,0);			
		}
	});
	
	var homepage_project = $('featured');
	if (typeof homepage_project !== 'undefined') {
		var homepageviewer = new ProjectViewer(homepage_project);
	} 
	
	/* \\Homepage project viewer */
	
	/* Search box */
	
	var SearchBox = new Class({
		search_form : null,
		bound: [],
		box : null,
		indicator : null,
		firstResult : null,
		search_box : null,
		initialize : function(search_form) {
			this.search_form = search_form;
			this.search_box = $E('input[type=text]', search_form);
			this.bound.submit = this.onSubmit.bindWithEvent(this);
			this.search_form.addEvent('submit',this.bound.submit);
		},
		buildResultBox : function(query, results){
			var p, a, div;
			var box = new Element('div',{
				'id' : 'search-results'
			});
			this.bound.remove = this.removeBox.bindWithEvent(this);
			
			var close = new Element('a',{
				'href' : '#',
				'events' : {
					'click' : this.bound.remove
				},
				'id':'search-box-close'
			});
			close.setText(dict.get('close'));
			
			p = new Element('p');
			p.injectInside(box);
			close.injectInside(p);
			
			if (results.length === 0) {
				var no_results = this.emptyResultset();
				no_results.injectInside(box);
			}
			else {
				var result_list = this.resultsList(results);
				result_list.injectInside(box);
				
				var more_results = this.moreResults(query);
				more_results.injectInside(box);
				
				//capture keydown on entering close button
				var closeKeydown = function(event){
					event = new Event(event);
					//do nothing
					if (event.key == "up") {
						event.stop();
					}
					
					//close the box
					else if (event.key == "esc") {
						event.stop();
						this.removeBox();
					}
					
					else if (event.key == "down") {
						event.stop();
						//focus on first result
						event.target.getParent().getNext().getFirst().getFirst().focus();
					}
				};
				var closeKeydownBound = closeKeydown.bindWithEvent(this);
				close.addEvent('keydown',closeKeydownBound);
				
			a = new Element('a',{
				'href' : 'http://search.yahoo.com/',
				'class' : 'yahoo'
			});
			a.setText('Yahoo! Powered');
			
			div = new Element('div',{
				'class' : 'yahoo-container'
			});
			div.injectInside(box);
			a.injectInside(div);				
				
		}
			
			this.box = box;
			
			var styler = new Fx.Style(this.box,'opacity', { duration: 200 }).set(0);
			this.box.injectAfter(this.search_form);
			
			styler.start(0,1);

			//capture global mouseclick to close the box if it's outside
			this.bound.bodyClick = this.onBodyClick.bindWithEvent(this);
			$E('body').addEvent('click',this.bound.bodyClick);

	
			//move focus to first element				
			var self = this;
			window.setTimeout(function(){
				if (self.firstResult) {
					self.firstResult.focus();
				}	
			}, 300);	

		},
		/* returns elements for empty resultset */
		emptyResultset : function(){
			var no_results = new Element('strong',{
				'class' : 'empty-resultset'
			});
			
			no_results.setText(dict.get('no_results_found'));			
			return no_results;
		},
		/* builds results list */
		resultsList : function(results){
			var result_list = new Element('ul');
			this.bound.keydown = this.navigateResults.bindWithEvent(this);
			results.each(function(result){
				var li = new Element('li');
				var a = new Element('a',{
					'href' : result.link,
					'events' : {
						'keydown' : this.bound.keydown	
					}
				});
				if (!this.firstResult) {
					this.firstResult = a;
				}
				a.setHTML(result.title);
				a.injectInside(li);
				li.injectInside(result_list);
			},this);	
			
			return result_list;		
		},
		/* returns more results link */
		moreResults : function (query){
			var keydown = function(event){
				event = new Event(event);
				if (event.key == "up") {
					event.stop();
					event.target.getPrevious().getLast().getFirst().focus();
				}
				else if (event.key == "down") {
					event.stop();
				}
				else if (event.key == "esc")	{
					this.removeBox();
				}					
			};
			
			var boundkey = keydown.bindWithEvent(this);
			
			var more_results = new Element('a',{
				'href' : '/s/'+escape(query),
				'class' : 'more-results',
				'events' : {
					'keydown' : boundkey
				}
			});
			more_results.setText(dict.get('more_results'));
			return more_results;
		},
		navigateResults : function(event) {
			event = new Event(event);
			/* move down in the results */
			if (event.key == "down") {
				var next = event.target.getParent().getNext();
				if (next) {
					$E('a',next).focus();
				}
				else {
					$E('a.more-results', this.box).focus();
				}
				event.stop();				
			}
			
			/* move up in the results */
			else if (event.key == "up") {
				var prev = event.target.getParent().getPrevious();
				if (prev) {
					$E('a',prev).focus();
				}
				else {
					$E('p a', this.box).focus();
				}				
				event.stop();				
			}	
			
			/* close box */
			else if (event.key == "esc")	{
				event.stop();
				this.removeBox();
			}										
		},
		onBodyClick : function(event) {
			this.removeBox();
			$E('body').removeEvent(this.bound.bodyClick);
		},
		removeBox : function(event){
			if (event) {
				event = new Event(event).stop();
			}
			
			if (this.box !== null) {
				this.box.remove();
				this.box = null;
				this.firstResult = null;
				this.search_box.focus();
			}
		},
		onSubmit : function(event) {
			var interval;
			this.removeBox();
			
			event = new Event(event).stop();

			var query = this.search_box.getValue();
			var self = this;
			var form_data = {};
			form_data[this.search_box.getAttribute('name')] = query;
			 
			this.search_box.addClass('loading');
			/*make request for results - can't use AJAX here in order to make it work on blog */
			
			var language = $E('html').getAttribute('lang').substr(0,2);
			
			var assetUri = (language == 'pl' ? PROJECT_URL_PL : PROJECT_URL);
			assetUri = assetUri+'/search/ajax/q/'+escape(query); 
			
			var as = new Asset.javascript(assetUri, { 'id':'search_results'});
			
			var onReady = function(results){
					window.clearInterval(interval);
					self.search_box.removeClass('loading');
					interval = null;
					self.buildResultBox(query, results);
					/* reset results before new query */
					$('search_results').remove();
					merix_search_results = null;									
			};				
			
			interval = window.setInterval(function(){
				if (merix_search_results !== null ) {
					onReady(merix_search_results);
				}
			},50);
			/* force stop request after 5 seconds */  
			var timeout = window.setTimeout(function(){
				if (interval !== null) {
					onReady([]);
				}
			}, 5000);
		}
	});

	var search_form = document.getElementById('search-form');

	if (typeof search_form !== 'undefined') {
		var sform = new SearchBox(search_form);
	}
	
	/* \\ Search Form */
	
	/* Sitemap slider */
	
	var SitemapSlider = new Class({
		contener : null,
		bound : [],
		slider : null,
		initialize : function(contener){
			this.contener = contener;
			this.contener.injectTop($E('body'));
			this.slider = new Fx.Slide(this.contener, { duration: 500}).hide();
						
			this.bound.click = this.onClick.bindWithEvent(this);
			
			$ES('a[href="#sitemap"]').each(function(item) {
				item.addEvent('click',this.bound.click);
			},this);
		},
		onClick : function(event) {
			this.contener.setStyle('display','block');			
			event = new Event(event).stop();
			this.slider.toggle();
		}
	});
	
	
	var sitemap_slider = $('sitemap');
	
	if (typeof sitemap_slider !== 'undefined') {
		var sitemap = new SitemapSlider(sitemap_slider);
	}
	
	/* Del.icio.us button */
	
	var DeliciousButton = new Class({
		link : null,
		bound : [],
		initialize : function(link) {
			this.link = link;
			this.bound.click = this.onClick.bindWithEvent(this);
			
			this.link.addEvent('click',this.bound.click);
		},
		onClick : function(event){
			event = new Event(event).stop();
			window.open('http://del.icio.us/post?v=4&noui&jump=close&url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title), 'delicious','toolbar=no,width=700,height=400');
		}
	});
	
	var delicious_button = $('post-to-delicious');
	
	if (typeof delicious_button !== 'undefined') {
		var dlcbutton = new DeliciousButton(delicious_button);
	}
	
	/* \\Del.icio.us button */
	
	/* Infoboxes */
	
	var InfoBox = new Class({
		bound : [],
		initialize : function(boxes){
			
			this.bound.click = this.onClick.bindWithEvent(this);
			boxes.each(function(box){
				$ES('a.c',box).each(function(item){
					item.box = box;
					item.addEvent('click',this.bound.click);
				},this);
			},this);
		},
		onClick : function(event){
			event = new Event(event).stop();
			var box = event.target.box;
			var link = $(event.target);
			
			var styler = new Fx.Style(box, 'opacity', {
				onComplete : function (){
					var slider = new Fx.Slide(box).slideOut(); 
				}
			}).start(1,0);
			
			var t = new Ajax(link.getAttribute('href'), {
				method : 'post'
			}).request();			
		}
	});
	
	
	var infoboxes = $ES('div.infobox');
	
	if (infoboxes.length > 0) {
		var ib = new InfoBox(infoboxes);
	}
	/* \\Infoboxes */
	
	
	/* Gravatar */
	var Gravatar = new Class({
		images : [],
		initialize : function(container){
			this.images = $ES('img.g',container);
			
			this.rewriteSources();
		},
		rewriteSources : function(){
			this.images.each(function(img){
				var url, hash;
				hash = this.getHash(img.getProperty('class'));
				if (hash) {
					url = 'http://www.gravatar.com/avatar.php?';
					url += 'gravatar_id='+hash;
					url += '&rating=G';
					url += '&size=48';
					url += '&default='+escape(img.getProperty('src'));
					img.setProperty('src', url);
				}
			},this);
		},
		getHash : function(str) {
			return str.replace(/g hash\-/i,'');
		}
	});
	
	var blog_comments = $('post-responses');
	if (typeof blog_comments !== 'undefined') {
		var gra = new Gravatar(blog_comments);
	}
	
	/* \\Gravatar */
	
	/* Blog comment form */

	var commentform = document.getElementById('commentform');
	
	if (commentform !== null && document.getElementById('f-name') !== null) {
		var cf = new FormValidator(commentform);
		cf.addRule('f-name',dict.get('emptyName'),cf.validators.MANDATORY);
		cf.addRule('f-email',dict.get('emptyEmail'),cf.validators.MANDATORY);
		cf.addRule('f-email',dict.get('invalidEmail'),cf.validators.EMAIL);
		cf.addRule('f-comment',dict.get('emptyComment'),cf.validators.MANDATORY);
	}
	
	/* \\Blog comment form */
	
	/* request form button */
	var RequestForm = new Class({
		bound : [],
		index : 0,
		initialize : function(containers) {
			this.bound.click = this.onClick.bindWithEvent(this);
			containers.each(function(item){
				addButton = this.createButton();
				addButton.container = item;
				addButton.injectAfter($E('input',item));
			},this);
		},
		createButton : function(){
				var addButton = new Element('img',{
					'alt' : dict.get('add'),
					'src' : STATIC_URL+'images/icons-add.png',
					'events' : {
						'click' : this.bound.click
					}
				});
				return addButton;			
		},
		onClick : function(event) {
			this.index = this.index + 1;
			event = new Event(event).stop();
			
			var container = event.target.container;
			labelHTML = $E('label',container).innerHTML;
			$(event.target).remove();
			
			var new_box = new Element('p',{
				'class':'file'
			});
			var label = new Element('label',{
				'for' : 'f-attachment_'+this.index
			});
			label.setHTML(labelHTML);
			label.injectInside(new_box);
			
			var input = new Element('input',{
				'type':'file',
				'id':'f-attachment_'+this.index,
				'name':'attachment_'+this.index
			});
			input.injectInside(new_box);
			var addButton = this.createButton();
			addButton.container = new_box;
			addButton.injectInside(new_box);
			
			new_box.injectAfter(event.target.container);
		}
	});
	
	var file_inputs = $ES('p.file');
	if (file_inputs.length > 0) {
		var rf = new RequestForm(file_inputs);
	}
	/* \\request form button */
	

	/* Code Highlighter with Geshi Library */
	
	var CodeHighlighter = new Class({
		containers : [],
		switcher : null,
		initialize : function(containers) {
			/* text normalization in IE FTW! >:[ */
			if (window.ie) {
				return;
			}
			this.containers = containers;
			this.switcher = this.createSwitcher();
			
			
			this.containers.each(function(item){
				var code = $E('code',item);
				
				var source = code.innerHTML;	
				
				var language = code.getProperty('class');
				if (language == 'html'){
					language = 'html4strict';
				}
				if (language === null){
					return;
				}
				this.request(source, language, item);
			},this);
		},
		createSwitcher : function(){
			var switcher = new Element('div',{
				'class' : 'code-switcher'
			});
			var t = new Element('a',{
				'href' : '#'
			});
			t.setText('ZmieÅ? widok');
			t.injectInside(switcher);
			return switcher;
		},
		request : function(source, language, container){
			var self = this;
			var t = new Ajax('/converter.php', {
				method : 'post',
				data : {
					'source' : source,
					'language' : language
				},
				onComplete: function(data){
					data = Json.evaluate(data);
					if (typeof data.error !== 'undefined') {
						return;
					}
					
					var source_container = new Element('div',{
						'class' : language+' code-view' 
					});
					
					
					source_container.injectAfter(container);
					source_container.setHTML(data.parsed);
					
					
					var switcher = self.switcher.clone(true);
					
					switcher.injectBefore(container);
					
					switcher_trigger = $E('a',switcher);
					switcher_trigger.A = new Fx.Slide(source_container, {duration: 0});
					switcher_trigger.B = new Fx.Slide(container, {duration: 0});
					switcher_trigger.B.toggle();
					
					switcher_trigger.addEvent('click',function(event){
						event = new Event(event).stop();
						/* FX slides */
						this.A.toggle();
						this.B.toggle();
					});
					
					var style_tag = new Element('style',{
						'type' : 'text/css'
					});
					
					style_tag.injectInside($E('head'));
					style_tag.setHTML(data.styles);
				}
			}).request();			
		}
		
	});
	
	
	var loc = window.location + ""; /* convert to string */
	
	/* apply for blog only */
	if (/blog\.merixstudio\.com\//i.test(loc)){
		var pre_tags = $ES('pre');
		if (pre_tags.length > 0) {
			var ch = new CodeHighlighter(pre_tags);
		}		
	}
	
	/* \\Code Highlighter */

	/* External Links */
	var ExternalLinks = new Class({
		regex_absolute : /^http:\/\/.*/i,
		regex_merix : /^http:\/\/[a-z0-9_-]+\.([a-z0-9_-]+\.)?merixstudio\.com\//i,  
		initialize : function(items){
			items.each(function(item){
				item = $(item);
				var href = item.getProperty('href');
				if (this.regex_absolute.test(href) === true && this.regex_merix.test(href) === false) {
					var rel = item.getProperty('rel') || '';
					rel = rel ? (rel+' external') : 'external';
					item.setProperty('rel',rel);
					
					var title = item.getProperty('title') || '';
					var extlinks = dict.get('externalLink');
					title = title ? (title+' '+extlinks) : extlinks;
					item.setProperty('title',title);					
					
					item = $E('span',item) || item;
					var contents = item.innerHTML;
					item.setHTML(contents+ '<span> &uarr;</span>');
				}
			},this);
		}
	});
	
	var exlinks = new ExternalLinks($ES('a'));
	/* \\External Links */

})();