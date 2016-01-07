| **parameter** | **default value** | **description**  |
|:--------------|:------------------|:-----------------|
| saveState     | FALSE             |                  |
| savedStateLoad  | FALSE             |  when Ingrid is initialized, should it load data from a previously saved state? |
| initialLoad   | FALSE             |  when Ingrid is initialized, should it load data immediately? |
| preselect     | FALSE             |                  |

| colWidths | [225,225,225,225] |  width of each column  |
|:----------|:------------------|:-----------------------|
| minColWidth | 20                |  minimum column width  |
| headerHeight | 30                |  height of our header  |
| headerClass | grid-header-bg    |  header bg             |
| resizableCols | TRUE              |  make columns resizable via drag + drop  |

| gridClass | datagrid |  class of head & body  |
|:----------|:---------|:-----------------------|
| rowClasses | [.md](.md) |  list of row classes (selected by cursor)  |
| colClasses | [.md](.md) |  array of classes : i.e. ['','grid-col-2','','']  |
| rowHoverClass | grid-row-hover |  hovering over a row? use this class  |
| rowSelection | TRUE     |  allow row selection?  |
| rowSelectedClass | grid-row-sel |  selecting a row? use this class  |
| onRowSelect | function(tr, selected){} |  function to call when row is clicked  |

| sorting | true, |   |
|:--------|:------|:--|
| colSortParams | [.md](.md) |  value to pass as sort param when header clicked (i.e. '&sort=param') ex: ['col1','col2','col3','col4']  |
| sortAscParam | ASC   |  param passed on ascending sort (i.e. '&dir=ASC)  |
| sortDescParam | DESC  |  param passed on ascending sort (i.e. '&dir=DESC)  |
| sortedCol | col1  |  current data's sorted column (can be a key from 'colSortParams', or an int 0-n (for n columns)  |
| sortedColDir | DESC  |  current sort direction  |
| sortDefaultDir | ASC   |  on 1st click, sort tihs direction  |
| sortAscClass | grid-sort-asc |  class for ascending sorted col  |
| sortDescClass | grid-sort-desc |  class for descending sorted col  |
| sortNoneClass | grid-sort-none |  ... not sorted? use this class  |
| unsortableCols | [.md](.md) |  do not make theses columns sortable  |

| p\_id | null |  id of existent paging toolbar  |
|:------|:-----|:--------------------------------|
| paging | TRUE |  paging toolbar enabled?        |
| pageNumber | 1    |                                 |
| pageSaved | TRUE |                                 |
| recordsPerPage | 0    |                                 |
| totalRecords | 0    |                                 |
| pageToolbarHeight | 25   |                                 |
| pageToolbarClass | grid-page-toolbar |                                 |
| pageStartClass | grid-page-start |                                 |
| pagePrevClass | grid-page-prev |                                 |
| pageInfoClass | grid-page-info |                                 |
| pageInputClass | grid-page-input |                                 |
| pageNextClass | grid-page-next |                                 |
| pageEndClass | grid-page-end |                                 |
| pageLoadingClass | grid-page-loading |                                 |
| pageLoadingDoneClass | grid-page-loading-done |                                 |
| pageViewingRecordsInfoClass | grid-page-viewing-records-info |                                 |
| pageChanged | function(p){} |  called when page changed (loading finished)  |

| url | remote.php |  url to fetch data  |
|:----|:-----------|:--------------------|
| type | GET        |  'POST' or 'GET'    |
| dataType | html       |  'html' or 'json' - expected dataType returned  |
| extraParams | {}         |  a map of extra params to send to the server  |
| loadingClass | grid-loading |  loading modalmask div  |
| loadingHtml | <div>&nbsp <table><thead><th> </div>',            </th></thead><tbody>
<tr><td> onLoadStart </td><td> function(){}, </td><td>                     </td></tr>
<tr><td> onLoadSuccess </td><td> function(data){}, </td><td>                     </td></tr>
<tr><td> onLoadComplete </td><td> function(){}, </td><td>                     </td></tr></tbody></table>

| resizeHandleHtml | | resize handle html + css  |
|:-----------------|:|:--------------------------|
| resizeHandleClass | grid-col-resize |                           |
| scrollbarW       | 0 |  width allocated for scrollbar  |
| columnIDAttr     | _colid_|  attribute name used to groups TDs in columns  |
| ingridIDPrefix   | _ingrid_|  prefix used to create unique IDs for Ingrid  |

| cookieExpiresDays | 1 |   |
|:------------------|:--|:--|
| cookiePath        | / |   |