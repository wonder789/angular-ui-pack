function spGridGroupingRow( SpGridConstant, $compile ){
    return {
        restrict : "E",
        controller : "spGridBodyController",
        require : "^spGrid",
        replace : true,
        template : "<div class=\"sp-grid-grouping-row\"></div>",
        link : function ( scope, element, attrs ){

            scope.groupingType =  attrs.groupingType;
            if( attrs.groupingType == "group" && scope.gridObject.isGroupable() ){
                element.append( $compile(scope.gridObject.getGrouping().groupingRowTemplate)(scope));
            } else if( attrs.groupingType == "total" && scope.gridObject.isTotalize() ) {
                element.append( $compile(scope.gridObject.getGrouping().totalRowTemplate)(scope));
            }

        }

    }
}

module.exports = function( app ){
    app.directive("spGridGroupingRow", spGridGroupingRow );
};