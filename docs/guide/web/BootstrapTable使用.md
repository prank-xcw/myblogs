---
title: BootstrapTable使用
categories: web
abbrlink: c35b5ee2
tags:
  - web
  - BootstrapTable
---







## 表格参数：



|          名称          |              标签              |   类型   | 默认                                                         | 描述                                                         |
| :--------------------: | :----------------------------: | :------: | :----------------------------------------------------------- | :----------------------------------------------------------- |
|           -            |          data-toggle           |  String  | ‘table’                                                      | 不用写 JavaScript 直接启用表格。                             |
|        classes         |          data-classes          |  String  | ‘table table-hover’                                          | 表格的类名称。默认情况下，表格是有边框的，你可以添加 ‘table-no-bordered’ 来删除表格的边框样式。 |
|       sortClass        |        data-sort-class         |  String  | undefined                                                    | 被排序的td标签的class名                                      |
|         height         |          data-height           |  Number  | undefined                                                    | 定义表格的高度。                                             |
|     undefinedText      |      data-undefined-text       |  String  | ‘-‘                                                          | 当数据为 undefined 时显示的字符                              |
|        striped         |          data-striped          | Boolean  | false                                                        | 设置为 `true` 会有隔行变色效果                               |
|        sortName        |         data-sort-name         |  String  | undefined                                                    | 定义排序列,通过url方式获取数据填写字段名，否则填写下标       |
|       sortOrder        |        data-sort-order         |  String  | ‘asc’                                                        | 定义排序方式 ‘asc’ 或者 ‘desc’                               |
|       sortStable       |        data-sort-stable        | Boolean  | false                                                        | 设置为 `true` 将获得稳定的排序，我们会添加`_position`属性到 row 数据中。 |
|      iconsPrefix       |       data-icons-prefix        |  String  | ‘glyphicon’                                                  | 定义字体库 (‘Glyphicon’ or ‘fa’ for FontAwesome),使用”fa”时需引用 FontAwesome，并且配合 icons 属性实现效果Glyphicon 集成于Bootstrap可免费使用 参考：http://glyphicons.com/ FontAwesome 参考：http://fortawesome.github.io/ |
|         icons          |           data-icons           |  Object  | { paginationSwitchDown: ‘glyphicon-collapse-down icon-chevron-down’, paginationSwitchUp: ‘glyphicon-collapse-up icon-chevron-up’, refresh: ‘glyphicon-refresh icon-refresh’ toggle: ‘glyphicon-list-alt icon-list-alt’ columns: ‘glyphicon-th icon-th’ detailOpen: ‘glyphicon-plus icon-plus’ detailClose: ‘glyphicon-minus icon-minus’ } | 自定义图标                                                   |
|        columns         |               -                |  Array   | []                                                           | 列配置项,详情请查看 列参数 表格.                             |
|          data          |               -                |  Array   | []                                                           | 加载json格式的数据                                           |
|          ajax          |           data-ajax            | Function | undefined                                                    | 自定义 AJAX 方法,须实现 jQuery AJAX API                      |
|         method         |          data-method           |  String  | ‘get’                                                        | 服务器数据的请求方式 ‘get’ or ‘post’                         |
|          url           |            data-url            |  String  | undefined                                                    | 服务器数据的加载地址                                         |
|         cache          |           data-cache           | Boolean  | true                                                         | 设置为 `true` 禁用 AJAX 数据缓存                             |
|      contentType       |       data-content-type        |  String  | ‘application/json’                                           | 发送到服务器的数据编码类型                                   |
|        dataType        |         data-data-type         |  String  | ‘json’                                                       | 服务器返回的数据类型                                         |
|      ajaxOptions       |       data-ajax-options        |  Object  | {}                                                           | 提交ajax请求时的附加参数，可用参数列请查看http://api.jquery.com/jQuery.ajax. |
|      queryParams       |       data-query-params        | Function | function(params) { return params; }                          | 请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数 如果 queryParamsType = ‘limit’ ,返回参数必须包含 limit, offset, search, sort, order否则, 需要包含:  pageSize, pageNumber, searchText, sortName, sortOrder. 返回false将会终止请求 |
|    queryParamsType     |     data-query-params-type     |  String  | ‘limit’                                                      | 设置为 ‘limit’ 则会发送符合 RESTFul 格式的参数.              |
|    responseHandler     |     data-response-handler      | Function | function(res) { return res; }                                | 加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。 |
|       pagination       |        data-pagination         | Boolean  | false                                                        | 设置为 `true` 会在表格底部显示分页条                         |
|     paginationLoop     |      data-pagination-loop      | Boolean  | true                                                         | 设置为 `true` 启用分页条无限循环的功能。                     |
|   onlyInfoPagination   |   data-only-info-pagination    | Boolean  | false                                                        | 设置为 `true` 只显示总数据数，而不显示分页按钮。需要 pagination=’True’ |
|     sidePagination     |      data-side-pagination      |  String  | ‘client’                                                     | 设置在哪里进行分页，可选值为 ‘client’ 或者 ‘server’。设置 ‘server’时，必须设置 服务器数据地址（url）或者重写ajax方法 |
|       pageNumber       |        data-page-number        |  Number  | 1                                                            | 如果设置了分页，首页页码                                     |
|        pageSize        |         data-page-size         |  Number  | 10                                                           | 如果设置了分页，页面数据条数                                 |
|        pageList        |         data-page-list         |  Array   | [10, 25, 50, 100, All]                                       | 如果设置了分页，设置可供选择的页面数据条数。设置为All 则显示所有记录。 |
|     selectItemName     |     data-select-item-name      |  String  | ‘btSelectItem’                                               | radio or checkbox 的字段名                                   |
|      smartDisplay      |       data-smart-display       | Boolean  | true                                                         | 设置为 `true`可以在分页和卡片视图快速切换                    |
|         escape         |          data-escape           | Boolean  | false                                                        | 转义HTML字符串，替换 `&`, `<`, `>`, `"`, ```, 和 `'`字符.    |
|         search         |          data-search           | Boolean  | false                                                        | 是否启用搜索框                                               |
|    searchOnEnterKey    |    data-search-on-enter-key    | Boolean  | false                                                        | 设置为 `true`时，按回车触发搜索方法，否则自动触发搜索方法    |
|      strictSearch      |       data-strict-search       | Boolean  | false                                                        | 设置为 `true`启用 全匹配搜索，否则为模糊搜索                 |
|       searchText       |        data-search-text        |  String  | ”                                                            | 初始化搜索文字                                               |
|     searchTimeOut      |      data-search-time-out      |  Number  | 500                                                          | 设置搜索超时时间                                             |
|      trimOnSearch      |      data-trim-on-search       | Boolean  | true                                                         | 设置为 `true` 将允许空字符搜索                               |
|       showHeader       |        data-show-header        | Boolean  | true                                                         | 是否显示列头                                                 |
|       showFooter       |        data-show-footer        | Boolean  | false                                                        | 是否显示列脚                                                 |
|      showColumns       |       data-show-columns        | Boolean  | false                                                        | 是否显示 内容列下拉框                                        |
|      showRefresh       |       data-show-refresh        | Boolean  | false                                                        | 是否显示 刷新按钮                                            |
|       showToggle       |        data-show-toggle        | Boolean  | false                                                        | 是否显示 切换试图（table/card）按钮                          |
|  showPaginationSwitch  |  data-show-pagination-switch   | Boolean  | false                                                        | 是否显示 数据条数选择框                                      |
|  minimumCountColumns   |   data-minimum-count-columns   |  Number  | 1                                                            | 当列数小于此值时，将隐藏内容列下拉框。                       |
|        idField         |         data-id-field          |  String  | undefined                                                    | 指定主键列                                                   |
|        uniqueId        |         data-unique-id         |  String  | undefined                                                    | 为每一行指定唯一的标识符                                     |
|        cardView        |         data-card-view         | Boolean  | false                                                        | 设置为 `true`将显示card视图，适用于移动设备。否则为table试图，适用于pc |
|       detailView       |        data-detail-view        | Boolean  | false                                                        | 设置为 `true` 可以显示详细页面模式。                         |
|    detailFormatter     |     data-detail-formatter      | Function | function(index, row) { return ”; }                           | 格式化详细页面模式的视图。                                   |
|      searchAlign       |       data-search-align        |  String  | ‘right’                                                      | 指定 搜索框 水平方向的位置。’left’ or ‘right’                |
|      buttonsAlign      |       data-buttons-align       |  String  | ‘right’                                                      | 指定 按钮 水平方向的位置。’left’ or ‘right’                  |
|      toolbarAlign      |       data-toolbar-align       |  String  | ‘left’                                                       | 指定 toolbar 水平方向的位置。’left’ or ‘right’               |
|    paginationVAlign    |    data-pagination-v-align     |  String  | ‘bottom’                                                     | 指定 分页条 在垂直方向的位置。’top’ or ‘bottom’ or ‘bonth’   |
|    paginationHAlign    |    data-pagination-h-align     |  String  | ‘right’                                                      | 指定 分页条 在水平方向的位置。’left’ or ‘right’              |
| paginationDetailHAlign | data-pagination-detail-h-align |  String  | ‘left’                                                       | 指定 分页详细信息 在水平方向的位置。’left’ or ‘right’        |
|   paginationPreText    |    data-pagination-pre-text    |  String  | ‘<’                                                          | 指定分页条中上一页按钮的图标或文字                           |
|   paginationNextText   |   data-pagination-next-text    |  String  | ‘>’                                                          | 指定分页条中下一页按钮的图标或文字                           |
|     clickToSelect      |      data-click-to-select      | Boolean  | false                                                        | 设置true 将在点击行时，自动选择rediobox 和 checkbox          |
|      singleSelect      |       data-single-select       | Boolean  | false                                                        | 设置True 将禁止多选                                          |
|        toolbar         |          data-toolbar          |  String  | undefined                                                    | 一个jQuery 选择器，指明自定义的toolbar 例如: #toolbar, .toolbar. |
|     checkboxHeader     |      data-checkbox-header      | Boolean  | true                                                         | 设置false 将在列头隐藏check-all checkbox .                   |
|    maintainSelected    |     data-maintain-selected     | Boolean  | false                                                        | 设置为 `true` 在点击分页按钮或搜索按钮时，将记住checkbox的选择项 |
|        sortable        |         data-sortable          | Boolean  | true                                                         | 设置为`false` 将禁止所有列的排序                             |
|       silentSort       |        data-silent-sort        | Boolean  | true                                                         | 设置为 `false` 将在点击分页按钮时，自动记住排序项。仅在 sidePagination设置为 `server`时生效. |
|        rowStyle        |         data-row-style         | Function | function(row,index) { return class; }                        | 自定义行样式 参数为： row: 行数据 index: 行下标 返回值可以为class或者css |
|     rowAttributes      |      data-row-attributes       | Function | function(row,index) { return attributes; }                   | 自定义行属性 参数为： row: 行数据 index: 行下标 返回值可以为class或者css 支持所有自定义属性 |
|      customSearch      |       data-custom-search       | Function | $.noop                                                       | 执行自定义搜索功能而不是内置搜索功能，需要一个参数：text: 搜索文本如：<br/>function customSearch(text) {                //Search logic here.                <br/>//You must use `this.data` array in order <br/>// to filter the data. NO use `this.options.data`.            <br/>} |
|       customSort       |        data-custom-sort        | Function | $.noop                                                       | 执行自定义排序函数而不是内置排序函数，需要两个参数：  sortName: 排序名称 sortOrder: 排序顺序 如:<br/>function customSort(sortName, sortOrder) {                //Sort logic here.                //You must use `this.data` array in  //order to sort the data. NO use `this.options.data`.            }            ` |





## 字段参数：



|      名称       |          标签          |             类型              |   默认    |                             描述                             |
| :-------------: | :--------------------: | :---------------------------: | :-------: | :----------------------------------------------------------: |
|      radio      |       data-radio       |            Boolean            |   false   |                      是否显示单选radio                       |
|    checkbox     |     data-checkbox      |            Boolean            |   false   |                     是否显示多选checkbox                     |
|      field      |       data-field       |            String             | undefined |                    该列映射的data的参数名                    |
|      title      |       data-title       |            String             | undefined |                         该列的表头名                         |
|  titleTooltip   |   data-title-tooltip   |            String             | undefined |                   该列表头的title提示文本                    |
|      class      |   class / data-class   |            String             | undefined |                         该列的class                          |
|     rowspan     | rowspan / data-rowspan |            Number             | undefined |                  合并单元格时定义合并多少行                  |
|     colspan     | colspan / data-colspan |            Number             | undefined |                  合并单元格时定义合并多少列                  |
|      align      |       data-align       |            String             | undefined |       设置该列数据如何对齐，’left’, ‘right’, ‘center’        |
|     halign      |      data-halign       |            String             | undefined |       table header对齐方式， ‘left’, ‘right’, ‘center’       |
|     falign      |      data-falign       |            String             | undefined |       table footer对齐方式， ‘left’, ‘right’, ‘center’       |
|     valign      |      data-valign       |            String             | undefined |      单元格（cell）对齐方式. ‘top’, ‘middle’, ‘bottom’       |
|      width      |       data-width       | Number {Pixels or Percentage} | undefined |     列的宽度，可以使用像素或者百分比，不带单位则默认为px     |
|    sortable     |     data-sortable      |            Boolean            |   false   |                该列是否排序（表头显示双箭头）                |
|      order      |       data-order       |            String             |   ‘asc’   |            该列默认的排序方式， ‘asc’ or ‘desc’.             |
|     visible     |      data-visible      |            Boolean            |   true    |                         该列是否可见                         |
|   cardVisible   |   data-card-visible    |            Boolean            |   true    |                     在card视图里是否可见                     |
|   switchable    |    data-switchable     |            Boolean            |   true    |                       列切换是否可见.                        |
|  clickToSelect  |  data-click-to-select  |            Boolean            |   true    |          是否选中checkbox或者radio，当该列被选择时           |
|    formatter    |     data-formatter     |           Function            | undefined | 格式化单元格内容，function(value, row, index), value：该cell本来的值，row：该行数据，index：该行序号（从0开始） |
| footerFormatter | data-footer-formatter  |           Function            | undefined |      格式化footer内容，function(rows)，rows：所有行数据      |
|     events      |      data-events       |            Object             | undefined | The cell 的事件监听，当你使用formatter function的时候,有三个参数:event: the jQuery event. value: 该cell的值 row: 该行的数据 index: 该行的序号 |
|     sorter      |      data-sorter       |           Function            | undefined |              自定义字段排序函数，function(a, b)              |
|    sortName     |     data-sort-name     |            String             | undefined | 当列中有html等标签时，只排序实际内容（忽略标签和样式），例如字段为：”**abc**“，则sortName=abc |
|    cellStyle    |    data-cell-style     |           Function            | undefined | 单元格样式，支持css和classes，function(value, row, index) value:该cell的值 row: 该行的数据 index: 该行的序号 |
|   searchable    |    data-searchable     |            Boolean            |   true    |                      搜索时是否搜索此列                      |
| searchFormatter | data-search-formatter  |            Boolean            |   true    |      搜索是否使用格式化后的数据（即显示在页面上的数据）      |





## 事件：



```javascript
$('#table').bootstrapTable({
    onEventName: function (arg1, arg2, ...) {
        // ...
    }
});
 
$('#table').on('event-name.bs.table', function (e, arg1, arg2, ...) {
    // ...
});
```

|   Option 事件    |       jQuery 事件        |            参数             | 描述                                                         |
| :--------------: | :----------------------: | :-------------------------: | :----------------------------------------------------------- |
|      onAll       |       all.bs.table       |         name, args          | 所有的事件都会触发该事件，参数包括： name：事件名， args：事件的参数。 |
|    onClickRow    |    click-row.bs.table    |        row, $element        | 当用户点击某一行的时候触发，参数包括： row：点击行的数据， $element：tr 元素， field：点击列的 field 名称。 |
|  onDblClickRow   |  dbl-click-row.bs.table  |        row, $element        | 当用户双击某一行的时候触发，参数包括： row：点击行的数据， $element：tr 元素， field：点击列的 field 名称。 |
|   onClickCell    |   click-cell.bs.table    | field, value, row, $element | 当用户点击某一列的时候触发，参数包括： field：点击列的 field 名称， value：点击列的 value 值， row：点击列的整行数据， $element：td 元素。 |
|  onDblClickCell  | dbl-click-cell.bs.table  | field, value, row, $element | 当用户双击某一列的时候触发，参数包括： field：点击列的 field 名称， value：点击列的 value 值， row：点击列的整行数据， $element：td 元素。 |
|      onSort      |      sort.bs.table       |         name, order         | 当用户对列进行排序时触发，参数包含： name: 排序列字段名 order: 排序列的顺序 |
|     onCheck      |      check.bs.table      |             row             | 当用户检查行时触发，参数包含： row: 与单击的行对应的记录. $element: 选中DOM元素. |
|    onUncheck     |     uncheck.bs.table     |             row             | 在用户取消选中行时触发，参数包含：  row: 与单击的行对应的记录. $element: 取消选中DOM元素. |
|    onCheckAll    |    check-all.bs.table    |            rows             | 当用户检查所有行时触发，参数包含： rows: 与新检查的行对应的记录数组 |
|   onUncheckAll   |   uncheck-all.bs.table   |            rows             | 当用户取消选中所有行时触发，参数包含： rows:与先前检查的行对应的记录数组 |
|   onCheckSome    |   check-some.bs.table    |            rows             | 当用户检查某些行时触发，参数包含：  rows: 与先前检查的行对应的记录数组. |
|  onUncheckSome   |  uncheck-some.bs.table   |            rows             | 当用户取消选中某些行时触发，参数包含： rows: 与先前检查的行对应的记录数组. |
|  onLoadSuccess   |  load-success.bs.table   |            data             | 在成功加载远程数据时触发                                     |
|   onLoadError    |   load-error.bs.table    |           status            | 在加载远程数据时发生某些错误时触发.                          |
|  onColumnSwitch  |  column-switch.bs.table  |       field, checked        | 切换列可见时触发.                                            |
|  onColumnSearch  |  column-search.bs.table  |         field, text         | 在按列搜索时触发                                             |
|   onPageChange   |   page-change.bs.table   |        number, size         | 更改页码或页面大小时触发.                                    |
|     onSearch     |     search.bs.table      |            text             | 在搜索表时触发.                                              |
|     onToggle     |     toggle.bs.table      |          cardView           | 切换表视图时触发.                                            |
|    onPreBody     |    pre-body.bs.table     |            data             | 在呈现表体之前触发                                           |
|    onPostBody    |    post-body.bs.table    |            none             | 在表体表示并在DOM中可用之后触发                              |
|   onPostHeader   |   post-header.bs.table   |            none             | 在表头之后触发，并在DOM中可用                                |
|   onExpandRow    |   expand-row.bs.table    |     index, row, $detail     | 当点击详细图标展开详细页面的时候触发。                       |
|  onCollapseRow   |  collapse-row.bs.table   |         index, row          | 当点击详细图片收起详细页面的时候触发。                       |
| onRefreshOptions | refresh-options.bs.table |           options           | 在刷新选项之后和在销毁和初始化表之前触发.                    |
|    onRefresh     |     refresh.bs.table     |           params            | 单击刷新按钮后触发.                                          |





## 方法：



|       名称        |      参数      |                             描述                             |
| :---------------: | :------------: | :----------------------------------------------------------: |
|    getOptions     |      none      |                     返回表格的 Options。                     |
|   getSelections   |      none      |     返回所选的行，当没有选择任何行的时候返回一个空数组。     |
| getAllSelections  |      none      | 返回所有选择的行，包括搜索过滤前的，当没有选择任何行的时候返回一个空数组。 |
|      getData      | useCurrentPage | 或者当前加载的数据。假如设置 useCurrentPage 为 true，则返回当前页的数据。 |
| getRowByUniqueId  |       id       |                  根据 uniqueId 获取行数据。                  |
|       load        |      data      |              加载数据到表格中，旧数据会被替换。              |
|  showAllColumns   |      none      |                         显示所有列.                          |
|  hideAllColumns   |      none      |                         隐藏所有列.                          |
|      append       |      data      |                添加数据到表格在现有数据之后。                |
|      prepend      |      data      |                插入数据到表格在现有数据之前。                |
|      remove       |     params     | 从表格中删除数据，包括两个参数： field: 需要删除的行的 field 名称。 values: 需要删除的行的值，类型为数组。 |
|     removeAll     |       -        |                      删除表格所有数据。                      |
| removeByUniqueId  |       id       |                 根据 uniqueId 删除指定的行。                 |
|     insertRow     |     params     | 插入新行，参数包括： index: 要插入的行的 index。 row: 行的数据，Object 对象。 |
|     updateRow     |     params     | 更新指定的行，参数包括： index: 要更新的行的 index。 row: 行的数据，Object 对象。 |
|      showRow      |     params     | 显示指定的行，参数包括： index: 要更新的行的 index 或者 uniqueId。 isIdField: 指定 index 是否为 uniqueid。 |
|      hideRow      |     params     | 显示指定的行，参数包括： index: 要更新的行的 index。 uniqueId: 或者要更新的行的 uniqueid。 |
|   getRowsHidden   |      show      | 获取所有行隐藏，如果show参数为true，行将再次显示，否则，方法 只返回隐藏的行. |
|    mergeCells     |    options     | 将某些单元格合并到一个单元格，选项包含以下属性： index：行索引 field：字段名称 rowspan：要合并的rowspan数量  colspan：要合并的colspan数量 |
|    updateCell     |     params     | 更新一个单元格，params包含以下属性： index：行索引  field：字段名称 value：新字段值 |
|      refresh      |     params     | 刷新远程服务器数据，可以设置` {silent：true} `以静默方式刷新数据，并设置` {url：newUrl} `更改URL。要提供特定于此请求的查询参数，请设置` {query：{foo：’bar’}}` |
|  refreshOptions   |    options     |                           刷新选项                           |
|    resetSearch    |      text      |                         设置搜索文本                         |
|    showLoading    |      none      |                        显示加载状态.                         |
|    hideLoading    |      none      |                         隐藏加载状态                         |
|     checkAll      |      none      |                     检查所有当前页面行.                      |
|    uncheckAll     |      none      |                    取消选中所有当前页面行                    |
|       check       |     index      |                   检查一行，行索引从0开始.                   |
|      uncheck      |     index      |                 取消选中一行，行索引从0开始.                 |
|      checkBy      |     params     | 按值数组检查一行，参数包含： field：用于查找记录的字段的名称 values：要检查的行的值数组 例:  $(“#table”).bootstrapTable(“checkBy”, {field:”field_name”,values:[“value1”,”value2”,”value3”]}) |
|     uncheckBy     |     params     | 按值数组取消选中一行，参数包含： field：用于查找记录的字段的名称 values：要取消选中的行的值的数组 例:  $(“#table”).bootstrapTable(“uncheckBy”, {field:”field_name”,values:[“value1”,”value2”,”value3”]}) |
|     resetView     |     params     |               重置引导表视图，例如重置表高度.                |
|    resetWidth     |      none      |             调整页眉和页脚的大小以适合当前列宽度             |
|      destroy      |      none      |                         销毁引导表.                          |
|    showColumn     |     field      |                        显示指定的列.                         |
|    hideColumn     |     field      |                        隐藏指定的列.                         |
| getHiddenColumns  |       -        |                        获取隐藏的列。                        |
| getVisibleColumns |       -        |                         获取可见列。                         |
|     scrollTo      |     value      |   滚动到指定位置，单位为 px，设置 ‘bottom’ 表示跳到最后。    |
| getScrollPosition |      none      |              获取当前滚动条的位置，单位为 px。               |
|     filterBy      |     params     | （只能用于 client 端）过滤表格数据， 你可以通过过滤`{age: 10}`来显示 age 等于 10 的数据。 |
|    selectPage     |      page      |                        跳到指定的页。                        |
|     prevPage      |      none      |                         跳到上一页。                         |
|     nextPage      |      none      |                         跳到下一页。                         |
| togglePagination  |      none      |                        切换分页选项。                        |
|    toggleView     |      none      |                     切换 card/table 视图                     |
|     expandRow     |     index      | 如果详细视图选项设置为True，请展开具有通过参数传递的索引的行. |
|    collapseRow    |     index      | 如果详细视图选项设置为True，则折叠具有通过参数传递的索引的行. |
|   expandAllRows   |  is subtable   |          如果详细视图选项设置为True，请展开所有行.           |
|  collapseAllRows  |  is subtable   |        如果详细信息视图选项设置为True，则折叠所有行.         |

 







## 跨行跨列

> 首先要在服务的对跨行的列排序

```js
 $('#example').bootstrapTable({
      url: '/init/table',
      method: 'get',
      striped: true,
      toolbar: "#toolbar",
      sidePagination: "true",
      striped: true, // 是否显示行间隔色
      //search : "true",
      uniqueId: "ID",
      pageSize: "25",
      pagination: true, // 是否分页
      sortable: true, // 是否启用排序
      search:true,
      showColumns: true,
      showRefresh: true,
      onLoadSuccess: function (data) {
          var data = data.rows;
      //  mergeColspan(data,"name" , $('#example'));//列合并
        mergeCells(data, "name", 1, $('#example'));//行合并
      },
      columns:[
          {
              title: '序号',
              field: 'index',
              align: 'center',
              valign: 'middle',
              formatter: genderIndex
          }, {
              title: '业务分类',
              field: 'fullPath',
              align: 'center',
              valign: 'middle'
          }
      ]
});
```





### 方法一：

```js
/*
合并行
 @param data  原始数据（在服务端完成排序）
 @param fieldName 合并属性名称数组
 @param colspan 列数
 @param target 目标表格对象
*/
function mergeCells(data, fieldName, colspan, target) {
  if (data.length == 0) {
    alert("不能传入空数据");
    return;
  }
  var numArr = [];
  var value = data[0][fieldName];
  var num = 0;
  for (var i = 0; i < data.length; i++) {
    if (value != data[i][fieldName]) {
      numArr.push(num);
      value = data[i][fieldName];
      num = 1;
      continue;
    }
    num++;
  }
  if (typeof (value) != "undefined" && value != "") {
    numArr.push(num);
  }
  var merIndex = 0;
  for (var i = 0; i < numArr.length; i++) {
    $(target).bootstrapTable('mergeCells',
        {
          index: merIndex,
          field: fieldName,
          colspan: colspan,
          rowspan: numArr[i]
        })
    merIndex += numArr[i];
  }
}


/**
   * 合并列
   * @param data  原始数据（在服务端完成排序）
   * @param fieldName 合并属性数组
   * @param target    目标表格对象
   */
  function mergeColspan(data, fieldNameArr, target) {
    if (data.length == 0) {
      alert("不能传入空数据");
      return;
    }
    if (fieldNameArr.length == 0) {
      alert("请传入属性值");
      return;
    }
    var num = -1;
    var index = 0;
    for (var i = 0; i < data.length; i++) {
      num++;
      for (var v in fieldNameArr) {
        index = 1;
        if (data[i][fieldNameArr[v]] != data[i][fieldNameArr[0]]) {
          index = 0;
          break;
        }
      }
      if (index == 0) {
        continue;
      }
      $(target).bootstrapTable('mergeCells', { index: num, field: fieldNameArr[0], colspan: fieldNameArr.length, rowspan: 1 });
    }
  }



```



### 方法二：

修改onLoadSuccess函数

```js
onLoadSuccess: function (data) {
    // 加载成功时执行  合并相同分类
    var rows = data.rows;
    var supplyClassIdList = new Set(), groupData = [];
    rows.map(e => {
        supplyClassIdList.add(e.supplyClassId);
    });
    for (let item of supplyClassIdList) {
        var arr = rows.filter(e => {
            return e.supplyClassId == item;
        });
        groupData.push({
            supplyClassId: item,
            list: arr
        });
    }

    var merIndex = 0;
    for (var i = 0; i < groupData.length; i++) {
        var rowData = groupData[i].list;
        $table.bootstrapTable('mergeCells', {index: merIndex, field: 'fullPath', rowspan: rowData.length});
        merIndex += rowData.length;
    }
}
```

