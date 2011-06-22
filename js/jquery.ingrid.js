/**
 * Ingrid: jQuery Datagrid Control
 *
 * Copyright (c) 2009-2011 Matthew Knight (http://www.reconstrukt.com http://slu.sh)
 *                         Patrice Blanchardie (http://www.inisos.com)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * @requires jQuery v1.3+
 * @version 0.9.7
 *
 */

jQuery.fn.ingrid = function(o){

	var cfg = {

		saveState: false,
		savedStateLoad : false,						 // when Ingrid is initialized, should it load data from a previously saved state?
		initialLoad : false,				// when Ingrid is initialized, should it load data immediately?
		preselect : false,
		
		colWidths: [225,225,225,225],			// width of each column
		minColWidth: 20,				// minimum column width
		headerHeight: 30,				// height of our header
		headerClass: 'grid-header-bg',			// header bg
		resizableCols: true,				// make columns resizable via drag + drop

		gridClass: 'datagrid',				// class of head & body
		rowClasses: [],					// list of row classes (selected by cursor)
		colClasses: [],					// array of classes : i.e. ['','grid-col-2','','']
		rowHoverClass: 'grid-row-hover',		// hovering over a row? use this class
		rowSelection: true,				// allow row selection?
		rowSelectedClass: 'grid-row-sel',		// selecting a row? use this class
		onRowSelect: function(tr, selected){},			// function to call when row is clicked

		/* sorting */
		sorting: true,
		colSortParams: [],				// value to pass as sort param when header clicked (i.e. '&sort=param') ex: ['col1','col2','col3','col4']
		sortAscParam: 'ASC',				// param passed on ascending sort (i.e. '&dir=ASC)
		sortDescParam: 'DESC',				// param passed on ascending sort (i.e. '&dir=DESC)
		sortedCol: 'col1',				// current data's sorted column (can be a key from 'colSortParams', or an int 0-n (for n columns)
		sortedColDir: 'DESC',				// current sort direction
		sortDefaultDir: 'ASC',				// on 1st click, sort tihs direction
		sortAscClass: 'grid-sort-asc',			// class for ascending sorted col
		sortDescClass: 'grid-sort-desc',		// class for descending sorted col
		sortNoneClass: 'grid-sort-none',		// ... not sorted? use this class
		unsortableCols: [],				// do not make theses columns sortable

		/* paging */
		p_id: null,					 // id of paging toolbar
		paging: true,					// or... create a paging toolbar
		pageNumber: 1,
		pageSaved: true,
		recordsPerPage: 0,
		totalRecords: 0,
		pageToolbarHeight: 25,
		pageToolbarClass: 'grid-page-toolbar',
		pageStartClass: 'grid-page-start',
		pagePrevClass: 'grid-page-prev',
		pageInfoClass: 'grid-page-info',
		pageInputClass: 'grid-page-input',
		pageNextClass: 'grid-page-next',
		pageEndClass: 'grid-page-end',
		pageLoadingClass: 'grid-page-loading',
		pageLoadingDoneClass: 'grid-page-loading-done',
		pageViewingRecordsInfoClass: 'grid-page-viewing-records-info',
		pageChanged: function(p){},			 // called when page changed (loading finished)

		/* ajax stuff */
		url: 'remote.php',						// url to fetch data
		type: 'GET',							// 'POST' or 'GET'
		dataType: 'html',						// 'html' or 'json' - expected dataType returned
		extraParams: {},						// a map of extra params to send to the server
		loadingClass: 'grid-loading',			// loading modalmask div
		loadingHtml: '<div>&nbsp;</div>',
		onLoadStart: function(){},
		onLoadSuccess: function(data){},
		onLoadComplete: function(){},

		/* should seldom change */
		resizeHandleHtml: '',					// resize handle html + css
		resizeHandleClass: 'grid-col-resize',
		scrollbarW: 0,							// width allocated for scrollbar
		columnIDAttr: '_colid',					// attribute name used to groups TDs in columns
		ingridIDPrefix: '_ingrid',				// prefix used to create unique IDs for Ingrid

		/* cookie, for saving state */
		cookieExpiresDays: 1,
		cookiePath: '/',

		/* not yet implemented */
		minHeight: 100,
		resizableGrid: true,
		dragDropCols: true,
		sortType: 'server|client|none',

		/* cfg functions */
		isSortableCol : function(colIndex) {
			if (cfg.unsortableCols.length==0 || jQuery.inArray(colIndex, cfg.unsortableCols)==-1) {
				return true;
			}
			return false;
		}

	};
	jQuery.extend(cfg, o);

	// get total table width
	var total_width = 0;
	for(i=0; i<cfg.colWidths.length; i++) {
		total_width += cfg.colWidths[i];
	}

	var cols = new Array();
	
	// table header
	var h = this.find('thead').height(cfg.headerHeight)
	.addClass(cfg.headerClass)
	.height(cfg.headerHeight)
	.extend({
	  cols : cols
	});


	// initialize columns
	h.find('th').each(function(i){

		// init width
		jQuery(this).width(cfg.colWidths[i]);

		// put column text in a div, make unselectable
		var col_label = jQuery('<div />').html(jQuery(this).html())
		                                 .css("float", "left")
		                                 .css("display", "block")
		                                 .css('-moz-user-select', 'none')
		                                 .css('-khtml-user-select', 'none')
		                                 .css('user-select', 'none')
		                                 .attr('unselectable', 'on');

		// column sorting?
		if (cfg.sorting && cfg.isSortableCol(i)) {

			var key = cfg.colSortParams[i] ? cfg.colSortParams[i] : i;
			// is this column the default sorted column?
			var cls = (key == cfg.sortedCol || i == cfg.sortedCol) ?
									( cfg.sortedColDir == cfg.sortAscParam ? cfg.sortAscClass : cfg.sortDescClass ) :
									( cfg.sortNoneClass );

			col_label.addClass(cls).click(function(){
				var dir = col_label.hasClass(cfg.sortNoneClass) ? cfg.sortDefaultDir
																: ( col_label.hasClass(cfg.sortAscClass) ? cfg.sortDescParam
																										 : cfg.sortAscParam );

				var params = { sort : key, dir : dir };
				if (p) jQuery.extend(params, { page : p.getPage() } );

				g.load( params, function(){
					var cls = col_label.hasClass(cfg.sortNoneClass) ?
											( cfg.sortDefaultDir == cfg.sortAscParam ? cfg.sortAscClass : cfg.sortDescClass ) :
											( col_label.hasClass(cfg.sortAscClass) ? cfg.sortDescClass : cfg.sortAscClass );

					// re-init sortable cols
					var i2 = 0;
					g.getHeaders(function(col){
						col.find('div:first').each(function() {
							if(cfg.isSortableCol(i2++))
								jQuery(this).addClass(cfg.sortNoneClass).removeClass(cfg.sortAscClass).removeClass(cfg.sortDescClass);
						});
					});
					col_label.removeClass(cfg.sortAscClass).removeClass(cfg.sortDescClass).addClass(cls).removeClass(cfg.sortNoneClass);

				});
			});
		}

		// replace contents of <th>
		jQuery(this).html(col_label);

		// bind an event to easily resize columns
		jQuery(this).bind('resizeColumn', {col_num : i}, function(e, w){

			oldtotalw = g.width();

			oldw = jQuery(this).width();
			d = (w - oldw);

			// set new column width
			jQuery(this).width(w);

			// auto enlarge while header is > headerHeight (max 50 times)
			i = 0;
			while(h.height()>cfg.headerHeight) {
				jQuery(this).width(w+=5);
				d = (w - oldw);
				if(++i == 50) break;
			}
						
			// set new global head table width
			g.width( oldtotalw + d );

			// set body cells to this width
			g.resize();
			g.getColumn(e.data.col_num).each(function(){
				jQuery(this).width(w);
			});
		});

		// append resize handle?
		if (cfg.resizableCols) {
			// make column headers resizable
			var handle = jQuery('<div />').html(cfg.resizeHandleHtml == '' ? '-' : cfg.resizeHandleHtml)
										  .addClass(cfg.resizeHandleClass);
			handle.bind('mousedown', function(e){
				// start resize drag
				var th 		= jQuery(this).parent();
				pos = jQuery(this).offset();

				var left  = jQuery(window).scrollLeft()+e.clientX;

				z.resizeStart(th, left, jQuery(this));
			});
			jQuery(this).append(handle);
		}
	});
	
	var b = this.find('tbody').addClass(cfg.gridClass);

	// resizable cols?
	// if so create a vertical resize divider, with unique ID
	if (cfg.resizableCols) {
		var z_sel = 'vertical-resize-divider' + new Date().getTime();
		var z	= jQuery('<div id="' + z_sel + '"></div>')
						.css({
							backgroundColor: '#ababab',
							width: '4px',
							position: 'absolute',
							zIndex: '10',
							display: 'block',
							opacity: '0.5'
						})
						.extend({
							resizeStart : function(th, eventX, resizerobj){
							
								jQuery("body").css('-webkit-user-select', 'none')
								              .css('-khtml-user-select', 'none')
								              .css('-moz-user-select', 'none')
								              .css('-o-user-select', 'none')
								              .css('user-select', 'none');
							
								// this is fired onmousedown of the column's resize handle
								var pos	= th.offset();
								jQuery(this).show().css({
									top: pos.top,
									left: eventX,
									height: (cfg.headerHeight + b.height())
								});
								// when resizing, bind some listeners for mousemove & mouseup events
								jQuery('body').bind('mousemove', {col : th}, function(e){
									// on mousemove, move the vertical-resize-divider
									var th 		= e.data.col;
									var pos		= th.offset();
									var col_w	= jQuery(window).scrollLeft()+e.clientX - pos.left;
									// make sure cursor isn't trying to make column smaller than minimum
									if (col_w > cfg.minColWidth) {
										jQuery('#' + z_sel).css('left', jQuery(window).scrollLeft()+e.clientX);
									}
								});
								jQuery('body').bind('mouseup', {col : th}, function(e){
								
									jQuery("body").css('-webkit-user-select', 'auto')
												  .css('-khtml-user-select', 'normal')
												  .css('-moz-user-select', 'normal')
												  .css('-o-user-select', 'normal')
												  .css('user-select', 'normal');
									
									jQuery(this).unbind('mousemove').unbind('mouseup');
									
									jQuery('#' + z_sel).hide();
									var th 		= e.data.col;
									var pos		= th.offset();
									var col_w	= jQuery(window).scrollLeft()+e.clientX - pos.left;
									
									if (col_w > cfg.minColWidth) {
										th.trigger('resizeColumn', [col_w]);
									} else {
										th.trigger('resizeColumn', [cfg.minColWidth]);
									}
								});
							}
						});
	}
	
	// paging?
	if (cfg.paging) {
		
		var totr  = cfg.recordsPerPage > 0 ? cfg.recordsPerPage : b.find('tr').length;
		
		if (cfg.totalRecords > 0) {
			var totp = Math.ceil(cfg.totalRecords / totr);
		}
		
		var p;	 // paging toolbar
		var pv;	// view info
		var pb1;   // start page
		var pb2;   // prev page
		var pb3;   // next page
		var pb4;   // end page
		var pload; // loading indicator
		var pfld;  // page number
		var pinfo; // page info
		var pform; // form
		
		// paging toolbar id provided
		if( cfg.p_id != null) {
			p = jQuery('#'+cfg.p_id);
			pv = jQuery('.'+cfg.pageViewingRecordsInfoClass);
			pb1 = jQuery('.'+cfg.pageStartClass);
			pb2 = jQuery('.'+cfg.pagePrevClass);
			pb3 = jQuery('.'+cfg.pageNextClass);
			pb4 = jQuery('.'+cfg.pageEndClass);
			if (!cfg.totalRecords > 0) {
				pb4.remove();
			}
			pload = jQuery('.'+cfg.pageLoadingClass);
			pfld = jQuery('.'+cfg.pageInputClass);
			pinfo = jQuery('.'+cfg.pageInfoClass);
			pform = jQuery('#'+cfg.p_id+" form");;
		}
		// or create a paging toolbar
		else {
			p = jQuery('<div />')
			.addClass(cfg.pageToolbarClass)
			.height(cfg.pageToolbarHeight);
			
			pv = jQuery('<div />').addClass(cfg.pageViewingRecordsInfoClass);
			
			pb1	= jQuery('<a href="#bottom">&laquo;</a>').addClass(cfg.pageStartClass);
			pb2	= jQuery('<a href="#bottom">&lt;</a>').addClass(cfg.pagePrevClass);
			pb3	= jQuery('<a href="#bottom">&gt;</a>').addClass(cfg.pageNextClass);
			if (cfg.totalRecords > 0) {
				pb4 = jQuery('<a href="#bottom">&raquo;</a>').addClass(cfg.pageEndClass);
			}
			pload = jQuery('<div />').addClass(cfg.pageLoadingClass);
			pfld = jQuery('<input type="text" value="' + cfg.pageNumber + '"/>').addClass(cfg.pageInputClass);
			pinfo = jQuery('<div />').addClass(cfg.pageInfoClass).append(pfld);
			pform = jQuery('<form></form>').append(pinfo);
			
			p.append(pb1).append(pb2).append(pform).append(pb3).append(pb4).append(pload).append(pv);
		}
		
		// extend paging toolbar
		
		p.extend({
			setPage : function(p){
				var input = this.find('input.' + cfg.pageInputClass);
				pload.removeClass(cfg.pageLoadingDoneClass);
				g.load( {page : p}, function(){
					input.val(p);
					if (cfg.totalRecords > 0) {
						var totr = b.find('tr').length;
						pv.updateViewInfo(totr, p);
						// callback
						if(cfg.pageChanged) {
							cfg.pageChanged(p);
						}
					}
					pload.addClass(cfg.pageLoadingDoneClass);
				});
				return this;
			},
			getPage : function(){
				var page = Number(this.find('input.' + cfg.pageInputClass).val());
				return page;
			}
		});
		
		pv.extend({
			updateViewInfo : function(loaded_rows, page) {
				var _start = ( (cfg.recordsPerPage * (page - 1) + 1) );
				if (cfg.totalRecords > 0) {
					_end   = ( (cfg.recordsPerPage * page) > cfg.totalRecords ? cfg.totalRecords : cfg.recordsPerPage * page );
					this.html('Viewing&nbsp;Rows&nbsp;' + _start + '&nbsp;-&nbsp;' + _end + '&nbsp;of&nbsp;' + cfg.totalRecords);
				} else {
					_end   = _start + cfg.recordsPerPage;
					this.html('Viewing&nbsp;Rows&nbsp;' + _start + '&nbsp;-&nbsp;' + _end);
				}
				return this;
			}
		});
		
		// update the "viewing x of y" record info
		pv.updateViewInfo(totr, cfg.pageNumber);

		pb1.click(function(){
			p.setPage(1);
		});

		pb2.click(function(){
			var _p = p.getPage();
			if (_p > 1) {
				_p--;
				p.setPage(_p);
			}
		});
		
		function nextPage() {
			var _p = p.getPage();
			_p++;
			if (totp) {
				if (_p <= totp) {
					p.setPage(_p);
				}
			} else {
				p.setPage(_p);
			}
		}
		
		pb3.click(nextPage);

		// loading indicator
		pload.addClass(cfg.pageLoadingDoneClass);

		// page field & form
		pfld  = jQuery('<input type="text" value="' + cfg.pageNumber + '"/>').addClass(cfg.pageInputClass);

		pform.submit(function(){
			var _p = parseInt(p.getPage());
			if (_p > 0) {
				if (totp) {
					if (_p <= totp)
						p.setPage(_p);
					else
						p.setPage(totp);
				} else if (_p > 0) {
					p.setPage(_p);
				}
			} else {
				alert('Please enter a valid page number.');
			}
			return false;
		});

		// last page button & info (if we know total records)
		if (cfg.totalRecords > 0) {
			pinfo.html('Page ' + pinfo.html() + ' of ' + totp);
			pb4.click(function(){
				var _p = p.getPage(); _p++;
				if (totp) {
					 if (_p <= totp) p.setPage(totp);
				}
			});
		} else {
			pinfo.html('Page ' + pinfo.html());
		}
		
	}

	// create a container div to for our main grid object
	// append & extend grid {g} with header {h}, body {b}, paging {p}, resize handle {z}
	
	var g = jQuery('<table cellpadding="0" cellspacing="0"></table>')
	.width( total_width )
	.addClass(cfg.gridClass)
	.append(h).append(b)
	.extend({
		h : h,
		b : b
	});

	if (cfg.paging) {
		
		if(total_width > 400) {
			p.width(total_width);
		}
		g.extend({ p : p });
	}
	if (cfg.resizableCols) {
		g.extend({ z : z });
	}

	// create some other piece-parts, like
	// ...a gap filler to fill gap over scrollport
	var gap = jQuery('<div />').width(cfg.scrollbarW).addClass(cfg.headerClass).height(cfg.headerHeight).css({
		position: 'absolute',
		zIndex: '0'
	}).appendTo(g);
	// ...a loading modal mask
	var modalmask = jQuery('<div />').html(cfg.loadingHtml).addClass(cfg.loadingClass).css({
		position: 'absolute',
		zIndex: '1000'
	}).appendTo(g).hide();

	// create methods on our grid object
	g.extend({

		selected_ids : [],

		load : function(params, cb) {
			cfg.onLoadStart();
			var data = jQuery.extend(cfg.extraParams, params);

			// show loading canvas
			modalmask.width(b.width()).height(b.height()).show();
			pload.addClass(cfg.pageLoadingClass);

			// save selected rows
			g.saveSelectedRows();

			jQuery.ajax({
				type: cfg.type.toUpperCase(),
				url: cfg.url + "&rand="+Math.random(),
				data: data,
				success: function(result){
					cfg.onLoadSuccess(result);
					if(result == "") {
						g.clear();
						pv.html("An error has occured.");
						alert("An error has occured.");
						return;
					}
					// for JSON return type
					if (cfg.dataType == 'json') {
						var rows  = eval( '(' + result + ')' );
						alert('json = ' + rows);
					}
					// for HTML (Table) return type
					if (cfg.dataType == 'html') {
						var tmp = jQuery("<div />").html(result);
						var $tbl = tmp.find("tbody");
						var row  = $tbl.find('tr:first');
						if ( jQuery(row).find('td').length == cfg.colWidths.length ) {
							// setting width on first row keeps it from "blinking"
							jQuery(row).find('td').each(function(i){
								jQuery(this).width( g.getHeader(i).css('width') );
							});
							// now swap the tbody's
							b.html($tbl.html());
							g.initStylesAndWidths();
							
							pb3.click(nextPage);

							var totr = b.find('tr').length;
							if(!data.page) {
								data.page = 1;
							}
							pv.updateViewInfo(totr, data.page);

							// remember the last loaded state for this grid?
							g.saveState(data);

						} else if (row.length < 1) {
							// no rows returned
							g.clear();
							pv.html("No result found.");
							alert("No result found.");
							// disable next page button
							pb3.unbind("click");
						} else {
							// inconsistent results... too many (or too few) columns returned
							g.clear();
							pv.html("Error: inconsistent result.");
							alert("Error: inconsistent result");
						}
					}
					if (cb) cb();
				},
				error: function(req, status, ex){
					pv.html("An error occured.");
				},
				complete: function(){
					modalmask.hide();
					pload.removeClass(cfg.pageLoadingClass);
					pload.addClass(cfg.pageLoadingDoneClass);
					cfg.onLoadComplete();
				}
			});
			return this;
		},
		reload: function(){
			g.load();
		},
		
		clear: function() {
			modalmask.hide();
			b.html('<tr><td colspan="'+cols.length+'"></td></tr>');
		},

		// returns JSON
		getState : function() {

			/*
			alert(this + ' ...is jQuery')
			alert(this[0] + ' ...is the div, id="' + this.attr('id') + '"')
			*/
			var props = {
				url : 'nothing'
			};
			return props;
		},

		saveState : function(data){

			if (jQuery.cookie && cfg.saveState) {
				// save page #, column sort & dir
				var g_id  		= this.attr('id');
				var param_str = 'page=' + data.page + ',sort=' + data.sort + ',dir=' + data.dir;
				jQuery.cookie(g_id, param_str, {expires: cfg.cookieExpiresDays, path: cfg.cookiePath});
			}

		},

		saveSelectedRows : function() {
			if (jQuery.cookie) {
				var row_ids = g.selected_ids;
				if(row_ids.length > 0)
					jQuery.cookie( this.attr('id') + '_rows', row_ids.join(','), {expires: cfg.cookieExpiresDays, path: cfg.cookiePath});
			}
		},

		// returns <th> els
		getHeaders : function(cb) {
			var ths = this.find('th');
			if (cb) {
				ths.each(function(){
					cb(jQuery(this));
				});
				return this;
			} else {
				return ths;
			}
		},

		// returns single <th> el
		getHeader : function(i, cb) {
			var th = this.find('th').slice(i, i+1);
			if (cb) {
				cb(jQuery(this));
				return this;
			} else {
				return th;
			}
		},

		// returns <td> els in column i
		getColumn : function(i, cb) {
			var tds = this.find("tbody td[" + cfg.columnIDAttr + "='" + i + "']");
			if (cb) {
				tds.each(function(){
					cb(jQuery(this));
				});
				return this;
			} else {
				return tds;
			}
		},

		// returns <tr> els
		getRows : function(cb) {
			var trs = this.find("tbody tr");
			if (cb) {
				trs.each(function(){
					cb(jQuery(this));
				});
				return this;
			} else {
				return trs;
			}
		},

		// returns <tr> els
		getSelectedRows : function() {
			return this.find("tbody tr[_selected='true']");
		},

		unSelectAll : function() {
			g.getSelectedRows().each(function() {
				jQuery(this).attr("_selected", "true");
				jQuery(this).click();
			});
		},

		selectAll : function() {
			this.find("tbody tr").each(function() {
				jQuery(this).attr("_selected", "false");
				jQuery(this).click();
			});
		},

		// returns an array of IDs (saved in cookie)
		getSavedRowIds : function() {
			var row_ids = [];
			if (jQuery.cookie) {
				var str_ids = jQuery.cookie( this.attr('id') + '_rows' );
				if (str_ids) row_ids = str_ids.split(',');
			}
			return row_ids;
		},

		// return an array of all selected rows
		getSelectedIds : function() {
			return g.selected_ids;
		},
		
		removeSelectedId : function(id) {
			sid = String(id);
			var idx = jQuery.inArray(sid, g.selected_ids);
			if(idx != -1) {
				g.selected_ids.splice(idx, 1);
			}
		},

		resize : function() {
			// set body table width based on header table
			// minimize calls to width() and offset()

			var outer_w = g.width();
			b.width(outer_w);

			if (cfg.paging && outer_w > 400) p.width(outer_w);

			if (gap) {
				var pos = h.offset();
				gap.css('left', outer_w - cfg.scrollbarW + pos.left).css('top', pos.top);
			}
		},

		initStylesAndWidths : function() {

			var colWidths = new Array();
			this.getHeaders().each(function(i){
				colWidths[i] = jQuery(this).css('width');
			});

			// make one pass of the grid,
			// initialize properties on rows & columns

			// pre-selected rows
			if(cfg.preselect)
				g.selected_ids = g.getSavedRowIds();

			this.getRows().each(function(r){

				// custom row styles (striping, etc) & hover
				if (cfg.rowClasses.length > 0) {
					var cursor = (r == 0 ? 0 : r % cfg.rowClasses.length);
					if (cfg.rowClasses[cursor] != '') {
						// custom row class
						jQuery(this).addClass(cfg.rowClasses[cursor]);
					}
					if (cfg.rowHoverClass != '') {
						// hover class
						jQuery(this).hover(
							function() {
								if (jQuery(this).attr('_selected') != 'true')
									jQuery(this).removeClass(cfg.rowClasses[cursor]).addClass(cfg.rowHoverClass);
							},
							function() {
								if (jQuery(this).attr('_selected') != 'true')
									jQuery(this).removeClass(cfg.rowHoverClass).addClass(cfg.rowClasses[cursor]);
							}
						);
					}
				}

				// setup column IDs & classes on row's cells
				jQuery(this).find('td').each(function(i){
					// column IDs & width
					// wrap the cell text in a div with overflow hidden, so cells aren't stretched wider by long text

					jQuery(this).attr(cfg.columnIDAttr, i).width(colWidths[i]).css('overflow', 'hidden');
					
					// column colors
					if (cfg.colClasses.length > 0) {
						if (cfg.colClasses[i] != '') {
							jQuery(this).addClass(cfg.colClasses[i]);
						}
					}
				});

				// selection behavior
				if (cfg.rowSelection == true) {
					jQuery(this).click(function() {
						// test array state
						isAlreadySelected = jQuery(this).attr('id') != undefined && jQuery.inArray(jQuery(this).attr('id'), g.selected_ids) != -1;
						// test view state
						if (jQuery(this).attr('_selected') && jQuery(this).attr('_selected') == 'true') {
							// switch to unselected state
							jQuery(this).attr('_selected', 'false').removeClass(cfg.rowSelectedClass);
							// remove from selected_ids array
							if(isAlreadySelected)
								g.removeSelectedId(jQuery(this).attr('id'));
						} else {
							// switch to selected state
							jQuery(this).attr('_selected', 'true').addClass(cfg.rowSelectedClass);
							// push to selected_ids array
							if(!isAlreadySelected)
								g.selected_ids.push(jQuery(this).attr('id'));
						}

						// callback
						cfg.onRowSelect(this, (jQuery(this).attr('_selected') == 'true') );
					});

					// previously selected rows
					if (jQuery(this).attr('id')!=undefined && jQuery.inArray(jQuery(this).attr('id'), g.selected_ids) != -1) {
						// switch to selected state
						jQuery(this).attr('_selected', 'true').addClass(cfg.rowSelectedClass);
						// push to selected_ids array
						if(jQuery(this).attr('id') == undefined || jQuery.inArray(jQuery(this).attr('id'), g.selected_ids) == -1)
							g.selected_ids.push(jQuery(this).attr('id'));
						// callback
						cfg.onRowSelect(this, true);
					}
				}
			});
		}
	});

	// don't break the chain
	// return a modified & extended jQ table object.
	// here,
	// 	this	 ...is jQuery
	// 	this[0]  ...is a table

	/*
			alert(this + ' ...is jQuery')
			alert(this[0] + ' ...is a table')
			alert(this.length + ' = total tables matched to selector')
	*/

	return this.each(function(tblIter){
		// fires for each table[tblIter].
		// for each one,
		// 	this	 ...is a table

		/*
		alert(this + ' ...is a table [' + tblIter + '] , id="' + jQuery(this).attr('id') + '"')
		alert(g[0] + ' ...is the grid div html');
		*/

		// append to doc
		var g_id = 	cfg.ingridIDPrefix + '_' + jQuery( this ).attr('id') + '_' + tblIter;
		g.attr( 'id', g_id );
		
		var ok = jQuery("<div />").append(g[0]);
		
		
		if(cfg.paging && cfg.p_id == null)
			ok.append(p);
		if(cfg.resizableCols)
			ok.append(z.hide());
		jQuery( this ).replaceWith( ok );

		// init grid styles, etc
		g.initStylesAndWidths();

		// sync grid size to headers
		g.resize();

		// place the mask accordingly
		modalmask.width( h.width() + cfg.scrollbarW ).height(b.height()).css({
			top: b.offset().top,
			left: b.offset().left
		});

		// load it up?
		if (cfg.savedStateLoad && jQuery.cookie) {
			var param_str = jQuery.cookie(g_id);
			if (!param_str) {
				g.load();
				cfg.initialLoad = false;
			} else {
				// we have a saved state for this grid_id
				var pairs  	= param_str.split(',');
				var params 	= {};
				var hash  	= [];
				for (i=0; i<pairs.length; i++) {
					var prop = pairs[i].split('=');
					hash[prop[0]] = prop[1];
				}
				if (hash['page'].toLowerCase() != 'undefined' && cfg.paging && cfg.pageSaved) {
					params.page = hash['page'];
					p.find('input.' + cfg.pageInputClass).val(params.page);
				}
				if (hash['sort'].toLowerCase() != 'undefined' &&
						hash['dir'].toLowerCase() != 'undefined') {

					params.sort = hash['sort'];
					params.dir 	= hash['dir'];
					var colid = params.sort;
					// perhaps the sort param is a key, if so, get the id for that key
					if (cfg.colSortParams.length > 0) {
						for (i=0; i<cfg.colSortParams; i++) {
							if (cfg.colSortParams[i] == params.sort) {
								colid = i;
								break;
							}
						}
					}

					// set appropriate style on sorted column
					// perhaps we should bind an event to the column <th>, like setSort()?
					// (re-init sortable cols)
					var i2 = 0;
					g.getHeaders(function(col){
						col.find('div:first').each(function() {
							if(cfg.isSortableCol(i2++))
								g.getHeaders(function(th){
									jQuery(this).addClass(cfg.sortNoneClass).removeClass(cfg.sortAscClass).removeClass(cfg.sortDescClass);
								});
						});
					});
					// all this prevents the column from being style-less (and blinking)
					g.getHeader(parseInt(colid)).find('div:first').addClass(cfg.sortNoneClass).removeClass(cfg.sortAscClass).removeClass(cfg.sortDescClass)
																							  .addClass( params.dir == cfg.sortAscParam ? cfg.sortAscClass : cfg.sortDescClass )
																							  .removeClass(cfg.sortNoneClass);
				}
				if ( params.page || params.sort || params.dir ) {
					g.load(params);
					cfg.initialLoad = false;
				}
			}
		}

		if (cfg.initialLoad) {
			g.load();
		}

	}).extend({

		cfg : cfg,
		g : g

	});

};