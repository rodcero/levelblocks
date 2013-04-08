$(document).ready(function(){
    //$levelgrid = $('#level-grid');
    if(levelobject == 'none'){
        $('#dimensions-modal').modal({
            show: true
        });

        $('#save-modal').modal({
            show: false
        });

        $('#continue-button').click(function(e){
            e.preventDefault();
            var h = parseInt($('#mh').val());
            var w = parseInt($('#mw').val());

            if(h>9 & w>9){
                levelgrid.init(h,w);
                levelgrid.getGridHTML(false);
                $('#dimensions-modal').modal('hide');
            }

        })
    }else
    {
        levelgrid.init(levelobject.height, levelobject.width);
        levelgrid.getGridHTML(true);

    }

    tools.init();

    $('#save-level').click(function(){
        $('#save-modal').modal('show');

    });

    $('#save-button').click(function(){
        levelgrid.saveLevelGrid();
    });

});



var levelgrid = {
    width : 0,
    height : 0,
    x_cells : 0,
    y_cells : 0,
    cell_size : 50,
    init: function(height, width){
        this.x_cells = width,
        this.y_cells = height,
        this.height = (height*this.cell_size)+height;
        this.width = (width*this.cell_size)+width;
    },
    getGridHTML : function(existing){
        if(existing)
        var a = levelobject["levelGrid"];

        var row_style = {
            width: this.width+'px'
        }
        var $grid = $('#level-grid');
        for(var h = 0; h < this.y_cells; h++){
            var $r = $('<div id="row_'+h+'" class="grid-row"></div>');
            $r.css(row_style);
            for(var w = 0; w < this.x_cells; w++){
                var index = (h*this.x_cells)+w
                var $c = null;
                if(existing)
                    $c = $('<div id="'+index+'" class="grid-cell '+a[index]+'" data-row="'+h+'" data-column="'+w+'" data-block="'+a[index]+'">'+index+'</div>');
                else
                    $c = $('<div id="'+index+'" class="grid-cell" data-row="'+h+'" data-column="'+w+'" data-block="">'+index+'</div>');

                $c.click(function(){
                    var $b = $(this);
                    $b.removeClass();
                    $b.addClass('grid-cell');
                    $b.addClass(tools.activeBlock.id);
                    $b.attr('data-block',$(tools.activeBlock).attr('data-block'));
                });
                $c.dblclick(function(){
                    $(this).removeClass();
                    $(this).addClass('grid-cell');
                    $(this).attr('data-block','');
                });
                $r.append($c);
            }
            $grid.append($r);
        }
    },
    saveLevelGrid: function(){
        var blockArray = [];

        $('.grid-cell').each(function(){
            blockArray.push($(this).attr('data-block'));
        });

        var level = {
            width : this.x_cells,
            height : this.y_cells,
            levelGrid : blockArray
        }

        utility.post('/editor/'+levelid, {name: $('#levelname').val(),level:JSON.stringify(level)}, this.savedLevelGrid, this.error)
    },
    savedLevelGrid: function(data){
        window.location = "/mylevels/";
    },
    error : function(data){
        console.log(data);
    }

}

var tools = {
    activeBlock: null,
    init: function(){
        //this.activeBlock = $('.block-selected')
        $('.box').click(function(){
            tools.setActiveBlock(this);
            $('.box-selected').removeClass('box-selected');
            $(this).addClass('box-selected')
        });
    },
    setActiveBlock: function(block){
        this.activeBlock = block;
        console.log(block);
    }
}

var utility = {
    post : function(url, data, doneHandler, errorHandler){
        $.ajax({
            type: 'POST',
            url: url,
            data : data
        }).done(doneHandler).fail(errorHandler);
    }
}