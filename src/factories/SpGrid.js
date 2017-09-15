function SpGrid( SpGridConstant, $templateCache ){

    function SpGrid( gridOptions ){
        var _self = this;

        this._defaultOptions = {
            editable  : false,
            deleteable : false,
            columnDef : [],
            dataset   : [],
            createDataset : [],
            registerFunction : [],
            /**
             * 그리드 사이즈 옵션
             */
            gridSize : {
                width  : "auto",
                height : "auto"
            },
            /**
             * 필터 옵션
             */
            filterOptions : {
                query : ""
            },
            /**
             * 페이징 옵션
             */
            pagingOptions : {
                currentPage : 1,
                pageSize    : 10
            },
            /**
             * Grid Action 이벤트 콜백
             */
            gridAction : {
                onRowClick : function(){

                },
                onRowDeleteBefore : function(){
                    return true;
                },
                onRowDeleteAfter : function(){

                },
                onRowEditBefore : function(){
                    return true;
                },
                onRowEditAfter : function(){

                },
                onRowCreateBefore : function(){
                    return true;
                },
                onRowCreateAfter : function(){

                }

            },
            validateCallback : function( message ){
                alert(message);
            }

        };



        this._gridOptions     = angular.extend( this._defaultOptions, gridOptions );

        this._originalDataset = angular.copy( this._gridOptions.dataset );

        this.pageDataset      = angular.copy( this._gridOptions.dataset);

        this.status = "";

        this.init();
    }

    SpGrid.prototype.getCreateData = function(){
        return this._gridOptions.createDataset;
    };

    SpGrid.prototype.getValidateCallback = function( ){
        return this._gridOptions.validateCallback;
    };

    SpGrid.prototype.setValidateCallback = function( callback ){
        this._gridOptions.validateCallback = callback;
        return this;
    };


    SpGrid.prototype.setStatus = function( status ){
        this.status = status;
        return this;
    };

    SpGrid.prototype.getStatus = function(){
        return this.status;
    };

    SpGrid.prototype.isStatusChanged = function(){
        return this.status == "edit" || this.status == "create";
    };

    SpGrid.prototype.init = function(){
        var _columns = this.getColumnDef();


        if( this.isEditable() || this.isDeleteable()){
            _columns.push({
                type : "html",
                name: "",
                width: "150px",
                bindHtml : $templateCache.get(SpGridConstant.template.SP_GRID_DATA_ROW_BTN_GROUP)
            });
        }

        // if( this.getData() && this.getData.length > 0 ){
        //     this.generateIdx( this.getData());
        // }

        //Column Type 초기화
        if( _columns && _columns.length > 0 ){
            angular.forEach( _columns, function( _column){
                if( !_column.hasOwnProperty("type") ){
                    _column.type = "data";
                }
            });
        }

    };

    // SpGrid.prototype.generateIdx = function( dataset){
    //     for( var i = 0 ; i < dataset.length ; i ++ ){
    //         dataset[i].__idx = i+1;
    //     }
    // };

    SpGrid.prototype.getFilterOptions = function(){
        return this._gridOptions.filterOptions;
    };

    SpGrid.prototype.getPageSize = function(){
        return this._gridOptions.pagingOptions.pageSize;
    };

    SpGrid.prototype.getCurrentPage = function(){
        return this._gridOptions.pagingOptions.currentPage;
    };

    SpGrid.prototype.getTotalRecordCount = function(){
        return this.getData().length;
    };

    SpGrid.prototype.getGridAction = function(){
        return this._gridOptions.gridAction;
    };

    /**
     *
     * @returns {SpGrid._defaultOptions.pagingOptions|{currentPage, pageSize}}
     */
    SpGrid.prototype.getPagingOptions = function(){
        return this._gridOptions.pagingOptions;
    };
    /**
     * 등록할 Function List
     * @returns {Array}
     */
    SpGrid.prototype.getRegisterFunction = function(){
        return this._gridOptions.registerFunction;
    };
    /**
     * Grid 컬럼 Define 목록 리턴
     * @returns {Array}
     */
    SpGrid.prototype.getColumnDef = function(){
        return this._gridOptions.columnDef;
    };

    /**
     * Original Dataset 리턴
     * @returns {*}
     */
    SpGrid.prototype.getOriginalData = function(){
        return this._originalDataset;
    };
    /**
     * Grid Dataset 리턴
     * @returns {DOMStringMap|Array|*}
     */
    SpGrid.prototype.getData = function(){
        return this._gridOptions.dataset;
    };

    /**
     * Grid Dataset 설정
     * @param dataset
     * @returns {SpGrid}
     */
    SpGrid.prototype.setData = function( dataset ){
        // this.generateIdx( dataset );
        angular.copy(dataset,this._gridOptions.dataset);
        angular.copy(this._gridOptions.dataset,this._originalDataset );
        // this._gridOptions.dataset = dataset;
        // this._originalDataset = angular.copy( this._gridOptions.dataset );
        return this;
    };

    /**
     * Grid 사이즈(너비,높이) 리턴
     * @returns {SpGrid._defaultOptions.gridSize|{width, height}|*}
     */
    SpGrid.prototype.getSize = function(){
        return this._gridOptions.gridSize;
    };

    /**
     * Grid 사이즈(너비,높이) 설정
     * @param size
     * @returns {SpGrid}
     */
    SpGrid.prototype.setSize = function( size ){
        this._gridOptions.gridSize = size;
        return this;
    };

    /**
     * Grid Editable 리턴
     * @returns {boolean|*}
     */
    SpGrid.prototype.isEditable = function(){
        return this._gridOptions.editable;
    };

    /**
     * Grid Editable 설정
     * @param editMode
     * @returns {SpGrid}
     */
    SpGrid.prototype.setEditable = function( editable ){
        this._gridOptions.editable = editable;
        return this;
    };

    /**
     * Grid Deleteable 설정
     * @returns {boolean|*}
     */
    SpGrid.prototype.isDeleteable = function(){
        return this._gridOptions.deleteable;
    };

    /**
     * Grid Deleteable 설정
     * @param deleteable
     */
    SpGrid.prototype.setDeleteable = function( deleteable){
        this._gridOptions.deleteable = deleteable;
    };

    /**
     * Grid 로우 추가
     */
    SpGrid.prototype.addEmptyRow = function( ){
        var _columns = this.getColumnDef();
        var _row     = {};

        if ( !this.getGridAction().onRowCreateBefore() ){
            return ;
        }
        if( this.isStatusChanged() ){
            return;
        }

        for( var i = 0 ; i < _columns.length ; i ++ ){
            //컬럼타입이 데이터인 애들만 추가해줌
            if( _columns[i].type == "data" ){
                _row[_columns[i].id] = "";
            }

        }
        _row.cudFlag = SpGridConstant.CREATE_FLAG;
        this.setStatus("create");
        this.getCreateData().push(_row);
    };


    /**
     * Grid 변경된 로우 리턴
     * @returns {Array}
     */
    SpGrid.prototype.getChangedRow = function(){
        var _result = [];
        var _dataset = this.getData();
        for( var i = 0 ; i < _dataset.length ; i ++ ){
            if( _dataset[i] && _dataset[i].hasOwnProperty("cudFlag")
                && _dataset[i].cudFlag != "" && _dataset[i].__valid ){
                _result.push(_dataset[i]);
            }
        }
        return _result;
    };
    return SpGrid;
}

module.exports = function(app){
    app.factory("SpGrid", SpGrid);
};